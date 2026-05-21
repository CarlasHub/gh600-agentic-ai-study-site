# Domain 5: Orchestrate multi-agent coordination

## What this domain is really about

Multi-agent workflows can help when work has distinct roles, independent scopes, or review stages. They can also create duplicated effort, conflicting changes, and unclear accountability.

The exam expects you to know when multiple agents are useful, how to coordinate them, and how to recover when they collide or stall.

## Start with the simplest workflow

Do not use multiple agents just because you can. Use one well-guided agent when the task is small, linear, and low risk.

Use multiple agents when:

- Work can be split into independent scopes.
- Different expertise is needed.
- A reviewer agent can inspect without editing.
- Parallel work saves meaningful time.
- A high-risk task benefits from separation of duties.

Avoid multiple agents when:

- The task is simple.
- Agents would edit the same files.
- Handoffs are unclear.
- There is no shared source of truth.
- No one owns conflict resolution.

## Common agent roles

| Role | Purpose | Should usually edit files? |
| --- | --- | --- |
| Planner | Defines goal, scope, risks, and approach | No |
| Researcher | Gathers docs, examples, constraints | No |
| Builder | Implements approved change | Yes, in scoped branch |
| Tester | Writes or runs tests and validates output | Sometimes |
| Security reviewer | Checks secrets, auth, dependencies, risk | Usually no |
| Accessibility reviewer | Checks accessibility and UX evidence | Usually no |
| Release gate | Confirms evidence before merge or deploy | No |

Separation of roles supports accountability. The agent that writes code should not be the only reviewer of that code for risky work.

## Orchestration patterns

### Sequential handoff

One agent completes a stage and hands off evidence to the next.

Example:

1. Planner writes plan.
2. Builder implements.
3. Tester validates.
4. Release gate checks evidence.

This is slower but easier to audit.

### Parallel isolation

Agents work at the same time in separate scopes.

Examples:

- One agent updates docs while another writes tests.
- Two agents work in different services.
- A security reviewer inspects the branch while a documentation agent drafts release notes.

Parallel work needs clear file ownership and branch boundaries.

### Reviewer gate

A reviewer agent inspects output but does not merge, deploy, or silently rewrite the implementation. It produces findings and evidence for humans.

### Human checkpoint

A person approves high-risk decisions, production actions, policy exceptions, destructive changes, or permission expansion.

## Handoff design

Every handoff should include:

- Task goal.
- Current status.
- Decisions made.
- Files changed.
- Evidence produced.
- Risks found.
- Open questions.
- Next required action.
- Stop conditions.

Bad handoff: "Done, please continue."

Good handoff: "Implemented email validation in `LoginForm`. Unit tests pass. Accessibility test found one warning about focus order. No back-end auth changes. Next agent should review ARIA error announcement before PR is marked ready."

## Conflict types

Multi-agent conflicts often appear as:

- Overlapping file edits.
- Different implementation strategies.
- Duplicate solutions.
- Conflicting assumptions.
- One agent invalidating another agent's tests.
- One agent changing setup while another is validating.
- Review comments that contradict the task contract.

## Conflict prevention

Prevent conflicts with:

- Separate branches.
- File ownership.
- Clear task boundaries.
- Shared decision log.
- Required handoff format.
- PR checks.
- Human arbitration for contradictions.
- A rule that agents must not overwrite unrelated work.

## Recovery patterns

When multi-agent work goes wrong:

- Pause the affected agents.
- Preserve logs, diffs, and comments.
- Identify the source of conflict.
- Decide which work is authoritative.
- Rebase, split, or discard branches intentionally.
- Re-run tests in a clean environment.
- Update instructions or skills to prevent recurrence.
- Retire or reconfigure agents that repeatedly fail.

Do not silently merge whichever output arrived last.

## Custom agents and skills

Custom agents define a role and working style. Skills define detailed procedures that can be loaded when relevant.

Example design:

- `planner.agent.md`: plans work, cannot edit files, must produce scope and risks.
- `builder.agent.md`: implements approved plans, may edit scoped files.
- `reviewer.agent.md`: inspects PRs, cannot push commits.
- `security-review.SKILL.md`: detailed checklist for secrets, auth, dependency risk, and logging.

This design keeps broad role behaviour separate from detailed task procedure.

## Practical lab

Design a four-agent bug-fix workflow:

| Agent | Inputs | Outputs | Allowed tools | Forbidden actions | Evidence |
| --- | --- | --- | --- | --- | --- |
| Planner | Issue, repo docs | Plan | Read repo, read issues | Edit files | Plan comment |
| Builder | Approved plan | Branch and PR | Edit scoped files, run tests | Touch secrets, deploy | Diff, test logs |
| Tester | PR branch | Validation report | Test runner, logs | Merge PR | Check results |
| Release gate | PR evidence | Go/no-go decision | Read PR, read checks | Deploy without approval | Approval note |

Then write the handoff template each agent must use.

## Quick self-check

You are ready for this domain when you can answer:

- When is one agent better than many?
- What makes a multi-agent workflow auditable?
- How do you prevent overlapping changes?
- What should a handoff contain?
- What should happen when agents produce conflicting outputs?
- Why should reviewer agents usually avoid changing code directly?
