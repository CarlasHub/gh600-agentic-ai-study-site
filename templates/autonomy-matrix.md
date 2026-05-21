# Agent autonomy matrix

| Risk | Examples | Agent autonomy | Human checkpoint | Evidence required |
| --- | --- | --- | --- | --- |
| Low | Read docs, summarise issues | Allowed | None | Summary with links |
| Moderate | Edit docs or tests in feature branch | Allowed in branch | PR review | Diff, checks, rationale |
| High | Runtime code, auth, permissions, build scripts | Plan first, then branch changes | Approval before implementation and merge | Plan, tests, risk notes |
| Critical | Production deploy, secrets, data deletion | Blocked until explicit approval | Named human approval | Approval record and rollback plan |
