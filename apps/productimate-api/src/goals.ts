/**
 * This file has 7 routes:
 * 1. GET /goals
 * 2. GET /goals/:id
 * 3. POST /goals/add
 * 4. PUT /goals/:id
 * 5. DELETE /goals/:id
 * 6. GET /goals/add/user/:id
 * 7. PUT /goals/finish/:id
 */

import { prisma, telBot } from "@producti-mate/shared";
import { Router } from "express";
import { InlineKeyboard } from "grammy";
import * as z from "zod";

export const goalsRouter = Router();

goalsRouter.get("/", (req, res) => {
  const authHeader = req.headers["authorization"];
  const userId = authHeader && authHeader.split(" ")[1];

  prisma.goalUser
    .findMany({
      where: {
        userId,
      },
      include: {
        goal: {
          include: {
            users: { include: { user: true } },
          },
        },
      },
    })
    .then((goals) => {
      res.json(goals);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

goalsRouter.get("/public", (req, res) => {
  const authHeader = req.headers["authorization"];
  const userId = authHeader && authHeader.split(" ")[1];

  prisma.goal
    .findMany({
      where: {
        isPrivate: false,
        users: {
          none: {
            userId,
          },
        },
      },
      orderBy: {
        users: {
          _count: "desc",
        },
      },
    })
    .then((goals) => {
      res.json(goals);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

goalsRouter.get("/:id", (req, res) => {
  const authHeader = req.headers["authorization"];
  const userId = authHeader && authHeader.split(" ")[1];

  prisma.goalUser
    .findUnique({
      where: {
        id: parseInt(req.params.id),
        userId,
      },
      include: {
        goal: {
          include: {
            users: { include: { user: true }, orderBy: { exp: "desc" } },
          },
        },
      },
    })
    .then((goal) => {
      if (goal) {
        res.json(goal);
      } else {
        res.status(404).json({ message: "goal not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

const addGoalScheme = z.object({
  title: z.string(),
  description: z.string().optional(),
  isPrivate: z.boolean().optional(),
});

goalsRouter.post("/add", (req, res) => {
  const authHeader = req.headers["authorization"];
  const userId = authHeader && authHeader.split(" ")[1];

  const goal = addGoalScheme.safeParse(req.body);
  if (!goal.success) {
    res.status(400).json({ error: "Bad data" });
    return;
  }

  prisma.goal
    .create({
      data: {
        title: goal.data.title,
        description: goal.data.description,
        isPrivate: goal.data.isPrivate,
        userId,
      },
    })
    .then((goal) => {
      prisma.goalUser
        .create({
          data: {
            goalId: goal.id,
            userId,
          },
          include: {
            goal: { include: { users: { include: { user: true } } } },
          },
        })
        .then((goalUser) => {
          res.json(goalUser);
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

const joinGoalScheme = z.object({
  goalId: z.number(),
});

goalsRouter.post("/join", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const userId = authHeader && authHeader.split(" ")[1];

  const joinGame = joinGoalScheme.safeParse(req.body);
  if (!joinGame.success) {
    res.status(400).json({ error: "Bad data" });
    return;
  }

  try {
    // check if the user already joined the goal
    const goalUser = await prisma.goalUser.findFirst({
      where: {
        goalId: joinGame.data.goalId,
        userId,
      },
    });

    if (goalUser) {
      return res.json(goalUser);
    }

    const joinGoal = await prisma.goalUser.create({
      data: {
        goalId: joinGame.data.goalId,
        userId,
      },
    });
    return res.json(joinGoal);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

const updateGoalScheme = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

goalsRouter.put("/:id", (req, res) => {
  const authHeader = req.headers["authorization"];
  const userId = authHeader && authHeader.split(" ")[1];
  const goal = updateGoalScheme.safeParse(req.body);
  if (!goal.success) {
    res.status(400).json({ error: "Bad data" });
    return;
  }

  prisma.goalUser
    .findUnique({
      where: {
        id: parseInt(req.params.id),
        userId,
      },
    })
    .then((goalUser) => {
      prisma.goal
        .update({
          where: {
            id: goalUser.goalId,
          },
          data: {
            title: req.body.title,
            description: req.body.description,
          },
        })
        .then(() => {
          res.json(goalUser);
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

goalsRouter.delete("/:id", (req, res) => {
  const authHeader = req.headers["authorization"];
  const userId = authHeader && authHeader.split(" ")[1];

  prisma.goalUser
    .deleteMany({
      where: {
        goalId: parseInt(req.params.id),
      },
    })
    .then(() => {
      prisma.goal
        .delete({
          where: {
            id: parseInt(req.params.id),
          },
        })
        .then((goal) => {
          res.json(goal);
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
    });
});

goalsRouter.get("/add/user/:id", (req, res) => {
  const authHeader = req.headers["authorization"];
  const userId = authHeader && authHeader.split(" ")[1];

  prisma.goalUser
    .findUnique({
      where: {
        id: parseInt(req.params.id),
        userId,
      },
      include: {
        user: true,
        goal: true,
      },
    })
    .then((gu) => {
      const inviteBtn = new InlineKeyboard().url(
        "Accept invitation ✅",
        `https://t.me/ProductiMatebot?start=gi=${gu.goalId}`,
      );
      telBot.api
        .sendMessage(
          gu.user.id,
          `
Do you want to accomplish a goal with ${gu.user.name}?

🎯 Goal: ${gu.goal.title}

📯 Description: ${gu.goal.description}

Click on the bellow button to accept the invitation.
`,
          {
            reply_markup: inviteBtn,
          },
        )
        .then(() => {
          telBot.api
            .sendMessage(
              gu.userId,
              `Share the above link with your friends to invite them to your goal. 👆👆`,
            )
            .finally(() => {
              res.json({ message: "invitation sent" });
            });
        })
        .catch((err) => {
          console.error(JSON.stringify(err));

          res.status(500).json({ error: JSON.stringify(err) });
        });
    })
    .catch((err) => {
      console.error(JSON.stringify(err));

      res.status(500).json({ error: JSON.stringify(err) });
    });
});

goalsRouter.put("/finish/:id", (req, res) => {
  const authHeader = req.headers["authorization"];
  const userId = authHeader && authHeader.split(" ")[1];

  prisma.goalUser
    .update({
      where: {
        id: parseInt(req.params.id),
        userId,
      },
      data: {
        exp: {
          increment: 10,
        },
        lastFinish: new Date(new Date().toDateString()),
      },
    })
    .then((goalUser) => {
      res.json(goalUser);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});
