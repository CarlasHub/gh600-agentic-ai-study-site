# Accessibility Scan Evidence

## Purpose

Record automated and manual accessibility evaluation evidence without overstating what a scan proves.

## When To Use

Use when an accessibility scan is an evaluation signal for an agent-created UI or documentation change.

## Owner

Quality, security, or release owner

## Required Fields

- page_or_component
- tool
- scan_run
- findings
- manual_checks
- limitations
- owner_decision
- pr_evidence

## Evidence

- Accessibility scan run
- Tool and version
- Findings
- Manual keyboard or assistive-technology checks
- Known limitations
- Owner decision
- PR evidence

## Approval And Review

- Accessibility or quality owner reviews automated findings plus manual checks before accepting residual accessibility risk

## Failure Modes

- Automated scan is treated as complete proof
- Manual keyboard or screen-reader review is skipped
- Findings lack owner disposition

## Recovery Or Rollback

- Reopen unresolved findings, rerun the scan, add manual checks, and block merge until owner disposition is recorded

## Security And Compliance

- Accessibility evidence should not expose private user data in screenshots, logs, or public artifacts

## GH-600 Relevance

Teaches accessibility scans as evaluation signals with limitations, not generic quality checks.

## Sources

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [Responsible AI for Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-use-of-ai-overview)
- [Accessibility evaluation and testing](https://learn.microsoft.com/en-us/training/modules/accessibility-evaluation-and-testing/)
- [Accessibility testing](https://learn.microsoft.com/en-us/windows/apps/design/accessibility/accessibility-testing)
- [Resources for accessibility testing](https://learn.microsoft.com/en-us/microsoft-edge/accessibility/test)
- [Workflows](https://docs.github.com/en/actions/using-workflows/about-workflows)

## Mini-example

Scenario: An agent changes checkout form markup and a Lighthouse run passes.

Completed example: Record the scan run, findings, keyboard path, label/name checks, limitations, reviewer decision, and PR evidence instead of treating the pass as the whole verdict.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| page_or_component | `{{page_or_component}}` | Link or owner proving the value is current |
| tool | `{{tool}}` | Link or owner proving the value is current |
| scan_run | `{{scan_run}}` | Link or owner proving the value is current |
| findings | `{{findings}}` | Link or owner proving the value is current |
| manual_checks | `{{manual_checks}}` | Link or owner proving the value is current |
| limitations | `{{limitations}}` | Link or owner proving the value is current |
| owner_decision | `{{owner_decision}}` | Link or owner proving the value is current |
| pr_evidence | `{{pr_evidence}}` | Link or owner proving the value is current |

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on 2026-07-09 or later.
