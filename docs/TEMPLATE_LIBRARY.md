# Agent Documentation Template Library

This library turns agent work into scoped, reviewable, evidence-backed GitHub artifacts.

Use it when assigning work to Copilot cloud agent, a custom agent, a third-party coding agent, or a human developer working with agent assistance.

## Research Grounding

The templates use the following design principles:

- Explicit task boundaries and evidence before action, aligned with GitHub Copilot repository instructions and AGENTS.md behavior.
- Tool and MCP access treated as a governance decision because MCP can expose arbitrary data access and code execution paths.
- Trace-first evaluation, with realistic edge cases, handoff checks, tool-call checks, and human calibration.
- Software-agent validation through issue-to-patch evidence, inspired by SWE-bench style evaluation.
- Rule-following and user-interaction checks, inspired by tau-bench style evaluation.
- Reflection and failure analysis as durable learning, without treating agent confidence as proof.

Primary references:

- GitHub Copilot repository instructions: https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions
- GitHub Copilot task best practices and custom agents: https://docs.github.com/en/copilot/tutorials/cloud-agent/get-the-best-results
- GitHub MCP server configuration: https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/configure-mcp-servers
- MCP specification: https://modelcontextprotocol.io/specification/2025-06-18
- OpenAI agent workflow evaluation: https://developers.openai.com/api/docs/guides/agent-evals
- OpenAI evaluation best practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices
- SWE-bench paper: https://arxiv.org/abs/2310.06770
- tau-bench paper: https://arxiv.org/abs/2406.12045
- ReAct paper: https://arxiv.org/abs/2210.03629
- Reflexion paper: https://arxiv.org/abs/2303.11366

## Task Intake And Contracts

| Template | Path | Suggested use |
| --- | --- | --- |
| Agent task issue form | `.github/ISSUE_TEMPLATE/agent-task.yml` | Use for every agent-assigned issue. |
| Agent task contract | `docs/agent-task-contract.md` | Use when the issue needs a fuller agreement on scope, tools, evidence, and approval. |

## Repository Instructions

| Template | Path | Suggested use |
| --- | --- | --- |
| Copilot repository instructions | `.github/copilot-instructions.md` | Use as the repository-wide instruction file. |
| AGENTS.md | `AGENTS.md` | Use as agent operating rules; add nested files for stricter local scopes. |

## Planning And Handoffs

| Template | Path | Suggested use |
| --- | --- | --- |
| Agent plan | `docs/agent-plan.md` | Require before non-trivial edits. |
| Multi-agent handoff contract | `docs/multi-agent-handoff-contract.md` | Use when planner, builder, tester, reviewer, or specialist agents transfer ownership. |

## Review And Approval Gates

| Template | Path | Suggested use |
| --- | --- | --- |
| Pull request template | `.github/pull_request_template.md` | Make PR evidence consistent. |
| Agent approval gates | `docs/agent-approval-gates.md` | Define where human approval is required. |

## Tools, MCP, And Permissions

| Template | Path | Suggested use |
| --- | --- | --- |
| Tool permission matrix | `docs/agent-tool-permission-matrix.md` | Use before enabling shell, browser, MCP, deploy, database, or third-party tools. |
| MCP server review | `docs/agent-mcp-server-review.md` | Use before adding or changing an MCP server. |

## Evaluation And Observability

| Template | Path | Suggested use |
| --- | --- | --- |
| Agent evaluation plan | `docs/agent-evaluation-plan.md` | Use before prompt, model, tool, routing, handoff, or guardrail changes. |
| Trace review record | `docs/agent-trace-review.md` | Use after real runs to collect tool, handoff, and guardrail evidence. |
| Agent failure analysis | `docs/agent-failure-analysis.md` | Use after incorrect, unsafe, or incomplete agent work. |

## Memory, State, And Release Learning

| Template | Path | Suggested use |
| --- | --- | --- |
| Memory and state record | `docs/agent-memory-state-record.md` | Use for resumed or long-running work. |
| Agent release retrospective | `docs/agent-release-retrospective.md` | Use after release or workflow changes to convert lessons into template and eval updates. |
