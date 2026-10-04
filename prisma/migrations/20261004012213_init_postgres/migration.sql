-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "chain" TEXT NOT NULL DEFAULT 'solana',
    "recipientAddress" TEXT NOT NULL,
    "counterpartyLabel" TEXT NOT NULL,
    "asset" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "evidenceJson" TEXT NOT NULL,
    "evidenceCheckedAt" TIMESTAMP(3) NOT NULL,
    "evidenceSource" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "decidedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "policyVersion" TEXT NOT NULL,
    "memoHash" TEXT,
    "attestationPda" TEXT,
    "attestationTx" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_apiKey_key" ON "Workspace"("apiKey");

-- CreateIndex
CREATE INDEX "Review_workspaceId_idx" ON "Review"("workspaceId");

-- CreateIndex
CREATE INDEX "Review_recipientAddress_idx" ON "Review"("recipientAddress");

-- CreateIndex
CREATE INDEX "Review_workspaceId_recipientAddress_idx" ON "Review"("workspaceId", "recipientAddress");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
