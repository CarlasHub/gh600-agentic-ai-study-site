# Memory And State Record

## Purpose

Keep durable state explicit across long-running or resumed agent work.

## When To Use

Use when an agent continues across sessions, summarizes work, compacts context, or stores durable memory.

## Owner

Workflow owner or reviewer taking over the task

## Required Fields

- Current state
- Decision
- Assumption
- Expiry trigger
- Refresh source
- Next owner

## Evidence

- State file
- Decision log
- Checkpoint
- Stale-context checklist

## Approval And Review

- Reviewer approval before reusing remembered context after source, branch, policy, or owner changes

## Failure Modes

- Stale memory is trusted
- Assumptions overwrite facts
- Handoff loses open risk

## Recovery Or Rollback

- Reset memory, refresh current GitHub artifacts, and append a superseding decision

## Security And Compliance

- Do not retain sensitive data, secrets, private context, or expired assumptions in agent memory.

## GH-600 Relevance

Tests memory scope, state continuity, context refresh, and durable evidence across sessions.

## Sources

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [Foundations of Agentic AI in GitHub](https://learn.microsoft.com/en-us/training/modules/foundations-agentic-ai/)
- [About GitHub Copilot Memory](https://docs.github.com/en/copilot/concepts/agents/copilot-memory)
- [Adding repository custom instructions for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)
- [Workflows](https://docs.github.com/en/actions/using-workflows/about-workflows)

## Mini-example

Scenario: A reviewer needs to decide whether an agent task using Memory And State Record can continue.

Completed example: Fill docs/agent-memory-state-record.md with task scope, evidence, owner, approval decision, and rollback path before the agent proceeds.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| Current state | `{{current_state}}` | Link or owner proving the value is current |
| Decision | `{{decision}}` | Link or owner proving the value is current |
| Assumption | `{{assumption}}` | Link or owner proving the value is current |
| Expiry trigger | `{{expiry_trigger}}` | Link or owner proving the value is current |
| Refresh source | `{{refresh_source}}` | Link or owner proving the value is current |
| Next owner | `{{next_owner}}` | Link or owner proving the value is current |

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on 2026-07-09 or later.
