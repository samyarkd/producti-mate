import { Router } from "express";

export const reminderRouter = Router();

reminderRouter.get("/", (req, res) => {
  res.json({
    message: "all reminders 👋",
  });
});

reminderRouter.get("/:id", (req, res) => {
  res.json({
    message: "reminder 👋",
  });
});

reminderRouter.post("/add", (req, res) => {
  res.json({
    message: "reminder added 👋",
  });
});

reminderRouter.put("/:id", (req, res) => {
  res.json({
    message: "reminder updated 👋",
  });
});

reminderRouter.delete("/:id", (req, res) => {
  res.json({
    message: "reminder deleted 👋",
  });
});
