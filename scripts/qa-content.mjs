import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "src", "data");

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
}

const blueprint = readJson("examBlueprint.json");
const coverage = readJson("coverageMatrix.json");
const lessons = readJson("lessons.json");
const quizzes = readJson("quizzes.json");
const simulator = readJson("examSimulatorQuestions.json");
const labs = readJson("labs.json");
const flashcards = readJson("flashcards.json");
const glossary = readJson("glossary.json");
const mockExams = readJson("mockExams.json");
const sources = readJson("sources.json");
const accuracyFramework = readJson("accuracyFramework.json");
const templateLibrary = readJson("templateLibrary.json");
const scenarios = readJson("scenarios.json");
const cramGuide = readJson("cramGuide.json");
const studyPlans = readJson("studyPlans.json");

const expectedDomains = [
  ["domain-1", "Prepare agent architecture and SDLC processes", "15-20%"],
  ["domain-2", "Implement tool use and environment interaction", "20-25%"],
  ["domain-3", "Manage memory, state, and execution", "10-15%"],
  ["domain-4", "Perform evaluation, error analysis, and tuning", "15-20%"],
  ["domain-5", "Orchestrate multi-agent coordination", "15-20%"],
  ["domain-6", "Implement guardrails and accountability", "10-15%"]
];

const errors = [];
const warnings = [];

const by = (items, key) => new Map(items.map((item) => [item[key], item]));
const domainMap = by(blueprint.domains, "id");
const sourceMap = by(sources, "id");
const lessonMap = by(lessons, "id");
const quizMap = by(quizzes, "id");
const labMap = by(labs, "id");
const flashcardMap = by(flashcards, "id");
const scenarioMap = by(scenarios, "id");
const expectedSourceSnapshot = accuracyFramework.sourceSnapshot.id;
const requiredAccuracyFields = accuracyFramework.contentReview.requiredAccuracyFields;

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function uniqCheck(items, key, label) {
  const seen = new Set();
  for (const item of items) {
    if (!item[key]) fail(`${label} is missing ${key}`);
    if (seen.has(item[key])) fail(`${label} has duplicate ${key}: ${item[key]}`);
    seen.add(item[key]);
  }
}

function requireText(value, context, field) {
  if (typeof value !== "string" || !value.trim()) fail(`${context} is missing ${field}`);
}

function requireArray(value, context, field, min = 1) {
  if (!Array.isArray(value) || value.length < min) fail(`${context} needs ${field} with at least ${min} item(s)`);
}

function checkSourceIds(ids, context) {
  requireArray(ids, context, "sourceIds");
  for (const id of ids || []) {
    if (!sourceMap.has(id)) fail(`${context} references unknown sourceId ${id}`);
  }
}

function checkAccuracyMetadata(item, context) {
  if (!item.accuracy || typeof item.accuracy !== "object") {
    fail(`${context} is missing accuracy metadata`);
    return;
  }
  for (const field of requiredAccuracyFields) {
    if (!(field in item.accuracy)) fail(`${context} accuracy metadata is missing ${field}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.accuracy.reviewedAt || "")) {
    fail(`${context} accuracy.reviewedAt must use YYYY-MM-DD`);
  }
  if (item.accuracy.sourceSnapshot !== expectedSourceSnapshot) {
    fail(`${context} accuracy.sourceSnapshot must be ${expectedSourceSnapshot}`);
  }
  if (!["source-mapped", "human-reviewed", "needs-review"].includes(item.accuracy.verification)) {
    fail(`${context} accuracy.verification is invalid`);
  }
  if (item.accuracy.reviewRequiredOnSourceChange !== true) {
    fail(`${context} accuracy.reviewRequiredOnSourceChange must be true`);
  }
}

function checkDomain(id, context) {
  if (!domainMap.has(id)) fail(`${context} references unknown domainId ${id}`);
}

function collectOfficialSkills() {
  const skills = [];
  for (const domain of blueprint.domains) {
    for (const group of domain.groups || []) {
      for (const [index, skill] of (group.skills || []).entries()) {
        skills.push({
          id: `${group.id}-s${index + 1}`,
          skill,
          domainId: domain.id,
          groupId: group.id
        });
      }
    }
  }
  return skills;
}

uniqCheck(sources, "id", "source");
uniqCheck(lessons, "id", "lesson");
uniqCheck(quizzes, "id", "quiz question");
uniqCheck(simulator, "id", "simulator question");
uniqCheck(labs, "id", "lab");
uniqCheck(flashcards, "id", "flashcard");
uniqCheck(glossary, "id", "glossary term");
uniqCheck(coverage, "id", "coverage row");
uniqCheck(templateLibrary.sections, "id", "template library section");
uniqCheck(templateLibrary.templates, "id", "template library template");

const templateSectionIds = new Set(templateLibrary.sections.map((section) => section.id));
for (const template of templateLibrary.templates) {
  requireText(template.title, `template ${template.id}`, "title");
  requireText(template.filePath, `template ${template.id}`, "filePath");
  requireText(template.goal, `template ${template.id}`, "goal");
  requireText(template.suggestedUse, `template ${template.id}`, "suggestedUse");
  requireArray(template.placeholders, `template ${template.id}`, "placeholders", 3);
  requireArray(template.expectations, `template ${template.id}`, "expectations", 2);
  if (!templateSectionIds.has(template.sectionId)) fail(`template ${template.id} references unknown section ${template.sectionId}`);
  if (!fs.existsSync(path.join(root, template.filePath))) fail(`template ${template.id} file does not exist: ${template.filePath}`);
}

for (const [id, title, weight] of expectedDomains) {
  const domain = domainMap.get(id);
  if (!domain) fail(`Official domain ${id} is missing from examBlueprint.json`);
  if (domain && domain.title !== title) fail(`${id} title mismatch: expected "${title}", found "${domain.title}"`);
  if (domain && domain.weight !== weight) fail(`${id} weight mismatch: expected ${weight}, found ${domain.weight}`);
}

for (const source of sources) {
  requireText(source.title, `source ${source.id}`, "title");
  requireText(source.publisher, `source ${source.id}`, "publisher");
  requireText(source.why, `source ${source.id}`, "why");
  if (!/^https:\/\/[^\s]+$/i.test(source.url || "")) fail(`source ${source.id} has an invalid or non-HTTPS URL`);
  requireArray(source.domains, `source ${source.id}`, "domains");
  for (const domainId of source.domains || []) checkDomain(domainId, `source ${source.id}`);
}

const officialSkills = collectOfficialSkills();
const officialSkillKey = new Set(officialSkills.map((item) => `${item.domainId}::${item.skill}`));
const coverageSkillKey = new Set(coverage.map((row) => `${row.domainId}::${row.skill}`));
for (const skill of officialSkills) {
  if (!coverageSkillKey.has(`${skill.domainId}::${skill.skill}`)) {
    fail(`coverageMatrix.json is missing official skill "${skill.skill}" in ${skill.domainId}`);
  }
}

for (const row of coverage) {
  checkAccuracyMetadata(row, `coverage ${row.id}`);
  checkDomain(row.domainId, `coverage ${row.id}`);
  if (!officialSkillKey.has(`${row.domainId}::${row.skill}`)) {
    fail(`coverage ${row.id} does not match an official blueprint skill: ${row.skill}`);
  }
  requireArray(row.lessonIds, `coverage ${row.id}`, "lessonIds");
  requireArray(row.quizQuestionIds, `coverage ${row.id}`, "quizQuestionIds");
  requireArray(row.labIds, `coverage ${row.id}`, "labIds");
  requireArray(row.flashcardIds, `coverage ${row.id}`, "flashcardIds");
  checkSourceIds(row.sourceIds, `coverage ${row.id}`);
  requireText(row.revisionNote, `coverage ${row.id}`, "revisionNote");
  if (!["Complete", "Covered"].includes(row.coverageStatus)) fail(`coverage ${row.id} is not marked covered`);
  for (const id of row.lessonIds || []) if (!lessonMap.has(id)) fail(`coverage ${row.id} references unknown lesson ${id}`);
  for (const id of row.quizQuestionIds || []) if (!quizMap.has(id)) fail(`coverage ${row.id} references unknown quiz question ${id}`);
  for (const id of row.labIds || []) if (!labMap.has(id)) fail(`coverage ${row.id} references unknown lab ${id}`);
  for (const id of row.flashcardIds || []) if (!flashcardMap.has(id)) fail(`coverage ${row.id} references unknown flashcard ${id}`);
}

for (const lesson of lessons) {
  checkAccuracyMetadata(lesson, `lesson ${lesson.id}`);
  checkDomain(lesson.domainId, `lesson ${lesson.id}`);
  requireText(lesson.title, `lesson ${lesson.id}`, "title");
  requireText(lesson.officialSkill, `lesson ${lesson.id}`, "officialSkill");
  requireText(lesson.whyExam, `lesson ${lesson.id}`, "whyExam");
  requireArray(lesson.core, `lesson ${lesson.id}`, "core", 2);
  requireText(lesson.githubDetail, `lesson ${lesson.id}`, "githubDetail");
  requireText(lesson.practicalExample, `lesson ${lesson.id}`, "practicalExample");
  requireText(lesson.examTrap, `lesson ${lesson.id}`, "examTrap");
  if (!lesson.scenario || typeof lesson.scenario !== "object") fail(`lesson ${lesson.id} is missing scenario`);
  if (lesson.scenario) {
    requireText(lesson.scenario.title, `lesson ${lesson.id} scenario`, "title");
    requireText(lesson.scenario.body, `lesson ${lesson.id} scenario`, "body");
  }
  requireArray(lesson.takeaways, `lesson ${lesson.id}`, "takeaways", 3);
  requireArray(lesson.revisionQuestions, `lesson ${lesson.id}`, "revisionQuestions", 3);
  requireText(lesson.actionOverview, `lesson ${lesson.id}`, "actionOverview");
  requireArray(lesson.actionSteps, `lesson ${lesson.id}`, "actionSteps", 6);
  requireArray(lesson.filesToCreate, `lesson ${lesson.id}`, "filesToCreate", 3);
  for (const artifact of lesson.filesToCreate || []) {
    requireText(artifact.path, `lesson ${lesson.id} artifact`, "path");
    requireText(artifact.purpose, `lesson ${lesson.id} artifact ${artifact.path || ""}`, "purpose");
  }
  requireText(lesson.agentRequestTemplate, `lesson ${lesson.id}`, "agentRequestTemplate");
  requireArray(lesson.enterpriseChecklist, `lesson ${lesson.id}`, "enterpriseChecklist", 4);
  requireArray(lesson.whatNotToDo, `lesson ${lesson.id}`, "whatNotToDo", 3);
  requireArray(lesson.examActionDrill, `lesson ${lesson.id}`, "examActionDrill", 3);
  requireArray(lesson.keyTerms, `lesson ${lesson.id}`, "keyTerms", 3);
  checkSourceIds(lesson.sourceIds, `lesson ${lesson.id}`);
}

function checkQuestion(question, context, allowNullLesson = false) {
  checkAccuracyMetadata(question, context);
  checkDomain(question.domainId, context);
  requireText(question.question, context, "question");
  requireArray(question.options, context, "options", 4);
  if (question.options?.length !== 4) fail(`${context} must have exactly 4 options`);
  if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex > 3) {
    fail(`${context} has invalid correctIndex`);
  }
  requireText(question.correctExplanation, context, "correctExplanation");
  requireArray(question.wrongRationales, context, "wrongRationales", 3);
  const wrongIndexes = new Set((question.wrongRationales || []).map((item) => item.optionIndex));
  for (let index = 0; index < 4; index += 1) {
    if (index !== question.correctIndex && !wrongIndexes.has(index)) {
      fail(`${context} is missing wrong-answer rationale for option ${index}`);
    }
  }
  for (const rationale of question.wrongRationales || []) {
    if (rationale.optionIndex === question.correctIndex) fail(`${context} has a wrong rationale for the correct option`);
    requireText(rationale.rationale, `${context} option ${rationale.optionIndex}`, "rationale");
  }
  checkSourceIds(question.sourceIds, context);
  requireText(question.examTrap, context, "examTrap");
  if (!allowNullLesson && !lessonMap.has(question.lessonId)) fail(`${context} references unknown lesson ${question.lessonId}`);
}

for (const question of quizzes) checkQuestion(question, `quiz ${question.id}`);
for (const question of simulator) {
  checkQuestion(question, `simulator ${question.id}`, true);
  requireText(question.scenario, `simulator ${question.id}`, "scenario");
  requireText(question.form, `simulator ${question.id}`, "form");
}

for (const lab of labs) {
  checkAccuracyMetadata(lab, `lab ${lab.id}`);
  checkDomain(lab.domainId, `lab ${lab.id}`);
  requireText(lab.title, `lab ${lab.id}`, "title");
  requireText(lab.objective, `lab ${lab.id}`, "objective");
  requireArray(lab.skillIds, `lab ${lab.id}`, "skillIds");
  requireArray(lab.requiredTools, `lab ${lab.id}`, "requiredTools");
  requireText(lab.setup, `lab ${lab.id}`, "setup");
  requireArray(lab.steps, `lab ${lab.id}`, "steps", 4);
  requireText(lab.expectedResult, `lab ${lab.id}`, "expectedResult");
  requireText(lab.validation, `lab ${lab.id}`, "validation");
  requireText(lab.commonFailure, `lab ${lab.id}`, "commonFailure");
  requireText(lab.recovery, `lab ${lab.id}`, "recovery");
  requireText(lab.examRelevance, `lab ${lab.id}`, "examRelevance");
  checkSourceIds(lab.sourceIds, `lab ${lab.id}`);
}

for (const card of flashcards) {
  checkAccuracyMetadata(card, `flashcard ${card.id}`);
  checkDomain(card.domainId, `flashcard ${card.id}`);
  requireText(card.front, `flashcard ${card.id}`, "front");
  requireText(card.back, `flashcard ${card.id}`, "back");
  requireText(card.skillId, `flashcard ${card.id}`, "skillId");
  checkSourceIds(card.sourceIds, `flashcard ${card.id}`);
}

for (const term of glossary) {
  checkAccuracyMetadata(term, `glossary ${term.id}`);
  requireText(term.term, `glossary ${term.id}`, "term");
  requireText(term.definition, `glossary ${term.id}`, "definition");
  requireArray(term.domainIds, `glossary ${term.id}`, "domainIds");
  for (const domainId of term.domainIds || []) checkDomain(domainId, `glossary ${term.id}`);
  for (const lessonId of term.relatedLessons || []) if (!lessonMap.has(lessonId)) fail(`glossary ${term.id} references unknown lesson ${lessonId}`);
  checkSourceIds(term.sourceIds, `glossary ${term.id}`);
}

for (const scenario of scenarios) {
  checkAccuracyMetadata(scenario, `scenario ${scenario.id}`);
  checkDomain(scenario.domainId, `scenario ${scenario.id}`);
  requireText(scenario.title, `scenario ${scenario.id}`, "title");
  requireText(scenario.prompt, `scenario ${scenario.id}`, "prompt");
  requireText(scenario.goodAnswer, `scenario ${scenario.id}`, "goodAnswer");
  requireText(scenario.trap, `scenario ${scenario.id}`, "trap");
  if (!lessonMap.has(scenario.lessonId)) fail(`scenario ${scenario.id} references unknown lesson ${scenario.lessonId}`);
  checkSourceIds(scenario.sourceIds, `scenario ${scenario.id}`);
}

for (const exam of mockExams) {
  checkAccuracyMetadata(exam, `mock exam ${exam.id}`);
  requireText(exam.id, `mock exam`, "id");
  requireText(exam.title, `mock exam ${exam.id}`, "title");
  if (!Number.isInteger(exam.durationMinutes) || exam.durationMinutes < 1) fail(`mock exam ${exam.id} has invalid durationMinutes`);
  requireArray(exam.questionIds, `mock exam ${exam.id}`, "questionIds");
  for (const id of exam.questionIds || []) if (!quizMap.has(id)) fail(`mock exam ${exam.id} references unknown quiz question ${id}`);
}

const simulatorForms = new Map();
for (const question of simulator) {
  if (!simulatorForms.has(question.form)) simulatorForms.set(question.form, []);
  simulatorForms.get(question.form).push(question);
}
if (simulatorForms.size < 5) fail(`exam simulator should have at least 5 forms, found ${simulatorForms.size}`);
const expectedFormDistribution = {
  "domain-1": 10,
  "domain-2": 14,
  "domain-3": 8,
  "domain-4": 10,
  "domain-5": 10,
  "domain-6": 8
};
for (const [form, questions] of simulatorForms) {
  if (questions.length !== 60) fail(`${form} should have 60 questions, found ${questions.length}`);
  const domainCounts = {};
  const answerCounts = [0, 0, 0, 0];
  let longestCorrect = 0;
  for (const question of questions) {
    domainCounts[question.domainId] = (domainCounts[question.domainId] || 0) + 1;
    answerCounts[question.correctIndex] += 1;
    const lengths = question.options.map((option) => option.length);
    const longest = Math.max(...lengths);
    if (question.options[question.correctIndex].length === longest) longestCorrect += 1;
  }
  for (const [domainId, expected] of Object.entries(expectedFormDistribution)) {
    if ((domainCounts[domainId] || 0) !== expected) fail(`${form} has ${(domainCounts[domainId] || 0)} ${domainId} questions; expected ${expected}`);
  }
  if (Math.max(...answerCounts) - Math.min(...answerCounts) > 1) {
    fail(`${form} answer positions are imbalanced: ${answerCounts.join(", ")}`);
  }
  if (longestCorrect / questions.length > 0.35) {
    fail(`${form} has too many longest-option correct answers: ${longestCorrect}/${questions.length}`);
  }
}

requireArray(cramGuide.highYield, "cramGuide.json", "highYield", 5);
requireArray(cramGuide.decisionTables, "cramGuide.json", "decisionTables");
requireArray(cramGuide.cheatsheets, "cramGuide.json", "cheatsheets");
requireArray(studyPlans.sevenDay, "studyPlans.json", "sevenDay", 7);
requireArray(studyPlans.fourteenDay, "studyPlans.json", "fourteenDay", 14);
requireArray(studyPlans.thirtyDay, "studyPlans.json", "thirtyDay");

const summary = {
  sources: sources.length,
  blueprintDomains: blueprint.domains.length,
  officialSkills: officialSkills.length,
  coverageRows: coverage.length,
  lessons: lessons.length,
  lessonQuizQuestions: quizzes.length,
  simulatorQuestions: simulator.length,
  mockExams: mockExams.length,
  labs: labs.length,
  flashcards: flashcards.length,
  glossaryTerms: glossary.length,
  scenarios: scenarios.length,
  templateSections: templateLibrary.sections.length,
  templates: templateLibrary.templates.length,
  warnings: warnings.length,
  errors: errors.length
};

console.log(JSON.stringify(summary, null, 2));
if (warnings.length) {
  console.log("\nWarnings:");
  for (const item of warnings) console.log(`- ${item}`);
}
if (errors.length) {
  console.error("\nContent QA failed:");
  for (const item of errors.slice(0, 200)) console.error(`- ${item}`);
  if (errors.length > 200) console.error(`- ...and ${errors.length - 200} more`);
  process.exit(1);
}

console.log("\nContent QA passed.");
