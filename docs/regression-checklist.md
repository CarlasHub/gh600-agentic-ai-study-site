# Regression Checklist

## Purpose

Verify that prompt, memory, tool, workflow, or guardrail changes did not break previously passing behavior.

## When To Use

Use after tuning, root-cause fixes, scan remediation, or workflow changes.

## Owner

Quality, security, or release owner

## Required Fields

- baseline_case
- adjacent_case
- command
- threshold
- result
- owner
- rollback_trigger

## Evidence

- Workflow run
- Scan output
- Trace review
- Failure analysis
- Tuning log

## Approval And Review

- Quality or security owner signs off before accepting residual risk or tuning changes

## Failure Modes

- Agent confidence replaces evidence
- Tuning happens before root cause
- Regression checks are skipped

## Recovery Or Rollback

- Restore baseline behavior, classify root cause, and rerun the original plus adjacent cases

## Security And Compliance

- Preserve scan findings, trace data, and accepted-risk decisions without leaking sensitive information.

## GH-600 Relevance

Tests evaluation signals, error analysis, tuning, and evidence-backed release decisions.

## Sources

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [Workflows](https://docs.github.com/en/actions/using-workflows/about-workflows)
- [Risks and mitigations for GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/risks-and-mitigations)
- [Responsible AI for Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-use-of-ai-overview)

## Mini-example

Scenario: A reviewer needs to decide whether an agent task using Regression Checklist can continue.

Completed example: Fill docs/regression-checklist.md with task scope, evidence, owner, approval decision, and rollback path before the agent proceeds.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| baseline_case | `{{baseline_case}}` | Link or owner proving the value is current |
| adjacent_case | `{{adjacent_case}}` | Link or owner proving the value is current |
| command | `{{command}}` | Link or owner proving the value is current |
| threshold | `{{threshold}}` | Link or owner proving the value is current |
| result | `{{result}}` | Link or owner proving the value is current |
| owner | `{{owner}}` | Link or owner proving the value is current |
| rollback_trigger | `{{rollback_trigger}}` | Link or owner proving the value is current |

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on 2026-07-09 or later.
