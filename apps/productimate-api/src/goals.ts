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

import {
  AddGoalScheme,
  JoinGoalScheme,
  UpdateGoalScheme,
} from "@pm/types"

import {
  prisma,
  telBot,
} from "@producti-mate/shared"
import { Router } from "express"
import { InlineKeyboard } from "grammy"
import { scheduleJob } from "node-schedule"

export const goalsRouter = Router()

goalsRouter.get("/", (req, res) => {
  const authHeader = req.headers["authorization"]
  const userId = authHeader && authHeader.split(" ")[1]

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
      res.json(goals)
    })
    .catch((err) => {
      res.status(500).json({ error: err })
    })
})

goalsRouter.get("/public", (req, res) => {
  const authHeader = req.headers["authorization"]
  const userId = authHeader && authHeader.split(" ")[1]

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
      res.json(goals)
    })
    .catch((err) => {
      res.status(500).json({ error: err })
    })
})

goalsRouter.get("/:id", (req, res) => {
  const authHeader = req.headers["authorization"]
  const userId = authHeader && authHeader.split(" ")[1]

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
        res.json(goal)
      } else {
        res.status(404).json({ message: "goal not found" })
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err })
    })
})

goalsRouter.post("/add", (req, res) => {
  const authHeader = req.headers["authorization"]
  const userId = authHeader && authHeader.split(" ")[1]

  const goal = AddGoalScheme.safeParse(req.body)
  if (!goal.success) {
    res.status(400).json({ error: "Bad data" })
    return
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
          res.json(goalUser)
        })
        .catch((err) => {
          res.status(500).json({ error: err })
        })
    })
    .catch((err) => {
      res.status(500).json({ error: err })
    })
})

goalsRouter.post("/join", async (req, res) => {
  const authHeader = req.headers["authorization"]
  const userId = authHeader && authHeader.split(" ")[1]

  const joinGame = JoinGoalScheme.safeParse(req.body)
  if (!joinGame.success) {
    res.status(400).json({ error: "Bad data" })
    return
  }

  try {
    // check if the user already joined the goal
    const goalUser = await prisma.goalUser.findFirst({
      where: {
        goalId: joinGame.data.goalId,
        userId,
      },
    })

    if (goalUser) {
      return res.json(goalUser)
    }

    const joinGoal = await prisma.goalUser.create({
      data: {
        goalId: joinGame.data.goalId,
        userId,
      },
    })
    return res.json(joinGoal)
  } catch (error) {
    return res.status(500).json({ error: error })
  }
})

goalsRouter.put("/:id", (req, res) => {
  const authHeader = req.headers["authorization"]
  const userId = authHeader && authHeader.split(" ")[1]
  const goal = UpdateGoalScheme.safeParse(req.body)
  if (!goal.success) {
    res.status(400).json({ error: "Bad data" })
    return
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
          res.json(goalUser)
        })
        .catch((err) => {
          res.status(500).json({ error: err })
        })
    })
    .catch((err) => {
      res.status(500).json({ error: err })
    })
})

goalsRouter.delete("/:id", (req, res) => {
  const authHeader = req.headers["authorization"]
  const userId = authHeader && authHeader.split(" ")[1]

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
          res.json(goal)
        })
        .catch((err) => {
          res.status(500).json({ error: err })
        })
    })
})

goalsRouter.get("/add/user/:id", (req, res) => {
  const authHeader = req.headers["authorization"]
  const userId = authHeader && authHeader.split(" ")[1]

  prisma.goalUser
    .findFirst({
      where: {
        goalId: parseInt(req.params.id),
        userId,
      },
      include: {
        user: true,
        goal: true,
      },
    })
    .then((gu) => {
      if (!gu) {
        return res.status(404).json({
          message: "The goal not found",
        })
      }

      const inviteBtn = new InlineKeyboard().url(
        "Accept invitation ✅",
        `https://t.me/ProductiMatebot?start=gi=${gu.goalId}`,
      )
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
              `Forwared the above message with your friends to invite them to your goal. 👆👆`,
            )
            .finally(() => {
              res.json({ message: "invitation sent" })
            })
        })
        .catch((err) => {
          console.error(err)

          res.status(500).json({ error: JSON.stringify(err) })
        })
    })
    .catch((err) => {
      console.error(err)

      res.status(500).json({ error: JSON.stringify(err) })
    })
})

goalsRouter.put("/finish/:id", (req, res) => {
  const authHeader = req.headers["authorization"]
  const userId = authHeader && authHeader.split(" ")[1]

  prisma.goalUser
    .findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    })
    .then((goalUser) => {
      if (
        goalUser.lastFinish &&
        new Date(goalUser.lastFinish).toDateString() ===
        new Date().toDateString()
      ) {
        res.json(goalUser)
      } else {
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
            res.json(goalUser)
          })
          .catch((err) => {
            res.status(500).json({ error: err })
          })
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err })
    })
})

/**
 * Schedule a job to run at 3 pm every day
 * We remind the users to check their goals and complete them
 */
scheduleJob("0 0 15 * * *", function (fireDate) {
  // Go throw all users and send a message in telegram and remind them to check their goals

  prisma.user
    .findMany({
      where: {
        goalUsers: {
          some: {
            lastFinish: {
              not: new Date(new Date().toDateString()),
            },
          },
        },
      },
      include: {
        goalUsers: {
          include: {
            goal: true,
          },
        },
      },
    })
    .then((users) => {
      users.forEach(async (user) => {
        const goalsPageBtn = new InlineKeyboard().webApp(
          "Goals 🎯",
          process.env.API_URL! + "/goals",
        )
        await telBot.api.sendMessage(
          user.id,
          `
What's up mate? 🤨 Im here to remind you about something important

In order to progress you should complete small steps each day 😀 so here are your daily goals and make sure to finish them 💪:

${user.goalUsers.map((goalUser) => {
            return `• ${goalUser.goal.title} (${goalUser.exp} exp) \n\n`
          })}

Let's crush them 🫵
`,
          {
            reply_markup: goalsPageBtn,
          },
        )
      })
    })
    .catch((err) => {
      console.error(err)
    })
})
