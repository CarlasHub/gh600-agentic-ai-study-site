# Pull Request Evidence Table

## Purpose

Make pull request evidence reviewable by tying each claim to a GitHub artifact, check, owner, and residual risk.

## When To Use

Use when an agent must produce standard development artifacts that reviewers can inspect without trusting chat history.

## Owner

Repository maintainer, CODEOWNER, or risk owner

## Required Fields

- claim
- github_artifact
- evidence_link
- owner
- status
- residual_risk
- next_decision

## Evidence

- Issue URL
- Changed-file list
- Workflow run URL
- Check summary
- Review comments
- Deployment or environment approval
- Rollback note

## Approval And Review

- Reviewer approval uses the evidence table to decide whether the pull request can merge, needs revision, or must be blocked

## Failure Modes

- PR summary makes claims without links
- A check result is missing or stale
- Residual risk is not assigned to an owner

## Recovery Or Rollback

- Fill missing evidence, rerun checks, request the right owner review, or close the PR if evidence cannot be produced

## Security And Compliance

- Security, deployment, workflow, and policy changes must show owner review and unresolved-risk disposition

## GH-600 Relevance

Teaches how agent output becomes inspectable inside ordinary GitHub pull request review.

## Sources

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [Workflows](https://docs.github.com/en/actions/using-workflows/about-workflows)
- [About protected branches](https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [About code owners](https://docs.github.com/articles/about-code-owners)
- [Reviewing deployments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/review-deployments)

## Mini-example

Scenario: An agent fixed a checkout bug but the reviewer cannot see which checks ran.

Completed example: Add rows for issue URL, branch diff, workflow run, failing-to-passing test, CODEOWNERS approval, residual risk, and rollback note before requesting merge.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| claim | `{{claim}}` | Link or owner proving the value is current |
| github_artifact | `{{github_artifact}}` | Link or owner proving the value is current |
| evidence_link | `{{evidence_link}}` | Link or owner proving the value is current |
| owner | `{{owner}}` | Link or owner proving the value is current |
| status | `{{status}}` | Link or owner proving the value is current |
| residual_risk | `{{residual_risk}}` | Link or owner proving the value is current |
| next_decision | `{{next_decision}}` | Link or owner proving the value is current |

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on 2026-07-09 or later.
