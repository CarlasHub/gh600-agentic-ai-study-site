# GH-600 Agentic AI Study Platform

A source-grounded exam-preparation learning platform for **Microsoft/GitHub GH-600: Developing in Agentic AI Systems**.

This project teaches agentic SDLC workflows using GitHub as the system of record and control plane. It covers Copilot cloud agent, custom instructions, custom agents, MCP, GitHub Actions, branch protection, rulesets, CODEOWNERS, environments, evaluation, multi-agent coordination, Responsible AI, guardrails, and accountability.

## Coverage Summary

- 6 exam domains
- 101 lessons
- 505 quiz questions
- 5 scenario-based exam simulator forms
- 300 simulator questions aligned to the official domain weighting
- 303 flashcards with spaced repetition progress
- 40 hands-on labs, including capstone workflows
- 12 GitHub UI workflow walkthroughs
- 60 scenarios
- 58 glossary terms, including acronyms and short names
- 65 official skill coverage rows
- Adaptive quiz practice for weaker domains
- Weekly source currentness workflow
- Search discovery support with `robots.txt`, `sitemap.xml`, clean route entry points, per-route metadata, and structured data
- Agent documentation template library for task contracts, repository instructions, planning, approval gates, MCP/tool governance, evaluation, traces, state, and release learning
- Every lesson includes explicit action steps, concrete files/settings/artifacts, a copyable agent request, enterprise checks, common mistakes to avoid, and an exam action drill

The machine-readable coverage matrix is in `src/data/coverageMatrix.json`. The readable version is in `docs/COVERAGE_MATRIX.md`.

## Source Policy

This is original educational content based on official Microsoft and GitHub sources. It does not copy Microsoft, GitHub, or third-party documentation verbatim. Every lesson, quiz, lab, flashcard, and coverage row carries source references.

Primary source of truth: [Microsoft GH-600 study guide](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600).

Research log: [docs/SOURCE_RESEARCH_LOG.md](docs/SOURCE_RESEARCH_LOG.md).

Currentness review workflow: [docs/CURRENTNESS_REVIEW.md](docs/CURRENTNESS_REVIEW.md).

Latest content QA report: [docs/CONTENT_QA_REPORT.md](docs/CONTENT_QA_REPORT.md).

Data accuracy framework: [docs/DATA_ACCURACY_FRAMEWORK.md](docs/DATA_ACCURACY_FRAMEWORK.md).

Latest data accuracy report: [docs/DATA_ACCURACY_REPORT.md](docs/DATA_ACCURACY_REPORT.md).

Agent documentation template library: [docs/TEMPLATE_LIBRARY.md](docs/TEMPLATE_LIBRARY.md).

Suspected content drift report form: [GitHub issue form](https://github.com/CarlasHub/gh600-agentic-ai-study-site/issues/new?template=content-drift.yml).

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

Run the content QA gate before relying on the site for release:

```bash
npm run qa:content
```

Run the full local check:

```bash
npm run check
```

That command validates the curriculum data, checks the SEO discovery files, runs the data accuracy scan, and then builds the production app.

Run the semantic evidence and metadata scan separately:

```bash
npm run data:accuracy
```

This checks item-level accuracy metadata, source grounding signals, quiz rationales, lab validation evidence, and writes `docs/DATA_ACCURACY_REPORT.md`.

Run the external source currentness check separately:

```bash
npm run check:sources
```

This checks source reachability, redirects, headers, content fingerprints, and source keywords. It writes `docs/SOURCE_CURRENTNESS_REPORT.md` and updates `src/data/sourceStatus.json`.

```bash
npm run build
```

The production build is written to `dist/`. The build also generates crawlable HTML entry points for lessons, domains, labs, glossary terms, library templates, and key study pages.

## Preview Build

```bash
npm run preview
```

## Deploy to GitHub Pages

The workflow in `.github/workflows/pages.yml` installs dependencies, runs content QA, runs data accuracy validation, builds the Vite app, uploads `dist/`, and deploys through GitHub Pages. Push a branch or merge to `main` after enabling Pages with GitHub Actions as the source.

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

The current content is broad and source-mapped. Each lesson includes a domain-specific case study, explicit implementation steps, file and artifact names, agent request guidance, enterprise review checks, and original GitHub UI workflow walkthroughs for the main control-plane flows. Future improvements could add more human editorial review passes as Microsoft and GitHub publish new GH-600-adjacent guidance.

## Copyright Note

Microsoft, GitHub, and product names are trademarks of their respective owners. This is an unofficial study aid. Use official Microsoft and GitHub documentation as the source of truth.
