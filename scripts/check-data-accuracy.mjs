import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "src", "data");
const docsDir = path.join(root, "docs");

function readJson(name, fallback = null) {
  const file = path.join(dataDir, name);
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

const framework = readJson("accuracyFramework.json");
const sourceStatus = readJson("sourceStatus.json", { lastChecked: null, sources: [] });
const sources = readJson("sources.json");
const lessons = readJson("lessons.json");
const quizzes = readJson("quizzes.json");
const simulator = readJson("examSimulatorQuestions.json");
const mockExams = readJson("mockExams.json");
const labs = readJson("labs.json");
const flashcards = readJson("flashcards.json");
const glossary = readJson("glossary.json");
const scenarios = readJson("scenarios.json");
const caseStudies = readJson("caseStudies.json", []);
const coverageMatrix = readJson("coverageMatrix.json");

const checkedAt = new Date().toISOString();
const errors = [];
const warnings = [];
const reviewQueue = [];

const sourceMap = new Map(sources.map((source) => [source.id, source]));
const statusMap = new Map((sourceStatus.sources || []).map((source) => [source.id, source]));
const expectedSnapshot = framework.sourceSnapshot.id;
const requiredAccuracyFields = framework.contentReview.requiredAccuracyFields;

const STOP_WORDS = new Set([
  "about",
  "after",
  "agent",
  "agents",
  "also",
  "before",
  "being",
  "could",
  "every",
  "github",
  "guide",
  "learn",
  "microsoft",
  "needs",
  "other",
  "should",
  "source",
  "study",
  "their",
  "there",
  "these",
  "using",
  "where",
  "which",
  "while",
  "with",
  "would"
]);

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function queue(item) {
  reviewQueue.push(item);
}

function asText(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(asText).join(" ");
  if (typeof value === "object") return Object.values(value).map(asText).join(" ");
  return "";
}

function normalize(value) {
  return asText(value).toLowerCase().replace(/[^a-z0-9+#./-]+/g, " ").replace(/\s+/g, " ").trim();
}

function words(value) {
  return [...new Set(normalize(value).split(" ").filter((word) => {
    if (word.length < 5) return false;
    if (/^\d+$/.test(word)) return false;
    return !STOP_WORDS.has(word);
  }))];
}

function checksum(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function checkAccuracy(item, context) {
  if (!item.accuracy || typeof item.accuracy !== "object") {
    fail(`${context} is missing accuracy metadata`);
    return;
  }
  for (const field of requiredAccuracyFields) {
    if (!(field in item.accuracy)) fail(`${context} accuracy metadata is missing ${field}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.accuracy.reviewedAt || "")) {
    fail(`${context} accuracy.reviewedAt must be YYYY-MM-DD`);
  }
  if (item.accuracy.sourceSnapshot !== expectedSnapshot) {
    fail(`${context} accuracy.sourceSnapshot must be ${expectedSnapshot}`);
  }
  if (!["source-mapped", "human-reviewed", "needs-review"].includes(item.accuracy.verification)) {
    fail(`${context} accuracy.verification is invalid`);
  }
  if (item.accuracy.reviewRequiredOnSourceChange !== true) {
    fail(`${context} accuracy.reviewRequiredOnSourceChange must be true`);
  }
}

function checkSourceIds(ids, context) {
  if (!Array.isArray(ids) || ids.length === 0) {
    fail(`${context} needs sourceIds`);
    return [];
  }
  const known = [];
  for (const id of ids) {
    if (!sourceMap.has(id)) {
      fail(`${context} references unknown sourceId ${id}`);
    } else {
      known.push(id);
    }
  }
  return known;
}

function sourceTerms(ids) {
  const terms = new Set();
  for (const id of ids) {
    const source = sourceMap.get(id);
    const status = statusMap.get(id);
    for (const term of words(`${source?.title || ""} ${source?.why || ""} ${source?.publisher || ""}`)) terms.add(term);
    for (const term of status?.contentKeywords || []) {
      if (typeof term === "string" && term.length >= 5 && !STOP_WORDS.has(term.toLowerCase())) terms.add(term.toLowerCase());
    }
  }
  return [...terms].slice(0, 48);
}

function checkGrounding(item, context, sourceIds, textValue, minimumHits = 1) {
  const text = normalize(textValue);
  const terms = sourceTerms(sourceIds);
  const hits = terms.filter((term) => text.includes(term.toLowerCase()));
  if (hits.length < minimumHits) {
    queue({
      severity: "medium",
      context,
      reason: `Low source keyword overlap: ${hits.length}/${Math.max(minimumHits, terms.length ? Math.min(terms.length, 8) : 0)} signal(s).`,
      sourceIds
    });
  }
  return {
    termCount: terms.length,
    hits: hits.length,
    sampleHits: hits.slice(0, 8)
  };
}

function checkQuestion(question, context) {
  checkAccuracy(question, context);
  const ids = checkSourceIds(question.sourceIds, context);
  const text = `${question.scenario || ""} ${question.question || ""} ${(question.options || []).join(" ")} ${question.correctExplanation || ""} ${asText(question.wrongRationales || [])} ${question.examTrap || ""}`;
  checkGrounding(question, context, ids, text, 1);

  if (!Array.isArray(question.options) || new Set(question.options).size !== question.options?.length) {
    fail(`${context} has duplicate answer options`);
  }
  if ((question.correctExplanation || "").length < 80) {
    queue({ severity: "medium", context, reason: "Correct explanation is thin and needs editorial review.", sourceIds: ids });
  }
  for (const rationale of question.wrongRationales || []) {
    if ((rationale.rationale || "").length < 55) {
      queue({ severity: "medium", context, reason: `Wrong-answer rationale ${rationale.optionIndex} is thin.`, sourceIds: ids });
    }
  }
}

function checkLesson(lesson) {
  const context = `lesson ${lesson.id}`;
  checkAccuracy(lesson, context);
  const ids = checkSourceIds(lesson.sourceIds, context);
  checkGrounding(lesson, context, ids, lesson, 2);
  if ((lesson.actionSteps || []).length < 6 || (lesson.enterpriseChecklist || []).length < 4) {
    queue({ severity: "high", context, reason: "Lesson lacks enough action or enterprise validation evidence.", sourceIds: ids });
  }
}

function checkLab(lab) {
  const context = `lab ${lab.id}`;
  checkAccuracy(lab, context);
  const ids = checkSourceIds(lab.sourceIds, context);
  checkGrounding(lab, context, ids, lab, 1);
  const evidenceText = normalize(`${lab.validation || ""} ${lab.expectedResult || ""} ${lab.recovery || ""}`);
  const evidenceTerms = ["evidence", "validate", "validation", "review", "artifact", "checks", "logs", "recovery"];
  if (!evidenceTerms.some((term) => evidenceText.includes(term))) {
    queue({ severity: "high", context, reason: "Lab validation does not clearly name evidence or recovery.", sourceIds: ids });
  }
}

function checkFlashcard(card) {
  const context = `flashcard ${card.id}`;
  checkAccuracy(card, context);
  const ids = checkSourceIds(card.sourceIds, context);
  checkGrounding(card, context, ids, card, 1);
  if ((card.back || "").length < 55) {
    queue({ severity: "medium", context, reason: "Flashcard definition is short and may not survive terminology drift.", sourceIds: ids });
  }
}

function checkGlossary(term) {
  const context = `glossary ${term.id}`;
  checkAccuracy(term, context);
  const ids = checkSourceIds(term.sourceIds, context);
  checkGrounding(term, context, ids, term, 1);
  if ((term.definition || "").length < 60) {
    queue({ severity: "medium", context, reason: "Glossary definition is short and should be checked against source terminology.", sourceIds: ids });
  }
}

function checkScenario(scenario) {
  const context = `scenario ${scenario.id}`;
  checkAccuracy(scenario, context);
  const ids = checkSourceIds(scenario.sourceIds, context);
  checkGrounding(scenario, context, ids, scenario, 1);
}

function checkCaseStudy(study) {
  const context = `case study ${study.id}`;
  checkAccuracy(study, context);
  const ids = checkSourceIds(study.sourceIds, context);
  checkGrounding(study, context, ids, study, 1);
  if ((study.scenario || "").length < 250 || (study.constraints || []).length < 4 || (study.evidenceArtifacts || []).length < 4) {
    queue({ severity: "medium", context, reason: "Case study needs enough scenario context, constraints, and evidence artifacts for exam-style practice.", sourceIds: ids });
  }
  for (const question of study.questions || []) {
    if ((question.rationale || "").length < 80) {
      queue({ severity: "medium", context: `${context} question ${question.id}`, reason: "Case-study rationale is thin and needs editorial review.", sourceIds: ids });
    }
  }
}

function checkCoverage(row) {
  const context = `coverage ${row.id}`;
  checkAccuracy(row, context);
  const ids = checkSourceIds(row.sourceIds, context);
  checkGrounding(row, context, ids, row, 1);
}

function checkMockExam(exam) {
  const context = `mock exam ${exam.id}`;
  checkAccuracy(exam, context);
  if (!Array.isArray(exam.questionIds) || exam.questionIds.length < 1) {
    fail(`${context} must reference simulator or quiz questions`);
  }
}

function daysSince(dateString) {
  if (!dateString) return Infinity;
  const time = Date.parse(dateString);
  if (Number.isNaN(time)) return Infinity;
  return Math.floor((Date.now() - time) / 86400000);
}

for (const source of sources) {
  const status = statusMap.get(source.id);
  if (!status) {
    queue({ severity: "high", context: `source ${source.id}`, reason: "No source status baseline exists.", sourceIds: [source.id] });
    continue;
  }
  if (status.status !== "reachable") {
    queue({ severity: "high", context: `source ${source.id}`, reason: `Source status is ${status.status}.`, sourceIds: [source.id] });
  }
  if (status.reviewState && status.reviewState !== "current" && status.reviewState !== "baseline-established") {
    queue({ severity: "high", context: `source ${source.id}`, reason: `Source review state is ${status.reviewState}.`, sourceIds: [source.id] });
  }
  if (!status.contentHash) {
    queue({ severity: "medium", context: `source ${source.id}`, reason: "Source has no content fingerprint yet.", sourceIds: [source.id] });
  }
}

const sourceAge = daysSince(sourceStatus.lastChecked);
if (sourceAge > 14) {
  warn(`Source status is ${sourceAge} days old; run npm run check:sources before release.`);
}

for (const lesson of lessons) checkLesson(lesson);
for (const question of quizzes) checkQuestion(question, `quiz ${question.id}`);
for (const question of simulator) checkQuestion(question, `simulator ${question.id}`);
for (const lab of labs) checkLab(lab);
for (const card of flashcards) checkFlashcard(card);
for (const term of glossary) checkGlossary(term);
for (const scenario of scenarios) checkScenario(scenario);
for (const study of caseStudies) checkCaseStudy(study);
for (const row of coverageMatrix) checkCoverage(row);
for (const exam of mockExams) checkMockExam(exam);

const contentSets = [
  ["Lessons", lessons.length],
  ["Quiz questions", quizzes.length],
  ["Simulator questions", simulator.length],
  ["Mock exams", mockExams.length],
  ["Labs", labs.length],
  ["Flashcards", flashcards.length],
  ["Glossary terms", glossary.length],
  ["Scenarios", scenarios.length],
  ["Case studies", caseStudies.length],
  ["Coverage rows", coverageMatrix.length]
];

const status = errors.length ? "failed" : reviewQueue.some((item) => item.severity === "high") ? "review-needed" : "passed";
const highReview = reviewQueue.filter((item) => item.severity === "high").length;
const mediumReview = reviewQueue.filter((item) => item.severity === "medium").length;
const reportHash = checksum(JSON.stringify({ contentSets, highReview, mediumReview, errors, warnings }));

const accuracyStatus = {
  checkedAt,
  status,
  frameworkVersion: framework.frameworkVersion,
  sourceSnapshot: expectedSnapshot,
  sourceLastChecked: sourceStatus.lastChecked,
  reportHash,
  contentItemsChecked: contentSets.reduce((sum, [, count]) => sum + count, 0),
  sourcesChecked: sources.length,
  reviewQueue: {
    high: highReview,
    medium: mediumReview,
    total: reviewQueue.length
  },
  reports: framework.reports,
  userReportUrl: framework.userReporting.issueUrl
};

fs.writeFileSync(path.join(dataDir, "accuracyStatus.json"), JSON.stringify(accuracyStatus, null, 2) + "\n");

const reviewRows = reviewQueue.slice(0, 80).map((item) => {
  const sourceList = (item.sourceIds || []).join(", ");
  return `${item.severity} | ${item.context.replaceAll("|", "/")} | ${item.reason.replaceAll("|", "/")} | ${sourceList}`;
});

const markdown = [
  "# Data Accuracy Report",
  "",
  `Checked: ${checkedAt}`,
  "",
  `Status: ${status}`,
  `Framework version: ${framework.frameworkVersion}`,
  `Source snapshot: ${expectedSnapshot}`,
  `Source metadata last checked: ${sourceStatus.lastChecked || "unknown"}`,
  `Report hash: ${reportHash}`,
  "",
  "## Scope",
  "",
  "This report is generated by `npm run data:accuracy`. It performs deterministic semantic evidence checks across lessons, quiz rationales, simulator questions, labs, flashcards, glossary entries, scenarios, case studies, mock exam records, and the coverage matrix.",
  "",
  "The check does not claim that automation can permanently prove every sentence true. It flags weak evidence, stale metadata, source drift, and thin explanations so a maintainer or instructor can perform targeted human review.",
  "",
  "Content set | Items checked",
  "--- | ---:",
  ...contentSets.map(([label, count]) => `${label} | ${count}`),
  "",
  "## Automated Checks",
  "",
  "- Required accuracy metadata exists on every lesson and assessment content record.",
  "- Each content record has source IDs that resolve to `src/data/sources.json`.",
  "- Each content record is compared against cited source titles, source rationale, and extracted source keywords from `src/data/sourceStatus.json`.",
  "- Quiz and simulator questions include correct-answer explanations and wrong-answer rationales that are long enough for editorial review.",
  "- Labs include validation, expected result, common failure, and recovery evidence.",
  "- Source status is checked for stale or changed fingerprints.",
  "",
  "## Manual Review Queue",
  "",
  `High severity: ${highReview}`,
  `Medium severity: ${mediumReview}`,
  `Total: ${reviewQueue.length}`,
  "",
  reviewRows.length ? "Severity | Item | Reason | Sources" : "No manual review flags were generated.",
  reviewRows.length ? "--- | --- | --- | ---" : "",
  ...reviewRows,
  reviewQueue.length > reviewRows.length ? `\nAdditional queued items omitted from this report: ${reviewQueue.length - reviewRows.length}` : "",
  "",
  "## Errors And Warnings",
  "",
  errors.length ? errors.map((item) => `- ERROR: ${item}`).join("\n") : "- No blocking errors.",
  warnings.length ? warnings.map((item) => `- WARNING: ${item}`).join("\n") : "- No warnings.",
  "",
  "## Maintainer Actions",
  "",
  "- If a source fingerprint changes, open the source URL, compare the changed product or exam behavior, update affected lessons/questions/labs/flashcards, and record the decision in `docs/DATA_ACCURACY_ACTION_LOG.md`.",
  "- If source keyword overlap is low, check whether the item cites too broad a source or needs tighter wording.",
  "- If a learner reports drift, use the `Content drift or data accuracy report` issue template and link the resulting issue from the action log.",
  ""
].filter((line) => line !== null).join("\n");

fs.writeFileSync(path.join(docsDir, "DATA_ACCURACY_REPORT.md"), markdown);

console.log(JSON.stringify(accuracyStatus, null, 2));

if (errors.length) {
  console.error("\nData accuracy check failed:");
  for (const error of errors.slice(0, 120)) console.error(`- ${error}`);
  if (errors.length > 120) console.error(`- ...and ${errors.length - 120} more`);
  process.exit(1);
}

if (reviewQueue.length) {
  console.log(`\nData accuracy check completed with ${reviewQueue.length} manual review flag(s).`);
} else {
  console.log("\nData accuracy check passed with no manual review flags.");
}
