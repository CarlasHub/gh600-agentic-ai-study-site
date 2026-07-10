# GH-600 Exam-Hardness Standard

This standard defines the release bar for GH-600 quizzes, exam simulator questions, and case-study drills.

The goal is to prepare learners for Microsoft-style practice assessment difficulty: scenario judgment, plausible distractors, source-backed product behavior, and evidence-driven decisions. A question should not be answerable by spotting the longest option, a repeated phrase, or a generic "be safe" pattern.

## Primary Sources

The primary source of truth is the official Microsoft GH-600 study guide. Supporting sources must come from Microsoft Learn, Microsoft, or GitHub Docs when possible.

Every assessment item must cite `ms-gh600-guide` plus topic-specific sources that support the product behavior being tested.

## Required Question Shape

Every quiz and simulator question must include:

- A scenario or decision point tied to an official GH-600 domain.
- Four answer options.
- One correct answer that names the right GitHub control, artifact, evidence path, or reviewer decision.
- Three plausible wrong answers that are wrong for specific reasons, not because they are obviously silly.
- A correct explanation that teaches why the selected answer is stronger.
- Wrong-answer rationales that identify the missing control, evidence, scope, approval, permission, trace, state, handoff, policy, or audit risk.

## Difficulty Requirements

Assessment content must avoid shallow recall as the default. The bank should include:

- Best-next-action questions.
- Evidence-selection questions.
- Risk-classification questions.
- Control-selection questions.
- Readiness or case-study judgment questions.

Scenario questions should make the learner decide among tradeoffs such as speed versus reviewability, tool power versus least privilege, memory usefulness versus stale state, or autonomy versus human approval.

## Bias Controls

The release gate fails when:

- Correct-answer positions are materially imbalanced.
- More than 35% of a bank or simulator form has the correct answer as the longest option.
- Wrong-answer rationales reuse banned generic language.
- Simulator forms do not keep official domain weighting.
- Lessons do not have exactly five related quiz questions.

These checks are enforced by:

```bash
npm run qa:exam-hard
```

The full release command also runs this gate:

```bash
npm run check
```

## Simulator Form Standard

Each simulator form must contain 60 questions and follow the official domain shape:

- Domain 1: 10 questions
- Domain 2: 14 questions
- Domain 3: 8 questions
- Domain 4: 10 questions
- Domain 5: 10 questions
- Domain 6: 8 questions

Each form must keep answer positions balanced and must include scenario, official skill, exam trap, correct explanation, wrong rationales, and official source IDs.

## Case-Study Standard

The platform must include at least one advanced case-study drill for each official exam domain.

Each case study must include:

- A domain-specific scenario.
- Four or more real constraints.
- Four or more expected evidence artifacts.
- Four or more case questions.
- Rationales that teach the relevant control, evidence, approval, policy, trace, memory, tool, or handoff concept.
- `ms-gh600-guide` and at least four supporting sources.

## Release Evidence

Every release that changes assessment content should record:

- What changed in the question bank or case studies.
- Which QA commands ran.
- Whether answer positions and longest-answer bias stayed within limits.
- Which source links support the changed content.
- Remaining risks, especially areas that still need human editorial review against current Microsoft practice assessment behavior.
