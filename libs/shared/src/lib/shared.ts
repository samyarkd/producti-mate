import { PrismaClient } from "@prisma/client";
import { Bot } from "grammy";

export const prisma = new PrismaClient();

export const telBot = new Bot(process.env.BOT_TOKEN!);
