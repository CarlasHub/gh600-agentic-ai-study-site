# MCP Allow-list Decision

## Purpose

Record whether an MCP server or toolset is allowed, denied, or escalated for a specific agent task.

## When To Use

Use for MCP registry, allow-list, server access, remote server, local server, or toolset lessons.

## Owner

Platform owner or tool/MCP administrator

## Required Fields

- server
- registry
- toolset
- allowed_operations
- denied_operations
- data_scope
- reviewer

## Evidence

- MCP server ID
- Registry or allow-list status
- Selected toolsets
- Denied operations
- Tool-call or dry-run evidence
- Escalation owner

## Approval And Review

- Platform owner approval before enabling an untrusted server, write-capable toolset, or broader data boundary

## Failure Modes

- Server is approved but the toolset is still too broad
- Local server is trusted without review
- Allow-list decision is missing from the PR

## Recovery Or Rollback

- Disable the MCP server or toolset, revoke access, and rerun the agent task with the approved capability boundary

## Security And Compliance

- Treat MCP server access as an external capability and data-exposure decision, not only a developer convenience

## GH-600 Relevance

Teaches that MCP server approval, registry policy, allow-list status, and toolset selection are separate exam decisions.

## Sources

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [Tooling, MCP, and Agent Execution Environments](https://learn.microsoft.com/en-us/training/modules/agent-tooling-mcp-execution-environments/)
- [MCP server usage in your company](https://docs.github.com/en/copilot/concepts/mcp-management)
- [Configure an MCP registry for your organization or enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-mcp-registry)
- [Configure MCP server access for your organization or enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-mcp-server-access)
- [MCP allowlist enforcement](https://docs.github.com/en/copilot/reference/mcp-allowlist-enforcement)
- [Configuring toolsets for the GitHub MCP Server](https://docs.github.com/copilot/how-tos/provide-context/use-mcp/configure-toolsets)

## Mini-example

Scenario: An agent needs GitHub issue context through an MCP server but does not need write operations.

Completed example: Allow the GitHub remote MCP server from the approved registry, select read-only issue/search toolsets, deny mutation tools, record data scope, and route write access to platform-owner approval.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| server | `{{server}}` | Link or owner proving the value is current |
| registry | `{{registry}}` | Link or owner proving the value is current |
| toolset | `{{toolset}}` | Link or owner proving the value is current |
| allowed_operations | `{{allowed_operations}}` | Link or owner proving the value is current |
| denied_operations | `{{denied_operations}}` | Link or owner proving the value is current |
| data_scope | `{{data_scope}}` | Link or owner proving the value is current |
| reviewer | `{{reviewer}}` | Link or owner proving the value is current |

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on 2026-07-09 or later.
