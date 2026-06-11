# Multi-Agent Handoff Contract

## Goal

Transfer responsibility between agents without losing state, scope, or accountability.

## Suggested Use

Use when a workflow involves planner, builder, tester, reviewer, documentation, security, or release agents.

## Handoff Summary

- From agent: `{{from_agent}}`
- To agent: `{{to_agent}}`
- Handoff reason: `{{handoff_reason}}`
- Current owner of next action: `{{owner}}`
- Related issue or PR: `{{issue_or_pr}}`

## State To Transfer

| Field | Value |
| --- | --- |
| Goal | `{{goal}}` |
| Completed work | `{{completed_work}}` |
| Files changed | `{{files_changed}}` |
| Validation already run | `{{validation}}` |
| Open risks | `{{open_risks}}` |
| Decisions made | `{{decisions}}` |
| Decisions still needed | `{{pending_decisions}}` |

## Inputs For Next Agent

- `{{input_artifact}}`
- `{{source_link}}`
- `{{trace_or_log}}`

## Expected Output From Next Agent

- `{{expected_output}}`

## Tool Boundary

The receiving agent may use:

- `{{allowed_tool}}`

The receiving agent must not use:

- `{{forbidden_tool}}`

## Circular Handoff Guard

Do not hand back to the previous agent unless:

- the exact missing input is named;
- the owner of the missing input is identified;
- the handoff includes a deadline or decision path.

## Completion Criteria

- [ ] The receiving agent has enough state to continue.
- [ ] Ownership is explicit.
- [ ] Risks and approvals are preserved.
- [ ] The handoff is recorded in the issue or PR.
