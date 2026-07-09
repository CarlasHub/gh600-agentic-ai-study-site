# Escalation Paths

## Purpose

Define how agents escalate ambiguity, risk, tool failures, and approval needs.

## When To Use

Use when agent tasks can encounter blocked tools, unclear requirements, or sensitive decisions.

## Owner

Repository maintainer, CODEOWNER, or risk owner

## Required Fields

- Risk class
- Approval owner
- Blocked actions
- Validation evidence
- Rollback path

## Evidence

- CODEOWNERS review
- Ruleset result
- Environment approval
- Audit note

## Approval And Review

- Named owner approval before privileged, irreversible, production, or compliance-sensitive action

## Failure Modes

- Approval is ceremonial
- Policy violation is logged only after execution
- Owner is not accountable

## Recovery Or Rollback

- Block the action, preserve evidence, and route to the risk owner for a controlled path

## Security And Compliance

- Apply least privilege and explicit authorization for security, privacy, compliance, and Responsible AI risk.

## GH-600 Relevance

Tests right-sized human intervention, guardrails, least privilege, and accountability.

## Sources

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [About protected branches](https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [About code owners](https://docs.github.com/articles/about-code-owners)
- [Deployments and environments](https://docs.github.com/en/actions/reference/deployments-and-environments)
- [Reviewing deployments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/review-deployments)
- [Responsible AI Principles and Approach](https://www.microsoft.com/en-us/ai/principles-and-approach/)

## Mini-example

Scenario: A reviewer needs to decide whether an agent task using Escalation Paths can continue.

Completed example: Fill docs/escalation-paths.md with task scope, evidence, owner, approval decision, and rollback path before the agent proceeds.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| Risk class | `{{risk_class}}` | Link or owner proving the value is current |
| Approval owner | `{{approval_owner}}` | Link or owner proving the value is current |
| Blocked actions | `{{blocked_actions}}` | Link or owner proving the value is current |
| Validation evidence | `{{validation_evidence}}` | Link or owner proving the value is current |
| Rollback path | `{{rollback_path}}` | Link or owner proving the value is current |

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on 2026-07-09 or later.
