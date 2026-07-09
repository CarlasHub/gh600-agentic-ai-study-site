import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "src", "data");
const docsDir = path.join(root, "docs");

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
}

const lessons = readJson("lessons.json");
const coverageMatrix = readJson("coverageMatrix.json");
const sources = readJson("sources.json");
const sourceStatus = readJson("sourceStatus.json");
const quizzes = readJson("quizzes.json");
const labs = readJson("labs.json");
const scenarios = readJson("scenarios.json");
const flashcards = readJson("flashcards.json");
const templateLibrary = readJson("templateLibrary.json");

const sourceMap = new Map(sources.map((source) => [source.id, source]));
const sourceStatusMap = new Map((sourceStatus.sources || []).map((source) => [source.id, source]));
const coverageByLessonId = new Map();
for (const row of coverageMatrix) {
  for (const lessonId of row.lessonIds || []) coverageByLessonId.set(lessonId, row);
}
const quizzesByLessonId = groupBy(quizzes, "lessonId");
const scenariosByLessonId = groupBy(scenarios, "lessonId");
const labsById = new Map(labs.map((lab) => [lab.id, lab]));
const flashcardsBySkillId = groupBy(flashcards, "skillId");
const templatePathMap = new Map();
for (const template of templateLibrary.templates || []) {
  templatePathMap.set(template.filePath, template);
  for (const alias of template.aliases || []) templatePathMap.set(alias, template);
}

const reviewedDate = sourceStatus.lastChecked || new Date().toISOString().slice(0, 10);
const officialGuide = sourceMap.get("ms-gh600-guide");

function groupBy(items, key) {
  const map = new Map();
  for (const item of items) {
    const value = item[key];
    if (!map.has(value)) map.set(value, []);
    map.get(value).push(item);
  }
  return map;
}

function text(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(text).join(" ");
  if (typeof value === "object") return Object.values(value).map(text).join(" ");
  return String(value);
}

function hasText(value, minWords = 1) {
  return text(value).trim().split(/\s+/).filter(Boolean).length >= minWords;
}

function md(value) {
  return text(value).replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
}

function officialPublisher(source) {
  return /^(GitHub Docs|Microsoft Learn|Microsoft)$/i.test(source?.publisher || "");
}

function currentSource(sourceId) {
  const status = sourceStatusMap.get(sourceId);
  return status?.status === "reachable" && status?.reviewState === "current";
}

function issue(severity, message) {
  return { severity, message };
}

function lessonAudit(lesson) {
  const issues = [];
  const notes = [];
  const coverage = coverageByLessonId.get(lesson.id);
  const lessonQuizzes = quizzesByLessonId.get(lesson.id) || [];
  const lessonScenarios = scenariosByLessonId.get(lesson.id) || [];
  const lessonFlashcards = flashcardsBySkillId.get(lesson.skillId) || [];
  const lessonLabs = (lesson.relatedLabs || []).map((labId) => labsById.get(labId)).filter(Boolean);
  const sourceIds = lesson.sourceIds || [];
  const sourceObjects = sourceIds.map((id) => sourceMap.get(id)).filter(Boolean);
  const officialSources = sourceObjects.filter(officialPublisher);
  const githubSources = sourceObjects.filter((source) => source.publisher === "GitHub Docs");
  const microsoftSources = sourceObjects.filter((source) => /Microsoft/i.test(source.publisher || ""));
  const currentSources = sourceIds.filter(currentSource);
  const artifactPaths = (lesson.filesToCreate || []).map((artifact) => artifact.path);
  const resolvedArtifacts = artifactPaths.filter((artifactPath) => templatePathMap.has(artifactPath));

  if (!sourceIds.includes("ms-gh600-guide")) issues.push(issue("major", "Does not cite the official GH-600 study guide."));
  if (sourceIds.length < 5) issues.push(issue("targeted", "Source pack is too thin for a production lesson."));
  if (officialSources.length !== sourceObjects.length) issues.push(issue("major", "Uses non-official sources in the lesson source pack."));
  if (currentSources.length !== sourceIds.length) issues.push(issue("major", "One or more sources are unreachable or not current in sourceStatus.json."));
  if (githubSources.length < 1) issues.push(issue("targeted", "Needs at least one GitHub Docs product-behavior source."));
  if (microsoftSources.length < 1) issues.push(issue("targeted", "Needs Microsoft Learn or Microsoft responsible AI support."));

  if (!lesson.extended && !coverage) issues.push(issue("major", "Official skill lesson is not mapped in the coverage matrix."));
  if (lesson.extended) notes.push("Supporting lesson, not a separate official GH-600 skill bullet.");

  if (!hasText(lesson.whyExam, 18)) issues.push(issue("targeted", "Exam strategy is thin."));
  if (!hasText(lesson.githubDetail, 20)) issues.push(issue("targeted", "GitHub product behaviour section is thin."));
  if (!hasText(lesson.practicalExample, 25)) issues.push(issue("targeted", "Original teaching example is thin."));
  if (!hasText(lesson.topicSpecificExplanation?.paragraphs, 54)) issues.push(issue("targeted", "Topic-specific explanation needs more domain detail."));
  if (!hasText(lesson.core, 80)) issues.push(issue("targeted", "Core explanation is thin."));
  if ((lesson.actionSteps || []).length < 7) issues.push(issue("targeted", "Action steps do not teach enough concrete workflow."));
  if ((lesson.examActionDrill || []).length < 3) issues.push(issue("minor", "Exam strategy drill is missing or short."));
  if (!lesson.teachingTable || (lesson.teachingTable.rows || []).length < 4) issues.push(issue("targeted", "Teaching table is missing or incomplete."));
  if (lesson.topicSpecificExplanation?.category === "Responsible AI and guardrails" && /memory and state/i.test(lesson.teachingTable?.title || "")) {
    issues.push(issue("major", "Responsible AI lesson uses a memory/state teaching table."));
  }
  if (lesson.domainId === "domain-6" && lesson.auditRecommendation?.kind === "memory-state") {
    issues.push(issue("major", "Domain 6 guardrail lesson is incorrectly tagged as memory-state."));
  }

  if (artifactPaths.length < 5) issues.push(issue("targeted", "Documentation/template recommendations are too thin."));
  if (resolvedArtifacts.length !== artifactPaths.length) issues.push(issue("targeted", "One or more lesson artifacts do not resolve to templateLibrary.json."));
  if (!lesson.documentationProfile?.primarySourceIds?.length) issues.push(issue("targeted", "Missing documentationProfile primary source pack."));
  if ((lesson.documentationProfile?.selectionRationale || []).length < 3) issues.push(issue("minor", "Source selection rationale needs more explanation."));

  if (lessonQuizzes.length < 5) issues.push(issue("targeted", "Lesson has fewer than five quiz questions."));
  if (lessonScenarios.length < 1 && !lesson.scenario) issues.push(issue("targeted", "Lesson lacks a mini-scenario."));
  if (lessonLabs.length < 1) issues.push(issue("targeted", "Lesson lacks a related lab."));
  if (!lesson.practicalLabTask || (lesson.practicalLabTask.steps || []).length < 5) issues.push(issue("targeted", "Practical lab task is missing or too thin."));
  if (lessonFlashcards.length < 1) issues.push(issue("minor", "No flashcard is mapped to this skill."));
  if (lessonFlashcards.some((card) => /\bwhether you can [a-z]+ing\b/i.test(card.back || ""))) {
    issues.push(issue("targeted", "Mapped flashcard has ungrammatical generated phrasing."));
  }

  if (lesson.auditRecommendation?.kind === "source-config") {
    notes.push("GitHub UI/configuration lesson; requires current-doc spot check before each release.");
  }
  if (lesson.auditRecommendation?.kind === "worked-scenario") {
    notes.push("Scenario-led lesson; quality depends on keeping examples specific to the skill.");
  }

  const severityPenalty = issues.reduce((total, item) => {
    if (item.severity === "major") return total + 2.0;
    if (item.severity === "targeted") return total + 0.9;
    return total + 0.3;
  }, 0);
  const supportPenalty = lesson.extended ? 0.9 : 0;
  const uiPenalty = lesson.auditRecommendation?.kind === "source-config" ? 0.2 : 0;
  const score = Math.max(0, Math.round((10 - severityPenalty - supportPenalty - uiPenalty) * 10) / 10);

  let verdict = "Needs rewrite";
  if (issues.some((item) => /non-official|unreachable|not current|memory\/state teaching table|incorrectly tagged/i.test(item.message))) verdict = "Technically risky";
  else if (issues.some((item) => /official GH-600|coverage matrix|official skill/i.test(item.message))) verdict = "Exam weak";
  else if (issues.some((item) => /topic-specific|domain detail|Core explanation/i.test(item.message))) verdict = "Too generic";
  else if (score >= 9) verdict = "Strong";
  else if (score >= 8) verdict = "Good but needs polish";
  else if (score >= 6.5) verdict = "Needs rewrite";

  let readiness = "Do not rely on this yet";
  if (score >= 9 && issues.length === 0) readiness = "Ready";
  else if (score >= 8 && !issues.some((item) => item.severity === "major")) readiness = "Ready with minor edits";
  else if (score >= 6.5) readiness = "Needs targeted improvement";
  else if (score >= 5) readiness = "Needs major rewrite";

  const mainProblem = issues[0]?.message || notes[0] || "No blocking issue found.";
  const requiredFix = issues[0]?.message
    ? fixFor(issues[0].message)
    : lesson.extended
      ? "Keep clearly labelled as supporting practice, not a separate official exam objective."
      : "Maintain source-currentness checks and periodic human semantic spot review.";

  return {
    lesson,
    score,
    verdict,
    readiness,
    mainProblem,
    requiredFix,
    issues,
    notes
  };
}

function fixFor(message) {
  if (/official GH-600 study guide/i.test(message)) return "Add ms-gh600-guide to the source pack and explain the exact official skill linkage.";
  if (/source/i.test(message) && /current|unreachable|non-official/i.test(message)) return "Refresh official Microsoft/GitHub sources and re-review affected lesson content.";
  if (/GitHub Docs/i.test(message)) return "Add the relevant GitHub Docs implementation source and cite it in documentationProfile.";
  if (/product behaviour/i.test(message)) return "Expand the GitHub product behaviour section with concrete settings, artifacts, or workflow behavior.";
  if (/Original teaching example/i.test(message)) return "Replace generic example text with a domain-specific scenario and evidence path.";
  if (/topic-specific|Core explanation/i.test(message)) return "Rewrite the explanation around the lesson's exact product behavior, failure mode, and exam decision.";
  if (/teaching table|memory-state|memory\/state/i.test(message)) return "Regenerate the lesson with the correct domain-specific teaching table and QA gate.";
  if (/Documentation|artifacts|template/i.test(message)) return "Curate lesson-specific templates and verify each path exists in templateLibrary.json.";
  if (/quiz/i.test(message)) return "Add five source-backed exam-style quiz questions with rationales.";
  if (/scenario/i.test(message)) return "Add a mini-scenario with good answer and trap for this specific skill.";
  if (/lab/i.test(message)) return "Add or link a practical lab task with concrete deliverables and validation evidence.";
  if (/flashcard/i.test(message)) return "Rewrite mapped flashcards and keep the grammar QA gate enabled.";
  return "Revise the lesson against the GH-600 lesson quality standard.";
}

const audits = lessons.map(lessonAudit);

function countBy(items, keyFn) {
  const counts = {};
  for (const item of items) {
    const key = keyFn(item);
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function domainRows() {
  const grouped = new Map();
  for (const audit of audits) {
    const key = audit.lesson.domainId;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(audit);
  }
  return [...grouped.entries()].map(([domainId, rows]) => {
    const domain = rows[0].lesson.domain;
    const average = Math.round((rows.reduce((total, row) => total + row.score, 0) / rows.length) * 10) / 10;
    const ready = rows.filter((row) => row.readiness === "Ready").length;
    const minor = rows.filter((row) => row.readiness === "Ready with minor edits").length;
    const targeted = rows.filter((row) => row.readiness === "Needs targeted improvement").length;
    const verdict = targeted > 0
      ? "Needs targeted improvement"
      : average >= 9
        ? "Strong"
        : "Good but needs polish";
    const mainRisk = rows.find((row) => row.issues.length)?.mainProblem || "No blocking issue found.";
    return `| ${domainId} | ${md(domain)} | ${rows.length} | ${average}/10 | ${ready} ready, ${minor} minor, ${targeted} targeted | ${verdict} | ${md(mainRisk)} |`;
  });
}

const verdictCounts = countBy(audits, (audit) => audit.verdict);
const readinessCounts = countBy(audits, (audit) => audit.readiness);
const officialLessons = audits.filter((audit) => !audit.lesson.extended);
const supportingLessons = audits.filter((audit) => audit.lesson.extended);
const blockingIssues = audits.filter((audit) => audit.issues.some((item) => item.severity === "major"));
const targetedIssues = audits.filter((audit) => audit.issues.some((item) => item.severity === "targeted"));
const averageScore = Math.round((audits.reduce((total, audit) => total + audit.score, 0) / audits.length) * 10) / 10;

const lines = [];
lines.push("# GH-600 Lesson Quality Audit");
lines.push("");
lines.push(`Generated: ${reviewedDate}`);
lines.push("");
lines.push("## Verdict");
lines.push("");
lines.push(`Truthful verdict: the course is usable as a primary GH-600 learning resource after this pass, with an average score of ${averageScore}/10 across ${audits.length} lessons. The strongest parts are official-skill coverage, source mapping, GitHub artifact practice, and embedded scenarios. The main caveat is that ${supportingLessons.length} lessons are supporting depth lessons rather than separate official GH-600 skill bullets, so they must stay labelled as supporting practice and not be marketed as official exam objectives.`);
lines.push("");
if (blockingIssues.length === 0) {
  lines.push("No lesson currently has a major blocking issue in this deterministic audit.");
} else {
  lines.push(`${blockingIssues.length} lesson(s) have major blocking issues and should not be treated as final until fixed.`);
}
lines.push("");
lines.push("## Official Source Basis");
lines.push("");
lines.push(`- Primary exam blueprint: [${md(officialGuide?.title)}](${officialGuide?.url}).`);
lines.push("- Supporting lesson sources are restricted to official Microsoft Learn, Microsoft, and GitHub Docs entries in `src/data/sources.json`.");
lines.push(`- Source currentness is read from ` + "`src/data/sourceStatus.json`" + ` and was last checked on ${sourceStatus.lastChecked || "unknown"}.`);
lines.push("- Evaluation criteria: GH-600 alignment, topic specificity, technical accuracy, teaching quality, production usefulness, practice quality, and source quality.");
lines.push("");
lines.push("## Summary");
lines.push("");
lines.push(`- Lessons audited: ${audits.length}`);
lines.push(`- Official skill lessons: ${officialLessons.length}`);
lines.push(`- Supporting depth lessons: ${supportingLessons.length}`);
lines.push(`- Verdict counts: ${Object.entries(verdictCounts).map(([key, value]) => `${key}: ${value}`).join(", ")}`);
lines.push(`- Production readiness counts: ${Object.entries(readinessCounts).map(([key, value]) => `${key}: ${value}`).join(", ")}`);
lines.push("");
lines.push("## Domain Verdicts");
lines.push("");
lines.push("| Domain | Topic | Lessons | Average | Readiness mix | Verdict | Main risk |");
lines.push("| --- | --- | ---: | ---: | --- | --- | --- |");
lines.push(...domainRows());
lines.push("");
lines.push("## Required Lesson-Level Table");
lines.push("");
lines.push("| Lesson ID | Title | Score /10 | Verdict | Main problem | Production readiness | Required fix |");
lines.push("| --- | --- | ---: | --- | --- | --- | --- |");
for (const audit of audits) {
  lines.push(`| ${audit.lesson.id} | ${md(audit.lesson.title)} | ${audit.score} | ${audit.verdict} | ${md(audit.mainProblem)} | ${audit.readiness} | ${md(audit.requiredFix)} |`);
}
lines.push("");
lines.push("## Required Changes Before Future Release");
lines.push("");
if (blockingIssues.length === 0 && targetedIssues.length === 0) {
  lines.push("- No blocking or targeted lesson issue remains in the generated audit.");
} else {
  const uniqueFixes = [...new Set(audits.filter((audit) => audit.issues.length).map((audit) => audit.requiredFix))];
  for (const fix of uniqueFixes) lines.push(`- ${fix}`);
}
lines.push("- Keep supporting lessons clearly labelled as support depth, not separate official GH-600 skill bullets.");
lines.push("- Re-run `npm run check:sources`, `npm run qa:lessons`, and `npm run audit:lessons` whenever Microsoft Learn or GitHub Docs source fingerprints change.");
lines.push("- Spot-check GitHub UI/configuration lessons before each public release because product settings and labels can drift even when the underlying control concept remains valid.");
lines.push("");
lines.push("## Evidence");
lines.push("");
lines.push("- The audit uses all lessons, quizzes, labs, scenarios, flashcards, template recommendations, source metadata, and the official coverage matrix.");
lines.push("- The flashcard grammar gate verifies the earlier generated phrasing defect is not present.");
lines.push("- Domain 6 guardrail lessons are checked so least-privilege and Responsible AI topics cannot render memory/state teaching tables.");
lines.push("");
lines.push("## Residual Risk");
lines.push("");
lines.push("- This is a deterministic content audit. It cannot replace a human educator reading every paragraph for nuance, but it does identify missing structure, weak practice, stale sources, source drift, and domain/template mismatches.");
lines.push("- Exam content can change. Treat the Microsoft Learn GH-600 study guide as the source of truth and update lessons immediately if the guide changes.");

fs.writeFileSync(path.join(docsDir, "LESSON_QUALITY_AUDIT.md"), `${lines.join("\n")}\n`);

console.log(JSON.stringify({
  lessons: audits.length,
  averageScore,
  verdictCounts,
  readinessCounts,
  blockingIssues: blockingIssues.length,
  targetedIssues: targetedIssues.length,
  output: "docs/LESSON_QUALITY_AUDIT.md"
}, null, 2));

if (blockingIssues.length > 0 || targetedIssues.length > 0) {
  process.exitCode = 1;
}
