# MCP Server Review

## Purpose

Review MCP server capability, roots, tools, secrets, transport, and autonomous-use risk before enabling it.

## When To Use

Use before adding or changing an MCP server for Copilot, code review, an IDE, or a custom agent.

## Owner

Platform owner or tool/MCP administrator

## Required Fields

- Tool or server
- Allowed operation
- Denied operation
- Data boundary
- Approval owner
- Evidence

## Evidence

- Permission matrix
- MCP registry or allow-list decision
- Tool-call log
- Escalation record

## Approval And Review

- Platform owner review before adding write-capable tools, remote servers, or broader toolsets

## Failure Modes

- All tools enabled
- Server approved but toolset too broad
- Data boundary undocumented

## Recovery Or Rollback

- Disable the tool, revoke the server or toolset, and rerun validation with reduced access

## Security And Compliance

- Treat MCP and tools as external capability boundaries that can expose data or act autonomously.

## GH-600 Relevance

Tests tool choice, MCP governance, execution context, and least-privilege tool access.

## Sources

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [Tooling, MCP, and Agent Execution Environments](https://learn.microsoft.com/en-us/training/modules/agent-tooling-mcp-execution-environments/)
- [Model Context Protocol (MCP) and GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/mcp-and-coding-agent/)
- [Configuring toolsets for the GitHub MCP Server](https://docs.github.com/copilot/how-tos/provide-context/use-mcp/configure-toolsets)
- [Configure MCP server access for your organization or enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-mcp-server-access)
- [MCP allowlist enforcement](https://docs.github.com/en/copilot/reference/mcp-allowlist-enforcement)

## Mini-example

Scenario: A reviewer needs to decide whether an agent task using MCP Server Review can continue.

Completed example: Fill docs/agent-mcp-server-review.md with task scope, evidence, owner, approval decision, and rollback path before the agent proceeds.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| Tool or server | `{{tool_or_server}}` | Link or owner proving the value is current |
| Allowed operation | `{{allowed_operation}}` | Link or owner proving the value is current |
| Denied operation | `{{denied_operation}}` | Link or owner proving the value is current |
| Data boundary | `{{data_boundary}}` | Link or owner proving the value is current |
| Approval owner | `{{approval_owner}}` | Link or owner proving the value is current |
| Evidence | `{{evidence}}` | Link or owner proving the value is current |

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on 2026-07-09 or later.
