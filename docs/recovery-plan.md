# Recovery Plan

## Goal

Define how to recover when an agent workflow fails or produces unsafe output.

## Suggested Use

Use for production, release, multi-agent, or tool-enabled workflows.

## Placeholders

- `{{failure_mode}}`: replace with the expected value for this repository, task, or workflow.
- `{{detection}}`: replace with the expected value for this repository, task, or workflow.
- `{{rollback}}`: replace with the expected value for this repository, task, or workflow.
- `{{data_repair}}`: replace with the expected value for this repository, task, or workflow.
- `{{owner}}`: replace with the expected value for this repository, task, or workflow.
- `{{communication}}`: replace with the expected value for this repository, task, or workflow.
- `{{postmortem}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| failure mode | `{{failure_mode}}` | `{{failure_mode_evidence_or_owner}}` |
| detection | `{{detection}}` | `{{detection_evidence_or_owner}}` |
| rollback | `{{rollback}}` | `{{rollback_evidence_or_owner}}` |
| data repair | `{{data_repair}}` | `{{data_repair_evidence_or_owner}}` |
| owner | `{{owner}}` | `{{owner_evidence_or_owner}}` |
| communication | `{{communication}}` | `{{communication_evidence_or_owner}}` |
| postmortem | `{{postmortem}}` | `{{postmortem_evidence_or_owner}}` |

## Expectations

- Recovery actions are executable.
- Owners are named.
- Post-incident learning is captured.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
