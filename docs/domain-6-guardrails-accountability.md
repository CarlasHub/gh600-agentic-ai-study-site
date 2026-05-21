# Domain 6: Implement guardrails and accountability

## What this domain is really about

Guardrails keep useful automation from becoming unsafe automation. Accountability makes sure decisions, actions, and approvals can be traced.

The exam expects you to classify risk, set autonomy levels, restrict dangerous behaviour, preserve evidence, and apply responsible AI principles to agentic development.

## Responsible AI principles

Microsoft's Responsible AI framework is a useful vocabulary for this domain.

| Principle | What it means for coding agents |
| --- | --- |
| Fairness | Avoid workflows that create biased, exclusionary, or unfair outcomes |
| Reliability and safety | Validate outputs, test changes, control risky actions |
| Privacy and security | Keep secrets and personal data out of prompts, logs, memory, and unnecessary tools |
| Inclusiveness | Build and review for accessibility and diverse users |
| Transparency | Make agent plans, actions, evidence, and limitations visible |
| Accountability | Humans and teams remain responsible for important decisions |

The main exam idea: the agent can assist, but accountability stays with the people and organisation operating it.

## Risk classification

Classify agent actions before deciding autonomy.

| Risk level | Examples | Typical control |
| --- | --- | --- |
| Low | Read docs, summarise issue, draft plan | Agent may proceed |
| Medium | Edit non-sensitive docs or tests in branch | PR review and checks |
| High | Auth, payments, security config, personal data | Human approval and specialist review |
| Critical | Production deployment, destructive data change, secrets access | Explicit authorisation, environment gate, audit trail |

The same action can have different risk in different contexts. Editing a README is low risk. Editing deployment instructions for production incident response may be higher risk.

## Autonomy matrix

Use autonomy levels to match action to control.

| Level | Agent can do | Human role |
| --- | --- | --- |
| 0 | Read, summarise, propose | Review output |
| 1 | Plan and draft changes | Approve before execution |
| 2 | Edit files in feature branch | Review PR and evidence |
| 3 | Create PRs and run checks | Approve merge |
| 4 | Trigger non-production deployment | Approve environment gate |
| 5 | Production or destructive action | Explicit human authorisation required |

Autonomy is not a badge of maturity. Good systems allow high autonomy for low-risk work and strict approval for high-risk work.

## Guardrails in GitHub

GitHub provides many control points:

- Branch protection.
- Required status checks.
- Required PR review.
- CODEOWNERS.
- Rulesets.
- Environments and deployment approvals.
- Secret scanning.
- Dependency scanning.
- Code scanning.
- Issue and PR templates.
- Audit logs.
- Protected tags.

Use these controls to make agent work visible and reversible.

## Guardrails in instructions and tools

Technical controls should be supported by clear instructions.

Repository instructions can say:

- Do not expose secrets.
- Do not modify generated files unless asked.
- Run specific tests before PR.
- Stop before production changes.
- Keep changes within issue scope.
- Record assumptions and evidence.

Tool policy can say:

- Use read-only tools by default.
- Allow write tools only for current branch or PR.
- Block broad organisation access.
- Block destructive tools.
- Require approval for deployment tools.
- Log tool calls.

## Actions that require human judgement

Require explicit human approval for:

- Production deployment.
- Secret access or credential changes.
- Permission expansion.
- Data deletion.
- Security policy exceptions.
- Legal, compliance, or privacy-sensitive changes.
- Authentication, payment, or personal data flow changes.
- Merge into protected branches.
- Disabling or weakening checks.

Do not create approval theatre. Approval should reduce real risk. If a task is harmless and reversible, unnecessary approvals slow the system without improving safety.

## Accountability evidence

Keep an audit trail:

- Original issue or task contract.
- Agent plan.
- Tool permissions.
- Changed files.
- Commands run.
- Test and scan results.
- PR summary.
- Reviewer comments.
- Approval records.
- Deployment records.
- Rollback plan.
- Post-incident notes if something failed.

Evidence should make it possible to answer: who asked for this, what did the agent do, what was checked, who approved it, and how can it be reversed?

## Privacy and security basics

Agents should not receive secrets unless the workflow has a very strong reason and an approved secure mechanism. In most SDLC workflows, agents do not need raw secrets.

Protect:

- API keys.
- Tokens.
- Passwords.
- Personal data.
- Customer data.
- Production logs.
- Proprietary or restricted information.

Avoid placing sensitive data in prompts, memory, PR comments, logs, screenshots, or external tools.

## Practical lab

Create an autonomy matrix for three repositories:

| Repository | Low-risk autonomous actions | Requires PR review | Requires explicit approval | Always blocked |
| --- | --- | --- | --- | --- |
| Public demo app | Docs edits, issue summaries | Code changes | Release publication | Secrets access |
| Internal business app | Test updates, docs | Feature branch changes | Auth, data model changes | Production data deletion |
| Production service | Read-only analysis | Small code changes | Deployment, secrets, incident changes | Direct main push |

Then add one GitHub control for each approval point.

## Quick self-check

You are ready for this domain when you can answer:

- What actions require explicit human approval?
- How do responsible AI principles apply to coding agents?
- What is an autonomy matrix?
- How do GitHub controls enforce accountability?
- Why should secrets stay out of prompts and memory?
- How do you balance speed with safety?
