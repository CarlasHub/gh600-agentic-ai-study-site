# Agent Evaluation Plan

## Goal

Define how an agent workflow will be evaluated before it is trusted or released.

## Suggested Use

Use before changing prompts, model settings, tool availability, MCP configuration, handoffs, guardrails, or repository instructions.

## Workflow Under Test

- Workflow name: `{{workflow_name}}`
- Owner: `{{owner}}`
- Agent profile or model: `{{agent_profile_or_model}}`
- Tools and MCP servers: `{{tools}}`
- User journey or task class: `{{task_class}}`

## Evaluation Questions

- Did the agent choose the right tool?
- Did the agent call tools with correct arguments?
- Did a handoff happen only when it should?
- Did the workflow follow domain policy and system instructions?
- Did the output satisfy the task goal?
- Did the workflow avoid sensitive or forbidden actions?

Add local questions:

- `{{local_eval_question}}`

## Dataset

| Case ID | Scenario | Expected behavior | Edge case covered |
| --- | --- | --- | --- |
| `{{case_id}}` | `{{scenario}}` | `{{expected_behavior}}` | `{{edge_case}}` |

Include:

- happy paths;
- ambiguous requests;
- tool failures;
- multi-intent requests;
- conflicting user/system instructions;
- handoff loops;
- long context or resumed work;
- sensitive data or permission boundaries.

## Metrics

| Metric | Target | Blocking? |
| --- | --- | --- |
| `{{success_rate_or_score}}` | `{{target}}` | `{{yes_no}}` |
| `{{tool_call_accuracy}}` | `{{target}}` | `{{yes_no}}` |
| `{{handoff_accuracy}}` | `{{target}}` | `{{yes_no}}` |
| `{{policy_violation_rate}}` | `{{target}}` | `{{yes_no}}` |

## Grading

- Deterministic checks: `{{exact_or_schema_checks}}`
- Model-graded checks: `{{rubric}}`
- Human review sample: `{{sample_size_and_owner}}`
- Calibration method: `{{how_model_grades_are_checked}}`

## Release Decision

```text
Release threshold: {{threshold}}
Latest result: {{result}}
Decision: {{ship_block_iterate}}
Owner: {{owner}}
Follow-up evals: {{follow_up_cases}}
```
