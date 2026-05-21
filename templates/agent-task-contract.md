# Agent task contract

## Goal

Describe the outcome in one sentence.

## Scope

Allowed areas:

- 

Forbidden areas:

- 

## Inputs

- Issue or requirement:
- Relevant files:
- Constraints:

## Expected outputs

- Plan:
- Code or documentation changes:
- Tests or checks:
- Evidence:

## Success criteria

- 

## Risks

- 

## Required checks

```bash
npm test
npm run lint
npm run build
```

## Stop conditions

The agent must stop and ask for review if:

- It needs secrets or production access.
- It must change files outside scope.
- Tests fail twice for the same reason.
- The plan changes materially.
- The requested action is destructive or irreversible.

## Rollback plan

Describe exactly how changes can be reverted.
