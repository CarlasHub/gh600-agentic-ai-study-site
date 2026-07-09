# Workflow Evidence Record

## Purpose

Record GitHub Actions run evidence, check summaries, failed steps, retries, and recovery decisions for agent work.

## When To Use

Use when workflow runs, setup steps, checks, scans, retries, or rollbacks are part of the lesson evidence.

## Owner

Quality, security, or release owner

## Required Fields

- workflow_name
- run_url
- trigger
- permissions
- check_summary
- failed_step
- retry_reason
- recovery_decision
- owner

## Evidence

- Workflow name
- Run URL
- Trigger
- Job permissions
- Setup log
- Check output
- Failed-step reason
- Retry or rollback decision

## Approval And Review

- Quality or security owner reviews failed checks, retries, scan findings, and recovery evidence before accepting the run

## Failure Modes

- A green check hides broader token permissions
- Retry reason is missing
- Scan output is not linked to the PR

## Recovery Or Rollback

- Rerun with corrected permissions or setup, preserve the failed run, and record the owner-approved recovery decision

## Security And Compliance

- Workflow permissions, secret exposure, CodeQL, dependency, and scan results must be visible before approval

## GH-600 Relevance

Teaches that workflow success must be interpreted with setup, permission, failure, retry, and scan context.

## Sources

- [Study guide for Exam GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600)
- [Workflows](https://docs.github.com/en/actions/using-workflows/about-workflows)
- [Configure the development environment for Copilot cloud agent](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment)
- [Using Copilot CLI in GitHub Actions with GITHUB_TOKEN](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions)
- [About code scanning](https://docs.github.com/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/about-code-scanning)
- [Configuring the dependency review action](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/manage-your-dependency-security/configure-dependency-review-action)

## Mini-example

Scenario: An agent reruns a failed validation workflow after widening permissions.

Completed example: Record the original run URL, the widened permission request, owner decision, rerun URL, check summary, and rollback trigger if the wider permission remains unjustified.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| workflow_name | `{{workflow_name}}` | Link or owner proving the value is current |
| run_url | `{{run_url}}` | Link or owner proving the value is current |
| trigger | `{{trigger}}` | Link or owner proving the value is current |
| permissions | `{{permissions}}` | Link or owner proving the value is current |
| check_summary | `{{check_summary}}` | Link or owner proving the value is current |
| failed_step | `{{failed_step}}` | Link or owner proving the value is current |
| retry_reason | `{{retry_reason}}` | Link or owner proving the value is current |
| recovery_decision | `{{recovery_decision}}` | Link or owner proving the value is current |
| owner | `{{owner}}` | Link or owner proving the value is current |

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on 2026-07-09 or later.
