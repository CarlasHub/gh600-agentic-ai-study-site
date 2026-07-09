# Agent Documentation Template Library

This library turns GH-600 agent work into scoped, reviewable, evidence-backed GitHub artifacts.

Version: 2026.07.09
Reviewed: 2026-07-09

## Research Grounding

- The official GH-600 study guide defines the exam domains and skill bullets.
- GitHub Docs sources define product behavior for Copilot coding agent, MCP, Actions, branch protection, rulesets, CODEOWNERS, environments, and repository instructions.
- Microsoft Learn and Microsoft Responsible AI sources define architecture, SDLC, governance, and Responsible AI expectations.

## Template Standard

Every template in the library now carries purpose, when to use it, owner, required fields, evidence, approval/review, failure modes, recovery/rollback, security/compliance, GH-600 relevance, sources, and a mini-example.

## Task Intake And Contracts

Templates that convert broad intent into bounded, reviewable work before an agent edits files.

| Template | Path | Use when | GH-600 relevance |
| --- | --- | --- | --- |
| Agent Anti-pattern Review | `docs/agent-anti-pattern-review.md` | Use before accepting broad, vague, over-permissioned, or evidence-light agent work. | Tests whether the learner can convert a broad request into a bounded agent task before execution. |
| Agent Step Map | `docs/agent-step-map.md` | Use when the lesson asks what an agent should do first, next, or never before implementation. | Tests whether the learner can convert a broad request into a bounded agent task before execution. |
| Agent Task Contract | `docs/agent-task-contract.md` | Use when an issue needs more governance than a short issue form can express. | Tests whether the learner can convert a broad request into a bounded agent task before execution. |
| Agent Task Issue Template | `.github/ISSUE_TEMPLATE/agent-task.yml` | Use for every agent-assigned issue, especially work that touches tests, workflows, security, user-facing behavior, or source-grounded content. | Tests whether the learner can convert a broad request into a bounded agent task before execution. |

## Repository Instructions

Templates that teach agents how to work in a repository without expanding their autonomy silently.

| Template | Path | Use when | GH-600 relevance |
| --- | --- | --- | --- |
| AGENTS.md | `AGENTS.md` | Use at the repository root, and add nested AGENTS.md files for areas with stricter local rules. | Tests whether repository-level behavior is controlled through durable GitHub instructions. |
| Branch Scope Control | `docs/branch-scope-control.md` | Use when a lesson covers branch-based scope, repository scope, autonomous branch creation, or safe PR creation. | Teaches that branch-based scope requires an issue boundary, allowed paths, checks, and owner review; the branch alone is not the control. |
| Copilot Repository Instructions | `.github/copilot-instructions.md` | Use as the root repository instruction file and update it whenever commands, ownership, or sensitive areas change. | Tests whether repository-level behavior is controlled through durable GitHub instructions. |
| Copilot Setup Steps Workflow | `.github/workflows/copilot-setup-steps.yml` | Use when Copilot needs deterministic setup before building, testing, or validating work. | Tests whether repository-level behavior is controlled through durable GitHub instructions. |

## Planning And Handoffs

Templates for plans, specialist ownership, multi-agent coordination, and transfer of responsibility.

| Template | Path | Use when | GH-600 relevance |
| --- | --- | --- | --- |
| Agent Handoff | `docs/agent-handoff.md` | Use for resumed work, specialist transitions, or multi-agent workflows. | Tests separation of planning, execution, handoff, and reviewable evidence. |
| Agent Lifecycle Record | `docs/agent-lifecycle-record.md` | Use when adding, updating, replacing, or retiring agents in active workflows. | Tests separation of planning, execution, handoff, and reviewable evidence. |
| Agent Plan | `docs/agent-plan.md` | Use before allowing an agent to make non-trivial or cross-file changes. | Tests separation of planning, execution, handoff, and reviewable evidence. |
| Agent Plan Approval Record | `docs/agent-plan-approval-record.md` | Use when planning and execution must be separated for code, workflow, permission, or PR actions. | Teaches that planning is not a control unless execution is gated before write-capable action. |
| Agent Roles | `docs/agent-roles.md` | Use when planner, builder, tester, reviewer, security, or release agents coordinate. | Tests separation of planning, execution, handoff, and reviewable evidence. |
| Agentic Versus Automation Decision Table | `docs/agentic-vs-automation-decision-table.md` | Use when a lesson asks whether a deterministic workflow is enough or an agent needs planning, tool, and review controls. | Teaches the exam distinction between ordinary automation and agentic workflows with planning, uncertainty, tools, and review evidence. |
| Conflict Log | `docs/conflict-log.md` | Use when multi-agent work or source-grounded content produces incompatible recommendations. | Tests separation of planning, execution, handoff, and reviewable evidence. |
| Duplicate Effort Checklist | `docs/duplicate-effort-checklist.md` | Use before and during parallel multi-agent execution. | Tests separation of planning, execution, handoff, and reviewable evidence. |
| Multi-agent Arbitration Record | `docs/multi-agent-arbitration-record.md` | Use when agents conflict, duplicate effort, edit overlapping files, or disagree on success. | Teaches that conflicting agent outputs need human-owned arbitration with evidence, not agent consensus. |
| Multi-Agent Handoff Contract | `docs/multi-agent-handoff-contract.md` | Use when more than one agent or specialist workflow participates in the same delivery chain. | Tests separation of planning, execution, handoff, and reviewable evidence. |
| Multi-Agent Plan | `docs/multi-agent-plan.md` | Use when planner, builder, tester, reviewer, or release agents share one goal. | Tests separation of planning, execution, handoff, and reviewable evidence. |

## Review And Approval Gates

Templates for pull requests, human review, sensitive actions, and release decisions.

| Template | Path | Use when | GH-600 relevance |
| --- | --- | --- | --- |
| Agent Approval Gates | `docs/agent-approval-gates.md` | Use in regulated, production, security, deployment, data, or MCP/tool-enabled workflows. | Tests right-sized human intervention, guardrails, least privilege, and accountability. |
| Approval Policy | `docs/approval-policy.md` | Use for high-risk agent actions, production controls, security, data, or compliance work. | Tests right-sized human intervention, guardrails, least privilege, and accountability. |
| Autonomy Matrix | `docs/autonomy-matrix.md` | Use when deciding how much independence an agent should have for a task or domain. | Tests right-sized human intervention, guardrails, least privilege, and accountability. |
| CODEOWNERS Template | `.github/CODEOWNERS` | Use when lessons mention CODEOWNERS, sensitive paths, or owner review for agent-generated changes. | Tests right-sized human intervention, guardrails, least privilege, and accountability. |
| Escalation Paths | `docs/escalation-paths.md` | Use when agent tasks can encounter blocked tools, unclear requirements, or sensitive decisions. | Tests right-sized human intervention, guardrails, least privilege, and accountability. |
| Guardrails | `docs/guardrails.md` | Use for safety-sensitive tasks, compliance, responsible AI, or production workflows. | Tests right-sized human intervention, guardrails, least privilege, and accountability. |
| Least-privilege Access Review | `docs/least-privilege-access-review.md` | Use when a lesson covers permissions, execution contexts, tool access, or guardrails. | Teaches that least privilege applies across repository, branch, workflow token, MCP, secret, environment, and deployment surfaces. |
| Policy Violation Record | `docs/policy-violation-record.md` | Use when guardrails block an action or when an agent requests a risky exception. | Teaches that a policy-violating action should be blocked and recorded, not allowed and explained afterward. |
| Pull Request Evidence Table | `docs/pr-evidence-table.md` | Use when an agent must produce standard development artifacts that reviewers can inspect without trusting chat history. | Teaches how agent output becomes inspectable inside ordinary GitHub pull request review. |
| Pull Request Template | `.github/pull_request_template.md` | Use for all PRs, with extra rigor for agent-generated changes. | Tests right-sized human intervention, guardrails, least privilege, and accountability. |
| Responsible AI Risk Review | `docs/responsible-ai-risk-review.md` | Use for agent workflows affecting people, sensitive data, decisions, or user-facing automation. | Tests right-sized human intervention, guardrails, least privilege, and accountability. |
| Sensitive Action Control | `docs/sensitive-action-control.md` | Use before an agent can perform actions that need explicit authorization or controlled paths. | Teaches when irreversible, privileged, production, or compliance-sensitive actions need explicit authorization or a controlled path. |

## Tools, MCP, And Permissions

Templates that document tool access, MCP risk, roots, secrets, and allowed execution boundaries.

| Template | Path | Use when | GH-600 relevance |
| --- | --- | --- | --- |
| Environment Constraints | `docs/environment-constraints.md` | Use before running agents in local, CI, cloud, or sandboxed environments. | Tests tool choice, MCP governance, execution context, and least-privilege tool access. |
| Execution Context Checklist | `docs/execution-context-checklist.md` | Use before an agent acts in a GitHub workflow, Copilot cloud agent environment, MCP-backed tool path, or protected environment. | Teaches that execution context is an access boundary decision, not a vague environment description. |
| MCP Allow-list Decision | `docs/mcp-allowlist-decision.md` | Use for MCP registry, allow-list, server access, remote server, local server, or toolset lessons. | Teaches that MCP server approval, registry policy, allow-list status, and toolset selection are separate exam decisions. |
| MCP Server Review | `docs/agent-mcp-server-review.md` | Use before adding or changing an MCP server for Copilot, code review, an IDE, or a custom agent. | Tests tool choice, MCP governance, execution context, and least-privilege tool access. |
| MCP Tool Policy | `docs/mcp-tool-policy.md` | Use before enabling MCP servers or toolsets for agents. | Tests tool choice, MCP governance, execution context, and least-privilege tool access. |
| Tool Permission Matrix | `docs/agent-tool-permission-matrix.md` | Use before enabling shell, browser, MCP, deployment, database, or third-party integration tools. | Tests tool choice, MCP governance, execution context, and least-privilege tool access. |
| Tool Risk Classification | `docs/tool-risk-classification.md` | Use before approving MCP tools, custom-agent tools, workflow actions, deployment tools, or external integrations. | Teaches how tool class changes approval, logging, and rollback requirements in GH-600 scenarios. |

## Evaluation And Observability

Templates for trace review, regression tests, failure analysis, and reliability evidence.

| Template | Path | Use when | GH-600 relevance |
| --- | --- | --- | --- |
| Accessibility Checklist | `docs/accessibility-checklist.md` | Use when agent work changes visible UI, navigation, forms, tables, or learning content. | Tests evaluation signals, error analysis, tuning, and evidence-backed release decisions. |
| Accessibility Scan Evidence | `docs/accessibility-scan-evidence.md` | Use when an accessibility scan is an evaluation signal for an agent-created UI or documentation change. | Teaches accessibility scans as evaluation signals with limitations, not generic quality checks. |
| Agent Evaluation Plan | `docs/agent-evaluation-plan.md` | Use before changing prompts, tools, routing, handoffs, models, or guardrails. | Tests evaluation signals, error analysis, tuning, and evidence-backed release decisions. |
| Agent Failure Analysis | `docs/agent-failure-analysis.md` | Use after failed tasks, unsafe tool calls, incorrect PRs, broken releases, or drift reports. | Tests evaluation signals, error analysis, tuning, and evidence-backed release decisions. |
| Agent Session Log Review | `docs/agent-session-log-review.md` | Use when traceability depends on reconstructing what the agent saw, decided, called, changed, and escalated. | Teaches traceability as a reconstruction task across session logs and GitHub evidence. |
| Agent Validation Workflow | `.github/workflows/agent-validation.yml` | Use when agent work needs automated checks, artifacts, and release evidence. | Tests evaluation signals, error analysis, tuning, and evidence-backed release decisions. |
| Audit Trail | `docs/audit-trail.md` | Use when accountability, compliance, or multi-agent traceability matters. | Tests evaluation signals, error analysis, tuning, and evidence-backed release decisions. |
| CodeQL Workflow | `.github/workflows/codeql.yml` | Use when agent changes touch code paths where static analysis evidence is required. | Tests evaluation signals, error analysis, tuning, and evidence-backed release decisions. |
| Error Analysis | `docs/error-analysis.md` | Use after wrong answers, bad PRs, failed checks, tool mistakes, or source drift. | Tests evaluation signals, error analysis, tuning, and evidence-backed release decisions. |
| Regression Checklist | `docs/regression-checklist.md` | Use after tuning, root-cause fixes, scan remediation, or workflow changes. | Tests evaluation signals, error analysis, tuning, and evidence-backed release decisions. |
| Root Cause Classification | `docs/root-cause-classification.md` | Use when an agent output fails and the learner must distinguish reasoning, instruction, context, tool, permission, environment, workflow, or threshold causes. | Teaches error analysis before tuning, permission changes, tool changes, or workflow edits. |
| Security Scan Evidence | `docs/security-scan-evidence.md` | Use when agent work touches code, workflows, dependencies, secrets, or deploy paths. | Tests evaluation signals, error analysis, tuning, and evidence-backed release decisions. |
| Trace Review Record | `docs/agent-trace-review.md` | Use for debugging agent behavior and building eval cases from real failures. | Tests evaluation signals, error analysis, tuning, and evidence-backed release decisions. |
| Tuning Log | `docs/tuning-log.md` | Use when improving agent behavior after evals, failures, or source-drift findings. | Tests evaluation signals, error analysis, tuning, and evidence-backed release decisions. |
| Workflow Evidence Record | `docs/workflow-evidence-record.md` | Use when workflow runs, setup steps, checks, scans, retries, or rollbacks are part of the lesson evidence. | Teaches that workflow success must be interpreted with setup, permission, failure, retry, and scan context. |

## Memory, State, And Release Learning

Templates for durable state, decisions, retrospectives, and cross-session learning.

| Template | Path | Use when | GH-600 relevance |
| --- | --- | --- | --- |
| Agent Memory Policy | `docs/agent-memory-policy.md` | Use when lessons cover short-term, long-term, external, or shared memory. | Tests memory scope, state continuity, context refresh, and durable evidence across sessions. |
| Agent Release Retrospective | `docs/agent-release-retrospective.md` | Use after agent-assisted releases, workflow migrations, source updates, or template-library changes. | Tests memory scope, state continuity, context refresh, and durable evidence across sessions. |
| Agent State Record | `docs/agent-state.md` | Use when lessons mention state, checkpoints, resumes, or external memory. | Tests memory scope, state continuity, context refresh, and durable evidence across sessions. |
| Context Handoff | `docs/context-handoff.md` | Use when compacting, resuming, or handing off agent work. | Tests memory scope, state continuity, context refresh, and durable evidence across sessions. |
| Decision Log | `docs/decision-log.md` | Use when lessons mention governance, state, memory, review, or source-drift decisions. | Tests memory scope, state continuity, context refresh, and durable evidence across sessions. |
| Memory And State Record | `docs/agent-memory-state-record.md` | Use when an agent continues across sessions, summarizes work, compacts context, or stores durable memory. | Tests memory scope, state continuity, context refresh, and durable evidence across sessions. |
| Memory Reset Decision | `docs/memory-reset-decision.md` | Use before reusing memory after source, branch, issue, PR, policy, owner, or secret-context changes. | Teaches preserve, prune, expire, reset, and durable-state replacement decisions for agent memory. |
| Recovery Plan | `docs/recovery-plan.md` | Use for production, release, multi-agent, or tool-enabled workflows. | Tests memory scope, state continuity, context refresh, and durable evidence across sessions. |
| Resume Checkpoint | `docs/resume-checkpoint.md` | Use for long tasks, paused sessions, or handoffs. | Tests memory scope, state continuity, context refresh, and durable evidence across sessions. |
| Stale Context Checklist | `docs/stale-context-checklist.md` | Use before resuming long-running work or relying on prior source-grounded content. | Tests memory scope, state continuity, context refresh, and durable evidence across sessions. |

## Primary Sources

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
- [About code scanning](https://docs.github.com/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/about-code-scanning)
- [Code scanning with CodeQL](https://docs.github.com/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql)
- [Secret scanning](https://docs.github.com/code-security/secret-scanning/about-secret-scanning)
- [Dependency review](https://docs.github.com/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review)
- [Configuring the dependency review action](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/manage-your-dependency-security/configure-dependency-review-action)
