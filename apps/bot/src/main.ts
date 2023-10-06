import { prisma, telBot } from "@producti-mate/shared";
import { InlineKeyboard } from "grammy";

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = telBot; // <-- put your bot token between the ""

bot.use(async (ctx, next) => {
  try {
    // start with invite scheme => /start gi=123
    // we want the gi
    if (ctx.msg.text.startsWith("/start ")) {
      const gi = ctx.msg.text.split(" ")[1].split("=")[1];
      // gi is the goal id
      // check if the goal exists

      const goal = await prisma.goal.findUnique({
        where: {
          id: parseInt(gi),
        },
      });

      if (goal) {
        // check if the user already joined the goal
        const gameUser = await prisma.goalUser.findUnique({
          where: {
            goalId: parseInt(gi),
            userId: ctx.msg.from.id,
          },
        });

        if (gameUser) {
          const goalBtn = new InlineKeyboard().webApp(
            "Goal Details",
            `https://samyar-local.loca.lt/goals/${gameUser.id}`,
          );
          ctx.reply(
            "You already joined this goal. Click on the 'Goal Details' button to see your goal.",
            {
              reply_markup: goalBtn,
            },
          );
        } else {
          // create a new goalUser
          const gameUser = await prisma.goalUser.create({
            data: {
              goalId: parseInt(gi),
              userId: ctx.msg.from.id,
            },
          });

          const goalBtn = new InlineKeyboard().webApp(
            "Goal Details",
            `https://samyar-local.loca.lt/goals/${gameUser.id}`,
          );

          ctx.reply(
            "You joined the goal successfully. Click on the 'Goal Details' button to see your goal.",
            {
              reply_markup: goalBtn,
            },
          );
        }
      }
    }
  } catch (error) {
    //
  }
  return next();
});

bot.command("start", async (ctx) => {
  try {
    const doesExist = await prisma.user.findUnique({
      where: {
        id: ctx.message?.from?.id,
      },
    });

    await prisma.user.upsert({
      where: {
        id: ctx.message?.from?.id,
      },
      update: {},
      create: {
        id: ctx.message?.from?.id,
        name: ctx.message?.from?.first_name,
      },
    });

    if (!doesExist) {
      ctx.reply("Welcome! Click on the buttons below to get started!");
    }
  } catch (error) {
    ctx.reply("Something went wrong. Please try again later.");
  }
});

// Handle other messages.
bot.on("message", (ctx) => ctx.reply("Got another message!"));

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start();
