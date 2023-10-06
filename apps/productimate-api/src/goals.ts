/**
 * This file has 5 routes:
 * 1. GET /goals
 * 2. GET /goals/:id
 * 3. POST /goals/add
 * 4. PUT /goals/:id
 * 5. DELETE /goals/:id
 */

import { prisma } from "@producti-mate/shared";
import { Router } from "express";
import * as z from "zod";

export const goalsRouter = Router();

goalsRouter.get("/", (req, res) => {
  const authHeader = req.headers["authorization"];
  const userId = authHeader && authHeader.split(" ")[1];

  prisma.goalUser
    .findMany({
      where: {
        userId: parseInt(userId),
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

goalsRouter.get("/:id", (req, res) => {
  const authHeader = req.headers["authorization"];
  const userId = authHeader && authHeader.split(" ")[1];

  prisma.goalUser
    .findUnique({
      where: {
        id: parseInt(req.params.id),
        userId: parseInt(userId),
      },
      include: {
        goal: {
          include: {
            users: { include: { user: true } },
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
        title: req.body.title,
        description: req.body.description,
        userId: parseInt(userId),
      },
    })
    .then((goal) => {
      prisma.goalUser
        .create({
          data: {
            goalId: goal.id,
            userId: parseInt(userId),
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

const updateGoalScheme = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

goalsRouter.put("/:id", (req, res) => {
  const goal = updateGoalScheme.safeParse(req.body);
  if (!goal.success) {
    res.status(400).json({ error: "Bad data" });
    return;
  }

  prisma.goalUser
    .findUnique({
      where: {
        id: parseInt(req.params.id),
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
  prisma.goalUser
    .findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    })
    .then((goalUser) => {
      prisma.goal
        .delete({
          where: {
            id: goalUser.id,
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
