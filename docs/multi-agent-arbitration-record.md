# Multi-agent Arbitration Record

## Purpose

Record the human-owned decision when multiple agents produce overlapping or contradictory work.

## When To Use

Use when agents conflict, duplicate effort, edit overlapping files, or disagree on success.

## Owner

Agent workflow owner

## Required Fields

- conflict
- agent_outputs
- evidence_compared
- arbiter
- decision
- rejected_alternative

## Evidence

- Conflicting outputs
- Branches or files affected
- Evidence compared
- Arbiter
- Decision
- Rejected alternative

## Approval And Review

- Named human arbiter decides which output survives before conflicting branches merge

## Failure Modes

- Agents resolve disagreement by consensus
- Duplicate work merges twice
- Rejected assumptions are lost

## Recovery Or Rollback

- Pause affected agents, preserve both outputs, choose one owner, and close or rebase conflicting branches

## Security And Compliance

- Conflicting agent outputs that touch sensitive paths require owner review before continuation

## GH-600 Relevance

Teaches that conflicting agent outputs need human-owned arbitration with evidence, not agent consensus.

## Sources

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [Foundations of Agentic AI in GitHub](https://learn.microsoft.com/en-us/training/modules/foundations-agentic-ai/)
- [Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
- [About GitHub Agentic Workflows](https://docs.github.com/en/copilot/concepts/agents/about-github-agentic-workflows)
- [Risks and mitigations for GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/risks-and-mitigations)

## Mini-example

Scenario: A builder agent and tester agent disagree whether a failing check is flaky.

Completed example: Pause both branches, compare logs and diffs, assign the release owner as arbiter, accept the tester evidence, and record the rejected builder assumption.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| conflict | `{{conflict}}` | Link or owner proving the value is current |
| agent_outputs | `{{agent_outputs}}` | Link or owner proving the value is current |
| evidence_compared | `{{evidence_compared}}` | Link or owner proving the value is current |
| arbiter | `{{arbiter}}` | Link or owner proving the value is current |
| decision | `{{decision}}` | Link or owner proving the value is current |
| rejected_alternative | `{{rejected_alternative}}` | Link or owner proving the value is current |

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on 2026-07-09 or later.
