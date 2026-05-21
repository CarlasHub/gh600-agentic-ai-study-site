# Domain 3: Manage memory, state, and execution

## What this domain is really about

Agents work across steps. To do that well, they need useful context: the goal, what has already happened, what was decided, what remains, and what constraints still apply.

Memory and state make agents more reliable when handled carefully. They make agents unreliable when stale assumptions, secrets, or unrelated history leak into the task.

## Memory versus state

These words are related, but not identical.

**Memory** is information the agent can use later. Examples: coding standards, user preferences, previous decisions, examples, and project rules.

**State** is the current status of a running task. Examples: current step, files changed, tests run, failures seen, open questions, and next action.

Memory answers: "What should the agent remember?"

State answers: "Where are we in the work right now?"

## Types of memory

| Type | Use | Risk |
| --- | --- | --- |
| Short-term memory | Current goal, constraints, recent findings | Can become cluttered or drift |
| Long-term memory | Stable preferences, standards, reusable examples | Can become stale or overgeneralised |
| External memory | Issues, PRs, docs, decision logs, artifacts | Must be maintained and reviewed |

For production SDLC work, external memory is often the safest because it is visible, auditable, and shared.

## What good memory contains

Useful memory:

- Stable coding standards.
- Repository structure.
- Test commands.
- Architecture decisions.
- Definition of done.
- Team preferences.
- Known safe workflows.
- Previous approved patterns.

Unsafe memory:

- Secrets.
- Credentials.
- Personal data not needed for the task.
- Temporary assumptions.
- Old debugging guesses.
- Failed workaround ideas.
- Sensitive customer data.

## Context engineering

Context engineering means deliberately choosing what the agent sees. More context is not always better. The agent needs the right context.

Good context includes:

- The issue or task contract.
- Relevant files, not the whole repository if unnecessary.
- Repository instructions.
- Path-specific instructions.
- Recent related PRs or decisions.
- Test and build commands.
- Constraints and forbidden actions.

Poor context includes:

- Huge unrelated file dumps.
- Outdated docs with no warning.
- Conflicting instructions.
- Chat history from a different task.
- Secret values.

Copilot Spaces and similar curated-context tools are useful because they gather relevant repositories, issues, pull requests, notes, images, and uploaded resources around a task or team topic.

## State tracking during execution

A reliable agent should track:

- Current objective.
- Completed steps.
- Current plan step.
- Files changed.
- Commands run.
- Results observed.
- Failed attempts.
- Decisions made.
- Open questions.
- Next action.

This prevents repeated work and helps humans resume if the agent stalls.

## Context drift

Context drift happens when an agent slowly moves away from the original goal or relies on stale information.

Signs of drift:

- The agent changes files outside the approved scope.
- The agent solves a different problem than the issue describes.
- The plan and implementation no longer match.
- The agent cites old assumptions after new evidence appears.
- Tests are skipped, replaced, or ignored.
- The final PR summary claims success without evidence.

Drift controls:

- Re-read the task contract before major actions.
- Keep a visible checklist.
- Compare changed files to approved scope.
- Require evidence for claims.
- Reset context when it becomes noisy.
- Use external artifacts for durable decisions.

## Long-term memory and adaptive agents

Advanced agent systems can store examples, preferences, and evolving instructions. This is useful for repeated workflows, but it needs governance.

Ask:

- Who can write to long-term memory?
- What information is allowed?
- How is memory reviewed?
- When does memory expire?
- How can incorrect memory be corrected?
- How are privacy and security protected?

Do not let memory become an invisible policy engine.

## Execution control

State management is also about controlling execution. A strong agent workflow has:

- Step-by-step progress.
- Stop conditions.
- Timeouts.
- Retry limits.
- Human checkpoints.
- Recovery instructions.
- Rollback instructions.

If an agent cannot explain where it is in the task, it should not be allowed to keep expanding its scope.

## Practical lab

Create `DECISIONS.md` for an agent-run project with this table:

| Date | Decision | Reason | Evidence | Impact | Owner | Review date |
| --- | --- | --- | --- | --- | --- | --- |

Then create `AGENT_STATE.md` with:

- Goal.
- Current step.
- Completed steps.
- Changed files.
- Checks run.
- Failures.
- Open questions.
- Next action.
- Stop condition.

## Quick self-check

You are ready for this domain when you can answer:

- What is the difference between memory and state?
- Why is external memory often safest for SDLC work?
- What should never be stored in memory?
- How do you detect context drift?
- What should be recorded so a human can resume agent work?
- How can long-term memory become a risk?
