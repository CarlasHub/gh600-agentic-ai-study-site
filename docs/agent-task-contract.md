# Agent Task Contract

## Goal

`{{one_sentence_goal}}`

Define the outcome the agent must deliver. The goal must be observable, not just a preference.

## Suggested Use

Use this contract when an agent task needs more governance than an issue title can provide.

Examples:

- multi-file implementation;
- source-grounded documentation update;
- workflow or CI change;
- MCP/tool-enabled task;
- security, deployment, or data-sensitive change.

## Task Owner

- Requester: `{{requester}}`
- Approver: `{{approver}}`
- Reviewer: `{{reviewer}}`
- Repository: `{{repository}}`
- Related issue: `{{issue_url}}`

## Context

`{{business_context}}`

Links:

- `{{source_or_design_link}}`
- `{{related_pr_or_issue}}`

## Scope

Allowed to edit:

- `{{allowed_path}}`

Allowed to inspect only:

- `{{inspect_only_path}}`

Not allowed:

- `{{forbidden_path_or_behavior}}`

## Inputs

- User request: `{{request_summary}}`
- Source documents: `{{source_documents}}`
- Required data: `{{required_data}}`
- Assumptions: `{{assumptions_to_confirm}}`

## Outputs

Expected artifacts:

- `{{artifact_path}}`: `{{artifact_purpose}}`
- `{{artifact_path}}`: `{{artifact_purpose}}`

Expected PR evidence:

- `{{test_output}}`
- `{{screenshot_or_trace}}`
- `{{source_review_note}}`

## Tool Boundary

| Tool or MCP server | Allowed use | Approval required | Notes |
| --- | --- | --- | --- |
| `{{tool_name}}` | `{{allowed_use}}` | `{{yes_no}}` | `{{notes}}` |

## Acceptance Criteria

- [ ] `{{criterion_1}}`
- [ ] `{{criterion_2}}`
- [ ] `{{criterion_3}}`

## Validation Plan

Commands:

```bash
{{validation_command}}
```

Manual checks:

- `{{manual_check}}`

Evidence required:

- `{{evidence_item}}`

## Stop Conditions

The agent must stop if:

- `{{stop_condition}}`
- `{{sensitive_decision}}`
- `{{unexpected_failure}}`

## Completion Standard

The task is complete only when:

1. the acceptance criteria pass;
2. the validation evidence is recorded;
3. the PR explains risk and rollback;
4. a human reviewer can decide without reading private chat history.
