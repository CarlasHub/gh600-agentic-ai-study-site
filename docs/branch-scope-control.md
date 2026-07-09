# Branch Scope Control

## Purpose

Constrain agent work to a branch, issue, allowed paths, required checks, and reviewer-owned merge path.

## When To Use

Use when a lesson covers branch-based scope, repository scope, autonomous branch creation, or safe PR creation.

## Owner

Repository maintainer or platform owner

## Required Fields

- branch_name
- issue_url
- allowed_paths
- denied_paths
- required_checks
- codeowner
- ruleset

## Evidence

- Branch name and linked issue
- Allowed and denied path list
- Required check results
- CODEOWNERS review
- Branch protection or ruleset status

## Approval And Review

- CODEOWNER or repository maintainer approval before merge, with ruleset or branch-protection evidence when protected paths are touched

## Failure Modes

- Branch exists but allowed paths are not defined
- Agent edits unrelated repository areas
- Required checks or owner review are bypassed

## Recovery Or Rollback

- Close or reset the branch, restore denied-path changes, and reopen with a corrected branch scope record

## Security And Compliance

- Protected paths, workflow files, secrets, environments, and deployment changes require owner review before merge

## GH-600 Relevance

Teaches that branch-based scope requires an issue boundary, allowed paths, checks, and owner review; the branch alone is not the control.

## Sources

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [About GitHub Copilot cloud agent](https://docs.github.com/copilot/concepts/about-copilot-coding-agent)
- [About protected branches](https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [About code owners](https://docs.github.com/articles/about-code-owners)
- [Workflows](https://docs.github.com/en/actions/using-workflows/about-workflows)

## Mini-example

Scenario: A cloud agent may create a branch for a checkout bug but must not edit authentication or deployment files.

Completed example: Record `agent/checkout-validation`, allowed paths `/src/checkout/**`, denied paths `/.github/workflows/**` and `/src/auth/**`, required test `npm run check`, CODEOWNER `@platform/security`, and ruleset evidence.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| branch_name | `{{branch_name}}` | Link or owner proving the value is current |
| issue_url | `{{issue_url}}` | Link or owner proving the value is current |
| allowed_paths | `{{allowed_paths}}` | Link or owner proving the value is current |
| denied_paths | `{{denied_paths}}` | Link or owner proving the value is current |
| required_checks | `{{required_checks}}` | Link or owner proving the value is current |
| codeowner | `{{codeowner}}` | Link or owner proving the value is current |
| ruleset | `{{ruleset}}` | Link or owner proving the value is current |

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on 2026-07-09 or later.
