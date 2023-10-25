import "dotenv/config"

import { prisma, telBot } from "@producti-mate/shared"
import { InlineKeyboard } from "grammy"
import { uploadImageImgur } from "./libs"

const bot = telBot

/**
 * This is a middelware for when user joins a goal via the bot
 */
bot.use(async (ctx, next) => {
  if (!ctx?.msg?.text) {
    return next()
  }

  try {
    if (ctx.msg.text.startsWith("/start")) {
      // pfp url used to set the users url
      let pfpUrl: null | string = null

      try {
        const doesExist = await prisma.user.findUnique({
          where: {
            id: ctx.msg?.from?.id.toString(),
          },
        })

        const pfpData = (await ctx.getUserProfilePhotos({ limit: 1 })).photos[0][0]
          .file_id
        const pfpUrlRaw =
          `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/` +
          (await ctx.api.getFile(pfpData)).file_path

        // set the pfp url
        pfpUrl = await uploadImageImgur({
          image: pfpUrlRaw,
        })



        const WebAppBtn = new InlineKeyboard().webApp(
          "Open Mini-App",
          "https://producti-mate.mazooon.com/",
        )
        if (!doesExist) {
          await ctx.reply(
            "Welcome! Click on the buttons below to get started!",
            {
              reply_markup: WebAppBtn,
            },
          )
        } else {
          if (ctx.msg.text === "/start") {
            await ctx.reply(
              "Welcome back! Click on the button below to get started!",
              {
                reply_markup: WebAppBtn,
              },
            )
          }
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
      })

      // check if the text is valid
      if (ctx.msg.text.split(" ").length !== 2) {
        return next()
      }

      const gi = ctx.msg.text.split(" ")[1].split("=")[1]

      const goal = await prisma.goal.findUnique({
        where: {
          id: parseInt(gi),
        },
      })

      if (goal) {
        // check if the user already joined the goal
        const gameUser = await prisma.goalUser.findFirst({
          where: {
            goalId: parseInt(gi),
            userId: ctx.from.id.toString(),
          },
        })

        if (gameUser) {
          const goalBtn = new InlineKeyboard().webApp(
            "Goal Details",
            `${process.env.API_URL}/goals/${gameUser.id}`,
          )
          await ctx.reply(
            "You already joined this goal. Click on the 'Goal Details' button to see your goal details.",
            {
              reply_markup: goalBtn,
            },
          )
        } else {
          const gameUser = await prisma.goalUser.create({
            data: {
              goalId: parseInt(gi),
              userId: ctx.from.id.toString(),
            },
          })

          const goalBtn = new InlineKeyboard().webApp(
            "Goal Details",
            `${process.env.API_URL}/goals/${gameUser.id}`,
          )

          await ctx.reply(
            "You joined the goal successfully. Click on the 'Goal Details' button to see your goal details.",
            {
              reply_markup: goalBtn,
            },
          )
        }
      }
    }
  } catch (error) {
    //
  }
  return next()
})

bot.catch((error) => {
  console.log(error)
  reportError(error)
})

function reportError(error: any) {
  bot.api.sendMessage(process.env.ADMIN_ID, JSON.stringify(error.message))
}
// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start()

console.log("Bot is working")
