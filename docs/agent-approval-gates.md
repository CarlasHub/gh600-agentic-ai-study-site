# Agent Approval Gates

## Goal

Define where an agent must pause for human approval.

## Suggested Use

Use this template for production workflows, regulated content, MCP/tool enablement, deployment changes, security-sensitive edits, or any task where agent autonomy needs explicit limits.

## Gate Policy

| Action | Risk tier | Agent may proceed? | Approver | Evidence required |
| --- | --- | --- | --- | --- |
| `{{action_type}}` | `{{low_medium_high}}` | `{{yes_no_after_approval}}` | `{{role_or_person}}` | `{{evidence}}` |

## Always Requires Approval

- Production deployment.
- Secret, token, credential, or permission changes.
- Authentication or authorization behavior changes.
- MCP server enablement or new external tool access.
- Data deletion, migration, export, retention, or privacy behavior changes.
- Branch protection, ruleset, CODEOWNERS, environment, or Actions permission changes.

Add local rules:

- `{{local_approval_rule}}`

## Approval Record

Use this format in the issue, PR, or release notes:

```text
Approval gate: {{gate_name}}
Approver: {{role_or_person}}
Decision: {{approved_rejected_needs_changes}}
Evidence reviewed: {{evidence_links}}
Time: {{timestamp}}
Conditions: {{conditions_or_none}}
```

## Bypass Policy

Bypass is allowed only when:

- `{{emergency_condition}}`
- `{{named_owner}}` accepts the risk;
- the action is logged after the fact;
- a follow-up review issue is created.

## Reviewer Checklist

- [ ] The action is mapped to the correct risk tier.
- [ ] The named approver has authority.
- [ ] Evidence is available before approval.
- [ ] The agent did not proceed before the approval record existed.
