import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "src", "data");

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
}

const lessons = readJson("lessons.json");
const quizzes = readJson("quizzes.json");
const labs = readJson("labs.json");
const sources = readJson("sources.json");
const sourceStatus = readJson("sourceStatus.json");

const sourceMap = new Map(sources.map((source) => [source.id, source]));
const sourceStatusMap = new Map((sourceStatus.sources || []).map((source) => [source.id, source]));
const quizMap = new Map(quizzes.map((quiz) => [quiz.id, quiz]));
const labMap = new Map(labs.map((lab) => [lab.id, lab]));
const finalLessons = lessons.filter((lesson) => lesson.accuracy?.verification === "human-reviewed");
const errors = [];
const broadSourceIds = new Set([
  "ms-gh600-guide",
  "ms-agentic-foundations",
  "ms-agent-architecture-sdlc",
  "ms-tooling-mcp-envs",
  "ms-responsible-ai-principles",
  "ms-foundry-responsible-ai"
]);

function fail(message) {
  errors.push(message);
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function words(value) {
  return text(value).split(/\s+/).filter(Boolean).length;
}

function requireText(value, context, field, minWords = 1) {
  if (!text(value)) {
    fail(`${context} is missing ${field}`);
    return;
  }
  if (words(value) < minWords) fail(`${context} ${field} is too thin: ${words(value)} words`);
}

function requireArray(value, context, field, minItems) {
  if (!Array.isArray(value) || value.length < minItems) {
    fail(`${context} needs ${field} with at least ${minItems} item(s)`);
  }
}

function normalized(value) {
  return text(value).toLowerCase().replace(/\s+/g, " ");
}

function checkNoDuplicate(fieldLabel, values) {
  const seen = new Map();
  for (const [context, value] of values) {
    const key = normalized(value);
    if (!key) continue;
    if (seen.has(key)) fail(`${context} duplicates ${fieldLabel} from ${seen.get(key)}`);
    else seen.set(key, context);
  }
}

function sourceTitles(ids) {
  return (ids || []).map((id) => sourceMap.get(id)?.title || "").join(" ");
}

function officialPublisher(source) {
  return /^(GitHub Docs|Microsoft Learn|Microsoft)$/i.test(source?.publisher || "");
}

function includesSpecificSource(lesson) {
  const titles = sourceTitles(lesson.sourceIds);
  return /GitHub Docs|Microsoft Learn|Responsible AI|Agentic Workflows|MCP|Copilot|Actions|rulesets|CODEOWNERS/i.test(titles);
}

for (const lesson of finalLessons) {
  const context = `lesson ${lesson.id}`;
  requireText(lesson.title, context, "title", 3);
  requireText(lesson.whyExam, context, "whyExam", 18);
  requireArray(lesson.plainLanguage, context, "plainLanguage", 2);
  for (const [index, paragraph] of (lesson.plainLanguage || []).entries()) {
    requireText(paragraph, `${context} plainLanguage[${index}]`, "paragraph", 18);
  }
  requireArray(lesson.core, context, "core", 5);
  for (const [index, paragraph] of (lesson.core || []).entries()) {
    requireText(paragraph, `${context} core[${index}]`, "paragraph", 16);
  }
  requireText(lesson.githubDetail, context, "githubDetail", 20);
  requireText(lesson.practicalExample, context, "practicalExample", 25);
  requireText(lesson.examTrap, context, "examTrap", 12);
  requireArray(lesson.takeaways, context, "takeaways", 4);
  requireArray(lesson.revisionQuestions, context, "revisionQuestions", 5);
  requireArray(lesson.actionSteps, context, "actionSteps", 7);
  requireArray(lesson.filesToCreate, context, "filesToCreate", 5);
  requireText(lesson.agentRequestTemplate, context, "agentRequestTemplate", 35);
  requireArray(lesson.enterpriseChecklist, context, "enterpriseChecklist", 5);
  requireArray(lesson.whatNotToDo, context, "whatNotToDo", 3);
  requireArray(lesson.examActionDrill, context, "examActionDrill", 3);
  requireArray(lesson.keyTerms, context, "keyTerms", 5);

  if (!lesson.sourceIds?.includes("ms-gh600-guide")) fail(`${context} must cite the official GH-600 study guide`);
  requireArray(lesson.sourceIds, context, "sourceIds", 5);
  for (const sourceId of lesson.sourceIds || []) {
    if (!sourceMap.has(sourceId)) fail(`${context} references unknown sourceId ${sourceId}`);
  }
  if (!includesSpecificSource(lesson)) fail(`${context} lacks lesson-specific Microsoft Learn or GitHub Docs support`);

  if (!lesson.documentationProfile || typeof lesson.documentationProfile !== "object") {
    fail(`${context} is missing documentationProfile`);
  } else {
    const profile = lesson.documentationProfile;
    if (profile.level !== "primary-source-pack") fail(`${context} documentationProfile.level must be primary-source-pack`);
    requireArray(profile.primarySourceIds, context, "documentationProfile.primarySourceIds", 5);
    requireArray(profile.selectionRationale, context, "documentationProfile.selectionRationale", 3);
    if (!profile.primarySourceIds?.includes("ms-gh600-guide")) {
      fail(`${context} documentationProfile.primarySourceIds must include ms-gh600-guide`);
    }
    const profileSources = (profile.primarySourceIds || []).map((id) => sourceMap.get(id)).filter(Boolean);
    for (const sourceId of profile.primarySourceIds || []) {
      if (!sourceMap.has(sourceId)) {
        fail(`${context} documentationProfile references unknown sourceId ${sourceId}`);
        continue;
      }
      if (!lesson.sourceIds?.includes(sourceId)) {
        fail(`${context} documentationProfile source ${sourceId} is not listed in lesson.sourceIds`);
      }
      const source = sourceMap.get(sourceId);
      if (!officialPublisher(source)) {
        fail(`${context} documentationProfile source ${sourceId} is not an official primary source`);
      }
      const status = sourceStatusMap.get(sourceId);
      if (!status) {
        fail(`${context} documentationProfile source ${sourceId} is missing source currentness metadata`);
      } else {
        if (status.status !== "reachable") fail(`${context} documentationProfile source ${sourceId} is not reachable`);
        if (status.reviewState !== "current") fail(`${context} documentationProfile source ${sourceId} review state is ${status.reviewState}`);
      }
    }
    if (!profileSources.some((source) => source.publisher === "GitHub Docs")) {
      fail(`${context} documentationProfile needs at least one GitHub Docs implementation source`);
    }
    if (!profileSources.some((source) => /Microsoft Learn|Microsoft/i.test(source.publisher))) {
      fail(`${context} documentationProfile needs at least one Microsoft exam, training, or responsible AI source`);
    }
    const topicSpecificCount = (profile.primarySourceIds || []).filter((id) => !broadSourceIds.has(id)).length;
    if (topicSpecificCount < 2) {
      fail(`${context} documentationProfile needs at least two topic-specific primary sources beyond broad exam/training docs`);
    }
    for (const [index, rationale] of (profile.selectionRationale || []).entries()) {
      requireText(rationale, `${context} documentationProfile.selectionRationale[${index}]`, "rationale", 12);
    }
  }

  if (!lesson.scenario || typeof lesson.scenario !== "object") {
    fail(`${context} is missing curated scenario`);
  } else {
    requireText(lesson.scenario.title, `${context} scenario`, "title", 3);
    requireText(lesson.scenario.body, `${context} scenario`, "body", 25);
    requireText(lesson.scenario.goodAnswer, `${context} scenario`, "goodAnswer", 20);
    requireText(lesson.scenario.trap, `${context} scenario`, "trap", 10);
    if (/The repository has protected branches, required CI, and a sensitive production area/i.test(lesson.scenario.body)) {
      fail(`${context} scenario still uses the generic protected-branches template`);
    }
  }

  requireArray(lesson.relatedLabs, context, "relatedLabs", 1);
  for (const labId of lesson.relatedLabs || []) {
    const lab = labMap.get(labId);
    if (!lab) {
      fail(`${context} references unknown related lab ${labId}`);
      continue;
    }
    if (lab.qualityTier !== "gold") fail(`${context} related lab ${labId} is not marked qualityTier gold`);
    if (!Array.isArray(lab.lessonIds) || !lab.lessonIds.includes(lesson.id)) {
      fail(`${context} related lab ${labId} does not declare lessonIds containing this lesson`);
    }
    requireText(lab.objective, `lab ${labId}`, "objective", 15);
    requireArray(lab.steps, `lab ${labId}`, "steps", 6);
    requireText(lab.expectedResult, `lab ${labId}`, "expectedResult", 18);
    requireText(lab.validation, `lab ${labId}`, "validation", 18);
    requireText(lab.commonFailure, `lab ${labId}`, "commonFailure", 12);
    requireText(lab.recovery, `lab ${labId}`, "recovery", 12);
  }

  if (!Array.isArray(lesson.relatedQuiz) || lesson.relatedQuiz.length !== 5) {
    fail(`${context} must have exactly 5 relatedQuiz IDs`);
  }
  for (const quizId of lesson.relatedQuiz || []) {
    const quiz = quizMap.get(quizId);
    if (!quiz) {
      fail(`${context} references unknown quiz ${quizId}`);
      continue;
    }
    if (quiz.lessonId !== lesson.id) fail(`${context} related quiz ${quizId} points to ${quiz.lessonId}`);
    if (/A team wants an agent to handle/i.test(quiz.question)) fail(`${context} quiz ${quizId} uses the old generic question pattern`);
    requireText(quiz.question, `quiz ${quizId}`, "question", 12);
    requireText(quiz.correctExplanation, `quiz ${quizId}`, "correctExplanation", 20);
    if (!Array.isArray(quiz.wrongRationales) || quiz.wrongRationales.length !== 3) {
      fail(`quiz ${quizId} must have 3 wrong rationales`);
    }
    for (const rationale of quiz.wrongRationales || []) {
      requireText(rationale.rationale, `quiz ${quizId} rationale ${rationale.optionIndex}`, "rationale", 12);
    }
  }
}

checkNoDuplicate("whyExam", finalLessons.map((lesson) => [`lesson ${lesson.id}`, lesson.whyExam]));
checkNoDuplicate("first core paragraph", finalLessons.map((lesson) => [`lesson ${lesson.id}`, lesson.core?.[0]]));
checkNoDuplicate("practicalExample", finalLessons.map((lesson) => [`lesson ${lesson.id}`, lesson.practicalExample]));
checkNoDuplicate("examTrap", finalLessons.map((lesson) => [`lesson ${lesson.id}`, lesson.examTrap]));
checkNoDuplicate("scenario body", finalLessons.map((lesson) => [`lesson ${lesson.id}`, lesson.scenario?.body]));
checkNoDuplicate("agentRequestTemplate", finalLessons.map((lesson) => [`lesson ${lesson.id}`, lesson.agentRequestTemplate]));

const relatedQuizIds = finalLessons.flatMap((lesson) => lesson.relatedQuiz || []);
checkNoDuplicate("related quiz reference", relatedQuizIds.map((id) => [`quiz reference ${id}`, id]));

const summary = {
  finalLessons: finalLessons.length,
  goldLabs: labs.filter((lab) => lab.qualityTier === "gold").length,
  checkedQuizQuestions: relatedQuizIds.length,
  errors: errors.length
};

console.log(JSON.stringify(summary, null, 2));
if (errors.length) {
  console.error("\nLesson quality QA failed:");
  for (const error of errors.slice(0, 200)) console.error(`- ${error}`);
  if (errors.length > 200) console.error(`- ...and ${errors.length - 200} more`);
  process.exit(1);
}

console.log("\nLesson quality QA passed.");
