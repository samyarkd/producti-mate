import { prisma } from "@producti-mate/shared";
import { Bot } from "grammy";

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot(process.env.BOT_TOKEN); // <-- put your bot token between the ""

bot.command("start", (ctx) => {
  prisma.user
    .upsert({
      where: {
        id: ctx.message?.from?.id,
      },
      update: {},
      create: {
        id: ctx.message?.from?.id,
        name: ctx.message?.from?.first_name,
      },
    })
    .then(() => {
      ctx.reply("Welcome! Click on the buttons below to get started!");
    })
    .catch((err) => {
      ctx.reply("Something went wrong. Please try again later.");
    });
});
// Handle other messages.
bot.on("message", (ctx) => ctx.reply("Got another message!"));

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start();
