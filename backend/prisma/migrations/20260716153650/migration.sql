/*
  Warnings:

  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Submission";

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "output" TEXT,
    "language" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "runtimeError" TEXT,
    "isExecuted" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "userId" TEXT,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "submissions_submissionId_key" ON "submissions"("submissionId");

-- CreateIndex
CREATE INDEX "submissions_userId_idx" ON "submissions"("userId");

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
