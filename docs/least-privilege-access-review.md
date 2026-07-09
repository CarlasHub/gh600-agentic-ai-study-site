# Least-privilege Access Review

## Purpose

Review repository, branch, workflow, MCP, secret, environment, and deployment access against task need.

## When To Use

Use when a lesson covers permissions, execution contexts, tool access, or guardrails.

## Owner

Repository maintainer, CODEOWNER, or risk owner

## Required Fields

- access_surface
- needed_for_task
- granted_level
- denied_level
- evidence
- reviewer

## Evidence

- Access surface inventory
- Task need for each permission
- Denied permission list
- Workflow token scope
- MCP and environment access decision

## Approval And Review

- Risk owner approval for any permission that exceeds task need or touches protected environments, secrets, or deployment paths

## Failure Modes

- Broad workflow token is used for convenience
- MCP write tools are enabled for read-only work
- Secret or deployment access is not tied to the task

## Recovery Or Rollback

- Revoke excess access, rerun validation with least privilege, and record the denied surface in the PR

## Security And Compliance

- Least privilege must cover repository, branch, workflow, MCP, secret, environment, and deployment access surfaces

## GH-600 Relevance

Teaches that least privilege applies across repository, branch, workflow token, MCP, secret, environment, and deployment surfaces.

## Sources

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [Risks and mitigations for GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/risks-and-mitigations)
- [Using Copilot CLI in GitHub Actions with GITHUB_TOKEN](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions)
- [Configure MCP server access for your organization or enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-mcp-server-access)
- [Deployments and environments](https://docs.github.com/en/actions/reference/deployments-and-environments)
- [Reviewing deployments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/review-deployments)

## Mini-example

Scenario: An agent requests workflow and MCP access to update docs.

Completed example: Grant repository read plus docs-path write through PR, deny secret and deployment access, deny write-capable MCP toolsets, and require escalation evidence for broader scope.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| access_surface | `{{access_surface}}` | Link or owner proving the value is current |
| needed_for_task | `{{needed_for_task}}` | Link or owner proving the value is current |
| granted_level | `{{granted_level}}` | Link or owner proving the value is current |
| denied_level | `{{denied_level}}` | Link or owner proving the value is current |
| evidence | `{{evidence}}` | Link or owner proving the value is current |
| reviewer | `{{reviewer}}` | Link or owner proving the value is current |

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on 2026-07-09 or later.
