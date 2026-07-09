# Agentic Versus Automation Decision Table

## Purpose

Choose ordinary automation or agentic workflow controls based on determinism, uncertainty, tools, evidence, and stop conditions.

## When To Use

Use when a lesson asks whether a deterministic workflow is enough or an agent needs planning, tool, and review controls.

## Owner

Agent workflow owner

## Required Fields

- task_pattern
- deterministic_fit
- agentic_signal
- required_control
- evidence
- stop_condition

## Evidence

- Task pattern
- Deterministic trigger
- Uncertainty signal
- Tool-use need
- Review artifact
- Stop condition

## Approval And Review

- Workflow owner approves agentic execution when uncertainty, tool choice, or broad context requires planning and evidence

## Failure Modes

- A deterministic CI task is overbuilt as agentic
- An uncertain tool-using task is treated like a simple script
- Stop conditions are omitted

## Recovery Or Rollback

- Move deterministic work back to automation, or add plan, tool, evidence, and approval controls when agentic uncertainty is real

## Security And Compliance

- Agentic workflows need tighter controls when tools, secrets, protected paths, or production-impacting actions are possible

## GH-600 Relevance

Teaches the exam distinction between ordinary automation and agentic workflows with planning, uncertainty, tools, and review evidence.

## Sources

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [Foundations of Agentic AI in GitHub](https://learn.microsoft.com/en-us/training/modules/foundations-agentic-ai/)
- [Designing Agent Architecture and SDLC Integration](https://learn.microsoft.com/en-us/training/modules/design-agent-architecture-integration/)
- [About GitHub Agentic Workflows](https://docs.github.com/en/copilot/concepts/agents/about-github-agentic-workflows)
- [Workflows](https://docs.github.com/en/actions/using-workflows/about-workflows)
- [Risks and mitigations for GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/risks-and-mitigations)

## Mini-example

Scenario: A repo labels stale issues nightly and also asks an agent to choose fixes for flaky tests.

Completed example: Classify stale labeling as deterministic automation; classify flaky-test repair as agentic because it needs diagnosis, tool use, evidence, and reviewer stop conditions.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| task_pattern | `{{task_pattern}}` | Link or owner proving the value is current |
| deterministic_fit | `{{deterministic_fit}}` | Link or owner proving the value is current |
| agentic_signal | `{{agentic_signal}}` | Link or owner proving the value is current |
| required_control | `{{required_control}}` | Link or owner proving the value is current |
| evidence | `{{evidence}}` | Link or owner proving the value is current |
| stop_condition | `{{stop_condition}}` | Link or owner proving the value is current |

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on 2026-07-09 or later.
