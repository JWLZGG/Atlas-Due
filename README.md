# Atlas Due

**Atlas Due** is a Solana-native trust and diligence layer for stablecoin settlement, treasury and payment counterparties.

## One-line pitch

Atlas Due helps platforms and treasury teams assess Solana settlement wallets, surface key risk signals, generate concise review memos and prepare review records for onchain attestation.

## Why this matters

Stablecoin and treasury workflows increasingly depend on wallet-level trust decisions. Today, those reviews are often fragmented across block explorers, screenshots, spreadsheets, and internal notes.

Atlas Due turns wallet review into a structured workflow and a portable diligence artifact.

## Core workflow

**Wallet input → analysis → review memo → onchain attestation**

## What works today

- sample wallet demo scenarios
- live Solana wallet preview
- live holdings table with concentration percentages
- recent transaction signature summary
- review memo generation
- deterministic memo hash
- printable memo flow
- attestation workflow placeholder

## MVP scope

The current MVP is focused on a narrow but valuable workflow:

- input a Solana wallet address
- analyze holdings and recent activity
- surface deterministic and early live risk signals
- generate a concise review memo
- prepare a review record for Solana Devnet attestation

### Included in v1

- wallet input
- analysis dashboard
- deterministic risk flags
- simple score
- review memo page
- memo hash generation
- early live wallet preview
- onchain review attestation placeholder

### Excluded from v1

- multichain support
- merchant checkout flow
- Visa/card integrations
- full compliance suite
- portfolio tracking
- alerts and notifications
- enterprise user management
- broad AI agent workflows

## Who it is for

Atlas Due is being designed for:

- treasury teams
- payment operators
- stablecoin settlement workflows
- platforms onboarding payout or settlement wallets

## Why Solana

Atlas Due is built around Solana for two reasons:

1. **Wallet-native financial context**  
   Solana provides the wallet-level activity and holdings data needed for settlement and treasury review.

2. **Portable review artifacts**  
   Atlas Due is designed to turn wallet review into an onchain-attestable artifact, rather than leaving diligence trapped in PDFs and internal notes.

## Current status

Atlas Due is in active build for **Solana Colosseum Frontier 2026**.

This repository represents a focused MVP being built for hackathon judging and post-hackathon startup development.

## Planned architecture

- **Next.js frontend**
- **TypeScript application layer**
- **deterministic risk engine**
- **memo generation layer**
- **Anchor-based Solana attestation program**

## Repository structure

```text
atlas-due/
  app/
  components/
  lib/
  types/
  prisma/
  scripts/
  public/
  README.md
  SPEC.md
  FOUNDER_FIT.md
  MARKET_THESIS.md
  SUBMISSION_CHECKLIST.md
  ```

## Architecture notes

### Longer-term target modules include:

components/ — reusable UI components
lib/ — helpers, constants, analysis logic, and Solana utilities
types/ — shared TypeScript types
prisma/ — database schema and migrations
scripts/ — seed and demo helper scripts

### A later monorepo structure may include:

packages/shared
packages/risk-engine
packages/memo
packages/solana-client
programs/atlas_due
What judges should look at first

## If you are reviewing this repo for the hackathon, the most important places to start are:

app/page.tsx — main user flow
app/api/analyze/route.ts — mock + live analysis entry point
components/AnalysisPanel.tsx — analysis presentation layer
components/MemoPanel.tsx — memo artifact layer
lib/solana.ts — live wallet and recent-activity reads
lib/build-review-memo.ts — memo construction and hashing

## Local setup

### Install dependencies:

```text
npm install
```

Run the development server:

```text
npm run dev
```

Open:

http://localhost:3000

## Submission context

### This repo is being built as a focused MVP for:

Solana Colosseum Frontier 2026
post-hackathon product refinement
potential pre-seed and ecosystem fundraising
Roadmap

## Near-term next steps:

deeper live transaction analysis
wallet age and activity heuristics
richer live risk scoring
Solana Devnet review attestation
cleaner memo export flow

## License

TBD