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
const templateLibrary = readJson("templateLibrary.json");
const requiredLessonLabels = [
  "Official skill",
  "GitHub product behaviour",
  "Exam strategy",
  "Original teaching example",
  "Practical lab task",
  "What is different about this topic"
];
const allowedTopicSpecificCategories = new Set([
  "MCP and tool access",
  "Memory and state",
  "Responsible AI and guardrails",
  "Multi-agent coordination",
  "Evaluation and tuning",
  "Repository and branch governance",
  "Workflow execution",
  "Agent architecture and SDLC"
]);
const bannedGenericActionStepFragments = [
  "Name the allowed inputs, editable scope, denied scope",
  "Create or update",
  "so the rule is durable",
  "Add the human approval point",
  "Run or require the check",
  "Write the PR or handoff note"
];
const bannedGenericCoreFragments = [
  "Start by identifying the request, the execution boundary, the allowed tools or memory, the output artifact",
  "Wrong answers usually move too fast, grant broad autonomy, skip a plan or check",
  "The skill \"",
  "means turning an agent instruction into a concrete GitHub workflow decision"
];

const sourceMap = new Map(sources.map((source) => [source.id, source]));
const sourceStatusMap = new Map((sourceStatus.sources || []).map((source) => [source.id, source]));
const quizMap = new Map(quizzes.map((quiz) => [quiz.id, quiz]));
const labMap = new Map(labs.map((lab) => [lab.id, lab]));
const templatePathMap = new Map();
for (const template of templateLibrary.templates || []) {
  templatePathMap.set(template.filePath, template);
  for (const alias of template.aliases || []) templatePathMap.set(alias, template);
}
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
const expectedAuditKindCounts = {
  "worked-scenario": 50,
  "memory-state": 14,
  "risk-matrix": 14,
  "source-config": 9,
  "conflict-tree": 4,
  "evidence-thresholds": 8,
  "anti-pattern": 1,
  "tuning-before-after": 1
};
const domainArtifactPatterns = {
  "domain-1": /^(?:\.github\/ISSUE_TEMPLATE\/agent-task\.yml|docs\/agent-task-contract\.md|docs\/agent-step-map\.md|docs\/agent-anti-pattern-review\.md|docs\/agent-plan\.md|\.github\/pull_request_template\.md|\.github\/CODEOWNERS|docs\/agent-approval-gates\.md|docs\/agent-handoff\.md)$/,
  "domain-2": /^(?:docs\/agent-tool-permission-matrix\.md|docs\/mcp-tool-policy\.md|docs\/agent-mcp-server-review\.md|docs\/mcp-allowlist-decision\.md|docs\/environment-constraints\.md|docs\/branch-scope-control\.md|docs\/escalation-paths\.md|\.github\/workflows\/copilot-setup-steps\.yml|\.github\/workflows\/agent-validation\.yml)$/,
  "domain-3": /^(?:docs\/agent-memory-policy\.md|docs\/agent-state\.md|docs\/resume-checkpoint\.md|docs\/stale-context-checklist\.md|docs\/decision-log\.md|docs\/context-handoff\.md)$/,
  "domain-4": /^(?:docs\/agent-evaluation-plan\.md|\.github\/workflows\/agent-validation\.yml|docs\/security-scan-evidence\.md|docs\/agent-failure-analysis\.md|docs\/error-analysis\.md|docs\/tuning-log\.md|docs\/regression-checklist\.md|docs\/agent-trace-review\.md)$/,
  "domain-5": /^(?:docs\/agent-roles\.md|docs\/multi-agent-plan\.md|docs\/multi-agent-handoff-contract\.md|docs\/conflict-log\.md|docs\/multi-agent-arbitration-record\.md|docs\/duplicate-effort-checklist\.md|docs\/recovery-plan\.md|docs\/agent-lifecycle-record\.md)$/,
  "domain-6": /^(?:docs\/autonomy-matrix\.md|docs\/guardrails\.md|docs\/approval-policy\.md|docs\/responsible-ai-risk-review\.md|docs\/least-privilege-access-review\.md|docs\/sensitive-action-control\.md|docs\/policy-violation-record\.md|docs\/audit-trail\.md|docs\/agent-tool-permission-matrix\.md|docs\/environment-constraints\.md)$/
};
const requiredUiConfigLessonIds = new Set([
  "domain-1-lesson-04-configure-agent-planning-to-be-distinct-from-agent-execution",
  "domain-1-lesson-05-configure-an-agent-to-output-a-structured-plan",
  "domain-1-lesson-08-plan-and-implement-the-degree-of-agent-autonomy-including-guardrails",
  "domain-1-lesson-09-configure-agent-to-produce-inspectable-artifacts-within-standard-development-too",
  "domain-1-lesson-10-configure-human-intervention-for-autonomous-agents-without-slowing-delivery",
  "domain-1-lesson-15-repository-custom-instructions-as-governance",
  "domain-2-lesson-02-configure-agent-tools",
  "domain-2-lesson-03-configure-agent-tool-permissions",
  "domain-2-lesson-04-add-an-mcp-server-as-a-tool-to-an-agent",
  "domain-2-lesson-05-configure-a-github-remote-mcp-server",
  "domain-2-lesson-06-configure-the-mcp-registries",
  "domain-2-lesson-07-configure-mcp-allow-lists",
  "domain-2-lesson-09-configure-an-agent-s-scope-to-a-specific-repository",
  "domain-2-lesson-10-configure-an-agent-to-be-invoked-in-a-ci-workflow",
  "domain-2-lesson-11-configure-an-agent-to-use-branch-based-scope",
  "domain-2-lesson-12-enable-an-agent-to-perform-autonomous-actions-including-creating-branches-and-pu",
  "domain-2-lesson-13-configure-an-agent-to-handle-environment-specific-constraints",
  "domain-2-lesson-14-implement-error-handling",
  "domain-2-lesson-15-implement-retries",
  "domain-2-lesson-16-implement-rollbacks",
  "domain-2-lesson-17-implement-escalation-paths",
  "domain-2-lesson-18-implement-traceability-and-accountability-for-agent-actions",
  "domain-2-lesson-21-github-mcp-server-default-toolsets",
  "domain-2-lesson-22-remote-mcp-server-versus-local-mcp-server",
  "domain-2-lesson-23-playwright-mcp-in-agent-validation",
  "domain-2-lesson-24-repository-level-mcp-configuration",
  "domain-5-lesson-02-configure-agent-isolation-for-parallel-execution",
  "domain-5-lesson-04-configure-multi-agent-workflows-to-produce-artifacts-suitable-for-review-and-aud",
  "domain-5-lesson-09-implement-multi-agent-recovery-patterns-including-rollback-and-human-in-the-loop",
  "domain-5-lesson-10-add-agents-to-existing-multi-agent-workflows",
  "domain-5-lesson-11-update-reconfigure-or-replace-agents-without-disrupting-active-workflows"
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

function checkWorkedExamQuestion(lesson, context) {
  const worked = lesson.workedExamQuestion;
  if (!worked || typeof worked !== "object") {
    fail(`${context} is missing workedExamQuestion`);
    return;
  }
  requireText(worked.title, context, "workedExamQuestion.title", 3);
  requireText(worked.scenario, context, "workedExamQuestion.scenario", 24);
  requireText(worked.question, context, "workedExamQuestion.question", 8);
  requireArray(worked.options, context, "workedExamQuestion.options", 4);
  for (const [index, option] of (worked.options || []).entries()) {
    requireText(option, `${context} workedExamQuestion.options[${index}]`, "option", 8);
  }
  if (!Number.isInteger(worked.correctIndex) || worked.correctIndex < 0 || worked.correctIndex >= (worked.options || []).length) {
    fail(`${context} workedExamQuestion.correctIndex must point to an option`);
  }
  requireText(worked.strongAnswer, context, "workedExamQuestion.strongAnswer", 22);
  requireArray(worked.whyWrong, context, "workedExamQuestion.whyWrong", 3);
  for (const [index, item] of (worked.whyWrong || []).entries()) {
    if (!Number.isInteger(item?.optionIndex)) fail(`${context} workedExamQuestion.whyWrong[${index}] is missing optionIndex`);
    requireText(item?.rationale, `${context} workedExamQuestion.whyWrong[${index}]`, "rationale", 10);
  }
}

function checkTeachingTable(lesson, context) {
  const table = lesson.teachingTable;
  if (!table || typeof table !== "object") {
    fail(`${context} is missing teachingTable`);
    return;
  }
  requireText(table.title, context, "teachingTable.title", 2);
  requireText(table.intro, context, "teachingTable.intro", 12);
  requireArray(table.columns, context, "teachingTable.columns", 4);
  requireArray(table.rows, context, "teachingTable.rows", 4);
  for (const [index, column] of (table.columns || []).entries()) {
    requireText(column, `${context} teachingTable.columns[${index}]`, "column", 1);
  }
  for (const [rowIndex, row] of (table.rows || []).entries()) {
    if (!Array.isArray(row)) {
      fail(`${context} teachingTable.rows[${rowIndex}] must be an array`);
      continue;
    }
    if (row.length !== (table.columns || []).length) {
      fail(`${context} teachingTable.rows[${rowIndex}] must match teachingTable.columns length`);
    }
    for (const [cellIndex, cell] of row.entries()) {
      requireText(cell, `${context} teachingTable.rows[${rowIndex}][${cellIndex}]`, "cell", 1);
    }
  }
}

function checkUiConfigExample(lesson, context) {
  const ui = lesson.uiConfigExample;
  if (!ui || typeof ui !== "object") {
    fail(`${context} is missing required uiConfigExample`);
    return;
  }
  requireText(ui.title, context, "uiConfigExample.title", 3);
  requireText(ui.intro, context, "uiConfigExample.intro", 16);
  requireArray(ui.steps, context, "uiConfigExample.steps", 4);
  for (const [index, step] of (ui.steps || []).entries()) {
    requireText(step, `${context} uiConfigExample.steps[${index}]`, "step", 12);
  }
  requireText(ui.expectedEvidence, context, "uiConfigExample.expectedEvidence", 18);
  requireArray(ui.sourceNotes, context, "uiConfigExample.sourceNotes", 2);
}

function checkTopicSpecificExplanation(lesson, context) {
  const item = lesson.topicSpecificExplanation;
  if (!item || typeof item !== "object") {
    fail(`${context} is missing topicSpecificExplanation`);
    return;
  }
  requireText(item.title, context, "topicSpecificExplanation.title", 5);
  requireText(item.category, context, "topicSpecificExplanation.category", 2);
  if (!allowedTopicSpecificCategories.has(item.category)) {
    fail(`${context} topicSpecificExplanation.category ${item.category} is not recognized`);
  }
  requireArray(item.paragraphs, context, "topicSpecificExplanation.paragraphs", 3);
  for (const [index, paragraph] of (item.paragraphs || []).entries()) {
    requireText(paragraph, `${context} topicSpecificExplanation.paragraphs[${index}]`, "paragraph", 18);
  }
  requireArray(item.distinctions, context, "topicSpecificExplanation.distinctions", 3);
  for (const [index, distinction] of (item.distinctions || []).entries()) {
    requireText(distinction, `${context} topicSpecificExplanation.distinctions[${index}]`, "distinction", 8);
  }
  requireText(item.examConnection, context, "topicSpecificExplanation.examConnection", 18);
}

function checkPracticalLabTask(lesson, context) {
  const task = lesson.practicalLabTask;
  if (!task || typeof task !== "object") {
    fail(`${context} is missing practicalLabTask`);
    return;
  }
  requireText(task.title, context, "practicalLabTask.title", 3);
  requireText(task.category, context, "practicalLabTask.category", 2);
  if (!allowedTopicSpecificCategories.has(task.category)) {
    fail(`${context} practicalLabTask.category ${task.category} is not recognized`);
  }
  requireText(task.objective, context, "practicalLabTask.objective", 16);
  requireArray(task.steps, context, "practicalLabTask.steps", 5);
  for (const [index, step] of (task.steps || []).entries()) {
    requireText(step, `${context} practicalLabTask.steps[${index}]`, "step", 12);
    for (const fragment of bannedGenericActionStepFragments) {
      if (step.includes(fragment)) fail(`${context} practicalLabTask.steps[${index}] still contains generic step fragment "${fragment}"`);
    }
  }
  requireText(task.deliverable, context, "practicalLabTask.deliverable", 12);
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

function pathMatchesDomain(domainId, artifactPath) {
  return domainArtifactPatterns[domainId]?.test(artifactPath);
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
  for (const [index, step] of (lesson.actionSteps || []).entries()) {
    requireText(step, `${context} actionSteps[${index}]`, "step", 12);
    for (const fragment of bannedGenericActionStepFragments) {
      if (step.includes(fragment)) fail(`${context} actionSteps[${index}] still contains generic step fragment "${fragment}"`);
    }
  }
  const coreText = (lesson.core || []).join(" ");
  for (const fragment of bannedGenericCoreFragments) {
    if (coreText.includes(fragment)) fail(`${context} core still contains generic explanation fragment "${fragment}"`);
  }
  requireArray(lesson.filesToCreate, context, "filesToCreate", 5);
  const artifactPaths = (lesson.filesToCreate || []).map((artifact) => artifact.path);
  if (artifactPaths.length === 1 && artifactPaths[0] === ".github/ISSUE_TEMPLATE/agent-task.yml") {
    fail(`${context} uses only the generic issue template`);
  }
  if (!artifactPaths.some((artifactPath) => pathMatchesDomain(lesson.domainId, artifactPath))) {
    fail(`${context} does not include a domain-specific template recommendation`);
  }
  if (/branch(?:-| )based|branch scope|specific repository|autonomous pr|creating branches/i.test(lesson.title) && !/mcp/i.test(lesson.title)) {
    if (artifactPaths.includes("docs/mcp-tool-policy.md")) {
      fail(`${context} is branch/repository-scope focused but recommends MCP policy as a primary artifact`);
    }
    if (!artifactPaths.includes("docs/branch-scope-control.md")) {
      fail(`${context} should recommend docs/branch-scope-control.md for branch or repository scope`);
    }
  }
  if (/mcp|toolset|allow-?list|registry|remote server|local server/i.test(lesson.title)) {
    if (!artifactPaths.includes("docs/mcp-tool-policy.md") && !artifactPaths.includes("docs/agent-mcp-server-review.md")) {
      fail(`${context} is MCP-focused but lacks an MCP template recommendation`);
    }
  }
  for (const artifactPath of artifactPaths) {
    if (!templatePathMap.has(artifactPath)) {
      fail(`${context} artifact ${artifactPath} does not resolve to a template library path or alias`);
    }
  }
  requireText(lesson.agentRequestTemplate, context, "agentRequestTemplate", 35);
  requireArray(lesson.enterpriseChecklist, context, "enterpriseChecklist", 5);
  requireArray(lesson.whatNotToDo, context, "whatNotToDo", 3);
  requireArray(lesson.examActionDrill, context, "examActionDrill", 3);
  requireArray(lesson.keyTerms, context, "keyTerms", 5);

  if (!lesson.auditRecommendation || typeof lesson.auditRecommendation !== "object") {
    fail(`${context} is missing auditRecommendation`);
  } else {
    requireText(lesson.auditRecommendation.reviewedAt, context, "auditRecommendation.reviewedAt", 1);
    requireText(lesson.auditRecommendation.kind, context, "auditRecommendation.kind", 1);
    requireText(lesson.auditRecommendation.recommendation, context, "auditRecommendation.recommendation", 6);
    if (!Object.hasOwn(expectedAuditKindCounts, lesson.auditRecommendation.kind)) {
      fail(`${context} auditRecommendation.kind ${lesson.auditRecommendation.kind} is not recognized`);
    }
  }

  checkWorkedExamQuestion(lesson, context);
  checkTeachingTable(lesson, context);
  checkTopicSpecificExplanation(lesson, context);
  if (lesson.topicSpecificExplanation?.category === "Responsible AI and guardrails" && /memory and state/i.test(lesson.teachingTable?.title || "")) {
    fail(`${context} is a Responsible AI lesson but renders a memory/state teaching table`);
  }
  if (lesson.domainId === "domain-6" && lesson.auditRecommendation?.kind === "memory-state") {
    fail(`${context} is a Domain 6 guardrail lesson but is tagged as memory-state`);
  }
  checkPracticalLabTask(lesson, context);
  if (requiredUiConfigLessonIds.has(lesson.id) || lesson.auditRecommendation?.kind === "source-config") {
    checkUiConfigExample(lesson, context);
  } else if (lesson.uiConfigExample) {
    checkUiConfigExample(lesson, context);
  }

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
checkNoDuplicate(
  "lesson action step",
  finalLessons.flatMap((lesson) => (lesson.actionSteps || []).map((step, index) => [`lesson ${lesson.id} actionSteps[${index}]`, step]))
);
checkNoDuplicate(
  "lesson practical lab task step",
  finalLessons.flatMap((lesson) => (lesson.practicalLabTask?.steps || []).map((step, index) => [`lesson ${lesson.id} practicalLabTask.steps[${index}]`, step]))
);

for (const file of ["src/main.jsx", "scripts/generate-seo-pages.mjs"]) {
  const content = fs.readFileSync(path.join(root, file), "utf8");
  for (const label of requiredLessonLabels) {
    if (!content.includes(label)) fail(`${file} must render required lesson label "${label}"`);
  }
}

const auditKindCounts = finalLessons.reduce((counts, lesson) => {
  const kind = lesson.auditRecommendation?.kind || "missing";
  counts[kind] = (counts[kind] || 0) + 1;
  return counts;
}, {});
for (const [kind, expected] of Object.entries(expectedAuditKindCounts)) {
  if ((auditKindCounts[kind] || 0) !== expected) {
    fail(`audit recommendation kind ${kind} expected ${expected}, found ${auditKindCounts[kind] || 0}`);
  }
}
for (const kind of Object.keys(auditKindCounts)) {
  if (!Object.hasOwn(expectedAuditKindCounts, kind)) fail(`unexpected audit recommendation kind ${kind}`);
}

const summary = {
  finalLessons: finalLessons.length,
  goldLabs: labs.filter((lab) => lab.qualityTier === "gold").length,
  checkedQuizQuestions: relatedQuizIds.length,
  auditKindCounts,
  uiConfigExamples: finalLessons.filter((lesson) => lesson.uiConfigExample).length,
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
