# Data Accuracy Action Log

Use this log to record source drift, semantic review decisions, and learner-reported corrections.

Date | Source or issue | Area reviewed | Decision | Follow-up
--- | --- | --- | --- | ---
2026-06-11 | GitHub issue #2 | Repository-wide validation framework | Added source fingerprint monitoring, deterministic data accuracy scans, accuracy metadata, CI integration, reporting docs, and a content drift issue form. | Run weekly source monitoring and review flagged source changes before release recommendations.
2026-07-08 | SEO release source-currentness refresh | GitHub documentation source fingerprints | Source reachability passed, but 14 GitHub documentation pages changed content hash since the June baseline. SEO changes can ship because crawlability work does not alter exam content, but the accuracy dashboard now records `review-needed`. | Review changed GitHub docs before changing lesson, quiz, lab, or readiness assumptions.
2026-07-10 | `ms-gh600-guide`, `gh-secret-scanning` | Exam blueprint and secret-scanning source fingerprints | Reviewed current official pages. GH-600 guide still shows the same six domains, weights, and skill bullets; page reports last updated 2026-05-13. GitHub Secret Scanning remains the same concept source after current URL/content fingerprint refresh. No lesson objective changes required. | Accept new source fingerprints, keep source status current, and continue weekly monitoring.
