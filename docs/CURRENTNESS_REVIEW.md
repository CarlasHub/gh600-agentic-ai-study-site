# Currentness Review Workflow

GH-600 is an active certification area. Microsoft states that the listed bullets illustrate assessment coverage and that related topics may be covered. Use this workflow before relying on the site for an exam sitting.

## When to run this review

- Before each exam attempt.
- Whenever the Microsoft GH-600 study guide changes.
- Whenever GitHub Copilot cloud agent, MCP, custom agents, custom instructions, branch protection, rulesets, environments, or Responsible AI documentation changes in a way that affects exam behaviour.
- Weekly through `.github/workflows/source-currentness.yml`, with human review for any flagged source.

## Review steps

1. Open the official GH-600 study guide.
2. Compare every domain, skill group, and bullet with `src/data/examBlueprint.json`.
3. Update `src/data/coverageMatrix.json` for new or renamed skills.
4. Re-check source URLs in `src/data/sources.json`.
5. Add or revise lessons, quizzes, labs, flashcards, and mock exam questions for any changed skill.
6. Update `docs/SOURCE_RESEARCH_LOG.md` with the date accessed and what changed.
7. Run `npm install` if dependencies changed.
8. Run `npm run qa:content` to catch broken mappings, invalid source IDs, incomplete lesson fields, and simulator balance problems.
9. Run `npm run check:sources` to verify configured sources are reachable and write `docs/SOURCE_CURRENTNESS_REPORT.md`.
10. Run `npm run build`.
11. Smoke test the main routes in a browser.
12. Record results in `docs/RELEASE_CHECKLIST.md`.

## What counts as up to date

A skill is current only when it still appears in the official guide or is clearly necessary surrounding knowledge, and it has all of the following:

- Lesson coverage.
- Practical case study or example.
- Quiz coverage.
- Flashcard coverage.
- Lab or practice artifact.
- Source citation.
- Revision note.
