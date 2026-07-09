# Agent Plan Approval Record

## Purpose

Record the human or policy gate that approves an agent plan before write-capable execution starts.

## When To Use

Use when planning and execution must be separated for code, workflow, permission, or PR actions.

## Owner

Agent workflow owner

## Required Fields

- plan_url
- approved_scope
- denied_scope
- approval_owner
- approval_time
- execution_start_condition
- evidence_required

## Evidence

- Approved plan link
- Approval owner
- Approved scope
- Denied write-capable actions
- Execution start condition
- Validation evidence required

## Approval And Review

- Named reviewer approval is required before the agent edits files, calls write-capable tools, opens a pull request, or touches protected paths

## Failure Modes

- The agent plans and executes in the same unreviewed step
- Approval is recorded after edits begin
- The plan omits denied scope or validation

## Recovery Or Rollback

- Stop execution, revert unapproved edits if any exist, return to the planning state, and require a fresh approval record

## Security And Compliance

- Use the approval record for sensitive paths, workflow files, secrets, production data, policy files, and other controlled surfaces

## GH-600 Relevance

Teaches that planning is not a control unless execution is gated before write-capable action.

## Sources

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [Designing Agent Architecture and SDLC Integration](https://learn.microsoft.com/en-us/training/modules/design-agent-architecture-integration/)
- [About GitHub Copilot cloud agent](https://docs.github.com/copilot/concepts/about-copilot-coding-agent)
- [Risks and mitigations for GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/risks-and-mitigations)
- [About protected branches](https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [About code owners](https://docs.github.com/articles/about-code-owners)

## Mini-example

Scenario: A cloud agent proposes an auth change plan and says it will edit files immediately.

Completed example: Link docs/agent-plan.md, approve only `/src/auth/errors.ts`, deny workflow and secret changes, require `npm test -- auth`, name `@security-owner`, and state that execution starts only after approval.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| plan_url | `{{plan_url}}` | Link or owner proving the value is current |
| approved_scope | `{{approved_scope}}` | Link or owner proving the value is current |
| denied_scope | `{{denied_scope}}` | Link or owner proving the value is current |
| approval_owner | `{{approval_owner}}` | Link or owner proving the value is current |
| approval_time | `{{approval_time}}` | Link or owner proving the value is current |
| execution_start_condition | `{{execution_start_condition}}` | Link or owner proving the value is current |
| evidence_required | `{{evidence_required}}` | Link or owner proving the value is current |

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on 2026-07-09 or later.
