# GH-600 Agentic AI Developer Course

## Course promise

This course takes you from "what is an agent?" to "I can design, run, supervise, evaluate, and govern agentic software development workflows in GitHub." It is built around the six GH-600 assessed domains and uses GitHub as the control plane: issues define work, branches isolate change, pull requests expose evidence, checks validate claims, and humans approve risk.

The exam is not just about knowing features. It tests judgement. You need to recognise when an agent should plan, when it may act, which tools it may use, which evidence proves success, and where human approval is required.

## How to use this course

1. Read this overview.
2. Study the six domain lessons in order.
3. Build the practical artifacts after each lesson.
4. Use the quizzes to find weak areas.
5. Revisit the official GH-600 study guide before the exam because beta objectives can change.

## The mental model

An AI agent is a software worker that can pursue a goal across multiple steps. A coding agent can inspect a repository, form a plan, edit files, run commands, call tools, respond to errors, and produce a pull request. That makes it powerful, but also risky. The stronger the agent, the more important the boundaries become.

Think of every agentic SDLC workflow as a loop:

1. **Intent**: what outcome is wanted?
2. **Context**: what repository, issue, docs, examples, constraints, and standards matter?
3. **Plan**: what will the agent do, in what scope, with what tools?
4. **Action**: what files, commands, tools, or systems will the agent touch?
5. **Evidence**: what proves the result is correct?
6. **Review**: who or what decides whether the work can proceed?
7. **Learning**: what instructions, checks, memory, or templates should improve next time?

## The six domains

### 1. Prepare agent architecture and SDLC processes

You learn how to design an agent workflow before anyone lets it act. This includes task contracts, planning, scope, acceptance criteria, pull request controls, and GitHub governance features.

### 2. Implement tool use and environment interaction

You learn how agents use tools: repository access, commands, browsers, GitHub Actions, MCP servers, prompts, resources, and external systems. The key skill is choosing the minimum useful tool access.

### 3. Manage memory, state, and execution

You learn how agents remember goals, decisions, context, progress, and preferences without drifting away from the task or storing sensitive information.

### 4. Perform evaluation, error analysis, and tuning

You learn how to judge agent output using evidence: tests, scans, logs, traces, diffs, artifacts, PR summaries, reviewer feedback, and root cause analysis.

### 5. Orchestrate multi-agent coordination

You learn when to use multiple agents, how to split work safely, how to avoid collisions, and how to preserve handoff evidence.

### 6. Implement guardrails and accountability

You learn how to classify risk, set autonomy levels, restrict dangerous actions, apply responsible AI principles, and keep humans in control of important decisions.

## What you should be able to do by the end

- Explain an agentic SDLC workflow from issue to pull request.
- Prepare a repository so an agent can understand, build, test, and validate it.
- Write repository instructions, path-specific instructions, custom agents, and skills.
- Explain how MCP gives agents access to tools, resources, and prompt templates.
- Restrict tool access and prevent unsafe behaviour.
- Use memory and state deliberately.
- Evaluate agent output and classify failures.
- Decide when multi-agent coordination helps and when it adds needless complexity.
- Keep humans in control through reviews, approvals, checks, logs, artifacts, and evidence.
- Apply Microsoft Responsible AI principles to coding agents.

## Core artifacts you will build

By the end, you should have these reusable artifacts:

- Agent task contract.
- Repository custom instructions.
- Path-specific instruction file.
- Custom agent profile.
- Agent skill folder.
- MCP tool policy.
- Copilot setup workflow.
- Memory and decision log.
- Evaluation scorecard.
- Failure analysis table.
- Multi-agent handoff template.
- Autonomy matrix.
- Guardrail and approval policy.

## Fast glossary

**Agent**: an AI system that can take multi-step action toward a goal, often using tools.

**Agent mode**: an IDE or platform workflow where Copilot can plan, edit, run commands, inspect errors, and iterate.

**Coding agent**: an agent assigned to software development work, often through an issue, branch, or pull request.

**Control plane**: the system used to govern, record, and approve work. For GH-600, treat GitHub as the control plane.

**Custom instructions**: repository or path-specific guidance that shapes Copilot behaviour.

**Custom agent**: a named agent profile with role, behaviour, tools, and instructions.

**Agent skill**: reusable task-specific guidance, often stored as a folder with a `SKILL.md` file and supporting scripts or resources.

**MCP**: Model Context Protocol, an open protocol for connecting AI applications to tools, resources, and prompt templates.

**Memory**: information carried across steps or sessions. It can be short-term, long-term, or external.

**Guardrail**: a technical or process boundary that prevents or controls risky actions.

**Evidence**: logs, test results, diffs, artifacts, PR comments, approvals, and other proof that work was done correctly.

## Suggested study order

1. Official GH-600 study guide and certification page.
2. Microsoft Learn Copilot Agent Mode.
3. GitHub Copilot coding agent best practices.
4. Repository custom instructions, custom agents, skills, and Copilot setup steps.
5. MCP concepts: tools, resources, prompts, clients, servers, allow lists.
6. Responsible AI principles and Copilot responsible-use docs.
7. Practical agent engineering courses from Microsoft, Hugging Face, LangGraph, and OpenAI.
8. Final pass through all six domain checklists and quizzes.

## Final exam habit

When you see a scenario, ask four questions:

1. What is the agent being asked to do?
2. What can the agent access or change?
3. What evidence proves the outcome?
4. What risk requires human judgement?
