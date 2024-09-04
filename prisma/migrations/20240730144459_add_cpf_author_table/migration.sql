/*
  Warnings:

  - Added the required column `cpf` to the `Author` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "cpf" TEXT NOT NULL;
