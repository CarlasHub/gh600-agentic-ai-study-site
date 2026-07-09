# Conflict Log

## Purpose

Track conflicts between agents, tools, requirements, or source documents.

## When To Use

Use when multi-agent work or source-grounded content produces incompatible recommendations.

## Owner

Agent workflow owner

## Required Fields

- Objective
- Assumptions
- Files
- Steps
- Validation
- Owner
- Next decision

## Evidence

- Approved plan
- Handoff packet
- Decision log
- PR comment

## Approval And Review

- Approval before execution when the plan touches sensitive paths or expands scope

## Failure Modes

- Plan and execution happen in one step
- Handoff omits risk
- Next owner is unclear

## Recovery Or Rollback

- Return to planning state, assign an owner, and preserve current evidence before continuing

## Security And Compliance

- Do not carry private or stale context into a handoff without review

## GH-600 Relevance

Tests separation of planning, execution, handoff, and reviewable evidence.

## Sources

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [Designing Agent Architecture and SDLC Integration](https://learn.microsoft.com/en-us/training/modules/design-agent-architecture-integration/)
- [About GitHub Copilot cloud agent](https://docs.github.com/copilot/concepts/about-copilot-coding-agent)
- [About GitHub Agentic Workflows](https://docs.github.com/en/copilot/concepts/agents/about-github-agentic-workflows)

## Mini-example

Scenario: A reviewer needs to decide whether an agent task using Conflict Log can continue.

Completed example: Fill docs/conflict-log.md with task scope, evidence, owner, approval decision, and rollback path before the agent proceeds.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| Objective | `{{objective}}` | Link or owner proving the value is current |
| Assumptions | `{{assumptions}}` | Link or owner proving the value is current |
| Files | `{{files}}` | Link or owner proving the value is current |
| Steps | `{{steps}}` | Link or owner proving the value is current |
| Validation | `{{validation}}` | Link or owner proving the value is current |
| Owner | `{{owner}}` | Link or owner proving the value is current |
| Next decision | `{{next_decision}}` | Link or owner proving the value is current |

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on 2026-07-09 or later.
