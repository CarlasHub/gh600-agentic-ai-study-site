# Agent Step Map

## Purpose

Map an agent task into ordered intake, context, planning, approval, execution, validation, review, and handoff steps.

## When To Use

Use when the lesson asks what an agent should do first, next, or never before implementation.

## Owner

Requester plus repository maintainer

## Required Fields

- step
- allowed_action
- blocked_action
- approval_owner
- evidence
- stop_condition

## Evidence

- Issue link
- Task contract
- Acceptance criteria
- Reviewer decision

## Approval And Review

- Human approval before sensitive files, broad tools, or unclear scope are changed

## Failure Modes

- Goal is vague
- Scope expands silently
- Validation is added after implementation

## Recovery Or Rollback

- Stop the agent, rewrite the task boundary, and reopen with explicit evidence requirements

## Security And Compliance

- Classify risk tier before granting write, workflow, secret, deployment, or MCP access

## GH-600 Relevance

Tests whether the learner can convert a broad request into a bounded agent task before execution.

## Sources

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [Designing Agent Architecture and SDLC Integration](https://learn.microsoft.com/en-us/training/modules/design-agent-architecture-integration/)
- [About GitHub Copilot cloud agent](https://docs.github.com/copilot/concepts/about-copilot-coding-agent)
- [Risks and mitigations for GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/risks-and-mitigations)

## Mini-example

Scenario: A reviewer needs to decide whether an agent task using Agent Step Map can continue.

Completed example: Fill docs/agent-step-map.md with task scope, evidence, owner, approval decision, and rollback path before the agent proceeds.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| step | `{{step}}` | Link or owner proving the value is current |
| allowed_action | `{{allowed_action}}` | Link or owner proving the value is current |
| blocked_action | `{{blocked_action}}` | Link or owner proving the value is current |
| approval_owner | `{{approval_owner}}` | Link or owner proving the value is current |
| evidence | `{{evidence}}` | Link or owner proving the value is current |
| stop_condition | `{{stop_condition}}` | Link or owner proving the value is current |

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on 2026-07-09 or later.
