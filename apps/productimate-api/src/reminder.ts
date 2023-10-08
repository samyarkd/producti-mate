/**
 * There are 5 routes in this file
 * 1. GET /reminder
 * 2. GET /reminder/:id
 * 3. POST /reminder/add
 * 4. PUT /reminder/:id
 * 5. DELETE /reminder/:id
 *
 * The routes are protected by a middleware that checks if the user is logged in using cookies.
 */

import { prisma, telBot } from "@producti-mate/shared";
import { Router } from "express";
import schedule from "node-schedule";
import * as z from "zod";

export const reminderRouter = Router();

reminderRouter.get("/", (req, res) => {
  const authHeader = req.headers["authorization"];
  const userId = authHeader && authHeader.split(" ")[1];

  prisma.reminders
    .findMany({
      where: {
        userId,
      },
    })
    .then((reminders) => {
      res.json(reminders);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

reminderRouter.get("/:id", (req, res) => {
  const authHeader = req.headers["authorization"];
  const userId = authHeader && authHeader.split(" ")[1];

  prisma.reminders
    .findUnique({
      where: {
        id: parseInt(req.params.id),
        userId,
      },
    })
    .then((reminder) => {
      if (reminder) {
        res.json(reminder);
      } else {
        res.status(404).json({ message: "reminder not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

const reminderSchema = z.object({
  remindAt: z.string(),
  title: z.string().optional(),
  body: z.string().optional(),
});

reminderRouter.post("/add", (req, res) => {
  const authHeader = req.headers["authorization"];
  const userId = authHeader && authHeader.split(" ")[1];

  const reminder = reminderSchema.safeParse(req.body);

  if (!reminder.success) {
    res
      .status(400)
      .json({ message: "Bad request data is invalid", data: req.body });
    return;
  }

  const sm = schedule.scheduleJob(
    new Date(reminder.data.remindAt),
    function () {
      telBot.api.sendMessage(userId, "Reminder: \n\n" + reminder.data.title);
      console.log("The world is going to end today.");
    },
  );

  prisma.reminders
    .create({
      data: {
        remindAt: new Date(reminder.data.remindAt),
        title: reminder?.data.title,
        body: sm.name,
        userId,
      },
    })
    .then((reminder) => {
      res.json(reminder);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

const reminderSchemaUpdate = z.object({
  remindAt: z.string().optional(),
  title: z.string().optional(),
  body: z.string().optional(),
});

reminderRouter.put("/:id", (req, res) => {
  const authHeader = req.headers["authorization"];
  const userId = authHeader && authHeader.split(" ")[1];

  const reminder = reminderSchemaUpdate.safeParse(req.body);

  if (!reminder.success) {
    res
      .status(400)
      .json({ message: "Bad request data is invalid", data: req.body });
    return;
  }

  const reminderId = parseInt(req.params.id);
  // check if it exists
  prisma.reminders
    .findUnique({
      where: {
        id: reminderId,
        userId,
      },
    })
    .then((reminder) => {
      if (!reminder) {
        res.status(404).json({ message: "reminder not found" });
        return;
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });

  prisma.reminders
    .update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        remindAt: reminder.data.remindAt && new Date(reminder.data.remindAt),
        title: reminder?.data.title,
        body: reminder?.data.body,

        userId,
      },
    })
    .then((reminder) => {
      res.json(reminder);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

reminderRouter.delete("/:id", (req, res) => {
  const authHeader = req.headers["authorization"];
  const userId = authHeader && authHeader.split(" ")[1];

  const reminderId = parseInt(req.params.id);
  // check if it exists
  prisma.reminders
    .findUnique({
      where: {
        id: reminderId,
        userId,
      },
    })
    .then((reminder) => {
      schedule.cancelJob(reminder.body);
      if (!reminder) {
        res.status(404).json({ message: "reminder not found" });
        return;
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });

  prisma.reminders
    .delete({
      where: {
        id: reminderId,
      },
    })
    .then(() => {
      res.json({ message: "reminder deleted" });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});
