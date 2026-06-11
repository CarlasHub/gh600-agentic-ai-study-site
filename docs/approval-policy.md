# Approval Policy

## Goal

Define risk-based approval rules for agent actions.

## Suggested Use

Use for high-risk agent actions, production controls, security, data, or compliance work.

## Placeholders

- `{{risk_tier}}`: replace with the expected value for this repository, task, or workflow.
- `{{action}}`: replace with the expected value for this repository, task, or workflow.
- `{{approver}}`: replace with the expected value for this repository, task, or workflow.
- `{{evidence}}`: replace with the expected value for this repository, task, or workflow.
- `{{approval_record}}`: replace with the expected value for this repository, task, or workflow.
- `{{bypass_rule}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| risk tier | `{{risk_tier}}` | `{{risk_tier_evidence_or_owner}}` |
| action | `{{action}}` | `{{action_evidence_or_owner}}` |
| approver | `{{approver}}` | `{{approver_evidence_or_owner}}` |
| evidence | `{{evidence}}` | `{{evidence_evidence_or_owner}}` |
| approval record | `{{approval_record}}` | `{{approval_record_evidence_or_owner}}` |
| bypass rule | `{{bypass_rule}}` | `{{bypass_rule_evidence_or_owner}}` |

## Expectations

- Risk tiers are actionable.
- Approvers are named by role.
- Bypass rules are exceptional and logged.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
