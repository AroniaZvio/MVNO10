/*
  Warnings:

  - A unique constraint covering the columns `[mobileNumber]` on the table `PhoneNumber` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."PhoneNumber" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'available',
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "balance" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "PhoneNumber_mobileNumber_key" ON "public"."PhoneNumber"("mobileNumber");

-- AddForeignKey
ALTER TABLE "public"."PhoneNumber" ADD CONSTRAINT "PhoneNumber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
