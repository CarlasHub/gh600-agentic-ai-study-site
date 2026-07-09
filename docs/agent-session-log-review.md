# Agent Session Log Review

## Purpose

Review agent session logs against issue, PR, commit, workflow, approval, and rollback evidence.

## When To Use

Use when traceability depends on reconstructing what the agent saw, decided, called, changed, and escalated.

## Owner

Quality, security, or release owner

## Required Fields

- session_id
- issue_timeline
- tool_calls
- commits
- workflow_runs
- approvals
- rollback_note
- gaps

## Evidence

- Session log
- Issue timeline
- PR description
- Commits
- Workflow run
- Check output
- Review comments
- Environment approval
- Rollback note

## Approval And Review

- Reviewer compares the session log with GitHub artifacts before accepting that the agent stayed inside the approved path

## Failure Modes

- Session log cannot be tied to commits
- Tool calls are not linked to approval
- Rollback or escalation is missing from the timeline

## Recovery Or Rollback

- Block merge, reconstruct the timeline from GitHub artifacts, add missing evidence, and require owner review before continuing

## Security And Compliance

- Preserve trace evidence without exposing secrets or private data in logs, PR comments, or public artifacts

## GH-600 Relevance

Teaches traceability as a reconstruction task across session logs and GitHub evidence.

## Sources

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [About GitHub Copilot cloud agent](https://docs.github.com/copilot/concepts/about-copilot-coding-agent)
- [Risks and mitigations for GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/risks-and-mitigations)
- [Workflows](https://docs.github.com/en/actions/using-workflows/about-workflows)
- [Reviewing deployments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/review-deployments)
- [About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)

## Mini-example

Scenario: An agent claims it only changed docs, but the branch includes a workflow edit.

Completed example: Compare session log, issue timeline, commit list, workflow run, PR evidence table, reviewer comments, and rollback note before deciding whether to block or approve.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| session_id | `{{session_id}}` | Link or owner proving the value is current |
| issue_timeline | `{{issue_timeline}}` | Link or owner proving the value is current |
| tool_calls | `{{tool_calls}}` | Link or owner proving the value is current |
| commits | `{{commits}}` | Link or owner proving the value is current |
| workflow_runs | `{{workflow_runs}}` | Link or owner proving the value is current |
| approvals | `{{approvals}}` | Link or owner proving the value is current |
| rollback_note | `{{rollback_note}}` | Link or owner proving the value is current |
| gaps | `{{gaps}}` | Link or owner proving the value is current |

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on 2026-07-09 or later.
