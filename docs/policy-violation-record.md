# Policy Violation Record

## Purpose

Record blocked, denied, or escalated agent actions that violate security, compliance, or Responsible AI policy.

## When To Use

Use when guardrails block an action or when an agent requests a risky exception.

## Owner

Repository maintainer, CODEOWNER, or risk owner

## Required Fields

- policy
- violating_action
- detection
- decision
- owner
- corrective_action
- audit_link

## Evidence

- Policy name
- Blocked action
- Detection point
- Owner decision
- Corrective action
- Audit link

## Approval And Review

- Policy owner review before any exception or alternative controlled path is accepted

## Failure Modes

- Violation is explained after execution
- Exception lacks an owner
- Corrective action does not prevent repeat behavior

## Recovery Or Rollback

- Deny the action, remove unsafe output, document the violation, and add a guardrail or test for recurrence

## Security And Compliance

- Security, compliance, privacy, and Responsible AI violations must be blocked and recorded before continuation

## GH-600 Relevance

Teaches that a policy-violating action should be blocked and recorded, not allowed and explained afterward.

## Sources

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [Responsible AI Principles and Approach](https://www.microsoft.com/en-us/ai/principles-and-approach/)
- [Responsible AI for Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-use-of-ai-overview)
- [Risks and mitigations for GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/risks-and-mitigations)
- [About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [About code owners](https://docs.github.com/articles/about-code-owners)

## Mini-example

Scenario: An agent attempts to expose customer data in a test fixture.

Completed example: Record the privacy policy violation, deny the action, assign the data owner, require sanitized fixtures, and link the corrective PR evidence.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| policy | `{{policy}}` | Link or owner proving the value is current |
| violating_action | `{{violating_action}}` | Link or owner proving the value is current |
| detection | `{{detection}}` | Link or owner proving the value is current |
| decision | `{{decision}}` | Link or owner proving the value is current |
| owner | `{{owner}}` | Link or owner proving the value is current |
| corrective_action | `{{corrective_action}}` | Link or owner proving the value is current |
| audit_link | `{{audit_link}}` | Link or owner proving the value is current |

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on 2026-07-09 or later.
