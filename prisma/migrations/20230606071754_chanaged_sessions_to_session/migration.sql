/*
  Warnings:

  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "sessions";

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,
    "data" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);
