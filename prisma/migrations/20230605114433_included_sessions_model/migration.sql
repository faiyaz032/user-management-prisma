-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "data" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
