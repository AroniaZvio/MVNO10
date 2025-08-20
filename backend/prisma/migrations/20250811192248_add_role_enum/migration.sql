/*
  Warnings:

  - You are about to drop the column `balance` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `EmailToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResetToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sim` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "public"."EmailToken" DROP CONSTRAINT "EmailToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ResetToken" DROP CONSTRAINT "ResetToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Sim" DROP CONSTRAINT "Sim_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Subscription" DROP CONSTRAINT "Subscription_planId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "balance",
DROP COLUMN "role",
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER',
ALTER COLUMN "isActive" SET DEFAULT true;

-- DropTable
DROP TABLE "public"."EmailToken";

-- DropTable
DROP TABLE "public"."Plan";

-- DropTable
DROP TABLE "public"."ResetToken";

-- DropTable
DROP TABLE "public"."Sim";

-- DropTable
DROP TABLE "public"."Subscription";

-- DropTable
DROP TABLE "public"."Transaction";

-- CreateTable
CREATE TABLE "public"."PhoneNumber" (
    "id" SERIAL NOT NULL,
    "countryCode" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "number800" TEXT,
    "connectionFee" INTEGER NOT NULL,
    "monthlyFee" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhoneNumber_pkey" PRIMARY KEY ("id")
);
