# GH-600 Study Plan

## How to study

Use the official GH-600 study guide as the exam map, then use this course to turn the map into working knowledge.

Daily rhythm:

1. Read one lesson.
2. Translate the lesson into one artifact.
3. Connect the artifact to a GitHub workflow.
4. Take the quiz.
5. Mark completed topics in the tracker.
6. Add weak topics to a revision list.

Do not only read. GH-600 is about operating agentic workflows. You need to practise task contracts, instructions, tool policies, setup workflows, evaluation, handoffs, and guardrails.

## 21-day path

| Day | Focus | Output |
| --- | --- | --- |
| 1 | Course overview and exam scope | One-page GH-600 map |
| 2 | Official study guide and certification page | Domain weighting notes |
| 3 | Agentic SDLC basics | Issue-to-PR workflow diagram |
| 4 | Domain 1: task contracts | Agent task template |
| 5 | Domain 1: repository readiness | `.github/copilot-instructions.md` draft |
| 6 | Domain 2: tools and permissions | Least-privilege tool matrix |
| 7 | Domain 2: Copilot setup | `copilot-setup-steps.yml` plan |
| 8 | Domain 2: MCP | MCP tools/resources/prompts notes |
| 9 | Domain 3: memory and state | `DECISIONS.md` and `AGENT_STATE.md` |
| 10 | Domain 3: context engineering | Curated context checklist |
| 11 | Review checkpoint | Retake quizzes for Domains 1-3 |
| 12 | Domain 4: evaluation | Agent QA scorecard |
| 13 | Domain 4: failure analysis | Root-cause table |
| 14 | Domain 4: tuning | Improved instructions and checks |
| 15 | Domain 5: multi-agent basics | Role map for planner, builder, tester, release gate |
| 16 | Domain 5: coordination | Handoff template and conflict policy |
| 17 | Domain 6: responsible AI | Principle-to-guardrail table |
| 18 | Domain 6: autonomy | Autonomy matrix |
| 19 | Full workflow practice | Simulated issue-to-PR agent run |
| 20 | Mock review | Evaluate the simulated PR and evidence |
| 21 | Final revision | Re-read official study guide and weak-topic list |

## Weekly milestones

### Week 1: Build the operating model

You should be able to explain how an issue becomes a plan, a branch, a PR, checks, review, and merge decision. You should know why GitHub is the control plane.

### Week 2: Add tools, state, and evaluation

You should be able to decide which tools an agent needs, configure least privilege, explain MCP, manage memory and state, and evaluate outputs using evidence.

### Week 3: Govern real workflows

You should be able to coordinate multiple agents, classify risk, apply responsible AI principles, and design guardrails that preserve speed without losing accountability.

## Practice scenario

Use this scenario throughout the course:

> A team wants a coding agent to improve login form validation in a production web application. The agent should update frontend validation, add tests, avoid changing authentication back-end logic, open a PR, and provide evidence. Authentication code, secrets, production deployment, and database changes require human approval.

For each domain, ask how this scenario changes:

- What should the issue say?
- Which instructions apply?
- Which tools are allowed?
- What memory or state is needed?
- What proves success?
- Would multiple agents help?
- Which guardrails apply?

## Final revision questions

- Can you explain custom instructions, custom agents, and skills without mixing them up?
- Can you explain MCP tools, resources, and prompts?
- Can you choose least-privilege access for an agent scenario?
- Can you spot context drift?
- Can you classify a failure as reasoning, tool, permission, context, environment, governance, or evaluation?
- Can you decide when multi-agent orchestration is useful?
- Can you map responsible AI principles to practical GitHub controls?

## Exam habit

For every scenario question, slow down and identify:

1. The agent's goal.
2. The agent's permissions.
3. The environment.
4. The required evidence.
5. The human approval point.

That habit will answer many GH-600 questions even when the feature names change.
