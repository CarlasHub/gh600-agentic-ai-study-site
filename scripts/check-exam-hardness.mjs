import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "src", "data");

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
}

const blueprint = readJson("examBlueprint.json");
const lessons = readJson("lessons.json");
const quizzes = readJson("quizzes.json");
const simulator = readJson("examSimulatorQuestions.json");
const caseStudies = readJson("caseStudies.json");
const sources = readJson("sources.json");

const errors = [];
const warnings = [];
const domainIds = blueprint.domains.map((domain) => domain.id);
const domainSet = new Set(domainIds);
const lessonMap = new Map(lessons.map((lesson) => [lesson.id, lesson]));
const sourceMap = new Map(sources.map((source) => [source.id, source]));
const genericRationalePatterns = [
  /this is plausible, but it weakens scope/i,
  /this treats speed or convenience as the main goal/i,
  /this solves only part of the scenario/i,
  /this best matches gh-600 expectations for governed agentic sdlc work/i
];
const evidenceWords = /artifact|evidence|review|approval|scope|permission|tool|branch|workflow|trace|memory|state|handoff|guardrail|audit|policy|threshold|source/i;
const sourceWords = /github|microsoft|learn|docs|gh-600|copilot|mcp|actions|branch|environment|responsible|accessibility/i;

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function requireText(value, context, field, minLength = 1) {
  if (typeof value !== "string" || value.trim().length < minLength) {
    fail(`${context} needs ${field} with at least ${minLength} characters`);
  }
}

function requireArray(value, context, field, min = 1) {
  if (!Array.isArray(value) || value.length < min) {
    fail(`${context} needs ${field} with at least ${min} item(s)`);
  }
}

function checkSourceIds(ids, context, min = 1) {
  requireArray(ids, context, "sourceIds", min);
  if (!ids?.includes("ms-gh600-guide")) fail(`${context} must cite ms-gh600-guide`);
  for (const id of ids || []) {
    if (!sourceMap.has(id)) fail(`${context} references unknown sourceId ${id}`);
  }
  const sourceText = (ids || []).map((id) => `${sourceMap.get(id)?.title || ""} ${sourceMap.get(id)?.publisher || ""}`).join(" ");
  if (!sourceWords.test(sourceText)) warn(`${context} source pack may be too generic`);
}

function distribution(items, context, tolerance = 1) {
  const counts = [0, 0, 0, 0];
  for (const item of items) counts[item.correctIndex] += 1;
  const min = Math.min(...counts);
  const max = Math.max(...counts);
  if (max - min > tolerance) fail(`${context} correct-answer positions are imbalanced: ${counts.join(", ")}`);
  return counts;
}

function longestCorrectRate(items) {
  let longestCorrect = 0;
  for (const item of items) {
    const lengths = item.options.map((option) => option.length);
    const max = Math.max(...lengths);
    if (lengths[item.correctIndex] === max) longestCorrect += 1;
  }
  return longestCorrect / items.length;
}

function checkAssessmentQuestion(question, context, minQuestionLength) {
  requireText(question.id, context, "id", 3);
  requireText(question.question, context, "question", minQuestionLength);
  requireArray(question.options, context, "options", 4);
  if (question.options?.length !== 4) fail(`${context} must have exactly four options`);
  if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex > 3) {
    fail(`${context} needs correctIndex between 0 and 3`);
  }
  if (new Set(question.options || []).size !== (question.options || []).length) fail(`${context} has duplicate options`);
  for (const [index, option] of (question.options || []).entries()) {
    requireText(option, `${context} option ${index}`, "text", 40);
  }
  requireText(question.correctExplanation, context, "correctExplanation", 140);
  if (!evidenceWords.test(question.correctExplanation || "")) {
    fail(`${context} correctExplanation must explain the evidence, control, or review reason`);
  }
  requireArray(question.wrongRationales, context, "wrongRationales", 3);
  if (question.wrongRationales?.length !== 3) fail(`${context} must have exactly three wrong rationales`);
  const rationaleIndexes = new Set();
  for (const rationale of question.wrongRationales || []) {
    if (!Number.isInteger(rationale.optionIndex) || rationale.optionIndex === question.correctIndex || rationale.optionIndex < 0 || rationale.optionIndex > 3) {
      fail(`${context} has invalid wrong rationale index ${rationale.optionIndex}`);
    }
    if (rationaleIndexes.has(rationale.optionIndex)) fail(`${context} repeats wrong rationale index ${rationale.optionIndex}`);
    rationaleIndexes.add(rationale.optionIndex);
    requireText(rationale.rationale, `${context} wrong rationale ${rationale.optionIndex}`, "rationale", 80);
    if (genericRationalePatterns.some((pattern) => pattern.test(rationale.rationale || ""))) {
      fail(`${context} wrong rationale ${rationale.optionIndex} uses a banned generic pattern`);
    }
    if (!evidenceWords.test(rationale.rationale || "")) {
      fail(`${context} wrong rationale ${rationale.optionIndex} must name the missing control, evidence, or review risk`);
    }
  }
  checkSourceIds(question.sourceIds, context, 3);
  if (!question.examHard) fail(`${context} is missing examHard=true metadata`);
  requireText(question.questionType, context, "questionType", 6);
  requireText(question.cognitiveLevel, context, "cognitiveLevel", 5);
}

function checkQuestionBank(items, context, minQuestionLength, domainTolerance = 2) {
  for (const item of items) {
    if (!domainSet.has(item.domainId)) fail(`${context} ${item.id} references unknown domainId ${item.domainId}`);
    checkAssessmentQuestion(item, `${context} ${item.id}`, minQuestionLength);
  }
  distribution(items, context, 2);
  const rate = longestCorrectRate(items);
  if (rate > 0.35) fail(`${context} longest-correct rate ${(rate * 100).toFixed(1)}% exceeds 35%`);
  for (const domainId of domainIds) {
    const domainItems = items.filter((item) => item.domainId === domainId);
    if (!domainItems.length) fail(`${context} has no questions for ${domainId}`);
    if (domainItems.length >= 20) distribution(domainItems, `${context} ${domainId}`, domainTolerance);
    const domainRate = longestCorrectRate(domainItems);
    if (domainRate > 0.45) fail(`${context} ${domainId} longest-correct rate ${(domainRate * 100).toFixed(1)}% exceeds 45%`);
  }
}

function checkSimulator() {
  checkQuestionBank(simulator, "simulator", 110, 5);
  const forms = [...new Set(simulator.map((question) => question.form))].sort();
  if (forms.length < 5) fail(`simulator must have at least 5 forms; found ${forms.length}`);
  const expectedPerForm = {
    "domain-1": 10,
    "domain-2": 14,
    "domain-3": 8,
    "domain-4": 10,
    "domain-5": 10,
    "domain-6": 8
  };
  for (const form of forms) {
    const items = simulator.filter((question) => question.form === form);
    if (items.length !== 60) fail(`${form} must have 60 simulator questions; found ${items.length}`);
    distribution(items, `simulator ${form}`, 1);
    const formRate = longestCorrectRate(items);
    if (formRate > 0.35) fail(`${form} longest-correct rate ${(formRate * 100).toFixed(1)}% exceeds 35%`);
    for (const [domainId, expected] of Object.entries(expectedPerForm)) {
      const actual = items.filter((question) => question.domainId === domainId).length;
      if (actual !== expected) fail(`${form} expected ${expected} questions for ${domainId}; found ${actual}`);
    }
    for (const question of items) {
      requireText(question.scenario, `simulator ${question.id}`, "scenario", 80);
      requireText(question.examTrap, `simulator ${question.id}`, "examTrap", 12);
      requireText(question.officialSkill, `simulator ${question.id}`, "officialSkill", 12);
    }
  }
}

function checkLessonQuizLinks() {
  const quizByLesson = new Map();
  for (const quiz of quizzes) {
    if (!lessonMap.has(quiz.lessonId)) fail(`quiz ${quiz.id} references unknown lesson ${quiz.lessonId}`);
    const items = quizByLesson.get(quiz.lessonId) || [];
    items.push(quiz);
    quizByLesson.set(quiz.lessonId, items);
  }
  for (const lesson of lessons) {
    const items = quizByLesson.get(lesson.id) || [];
    if (items.length !== 5) fail(`lesson ${lesson.id} must have exactly 5 quiz questions; found ${items.length}`);
  }
}

function checkCaseStudies() {
  if (caseStudies.length < 6) fail(`caseStudies.json must include at least 6 case studies; found ${caseStudies.length}`);
  const coveredDomains = new Set(caseStudies.map((study) => study.domainId));
  for (const domainId of domainIds) {
    if (!coveredDomains.has(domainId)) fail(`caseStudies.json is missing a case study for ${domainId}`);
  }
  const seen = new Set();
  for (const study of caseStudies) {
    const context = `case study ${study.id}`;
    if (seen.has(study.id)) fail(`${context} is duplicated`);
    seen.add(study.id);
    if (!domainSet.has(study.domainId)) fail(`${context} references unknown domainId ${study.domainId}`);
    requireText(study.title, context, "title", 12);
    requireText(study.scenario, context, "scenario", 300);
    requireText(study.learnerTask, context, "learnerTask", 30);
    requireArray(study.constraints, context, "constraints", 4);
    requireArray(study.evidenceArtifacts, context, "evidenceArtifacts", 4);
    requireArray(study.questions, context, "questions", 4);
    checkSourceIds(study.sourceIds, context, 5);
    for (const [index, question] of (study.questions || []).entries()) {
      requireText(question.id, `${context} question ${index + 1}`, "id", 8);
      requireText(question.questionType, `${context} question ${question.id}`, "questionType", 6);
      requireText(question.question, `${context} question ${question.id}`, "question", 40);
      requireArray(question.options, `${context} question ${question.id}`, "options", 4);
      if (question.options?.length !== 4) fail(`${context} question ${question.id} must have exactly four options`);
      if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex > 3) {
        fail(`${context} question ${question.id} needs correctIndex between 0 and 3`);
      }
      requireText(question.rationale, `${context} question ${question.id}`, "rationale", 90);
      if (!evidenceWords.test(question.rationale || "")) {
        fail(`${context} question ${question.id} rationale must name evidence, controls, or review risk`);
      }
    }
  }
}

checkQuestionBank(quizzes, "lesson quiz", 80);
checkLessonQuizLinks();
checkSimulator();
checkCaseStudies();

for (const warning of warnings) console.warn(`Warning: ${warning}`);

if (errors.length) {
  console.error("Exam-hardness QA failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Exam-hardness QA passed");
console.log(`- Lesson quiz questions: ${quizzes.length}; positions ${distribution(quizzes, "lesson quiz summary", 2).join("/")}; longest-correct ${(longestCorrectRate(quizzes) * 100).toFixed(1)}%`);
console.log(`- Simulator questions: ${simulator.length}; forms ${new Set(simulator.map((question) => question.form)).size}; longest-correct ${(longestCorrectRate(simulator) * 100).toFixed(1)}%`);
console.log(`- Case studies: ${caseStudies.length}; domains ${[...new Set(caseStudies.map((study) => study.domainId))].sort().join(", ")}`);
