# Agent Tool Permission Matrix

## Goal

Document which tools an agent may use, what data those tools can touch, and which actions require approval.

## Suggested Use

Use before enabling shell, browser, MCP, database, deployment, issue tracker, cloud, or third-party tools.

## Matrix

| Tool or MCP server | Allowed use | Denied use | Data access | Approval required | Audit signal |
| --- | --- | --- | --- | --- | --- |
| `{{tool_name}}` | `{{allowed_use}}` | `{{denied_use}}` | `{{data_scope}}` | `{{approval_rule}}` | `{{log_trace_or_artifact}}` |

## Least-Privilege Questions

- What exact task requires this tool?
- Can the task be completed with read-only access?
- Can the tool be scoped to specific paths, roots, APIs, or records?
- What secret or credential could be exposed?
- What action could the tool take autonomously?
- How will use of the tool be logged?

## Permission Tiers

| Tier | Description | Examples | Default decision |
| --- | --- | --- | --- |
| Read | Inspects files, docs, issues, logs, or traces | search, read file, list issues | Usually allowed in scope |
| Write local | Edits repository files in a branch | code edit, doc edit | Allowed only in task scope |
| Execute local | Runs commands or tests | test, build, lint | Allowed when commands are known |
| External read | Reads third-party systems | issue tracker, telemetry, docs | Approval depends on data sensitivity |
| External write | Changes outside the repo | deploy, database update, ticket update | Human approval required |
| Privileged | Changes auth, secrets, permissions, production | secrets, environments, rulesets | Human approval required |

## Approval Record

```text
Tool: {{tool_name}}
Approved use: {{approved_use}}
Approver: {{approver}}
Expiration: {{expiration_or_task_only}}
Evidence required: {{evidence}}
```
