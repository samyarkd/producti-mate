import "dotenv/config";

import { prisma, telBot } from "@producti-mate/shared";
import { InlineKeyboard } from "grammy";

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = telBot; // <-- put your bot token between the ""

bot.use(async (ctx, next) => {
  try {
    // start with invite scheme => /start gi=123
    // we want the gi
    if (ctx.msg.text.startsWith("/start")) {
      let pfpUrl: null | string = null;
      try {
        const doesExist = await prisma.user.findUnique({
          where: {
            id: ctx.message?.from?.id.toString(),
          },
        });

        const pfp = (await ctx.getUserProfilePhotos({ limit: 1 })).photos[0][0]
          .file_id;
        pfpUrl =
          `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/` +
          (await ctx.api.getFile(pfp)).file_path;

        if (!doesExist) {
          ctx.reply("Welcome! Click on the buttons below to get started!");
        }
      } catch (error) {
        //
      }

      await prisma.user.upsert({
        where: {
          id: ctx.message?.from?.id.toString(),
        },
        update: {},
        create: {
          id: ctx.message?.from?.id.toString(),
          name: ctx.message?.from?.first_name,
          pfp: pfpUrl,
        },
      });

      // check if the text is valid
      if (ctx.msg.text.split(" ").length !== 2) {
        return next();
      }

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
        const gameUser = await prisma.goalUser.findFirst({
          where: {
            goalId: parseInt(gi),
            userId: ctx.from.id.toString(),
          },
        });

        if (gameUser) {
          const goalBtn = new InlineKeyboard().webApp(
            "Goal Details",
            `${process.env.API_URL}`,
          );
          ctx.reply(
            "You already joined this goal. Click on the 'Goal Details' button to see your goal after that open the Goals page.",
            {
              reply_markup: goalBtn,
            },
          );
        } else {
          const goalBtn = new InlineKeyboard().webApp(
            "Goal Details",
            `${process.env.API_URL}`,
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
    reportError(error);
  }
  return next();
});

bot.catch((err) => {
  reportError(err);
});

function reportError(error: any) {
  bot.api.sendMessage(process.env.ADMIN_ID, JSON.stringify(error.message));
}
// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start();
