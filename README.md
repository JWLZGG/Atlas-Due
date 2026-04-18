# Atlas Due

Atlas Due is a Solana-native trust and diligence layer for stablecoin settlement, treasury, and payment counterparties.

## One-line pitch

Atlas Due helps platforms and treasury teams assess Solana settlement wallets, surface key risk signals, generate concise review memos, and anchor review records onchain.

## Core workflow

**Wallet input → analysis → review memo → onchain attestation**

## Why it exists

Stablecoin and treasury workflows increasingly rely on wallet-level trust decisions, but those reviews are still fragmented across block explorers, screenshots, spreadsheets, and internal notes.

Atlas Due turns wallet review into a structured diligence workflow and a portable trust artifact.

## Current status

Atlas Due is in active build for **Solana Colosseum Frontier 2026**.

This repository represents a focused MVP being built for hackathon judging and post-hackathon startup development.

## What works today

- sample wallet demo scenarios
- live Solana wallet preview
- live holdings table with concentration percentages
- recent transaction signature summary
- review memo generation
- deterministic memo hash

## MVP scope

The current MVP is focused on a narrow but valuable workflow:

- input a Solana wallet address
- analyze holdings and activity
- surface deterministic and early live risk signals
- generate a concise review memo
- anchor a review record on Solana Devnet

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

## Planned architecture

- **Next.js frontend**
- **TypeScript application layer**
- **deterministic risk engine**
- **memo generation layer**
- **Anchor-based Solana attestation program**

## Near-term repository structure

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

## Notes on architecture direction

```text
Longer-term target modules include:

components/ — reusable UI components
lib/ — helpers, constants, and app logic
types/ — shared TypeScript types
prisma/ — database schema and migrations
scripts/ — seed and demo helper scripts

A later monorepo structure may include:

```text
packages/shared
packages/risk-engine
packages/memo
packages/solana-client
programs/atlas_due
Local setup

## Install dependencies:

npm install

Run the development server:

npm run dev

Open:

http://localhost:3000

### Submission context

## This repo is being built as a focused MVP for:

```text
Solana Colosseum Frontier 2026
post-hackathon product refinement
potential pre-seed and ecosystem fundraising

### License

```text
TBD