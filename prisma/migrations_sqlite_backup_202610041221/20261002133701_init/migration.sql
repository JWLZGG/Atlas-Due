-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "chain" TEXT NOT NULL DEFAULT 'solana',
    "recipientAddress" TEXT NOT NULL,
    "counterpartyLabel" TEXT NOT NULL,
    "asset" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "evidenceJson" TEXT NOT NULL,
    "evidenceCheckedAt" DATETIME NOT NULL,
    "evidenceSource" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "decidedAt" DATETIME NOT NULL,
    "expiresAt" DATETIME,
    "policyVersion" TEXT NOT NULL,
    "memoHash" TEXT,
    "attestationPda" TEXT,
    "attestationTx" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Review_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_apiKey_key" ON "Workspace"("apiKey");

-- CreateIndex
CREATE INDEX "Review_workspaceId_idx" ON "Review"("workspaceId");

-- CreateIndex
CREATE INDEX "Review_recipientAddress_idx" ON "Review"("recipientAddress");

-- CreateIndex
CREATE INDEX "Review_workspaceId_recipientAddress_idx" ON "Review"("workspaceId", "recipientAddress");
