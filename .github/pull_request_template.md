# Pull Request Evidence

## Goal

`{{linked_issue_or_task_contract}}`

State the user-visible or maintainer-visible outcome this PR delivers.

## Summary

- `{{change_1}}`
- `{{change_2}}`
- `{{change_3}}`

## Scope Control

Allowed scope from the task:

- `{{allowed_path_or_area}}`

Out of scope and intentionally not changed:

- `{{non_goal_or_sensitive_area}}`

## Agent Or Human Work Record

- Agent or human operator: `{{operator}}`
- Agent session, trace, or run link: `{{session_or_trace_link}}`
- Model or agent profile, if known: `{{agent_profile_or_model}}`
- Handoff source, if any: `{{handoff_source}}`

## Validation Evidence

| Check | Command or method | Result | Evidence |
| --- | --- | --- | --- |
| Build | `{{build_command}}` | `{{pass_fail}}` | `{{log_or_artifact}}` |
| Tests | `{{test_command}}` | `{{pass_fail}}` | `{{log_or_artifact}}` |
| Content/source review | `{{review_method}}` | `{{pass_fail}}` | `{{source_or_report}}` |
| Browser/smoke test | `{{route_or_flow}}` | `{{pass_fail}}` | `{{screenshot_or_notes}}` |

## Risk And Approval

- Risk tier: `{{low_medium_high}}`
- Sensitive files touched: `{{none_or_paths}}`
- Required reviewers: `{{reviewer_roles_or_users}}`
- Approval gate satisfied: `{{approval_record_or_not_required}}`

## Tool And MCP Usage

| Tool or MCP server | Why used | Data exposed | Approval needed |
| --- | --- | --- | --- |
| `{{tool_name}}` | `{{reason}}` | `{{data_scope}}` | `{{yes_no}}` |

## Rollback

- Rollback command or action: `{{rollback_action}}`
- Data or migration impact: `{{none_or_details}}`
- Owner for rollback decision: `{{role_or_person}}`

## Reviewer Checklist

- [ ] The PR maps to a task contract or issue.
- [ ] The changed files match the approved scope.
- [ ] Required checks and evidence are present.
- [ ] Risk, approval, and rollback information are explicit.
- [ ] No agent-generated claim is accepted without evidence.
