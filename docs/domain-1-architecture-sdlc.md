# Domain 1: Prepare agent architecture and SDLC processes

## What this domain is really about

This domain is about designing the work before an agent acts. A coding agent can move quickly through a repository, but speed only helps when the task is clear, bounded, testable, and reviewable.

The exam expects you to understand how agentic work fits into the software development lifecycle. Do not think of the agent as "magic code generation." Think of it as a software worker inside a controlled GitHub workflow.

The safest pattern is:

1. A human or system creates a clear issue.
2. The agent reads the issue and repository instructions.
3. The agent produces a plan.
4. The plan is reviewed when risk requires it.
5. The agent works in a branch.
6. The agent runs checks and records evidence.
7. The agent opens or updates a pull request.
8. Humans and automated gates decide whether the work can merge.

## The core idea: GitHub is the control plane

For GH-600, treat GitHub as the system of record and control. That means important work should be visible in GitHub artifacts:

- Issues define intent, scope, acceptance criteria, and risk.
- Branches isolate change.
- Pull requests expose diffs, discussion, checks, and review evidence.
- GitHub Actions run validation.
- CODEOWNERS and branch protection enforce human review.
- Rulesets and environments control sensitive branches and deployments.
- PR summaries and comments help reviewers understand what happened.

If agent work only exists in chat, it is hard to audit. If agent work flows through GitHub, it can be inspected, tested, discussed, approved, or rolled back.

## Map agents to the SDLC

Agents can help in many SDLC stages, but each stage needs different permissions and evidence.

| SDLC stage | Good agent work | Evidence to keep |
| --- | --- | --- |
| Discovery | Read issues, inspect repository, summarise constraints | Notes, issue comments, source links |
| Planning | Propose approach, risks, affected files, tests | Plan artifact or PR comment |
| Implementation | Edit scoped files in a branch | Commit diff, changed-file list |
| Validation | Run tests, lint, scans, builds | Logs, check results, artifacts |
| Review | Summarise changes, explain risks, respond to feedback | PR summary, review comments |
| Release | Prepare release notes or deployment checklist | Approved PR, environment approval, release notes |

The agent does not need maximum autonomy at every stage. It may be safe for an agent to summarise a bug report, but unsafe for the same agent to deploy production changes without approval.

## Start with a task contract

A task contract is the simplest way to make agent work safe and understandable. It turns a vague request into a controlled job.

Include:

- Goal: what outcome should exist when the task is done?
- Background: what context should the agent read first?
- Scope: what files, features, or behaviours may change?
- Out of scope: what must not change?
- Tools: what tools may the agent use?
- Acceptance criteria: how will success be judged?
- Tests and checks: what must run?
- Risks: what could go wrong?
- Human checkpoints: where must the agent pause?
- Evidence: what must the PR or issue contain?
- Rollback: how can the change be reversed?

Bad task: "Improve auth."

Better task: "Update login form validation so empty email and invalid email formats show accessible inline errors. Do not change authentication back-end logic. Run unit tests and accessibility checks. Open a PR with screenshots, test logs, and rollback notes."

## Separate planning from execution

One of the most important exam ideas is the separation of planning, reasoning, and action.

- Planning decides what should happen.
- Reasoning explains why that plan makes sense.
- Action changes files, runs commands, calls tools, or touches systems.

For low-risk work, the same agent may plan and act. For higher-risk work, require the agent to stop after the plan and wait for approval.

A strong plan includes:

- Goal.
- Assumptions.
- Files likely to change.
- Commands likely to run.
- Permission or data risks.
- Test strategy.
- Success criteria.
- Rollback plan.

## Repository readiness

Agents do better when the repository is ready for them. Good repository preparation includes:

- Clear `README` setup steps.
- Reliable test commands.
- A working local or cloud development environment.
- `.github/copilot-instructions.md` for repository-wide behaviour.
- Path-specific instructions for special areas.
- Issue and PR templates.
- Branch protection and required checks.
- Build scripts that fail clearly.
- Documentation for architecture, domain rules, and coding standards.

If an agent cannot build and test the project, it cannot reliably validate its work.

## Custom instructions, agents, and skills

Use the right guidance mechanism:

| Mechanism | Best use |
| --- | --- |
| Repository instructions | Always-on project rules, coding style, test commands, architecture notes |
| Path-specific instructions | Rules for a folder, language, service, or sensitive component |
| Custom agent | A named role with behaviour, tools, and responsibilities |
| Agent skill | Detailed task-specific procedure loaded only when relevant |
| Prompt template | A reusable request pattern for humans or tools |

Example:

- Put "run `npm test` before PR" in repository instructions.
- Put "payment code requires security review" in path-specific instructions.
- Create a "release-note-writer" custom agent for release documentation.
- Create a "database-migration-review" skill for a detailed migration checklist.

## Common anti-patterns

Watch for these exam traps:

- Vague task with no acceptance criteria.
- Agent starts editing before planning.
- Agent can push directly to `main`.
- Agent has broad tool access without need.
- Agent changes unrelated files.
- Agent skips failing tests or removes checks to pass.
- Human review is treated as optional for risky changes.
- Agent decisions are hidden in chat and not recorded in GitHub.
- Rollback is not considered.

## Practical lab

Create an issue template named `agent-task.md` with these sections:

- Goal.
- Context links.
- Scope.
- Out of scope.
- Allowed tools.
- Required checks.
- Acceptance criteria.
- Risk level.
- Human approval points.
- Required PR evidence.
- Rollback plan.

Then write a repository instruction that says:

> For agentic tasks, produce a plan before editing files. The plan must list scope, affected files, tests, risks, and rollback. Stop for human approval before touching authentication, payments, secrets, production configuration, or destructive operations.

## Quick self-check

You are ready for this domain when you can answer:

- What makes an agent task reviewable?
- Why is GitHub a control plane for agentic SDLC work?
- When should planning and execution be separated?
- What belongs in a task contract?
- What repository setup helps an agent validate its own work?
- Which agent actions require PR checks or human approval?
