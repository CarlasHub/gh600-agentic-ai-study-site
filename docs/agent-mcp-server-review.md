# MCP Server Review

## Goal

Review an MCP server before it is made available to an agent.

## Suggested Use

Use before adding or changing an MCP server for Copilot cloud agent, code review, an IDE, CLI, or a custom agent.

## Server Summary

- Server name: `{{server_name}}`
- Owner: `{{owner}}`
- Business reason: `{{business_reason}}`
- Transport: `{{stdio_streamable_http_other}}`
- Deployment location: `{{local_remote_hosted}}`
- Authentication model: `{{auth_model}}`

## Capability Inventory

| Capability | Names | Needed? | Risk |
| --- | --- | --- | --- |
| Tools | `{{tool_names}}` | `{{yes_no}}` | `{{risk}}` |
| Resources | `{{resource_uris}}` | `{{yes_no}}` | `{{risk}}` |
| Prompts | `{{prompt_names}}` | `{{yes_no}}` | `{{risk}}` |
| Roots | `{{roots}}` | `{{yes_no}}` | `{{risk}}` |
| Sampling | `{{sampling_behavior}}` | `{{yes_no}}` | `{{risk}}` |
| Elicitation | `{{elicitation_behavior}}` | `{{yes_no}}` | `{{risk}}` |

## Root And Data Boundary

- Allowed roots or URIs: `{{allowed_roots}}`
- Forbidden roots or data: `{{forbidden_data}}`
- Path traversal protection reviewed: `{{yes_no}}`
- Sensitive data redaction: `{{redaction_policy}}`

## Autonomous-Use Decision

Once enabled for some agent contexts, tools may be used autonomously. Record whether that is acceptable.

```text
Decision: {{allow_reject_restrict}}
Reason: {{reason}}
Approver: {{approver}}
Restrictions: {{restrictions}}
Review date: {{date}}
```

## Validation

- [ ] Configuration syntax validated.
- [ ] Secrets use approved storage.
- [ ] Tool list matches business need.
- [ ] Roots and data access are least privilege.
- [ ] Transport security reviewed.
- [ ] Audit or trace signal identified.
- [ ] Rollback or disablement path documented.
