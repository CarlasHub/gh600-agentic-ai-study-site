# Domain 2: Implement tool use and environment interaction

## What this domain is really about

Agents become much more useful when they can use tools. They also become much more dangerous. This domain is about giving agents the right tools, in the right environment, with the least access needed to finish the task.

An agent may need to read files, edit code, run tests, use a browser, call GitHub APIs, inspect issues, write PR comments, access documentation, or call MCP tools. Every tool expands what the agent can do, so every tool needs a purpose and a boundary.

## Tool selection starts from the task

Do not start by asking "which tools can I enable?" Start by asking "what must the agent do?"

| Task need | Possible tool access |
| --- | --- |
| Understand code | Repository read access, search, file viewer |
| Change code | Branch write access, editor, test commands |
| Validate code | Build system, package manager, test runner, CI logs |
| Work with issues | Issue read access, issue comments |
| Prepare a PR | Branch creation, PR creation, PR comments |
| Use external knowledge | Docs search, curated resources, MCP resource server |
| Interact with an app | Browser or local server |
| Deploy | Environment access, deployment workflow, approvals |

If read-only access is enough, do not grant write access. If repository scope is enough, do not grant organisation scope.

## Least privilege

Least privilege means the agent gets only the access needed, only for the required scope, and only for the necessary time.

Prefer:

- Read-only before write.
- Branch-scoped work before default-branch access.
- Repository-scoped access before organisation access.
- Tool allow lists before broad access.
- Temporary credentials before long-lived credentials.
- Non-production environments before production.
- Human approval before destructive or sensitive actions.

The exam may describe an agent that needs one ability, then offer answers that grant five. Choose the smallest useful permission set.

## Understand the execution environment

An agent's behaviour depends on where it runs.

| Environment | What to check |
| --- | --- |
| Local IDE agent mode | Local files, terminal access, developer credentials, uncommitted changes |
| Copilot coding agent | Repository permissions, branch access, setup workflow, logs, PR workflow |
| GitHub Actions | Runner OS, secrets, permissions, artifacts, network access |
| Custom agent | Tools, instructions, MCP servers, role-specific behaviour |
| MCP server | Tool list, resource list, prompt templates, authentication, logging |

Always ask:

- What can the agent read?
- What can the agent change?
- What credentials are available?
- What logs or artifacts will be created?
- What happens if the agent fails halfway?

## Copilot coding agent setup

The coding agent needs a repeatable environment. GitHub supports custom setup steps through:

```text
.github/workflows/copilot-setup-steps.yml
```

Use setup steps to install dependencies, prepare services, configure test prerequisites, or document environment assumptions. The goal is not to hide complexity. The goal is to make the environment reproducible so the agent can build, test, and validate.

A good setup workflow:

- Uses minimal permissions.
- Installs dependencies deterministically.
- Avoids leaking secrets.
- Fails clearly when setup is broken.
- Produces logs useful for debugging.
- Does not deploy or mutate production systems.

## MCP in plain language

Model Context Protocol is a standard way for AI applications to connect to external tools and data.

Core MCP concepts:

- **Client**: the AI application or agent host.
- **Server**: a provider of capabilities.
- **Tool**: an action the agent can call, such as search issues or create a ticket.
- **Resource**: information the agent can read, such as docs, files, or database-like content.
- **Prompt**: a reusable structured prompt template exposed by a server.

MCP matters because it gives agents capabilities beyond text. A tool call can change the world. That is why MCP configuration must be governed.

## MCP safety model

When enabling MCP, define:

- Which servers are allowed.
- Which tools are allowed.
- Whether each tool is read-only or write-capable.
- Which credentials the server can use.
- Which repositories, projects, or data sources are in scope.
- How calls are logged.
- What the agent must never send to the tool.
- What requires human approval.

Example policy:

| Tool | Allowed? | Notes |
| --- | --- | --- |
| Search repository | Yes | Read-only |
| Read issues | Yes | Read-only |
| Comment on assigned PR | Yes | Write only to current PR |
| Read secrets | No | Never expose secrets to agent context |
| Deploy production | No without approval | Requires environment gate |
| Delete data | No | Destructive action |

## Prompt templates are also part of tooling

MCP prompts are structured templates a client can discover and fill with arguments. Treat them as reusable workflow tools, not random text snippets.

Good prompt templates:

- Have a clear purpose.
- Accept explicit inputs.
- Produce a predictable output structure.
- Tell the agent what evidence to gather.
- Include stop conditions for risk.

## Error handling

Agents must not retry forever or improvise unsafe fixes. Define failure behaviour.

Failure policy:

- Retry transient failures a small number of times.
- Stop on permission errors instead of asking for broad access automatically.
- Escalate ambiguous failures.
- Record failed commands and logs.
- Roll back partial changes when needed.
- Never remove checks just to make a workflow pass.

## Practical lab

Create an MCP and environment policy for a "documentation improvement" agent.

Allow:

- Repository read.
- Branch write for documentation files.
- Issue read.
- PR creation.
- Markdown lint.

Block:

- Secrets access.
- Production deployment.
- Package publishing.
- Direct default-branch writes.
- Editing application source code unless explicitly approved.

Then write the setup requirements the agent needs to validate documentation changes.

## Quick self-check

You are ready for this domain when you can answer:

- How do you choose which tools an agent needs?
- Why is least privilege more important for agents than for passive chat?
- What does `.github/workflows/copilot-setup-steps.yml` help with?
- What are MCP tools, resources, and prompts?
- Why are MCP allow lists important?
- What should an agent do after repeated tool failures?
