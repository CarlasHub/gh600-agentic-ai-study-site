# Lesson Template Recommendation Audit

Reviewed: 2026-07-09

## Verdict

The lesson recommendations now use source-backed GitHub artifacts by domain and topic. The generic issue template remains available, but no lesson relies on it as the only recommendation.

## Totals

- Total lessons checked: 101
- Lessons with changed recommendation paths since the previous commit: 101
- Templates in library: 53
- Templates added: 0
- Existing templates improved with production fields: 53
- Lessons where issue template alone was enough: 0
- Lessons where a different or additional artifact was required: 80

## Lessons By Domain

- domain-1: 16
- domain-2: 28
- domain-3: 14
- domain-4: 14
- domain-5: 17
- domain-6: 12

## Recommendation Categories

- Agent architecture and SDLC: 8
- Evaluation and tuning: 14
- MCP and tool access: 14
- Memory and state: 15
- Multi-agent coordination: 17
- Repository and branch governance: 8
- Responsible AI and guardrails: 15
- Workflow execution: 10

## Templates Added

- None

## Lessons Where The Generic Issue Template Was Sufficient Alone

None. The issue template is useful intake, but every final lesson needs at least one more production artifact.

## Examples Of Corrected Recommendation Logic

- Domain 1 task-definition lessons pair the issue template with task contract, plan, PR evidence, CODEOWNERS, approval gate, handoff, or step-map artifacts.
- Domain 2 branch-scope lessons now prefer branch scope, CODEOWNERS, PR, environment constraints, tool matrix, and escalation artifacts instead of MCP policy by default.
- Domain 2 MCP lessons keep MCP policy, MCP server review, allow-list decision, tool matrix, environment constraints, and validation workflow artifacts.
- Domain 3 lessons prefer memory policy, state record, resume checkpoint, stale-context checklist, decision log, and context handoff.
- Domain 4 lessons prefer evaluation plan, validation workflow, scan evidence, failure analysis, tuning log, trace review, and regression checklist.
- Domain 5 lessons prefer agent roles, multi-agent plan, handoff contract, conflict log, arbitration, duplicate-effort, recovery, and lifecycle records.
- Domain 6 lessons prefer autonomy matrix, guardrails, approval policy, Responsible AI risk review, least-privilege review, sensitive action control, policy violation record, and audit trail.

## Source Basis

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [About GitHub Copilot cloud agent](https://docs.github.com/copilot/concepts/about-copilot-coding-agent)
- [Risks and mitigations for GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/risks-and-mitigations)
- [Model Context Protocol (MCP) and GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/mcp-and-coding-agent/)
- [Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
- [Support for different types of custom instructions](https://docs.github.com/en/copilot/reference/custom-instructions-support)
- [Adding repository custom instructions for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)
- [Adding personal custom instructions for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/custom-instructions/adding-personal-custom-instructions-for-github-copilot)
- [Setting up the GitHub MCP Server](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp-in-your-ide/set-up-the-github-mcp-server)
- [Configuring toolsets for the GitHub MCP Server](https://docs.github.com/copilot/how-tos/provide-context/use-mcp/configure-toolsets)
- [Using the GitHub MCP Server from Copilot Chat](https://docs.github.com/en/copilot/how-tos/copilot-on-github/copilot-for-github-tasks/using-the-github-mcp-server-from-copilot-chat)
- [Workflows](https://docs.github.com/en/actions/using-workflows/about-workflows)
- [Deployments and environments](https://docs.github.com/en/actions/reference/deployments-and-environments)
- [Managing environments for deployment](https://docs.github.com/en/actions/reference/environments)
- [Reviewing deployments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/review-deployments)
- [About protected branches](https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- [About code owners](https://docs.github.com/articles/about-code-owners)
- [Responsible AI Principles and Approach](https://www.microsoft.com/en-us/ai/principles-and-approach/)
- [Responsible AI for Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-use-of-ai-overview)
- [Foundations of Agentic AI in GitHub](https://learn.microsoft.com/en-us/training/modules/foundations-agentic-ai/)
- [Designing Agent Architecture and SDLC Integration](https://learn.microsoft.com/en-us/training/modules/design-agent-architecture-integration/)
- [Tooling, MCP, and Agent Execution Environments](https://learn.microsoft.com/en-us/training/modules/agent-tooling-mcp-execution-environments/)
- [MCP server usage in your company](https://docs.github.com/en/copilot/concepts/mcp-management)
- [Configure an MCP registry for your organization or enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-mcp-registry)
- [Configure MCP server access for your organization or enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-mcp-server-access)
- [MCP allowlist enforcement](https://docs.github.com/en/copilot/reference/mcp-allowlist-enforcement)
- [Configure the development environment for Copilot cloud agent](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment)
- [Using Copilot CLI in GitHub Actions with GITHUB_TOKEN](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions)
- [About GitHub Agentic Workflows](https://docs.github.com/en/copilot/concepts/agents/about-github-agentic-workflows)
- [About GitHub Copilot Memory](https://docs.github.com/en/copilot/concepts/agents/copilot-memory)

## QA Rules Added

- Lesson artifact paths must resolve to a template library path or alias.
- Every lesson must have at least one domain-specific artifact.
- Branch-scope lessons must not recommend MCP policy unless the lesson itself is MCP-related.
- Template records must include production fields for owner, required fields, evidence, approval, failure modes, recovery, security/compliance, GH-600 relevance, sources, and mini-example.
- Recommended template files must exist.

## Remaining Risks

- GitHub and Microsoft documentation can change after this review date; source currentness checks remain required before release.
- The mapping is intentionally conservative. Some real organizations may add stricter local artifacts for regulated environments.
- UI labels in GitHub products may drift even when the underlying control concept remains accurate.
