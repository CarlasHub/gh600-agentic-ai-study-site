# MCP Tool Policy

## Goal

Define which MCP tools are allowed, restricted, or forbidden.

## Suggested Use

Use before enabling MCP servers or toolsets for agents.

## Placeholders

- `{{server}}`: replace with the expected value for this repository, task, or workflow.
- `{{tool}}`: replace with the expected value for this repository, task, or workflow.
- `{{allowed_use}}`: replace with the expected value for this repository, task, or workflow.
- `{{denied_use}}`: replace with the expected value for this repository, task, or workflow.
- `{{data_scope}}`: replace with the expected value for this repository, task, or workflow.
- `{{approval}}`: replace with the expected value for this repository, task, or workflow.
- `{{audit}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| server | `{{server}}` | `{{server_evidence_or_owner}}` |
| tool | `{{tool}}` | `{{tool_evidence_or_owner}}` |
| allowed use | `{{allowed_use}}` | `{{allowed_use_evidence_or_owner}}` |
| denied use | `{{denied_use}}` | `{{denied_use_evidence_or_owner}}` |
| data scope | `{{data_scope}}` | `{{data_scope_evidence_or_owner}}` |
| approval | `{{approval}}` | `{{approval_evidence_or_owner}}` |
| audit | `{{audit}}` | `{{audit_evidence_or_owner}}` |

## Expectations

- Tool access is least privilege.
- Data scope is explicit.
- Auditable use is required.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
