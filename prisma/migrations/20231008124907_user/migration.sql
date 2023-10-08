/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GoalUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exp" INTEGER NOT NULL DEFAULT 0,
    "lastFinish" DATETIME,
    "userId" TEXT NOT NULL,
    "goalId" INTEGER NOT NULL,
    CONSTRAINT "GoalUser_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GoalUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GoalUser" ("exp", "goalId", "id", "lastFinish", "userId") SELECT "exp", "goalId", "id", "lastFinish", "userId" FROM "GoalUser";
DROP TABLE "GoalUser";
ALTER TABLE "new_GoalUser" RENAME TO "GoalUser";
CREATE TABLE "new_Reminders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "body" TEXT,
    "remindAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Reminders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reminders" ("body", "createdAt", "id", "remindAt", "title", "updatedAt", "userId") SELECT "body", "createdAt", "id", "remindAt", "title", "updatedAt", "userId" FROM "Reminders";
DROP TABLE "Reminders";
ALTER TABLE "new_Reminders" RENAME TO "Reminders";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "pfp" TEXT
);
INSERT INTO "new_User" ("createdAt", "id", "name", "pfp", "updatedAt") SELECT "createdAt", "id", "name", "pfp", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE TABLE "new_Goal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Goal" ("createdAt", "description", "id", "title", "updatedAt", "userId") SELECT "createdAt", "description", "id", "title", "updatedAt", "userId" FROM "Goal";
DROP TABLE "Goal";
ALTER TABLE "new_Goal" RENAME TO "Goal";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
