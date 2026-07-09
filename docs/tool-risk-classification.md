# Tool Risk Classification

## Purpose

Classify agent tools by read-only, write-capable, privileged, external-data, secret, production, and irreversible risk.

## When To Use

Use before approving MCP tools, custom-agent tools, workflow actions, deployment tools, or external integrations.

## Owner

Platform owner or tool/MCP administrator

## Required Fields

- tool_name
- risk_class
- allowed_operations
- denied_operations
- approval_required
- logging_required
- rollback_path

## Evidence

- Tool name
- Risk class
- Allowed operations
- Denied operations
- Approval requirement
- Tool-call log
- Rollback or disable path

## Approval And Review

- Platform owner approval is required for write-capable, privileged, secret-accessing, production-impacting, or irreversible tools

## Failure Modes

- Tool is marked safe because it is useful
- Read and write operations are not separated
- Rollback is impossible or unnamed

## Recovery Or Rollback

- Disable or remove the tool, revoke credentials, rerun with the lowest-risk toolset, and preserve the denied request

## Security And Compliance

- External-data, secret, production, and irreversible tools require explicit controls, logs, and owner decisions

## GH-600 Relevance

Teaches how tool class changes approval, logging, and rollback requirements in GH-600 scenarios.

## Sources

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [Tooling, MCP, and Agent Execution Environments](https://learn.microsoft.com/en-us/training/modules/agent-tooling-mcp-execution-environments/)
- [Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
- [Configuring toolsets for the GitHub MCP Server](https://docs.github.com/copilot/how-tos/provide-context/use-mcp/configure-toolsets)
- [Configure MCP server access for your organization or enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-mcp-server-access)
- [Risks and mitigations for GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/risks-and-mitigations)
- [Using Copilot CLI in GitHub Actions with GITHUB_TOKEN](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions)

## Mini-example

Scenario: An agent needs issue search but asks for repository write and deployment tools.

Completed example: Classify issue search as read-only, repository write as write-capable, deployment as production-impacting, deny deployment, log the tool call, and require owner approval for write access.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| tool_name | `{{tool_name}}` | Link or owner proving the value is current |
| risk_class | `{{risk_class}}` | Link or owner proving the value is current |
| allowed_operations | `{{allowed_operations}}` | Link or owner proving the value is current |
| denied_operations | `{{denied_operations}}` | Link or owner proving the value is current |
| approval_required | `{{approval_required}}` | Link or owner proving the value is current |
| logging_required | `{{logging_required}}` | Link or owner proving the value is current |
| rollback_path | `{{rollback_path}}` | Link or owner proving the value is current |

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on 2026-07-09 or later.
