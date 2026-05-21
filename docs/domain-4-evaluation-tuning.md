# Domain 4: Perform evaluation, error analysis, and tuning

## What this domain is really about

Agent output is not correct because the agent sounds confident. It is correct when evidence shows that it satisfies the task, respects constraints, passes checks, and is understandable to reviewers.

This domain teaches you how to judge agent work, classify failures, and improve the workflow without hiding real problems.

## Evaluation starts before execution

You cannot evaluate success if success was never defined.

Before the agent acts, define:

- Expected outcome.
- Acceptance criteria.
- Required tests.
- Required scans.
- Files or systems in scope.
- Files or systems out of scope.
- Review evidence required.
- Risk level.

Example acceptance criteria:

- Empty email shows an inline validation error.
- Invalid email format shows an inline validation error.
- Error text is available to screen readers.
- Authentication back-end behaviour is unchanged.
- Unit tests and accessibility checks pass.

## Evidence types

Use a mix of quantitative and qualitative evidence.

### Quantitative signals

- Unit test result.
- Integration test result.
- End-to-end test result.
- Build status.
- Lint result.
- Type-check result.
- Security scan result.
- Dependency scan result.
- Accessibility scan result.
- Changed-file count.
- Defect count.
- Time to complete.

### Qualitative signals

- Does the solution match intent?
- Is the plan coherent?
- Are assumptions explicit?
- Are trade-offs explained?
- Are risks documented?
- Is the PR summary useful?
- Is the implementation maintainable?
- Did the agent stay in scope?

## Review the whole chain

Evaluate the full workflow, not only the final code.

Check:

- Was the original task clear?
- Did the agent use the right context?
- Did the agent plan before acting?
- Were tools appropriate and permitted?
- Did the agent change only approved files?
- Did the agent run the right checks?
- Did the agent report failures honestly?
- Did the PR contain evidence?
- Did humans review the risky parts?

## Failure classes

Classifying failure helps you fix the right thing.

| Failure class | Meaning | Example fix |
| --- | --- | --- |
| Reasoning error | The plan or conclusion was wrong | Improve task framing, examples, acceptance criteria |
| Tool misuse | Wrong command, API, or tool | Restrict tools, document commands, add skill |
| Permission issue | Too little or too much access | Adjust least-privilege policy |
| Context error | Missing, stale, or conflicting context | Curate context, update docs, reset state |
| Environment issue | Dependencies, network, secrets, OS, CI | Fix setup workflow, improve logs |
| Governance failure | Missing review, approval, checks, or scope | Add branch protection, templates, checkpoints |
| Evaluation gap | No reliable way to judge success | Add tests, scorecards, required evidence |

## Error analysis process

Use this process after a failed agent task:

1. Capture the failure exactly.
2. Gather evidence: logs, diff, PR comments, checks, screenshots.
3. Identify expected behaviour.
4. Identify actual behaviour.
5. Classify the root cause.
6. Decide corrective action.
7. Add a prevention rule.
8. Retest with the corrected workflow.

Do not jump straight to "make the prompt better." Sometimes the real issue is missing tests, bad environment setup, overbroad permissions, or unclear acceptance criteria.

## Tuning responsibly

Tuning means improving the system so future agent work gets better.

Good tuning:

- Clearer repository instructions.
- Better task templates.
- More precise acceptance criteria.
- Smaller tool allow list.
- More reliable setup workflow.
- Better tests or scans.
- Better stop conditions.
- More useful PR evidence.
- New agent skill for repeated complex tasks.

Bad tuning:

- Removing failing checks to make the PR green.
- Granting broad permissions because one task failed.
- Hiding uncertainty from reviewers.
- Letting the agent rewrite the task to match its output.
- Treating one success as proof that the workflow is safe.

## PR summaries and code review

AI-generated PR summaries can help reviewers understand context, but they do not replace review. Copilot code review can surface issues, but humans remain accountable for important decisions.

Use AI review support for:

- Explaining changed areas.
- Highlighting likely concerns.
- Summarising tests.
- Suggesting follow-up questions.

Do not use it as the only approval for:

- Security-sensitive code.
- Authentication or payment changes.
- Production deployment.
- Personal data handling.
- Compliance-sensitive decisions.

## Evaluation scorecard

Create a scorecard like this:

| Category | Pass | Risk | Fail |
| --- | --- | --- | --- |
| Scope | Only approved files changed | Minor unclear change | Unapproved area changed |
| Tests | Required tests passed | Some tests skipped with reason | Tests failed or missing |
| Security | No new sensitive exposure | Needs security review | Secret or unsafe pattern exposed |
| Evidence | Logs, checks, PR summary included | Partial evidence | Agent only claims completion |
| Review | Correct reviewers included | Reviewer unclear | Review bypassed |

## Practical lab

Take any agent-created PR, real or imagined. Fill this table:

| Observation | Evidence | Failure class | Corrective action | Prevention rule |
| --- | --- | --- | --- | --- |

Then write one improved instruction, one improved check, and one improved human review rule.

## Quick self-check

You are ready for this domain when you can answer:

- Why is agent confidence not evidence?
- Which signals prove a task succeeded?
- How do you classify agent failures?
- What is the difference between fixing a workflow and hiding a defect?
- When can AI PR summaries help?
- Why does human accountability still matter after automated review?
