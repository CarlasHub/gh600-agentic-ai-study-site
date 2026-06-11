# Multi-Agent Plan

## Goal

Plan coordinated work across multiple specialist agents.

## Suggested Use

Use when planner, builder, tester, reviewer, or release agents share one goal.

## Placeholders

- `{{goal}}`: replace with the expected value for this repository, task, or workflow.
- `{{agent_roles}}`: replace with the expected value for this repository, task, or workflow.
- `{{handoff_order}}`: replace with the expected value for this repository, task, or workflow.
- `{{shared_state}}`: replace with the expected value for this repository, task, or workflow.
- `{{conflict_policy}}`: replace with the expected value for this repository, task, or workflow.
- `{{validation}}`: replace with the expected value for this repository, task, or workflow.
- `{{owner}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| goal | `{{goal}}` | `{{goal_evidence_or_owner}}` |
| agent roles | `{{agent_roles}}` | `{{agent_roles_evidence_or_owner}}` |
| handoff order | `{{handoff_order}}` | `{{handoff_order_evidence_or_owner}}` |
| shared state | `{{shared_state}}` | `{{shared_state_evidence_or_owner}}` |
| conflict policy | `{{conflict_policy}}` | `{{conflict_policy_evidence_or_owner}}` |
| validation | `{{validation}}` | `{{validation_evidence_or_owner}}` |
| owner | `{{owner}}` | `{{owner_evidence_or_owner}}` |

## Expectations

- One owner controls each step.
- Shared state is durable.
- Conflicts have a resolution policy.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
