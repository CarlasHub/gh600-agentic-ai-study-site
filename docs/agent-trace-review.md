# Agent Trace Review

## Goal

Review the end-to-end behavior of an agent run.

## Suggested Use

Use after a real or simulated agent run, especially when debugging tool choice, handoffs, guardrail trips, unexpected output, or regression risk.

## Trace Metadata

- Trace ID: `{{trace_id}}`
- Workflow: `{{workflow}}`
- Agent profile or model: `{{agent_profile_or_model}}`
- Date: `{{date}}`
- Reviewer: `{{reviewer}}`
- Related issue or PR: `{{issue_or_pr}}`

## Run Summary

- User request: `{{user_request}}`
- Expected outcome: `{{expected_outcome}}`
- Actual outcome: `{{actual_outcome}}`
- Final status: `{{success_failure_partial}}`

## Tool Calls

| Step | Tool | Arguments correct? | Output useful? | Notes |
| --- | --- | --- | --- | --- |
| `{{step}}` | `{{tool}}` | `{{yes_no}}` | `{{yes_no}}` | `{{notes}}` |

## Handoffs

| From | To | Expected? | Result |
| --- | --- | --- | --- |
| `{{from_agent}}` | `{{to_agent}}` | `{{yes_no}}` | `{{result}}` |

## Guardrails And Policy

- Guardrail triggered: `{{yes_no}}`
- Expected trigger: `{{yes_no}}`
- Policy followed: `{{yes_no}}`
- Sensitive data exposed: `{{none_or_details}}`

## Failure Or Surprise

Describe the smallest observable failure:

`{{failure_description}}`

Likely cause:

- [ ] Prompt or instruction gap
- [ ] Missing context
- [ ] Wrong tool
- [ ] Incorrect tool arguments
- [ ] Handoff loop or wrong owner
- [ ] Guardrail gap
- [ ] Model limitation
- [ ] External system failure

## Follow-Up

- Regression case to add: `{{eval_case}}`
- Template to update: `{{template_path}}`
- Owner: `{{owner}}`
- Due date: `{{due_date}}`
