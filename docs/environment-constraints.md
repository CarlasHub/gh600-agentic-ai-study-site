# Environment Constraints

## Goal

Document runtime, network, filesystem, secret, and deployment constraints for agent work.

## Suggested Use

Use before running agents in local, CI, cloud, or sandboxed environments.

## Placeholders

- `{{runtime}}`: replace with the expected value for this repository, task, or workflow.
- `{{network_access}}`: replace with the expected value for this repository, task, or workflow.
- `{{filesystem_scope}}`: replace with the expected value for this repository, task, or workflow.
- `{{secrets}}`: replace with the expected value for this repository, task, or workflow.
- `{{blocked_actions}}`: replace with the expected value for this repository, task, or workflow.
- `{{validation_command}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| runtime | `{{runtime}}` | `{{runtime_evidence_or_owner}}` |
| network access | `{{network_access}}` | `{{network_access_evidence_or_owner}}` |
| filesystem scope | `{{filesystem_scope}}` | `{{filesystem_scope_evidence_or_owner}}` |
| secrets | `{{secrets}}` | `{{secrets_evidence_or_owner}}` |
| blocked actions | `{{blocked_actions}}` | `{{blocked_actions_evidence_or_owner}}` |
| validation command | `{{validation_command}}` | `{{validation_command_evidence_or_owner}}` |

## Expectations

- Constraints are visible before execution.
- Secrets and write surfaces are protected.
- Validation matches the environment.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
