# Memory Reset Decision

## Purpose

Decide whether agent memory should be preserved, pruned, expired, reset, or replaced with durable repository state.

## When To Use

Use before reusing memory after source, branch, issue, PR, policy, owner, or secret-context changes.

## Owner

Workflow owner or reviewer taking over the task

## Required Fields

- memory_item
- current_source
- reuse_decision
- expiry_trigger
- reset_reason
- durable_artifact
- reviewer

## Evidence

- Memory item
- Current source artifact
- Reuse decision
- Expiry trigger
- Reset reason
- Durable replacement artifact
- Reviewer

## Approval And Review

- Reviewer approval is required before reusing memory after branch, policy, source, issue, PR, owner, or sensitive-data changes

## Failure Modes

- Stale context is kept because it may be useful
- Sensitive information remains in memory
- A hidden memory item replaces a repository artifact

## Recovery Or Rollback

- Reset unsafe memory, refresh current GitHub artifacts, move durable facts to repository state, and record the superseding decision

## Security And Compliance

- Do not retain secrets, private data, obsolete policy, or unreviewed assumptions in reusable memory

## GH-600 Relevance

Teaches preserve, prune, expire, reset, and durable-state replacement decisions for agent memory.

## Sources

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [Foundations of Agentic AI in GitHub](https://learn.microsoft.com/en-us/training/modules/foundations-agentic-ai/)
- [About GitHub Copilot Memory](https://docs.github.com/en/copilot/concepts/agents/copilot-memory)
- [Adding repository custom instructions for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)
- [Workflows](https://docs.github.com/en/actions/using-workflows/about-workflows)
- [Responsible AI for Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-use-of-ai-overview)

## Mini-example

Scenario: An agent remembers an old API contract after the PR changed the endpoint.

Completed example: Expire the remembered contract, refresh from the current PR and docs, write the new fact to docs/decision-log.md, and require reviewer approval before continuing.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| memory_item | `{{memory_item}}` | Link or owner proving the value is current |
| current_source | `{{current_source}}` | Link or owner proving the value is current |
| reuse_decision | `{{reuse_decision}}` | Link or owner proving the value is current |
| expiry_trigger | `{{expiry_trigger}}` | Link or owner proving the value is current |
| reset_reason | `{{reset_reason}}` | Link or owner proving the value is current |
| durable_artifact | `{{durable_artifact}}` | Link or owner proving the value is current |
| reviewer | `{{reviewer}}` | Link or owner proving the value is current |

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on 2026-07-09 or later.
