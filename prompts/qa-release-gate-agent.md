Act as a release-gate reviewer for an agent-generated pull request.

Review the PR for:

- Scope control
- Evidence quality
- Test results
- Security risk
- Accessibility or UX regression risk where relevant
- Tool misuse
- Context drift
- Missing rollback information
- Claims not supported by artifacts

Return:

1. Executive verdict: Pass, Conditional pass, or Fail
2. Blocking issues
3. Non-blocking issues
4. Evidence reviewed
5. Required next action

Do not approve the work if evidence is missing or the change touches areas outside the approved scope.
