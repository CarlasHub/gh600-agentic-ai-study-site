# GH-600 Exam Strategy

Use this after you have studied the modules. It is not a replacement for the lessons, labs, and simulator.

## How To Read Questions

1. Find the GitHub object in the scenario: issue, branch, pull request, workflow run, MCP server, ruleset, CODEOWNERS file, environment, log, artifact, or review.
2. Identify the risk class: read-only, branch write, PR creation, deployment, secret, production, security, compliance, or irreversible action.
3. Ask what evidence a reviewer could inspect.
4. Prefer the answer that keeps the agent useful but bounded.
5. Reject answers that rely on agent confidence, speed, or hidden reasoning without GitHub evidence.

## Time Management

- First pass: answer questions where the risk and control are obvious.
- Flag: long scenario questions where two answers sound similar.
- Second pass: compare flagged options against scope, evidence, permissions, and human approval.
- Final pass: check that you did not choose a broad-permission answer just because it sounded efficient.

## Common Distractors

- "Let the agent decide later."
- "Give broad access so the agent can discover the task."
- "Trust the generated summary."
- "Retry until the workflow passes."
- "Skip human review because checks passed."
- "Use more agents even when handoff rules are missing."
- "Store everything in memory without expiry or scope."

## Most Likely Correct Pattern

The better answer usually:

- Defines scope before action.
- Uses least privilege.
- Keeps work in GitHub-visible artifacts.
- Requires checks, logs, traces, scans, or PR evidence.
- Adds human approval for sensitive, irreversible, production, security, or compliance-relevant work.
- Tunes the workflow after root cause analysis, not after guessing.

## Flag And Review Strategy

When stuck, write a quick mental note:

- What is the agent trying to do?
- What can go wrong?
- Which tool or permission is being requested?
- What evidence proves success?
- Who must approve the risk?

Then pick the answer that makes those five things explicit.

## Final Week

1. Complete one simulator form in timed mode.
2. Review domain scores and rationales.
3. Use adaptive quiz mode for weak domains.
4. Complete one related lab for each weak domain.
5. Review the visual reference aids in the cram guide.
6. Run the currentness check against official sources.
7. Take a different simulator form and aim for 80%+ with no domain under 70%.
