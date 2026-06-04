# GH-600 Agentic AI Study Platform

A source-grounded exam-preparation learning platform for **Microsoft/GitHub GH-600: Developing in Agentic AI Systems**.

This project teaches agentic SDLC workflows using GitHub as the system of record and control plane. It covers Copilot cloud agent, custom instructions, custom agents, MCP, GitHub Actions, branch protection, rulesets, CODEOWNERS, environments, evaluation, multi-agent coordination, Responsible AI, guardrails, and accountability.

## Coverage Summary

- 6 exam domains
- 101 lessons
- 505 quiz questions
- 3 scenario-based exam simulator forms
- 180 simulator questions aligned to the official domain weighting
- 303 flashcards
- 24 hands-on labs
- 12 GitHub UI workflow walkthroughs
- 60 scenarios
- 40 glossary terms
- 65 official skill coverage rows

The machine-readable coverage matrix is in `src/data/coverageMatrix.json`. The readable version is in `docs/COVERAGE_MATRIX.md`.

## Source Policy

This is original educational content based on official Microsoft and GitHub sources. It does not copy Microsoft, GitHub, or third-party documentation verbatim. Every lesson, quiz, lab, flashcard, and coverage row carries source references.

Primary source of truth: [Microsoft GH-600 study guide](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600).

Research log: [docs/SOURCE_RESEARCH_LOG.md](docs/SOURCE_RESEARCH_LOG.md).

Currentness review workflow: [docs/CURRENTNESS_REVIEW.md](docs/CURRENTNESS_REVIEW.md).

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open the URL Vite prints, usually `http://localhost:5173`.

## Build

```bash
npm run build
```

The production build is written to `dist/`.

## Preview Build

```bash
npm run preview
```

## Deploy to GitHub Pages

The workflow in `.github/workflows/pages.yml` installs dependencies, builds the Vite app, uploads `dist/`, and deploys through GitHub Pages. Push a branch or merge to `main` after enabling Pages with GitHub Actions as the source.

## Repository Structure

```text
src/
  data/              exam blueprint, lessons, quizzes, labs, mock exams, flashcards, glossary, sources, coverage
  pages/             route-equivalent page modules
  components/        component placeholders and extension points
  styles/main.css    accessible responsive styling
content/             domain content index files
docs/                research log, coverage matrix, strategy, release checklist
public/              static assets
```

## Remaining Gaps and Uncertainty

GH-600 is a current/beta-style exam area and Microsoft states related topics may be covered beyond listed bullets. This repository maps every official bullet available from the researched study guide. The official Microsoft study guide was re-checked on 2026-06-04 and showed a page update date of 2026-05-13, but learners should still re-check the official Microsoft study guide before sitting the exam.

The current content is broad and source-mapped. Each lesson now includes a domain-specific case study, and the app includes original GitHub UI workflow walkthroughs for the main control-plane flows. Future improvements could add periodic source-diff automation.

## Copyright Note

Microsoft, GitHub, and product names are trademarks of their respective owners. This is an unofficial study aid. Use official Microsoft and GitHub documentation as the source of truth.
