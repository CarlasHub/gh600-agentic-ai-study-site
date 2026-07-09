# Root Cause Classification

## Purpose

Classify agent failures before tuning prompts, changing tools, widening permissions, or adjusting workflows.

## When To Use

Use when an agent output fails and the learner must distinguish reasoning, instruction, context, tool, permission, environment, workflow, or threshold causes.

## Owner

Quality, security, or release owner

## Required Fields

- expected_result
- actual_result
- first_failing_signal
- root_cause_class
- evidence
- rejected_causes
- repair
- regression_case

## Evidence

- Expected result
- Actual result
- First failing signal
- Root-cause class
- Evidence
- Rejected causes
- Repair
- Regression case

## Approval And Review

- Quality owner reviews the classification before prompts, tools, permissions, memory, or workflows are changed

## Failure Modes

- Prompt is tuned before the failure is classified
- Tool misuse is mistaken for reasoning failure
- Environment or permission evidence is ignored

## Recovery Or Rollback

- Return to the first failing signal, classify again, undo mismatched changes, and add a regression case that catches the real cause

## Security And Compliance

- Do not widen permissions or tool access as a repair unless evidence proves permission was the root cause

## GH-600 Relevance

Teaches error analysis before tuning, permission changes, tool changes, or workflow edits.

## Sources

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [Responsible AI for Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-use-of-ai-overview)
- [Workflows](https://docs.github.com/en/actions/using-workflows/about-workflows)
- [Configure the development environment for Copilot cloud agent](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment)
- [About GitHub Copilot Memory](https://docs.github.com/en/copilot/concepts/agents/copilot-memory)
- [Configuring toolsets for the GitHub MCP Server](https://docs.github.com/copilot/how-tos/provide-context/use-mcp/configure-toolsets)
- [About code scanning](https://docs.github.com/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/about-code-scanning)

## Mini-example

Scenario: An agent fails tests after calling the wrong package manager and then proposes a prompt rewrite.

Completed example: Classify the first failure as tool misuse or environment mismatch, reject reasoning failure, fix setup/tool selection, and rerun regression checks.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| expected_result | `{{expected_result}}` | Link or owner proving the value is current |
| actual_result | `{{actual_result}}` | Link or owner proving the value is current |
| first_failing_signal | `{{first_failing_signal}}` | Link or owner proving the value is current |
| root_cause_class | `{{root_cause_class}}` | Link or owner proving the value is current |
| evidence | `{{evidence}}` | Link or owner proving the value is current |
| rejected_causes | `{{rejected_causes}}` | Link or owner proving the value is current |
| repair | `{{repair}}` | Link or owner proving the value is current |
| regression_case | `{{regression_case}}` | Link or owner proving the value is current |

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on 2026-07-09 or later.
