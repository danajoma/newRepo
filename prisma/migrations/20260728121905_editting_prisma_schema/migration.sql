/*
  Warnings:

  - You are about to drop the column `intern_id` on the `Tasks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_intern_id_fkey";

-- AlterTable
ALTER TABLE "Tasks" DROP COLUMN "intern_id";

-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "intern_id" INTEGER NOT NULL,
    "task_id" INTEGER NOT NULL,
    "submission_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_intern_id_fkey" FOREIGN KEY ("intern_id") REFERENCES "Interns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
