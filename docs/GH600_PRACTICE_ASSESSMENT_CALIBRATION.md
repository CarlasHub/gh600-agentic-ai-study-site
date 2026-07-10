# GH-600 Practice Assessment Calibration

Date: 2026-07-10

This record defines how the platform calibrates lessons, quizzes, simulator items, and case-study drills toward Microsoft practice-assessment difficulty without using copied exam items or unverifiable claims.

## Source Basis

- Microsoft GH-600 study guide: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-600
- Microsoft Practice Assessments guidance: https://learn.microsoft.com/en-us/credentials/certifications/practice-assessments-for-microsoft-certifications
- GitHub Copilot cloud agent documentation: https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent
- GitHub Copilot cloud agent risks and mitigations: https://docs.github.com/en/copilot/concepts/agents/cloud-agent/risks-and-mitigations
- GitHub Model Context Protocol documentation: https://docs.github.com/en/copilot/concepts/context/mcp
- GitHub MCP setup, toolsets, registry, allowlist, and access-control documentation listed in `src/data/sources.json`
- GitHub Actions, environments, rulesets, protected branches, CODEOWNERS, secret scanning, code scanning, dependency review, and accessibility sources listed in `src/data/sources.json`

## Calibration Model

The platform treats a hard GH-600 item as a product-behavior judgment, not a vocabulary check. A strong learner should be able to identify:

- The official GH-600 skill being tested.
- The GitHub product behavior that makes one answer stronger.
- The artifact that proves the action was scoped, reviewed, validated, or blocked.
- The tempting wrong answer and why it fails under review.
- The residual risk if the team accepts narration instead of GitHub evidence.

## Domain Expectations

Domain 1 questions should test SDLC integration, task contracts, plans, repository instructions, pull requests, checks, CODEOWNERS, and review timing.

Domain 2 questions should test MCP server configuration, toolsets, allowlists, token or permission scope, setup steps, Actions invocation, branch scope, retries, rollback, and traceability.

Domain 3 questions should test memory type, durable state, context drift, reset and pruning rules, stale context, conflicting context, and resumable execution records.

Domain 4 questions should test evaluation criteria, qualitative and quantitative signals, code scanning, secret scanning, dependency review, logs, traces, root-cause classification, and tuning decisions.

Domain 5 questions should test multi-agent isolation, parallel branches, handoffs, conflict detection, degraded execution, recovery, agent lifecycle changes, and audit continuity.

Domain 6 questions should test autonomy levels, least privilege, explicit authorization, environment reviewers, policy blocks, Responsible AI controls, audit trails, and velocity-preserving guardrails.

## Enforced Release Bar

The release gate `npm run qa:exam-hard` now requires:

- At least 18 case studies.
- At least 3 case studies per official exam domain.
- Case-study calibration profiles tied to Microsoft practice-assessment style.
- Product-behavior and tempting-distractor notes for every case-study question.
- At least 60 lesson quiz questions with source-grounded expert-style calibration metadata.
- Expert-calibrated questions to cite both `ms-gh600-guide` and `ms-practice-assessments`.
- Simulator form weights, answer-position balance, and longest-answer bias controls.

## Limitations

This calibration is source-grounded and expert-style, but it is not a claim that the platform contains real Microsoft exam questions. Microsoft practice assessments themselves state that examples are not the same as the exam and are not a replacement for training or product experience. The platform should therefore be treated as serious preparation material that must continue to track official Microsoft and GitHub documentation drift.
