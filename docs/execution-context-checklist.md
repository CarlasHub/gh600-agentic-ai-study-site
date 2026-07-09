# Execution Context Checklist

## Purpose

Evaluate repository, branch, runner, token, secret, environment, MCP/tool, data, and approval boundaries before agent execution.

## When To Use

Use before an agent acts in a GitHub workflow, Copilot cloud agent environment, MCP-backed tool path, or protected environment.

## Owner

Platform owner or tool/MCP administrator

## Required Fields

- repository_scope
- branch_scope
- runner_context
- token_permissions
- secret_access
- environment_access
- tool_access
- data_boundary
- approval_point

## Evidence

- Repository scope
- Branch scope
- Runner context
- GITHUB_TOKEN permissions
- Secret access
- Environment access
- MCP/tool access
- Data boundary
- Approval point

## Approval And Review

- Owner approval is required before expanding repository, token, secret, environment, MCP/tool, or data access beyond the task need

## Failure Modes

- The agent uses inherited access just because it exists
- Secret or environment access is not documented
- MCP access is approved without toolset narrowing

## Recovery Or Rollback

- Remove unused access, rerun validation in the narrowed context, and document any rejected expansion request

## Security And Compliance

- Treat execution context as the union of repo, branch, runner, token, secret, environment, MCP/tool, and data boundaries

## GH-600 Relevance

Teaches that execution context is an access boundary decision, not a vague environment description.

## Sources

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [Tooling, MCP, and Agent Execution Environments](https://learn.microsoft.com/en-us/training/modules/agent-tooling-mcp-execution-environments/)
- [Workflows](https://docs.github.com/en/actions/using-workflows/about-workflows)
- [Configure the development environment for Copilot cloud agent](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment)
- [Using Copilot CLI in GitHub Actions with GITHUB_TOKEN](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions)
- [Deployments and environments](https://docs.github.com/en/actions/reference/deployments-and-environments)
- [Reviewing deployments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/review-deployments)
- [Configuring toolsets for the GitHub MCP Server](https://docs.github.com/copilot/how-tos/provide-context/use-mcp/configure-toolsets)

## Mini-example

Scenario: A docs agent runs in a workflow that can write packages and read deployment secrets.

Completed example: Grant docs-path branch write, deny package publish and secrets, set read-only MCP tools, record token permissions, and require escalation for protected environments.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| repository_scope | `{{repository_scope}}` | Link or owner proving the value is current |
| branch_scope | `{{branch_scope}}` | Link or owner proving the value is current |
| runner_context | `{{runner_context}}` | Link or owner proving the value is current |
| token_permissions | `{{token_permissions}}` | Link or owner proving the value is current |
| secret_access | `{{secret_access}}` | Link or owner proving the value is current |
| environment_access | `{{environment_access}}` | Link or owner proving the value is current |
| tool_access | `{{tool_access}}` | Link or owner proving the value is current |
| data_boundary | `{{data_boundary}}` | Link or owner proving the value is current |
| approval_point | `{{approval_point}}` | Link or owner proving the value is current |

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on 2026-07-09 or later.
