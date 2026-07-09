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
- Approved plan: `{{docs_agent_plan_link}}`
- Plan approval record: `{{docs_agent_plan_approval_record_link}}`
- Deviations from approved plan: `{{none_or_deviation_links}}`

## Validation Evidence

| Check | Command or method | Result | Evidence |
| --- | --- | --- | --- |
| Build | `{{build_command}}` | `{{pass_fail}}` | `{{log_or_artifact}}` |
| Tests | `{{test_command}}` | `{{pass_fail}}` | `{{log_or_artifact}}` |
| Content/source review | `{{review_method}}` | `{{pass_fail}}` | `{{source_or_report}}` |
| Browser/smoke test | `{{route_or_flow}}` | `{{pass_fail}}` | `{{screenshot_or_notes}}` |
| Security scan | `{{codeql_secret_dependency_or_other_scan}}` | `{{pass_fail_or_disposition}}` | `{{alert_or_workflow_link}}` |
| Accessibility signal | `{{scan_or_manual_check}}` | `{{pass_fail_or_limitation}}` | `{{report_or_review_link}}` |

## PR Evidence Table

| Claim | GitHub artifact | Evidence link | Owner | Decision |
| --- | --- | --- | --- | --- |
| `{{agent_claim}}` | `{{issue_pr_commit_workflow_review_or_deployment}}` | `{{url}}` | `{{owner}}` | `{{approve_reject_escalate}}` |

## Risk And Approval

- Risk tier: `{{low_medium_high}}`
- Sensitive files touched: `{{none_or_paths}}`
- Required reviewers: `{{reviewer_roles_or_users}}`
- Approval gate satisfied: `{{approval_record_or_not_required}}`
- Least-privilege access review: `{{least_privilege_access_review_link}}`
- Explicit authorization required: `{{yes_no_and_owner}}`
- Blocked or denied actions: `{{none_or_links}}`

## Tool And MCP Usage

| Tool or MCP server | Risk class | Why used | Data exposed | Approval needed | Log or evidence |
| --- | --- | --- | --- | --- | --- |
| `{{tool_name}}` | `{{read_write_privileged_secret_production_irreversible}}` | `{{reason}}` | `{{data_scope}}` | `{{yes_no_owner}}` | `{{tool_log_or_policy_link}}` |

## Audit Trail

- Issue timeline entry: `{{issue_timeline_link}}`
- Workflow evidence record: `{{workflow_evidence_record_link}}`
- Security/accessibility evidence: `{{security_or_accessibility_evidence_link}}`
- Reviewer decision: `{{review_comment_or_approval_link}}`
- Escalation or policy block: `{{none_or_link}}`

## Rollback

- Rollback command or action: `{{rollback_action}}`
- Data or migration impact: `{{none_or_details}}`
- Owner for rollback decision: `{{role_or_person}}`
- Recovery trigger: `{{failed_check_policy_block_or_manual_decision}}`

## Reviewer Checklist

- [ ] The PR maps to a task contract or issue.
- [ ] The changed files match the approved scope.
- [ ] Required checks and evidence are present.
- [ ] Risk, approval, and rollback information are explicit.
- [ ] No agent-generated claim is accepted without evidence.
- [ ] Any plan deviation, access expansion, failed scan, or missing evidence is blocked or escalated before merge.
