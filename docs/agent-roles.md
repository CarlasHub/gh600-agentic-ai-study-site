# Agent Roles

## Goal

Define responsibilities, boundaries, and handoff rules for each agent role.

## Suggested Use

Use when planner, builder, tester, reviewer, security, or release agents coordinate.

## Placeholders

- `{{role_name}}`: replace with the expected value for this repository, task, or workflow.
- `{{responsibilities}}`: replace with the expected value for this repository, task, or workflow.
- `{{inputs}}`: replace with the expected value for this repository, task, or workflow.
- `{{outputs}}`: replace with the expected value for this repository, task, or workflow.
- `{{tools}}`: replace with the expected value for this repository, task, or workflow.
- `{{handoff_rules}}`: replace with the expected value for this repository, task, or workflow.
- `{{stop_conditions}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| role name | `{{role_name}}` | `{{role_name_evidence_or_owner}}` |
| responsibilities | `{{responsibilities}}` | `{{responsibilities_evidence_or_owner}}` |
| inputs | `{{inputs}}` | `{{inputs_evidence_or_owner}}` |
| outputs | `{{outputs}}` | `{{outputs_evidence_or_owner}}` |
| tools | `{{tools}}` | `{{tools_evidence_or_owner}}` |
| handoff rules | `{{handoff_rules}}` | `{{handoff_rules_evidence_or_owner}}` |
| stop conditions | `{{stop_conditions}}` | `{{stop_conditions_evidence_or_owner}}` |

## Expectations

- Each role has one clear responsibility.
- Tools match the role.
- Handoffs do not create ownership gaps.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
