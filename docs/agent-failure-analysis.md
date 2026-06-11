# Agent Failure Analysis

## Goal

Turn a failed or unsafe agent run into a specific fix, regression check, and process update.

## Suggested Use

Use after an incorrect PR, failed workflow, unsafe tool call, source drift incident, release miss, or incomplete handoff.

## Incident Summary

- Incident ID: `{{incident_id}}`
- Date: `{{date}}`
- Reporter: `{{reporter}}`
- Related issue, PR, trace, or release: `{{link}}`
- Severity: `{{low_medium_high}}`

## Expected Behavior

`{{expected_behavior}}`

## Actual Behavior

`{{actual_behavior}}`

## Impact

- User impact: `{{user_impact}}`
- Repository impact: `{{repo_impact}}`
- Security or data impact: `{{security_data_impact}}`

## Root Cause

Choose the primary cause:

- [ ] Task contract was ambiguous.
- [ ] Repository instructions were missing or stale.
- [ ] Source documentation drifted.
- [ ] Tool or MCP access was too broad.
- [ ] Tool arguments were wrong.
- [ ] Handoff owner was unclear.
- [ ] Eval coverage missed this case.
- [ ] Human approval gate was missing or bypassed.
- [ ] External dependency failed.

Details:

`{{root_cause_details}}`

## Containment

- Immediate fix: `{{immediate_fix}}`
- Rollback or disablement: `{{rollback}}`
- User communication: `{{communication}}`

## Prevention

- Template update: `{{template_path_and_change}}`
- Eval case: `{{eval_case}}`
- Guardrail or approval change: `{{guardrail_change}}`
- Owner: `{{owner}}`
- Due date: `{{due_date}}`

## Verification

- [ ] Regression test added or updated.
- [ ] Template or instruction updated.
- [ ] Owner reviewed the prevention step.
- [ ] Action logged in release or accuracy notes.
