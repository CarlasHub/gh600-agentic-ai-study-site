# Sensitive Action Control

## Purpose

Define controls for irreversible, privileged, production, data-handling, compliance, or deployment actions.

## When To Use

Use before an agent can perform actions that need explicit authorization or controlled paths.

## Owner

Repository maintainer, CODEOWNER, or risk owner

## Required Fields

- action
- risk
- blocked_by_default
- controlled_path
- approval_owner
- rollback
- audit

## Evidence

- Sensitive action classification
- Blocked-by-default rule
- Controlled path
- Approval owner
- Rollback plan
- Audit entry

## Approval And Review

- Explicit human authorization before irreversible, privileged, production, data-handling, compliance, or deployment actions

## Failure Modes

- Agent proceeds because the PR will be reviewed later
- Approval owner is unnamed
- Rollback is described only after execution

## Recovery Or Rollback

- Stop execution, preserve evidence, route to the approval owner, and continue only through the documented controlled path

## Security And Compliance

- Sensitive actions require explicit authorization, least privilege, owner review, and auditable evidence before action

## GH-600 Relevance

Teaches when irreversible, privileged, production, or compliance-sensitive actions need explicit authorization or a controlled path.

## Sources

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [Responsible AI Principles and Approach](https://www.microsoft.com/en-us/ai/principles-and-approach/)
- [About protected branches](https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [About code owners](https://docs.github.com/articles/about-code-owners)
- [Deployments and environments](https://docs.github.com/en/actions/reference/deployments-and-environments)
- [Reviewing deployments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/review-deployments)

## Mini-example

Scenario: An agent proposes changing a deployment workflow and rotating a production secret.

Completed example: Block autonomous execution, require CODEOWNER and environment reviewer approval, document rollback, and preserve audit evidence before any controlled path continues.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| action | `{{action}}` | Link or owner proving the value is current |
| risk | `{{risk}}` | Link or owner proving the value is current |
| blocked_by_default | `{{blocked_by_default}}` | Link or owner proving the value is current |
| controlled_path | `{{controlled_path}}` | Link or owner proving the value is current |
| approval_owner | `{{approval_owner}}` | Link or owner proving the value is current |
| rollback | `{{rollback}}` | Link or owner proving the value is current |
| audit | `{{audit}}` | Link or owner proving the value is current |

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on 2026-07-09 or later.
