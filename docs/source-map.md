# GH-600 Source Map

Use this page to understand why each source matters and where it fits in the course.

## Exam spine

### Official GH-600 study guide

Use this as the checklist for everything you must know. Turn each bullet into a note, quiz question, and practical exercise. It defines the audience as someone who can operate, integrate, supervise, and govern AI agents in production-grade SDLC workflows with GitHub as the system of record and control.

### Official GH-600 certification page

Use this for exam logistics: structure, duration, domain weighting, exam sandbox, scheduling, and official language. It confirms the six domains and the 120-minute proctored assessment.

## Copilot and GitHub operating model

### Microsoft Learn: Building applications with GitHub Copilot Agent Mode

Use this for practical agent workflow: prompting autonomous development tasks, grounding Copilot with documentation, iterating over a codebase, fixing errors, refactoring, and building features.

### GitHub Docs: Best practices for using GitHub Copilot

Use this for day-to-day discipline: choosing the right Copilot tool, writing better prompts, checking generated work, and understanding strengths and limitations.

### GitHub Docs: Best practices for using Copilot coding agent on tasks

Use this for issue-to-PR workflows. Focus on repository readiness, clear tasks, instructions, build/test validation, and evidence.

### GitHub Docs: Configure the Copilot coding agent environment

Use this for repeatable execution. The key file is `.github/workflows/copilot-setup-steps.yml`, which prepares the agent workspace so it can install dependencies, build, test, and validate.

### GitHub Docs: Repository custom instructions

Use this for always-on repository guidance. Learn `.github/copilot-instructions.md` and `.github/instructions/*.instructions.md` for repository-wide and path-specific behaviour.

### GitHub Docs: Custom agents

Use this for agent profiles. Learn YAML frontmatter, identity, instructions, tools, MCP server configuration, capability control, and role design.

### GitHub Docs and VS Code Docs: Agent skills

Use this for reusable task workflows. Custom instructions are best for general rules. Skills are better for detailed task-specific procedures that should be loaded only when relevant.

### GitHub Docs: Copilot Spaces

Use this for curated context. Spaces can gather repositories, code, pull requests, issues, notes, images, and uploads so teams do not repeat background explanation.

### GitHub Docs: Responsible use of Copilot code review and PR summaries

Use these for review safety. AI can improve context sharing and highlight issues, but it does not replace human accountability.

## MCP and tool ecosystems

### Model Context Protocol specification

Use this for the protocol concepts: clients, servers, tools, resources, prompts, discovery, and invocation.

### MCP prompts specification

Use this for structured prompt templates. MCP prompts are discoverable templates with arguments, not just informal text snippets.

### Anthropic: Introducing Model Context Protocol

Use this for why MCP exists: a standard way for AI tools to connect securely to data sources and tools.

## Responsible AI and governance

### Microsoft Responsible AI principles

Use this for guardrail vocabulary: fairness, reliability and safety, privacy and security, inclusiveness, transparency, and accountability.

### Microsoft Learn: Embrace Responsible AI principles and practices

Use this for structured study of the six principles and how they guide AI development and use.

## Practical agent engineering depth

### Microsoft: AI Agents for Beginners

Use this for fundamentals, design patterns, frameworks, tool use, agentic RAG, and hands-on examples.

### Hugging Face AI Agents Course

Use this for broad agent fundamentals, interactive practice, and ecosystem context.

### DeepLearning.AI: AI Agents in LangGraph

Use this for controllable workflows, graph-based design, debugging, maintenance, and agentic search.

### DeepLearning.AI: Long Term Agentic Memory with LangGraph

Use this for Domain 3: memory stores, user preferences, examples, evolving prompts, and stateful behaviour.

### OpenAI Agents SDK guide

Use this for general agent architecture: planning, tools, handoffs, state, and specialist collaboration.

### OpenAI Practical Guide to Building AI Agents

Use this for production design: use cases, model selection, tool design, guardrails, orchestration, cost, latency, and evaluation.

### GitHub Awesome Copilot

Use this after the basics. It is useful for examples of instructions, custom agents, skills, hooks, workflows, and plugins.

## How the sources map to the six domains

| Domain | Best sources |
| --- | --- |
| 1. Agent architecture and SDLC | GH-600 study guide, certification page, Copilot Agent Mode, Copilot best practices, coding agent task best practices |
| 2. Tool use and environments | Coding agent environment setup, MCP specification, MCP prompts, custom agents, OpenAI agent guides |
| 3. Memory, state, execution | Copilot Spaces, LangGraph memory course, Microsoft AI Agents for Beginners, OpenAI Agents SDK |
| 4. Evaluation and tuning | Copilot best practices, coding agent tasks, responsible-use review docs, OpenAI practical guide |
| 5. Multi-agent coordination | Custom agents, skills, LangGraph, OpenAI Agents SDK, OpenAI practical guide |
| 6. Guardrails and accountability | Microsoft Responsible AI, responsible Copilot review docs, repository instructions, GitHub branch protections, MCP allow lists |
