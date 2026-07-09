import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "src", "data");

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
}

const lessons = readJson("lessons.json");
const labs = readJson("labs.json");
const scenarios = readJson("scenarios.json");
const quizzes = readJson("quizzes.json");
const flashcards = readJson("flashcards.json");
const sources = readJson("sources.json");
const templateLibrary = readJson("templateLibrary.json");

const sourceIds = new Set(sources.map((source) => source.id));
const lessonMap = new Map(lessons.map((lesson) => [lesson.id, lesson]));
const labMap = new Map(labs.map((lab) => [lab.id, lab]));
const scenarioMap = new Map(scenarios.map((scenario) => [scenario.lessonId, scenario]));
const quizMap = new Map(quizzes.map((quiz) => [quiz.id, quiz]));
const templatePathMap = new Map();
for (const template of templateLibrary.templates || []) {
  templatePathMap.set(template.filePath, template);
  for (const alias of template.aliases || []) templatePathMap.set(alias, template);
}

const targets = {
  "domain-1-lesson-04-configure-agent-planning-to-be-distinct-from-agent-execution": {
    artifacts: ["docs/agent-plan.md", "docs/agent-plan-approval-record.md", "docs/agent-step-map.md"],
    terms: ["planning", "approval", "execution", "evidence", "write-capable", "pull request"],
    sources: ["ms-gh600-guide", "ms-agent-architecture-sdlc", "gh-copilot-cloud-agent"]
  },
  "domain-1-lesson-09-configure-agent-to-produce-inspectable-artifacts-within-standard-development-too": {
    artifacts: [".github/pull_request_template.md", "docs/pr-evidence-table.md", "docs/workflow-evidence-record.md", "docs/audit-trail.md"],
    terms: ["PR", "workflow run", "check", "review", "rollback", "audit"],
    sources: ["ms-gh600-guide", "gh-actions-workflows", "gh-codeowners"]
  },
  "domain-1-lesson-10-configure-human-intervention-for-autonomous-agents-without-slowing-delivery": {
    artifacts: ["docs/approval-policy.md", "docs/autonomy-matrix.md", "docs/sensitive-action-control.md"],
    terms: ["autonomous", "review", "explicit approval", "blocked", "risk", "human"],
    sources: ["ms-gh600-guide", "ms-responsible-ai-principles", "gh-cloud-agent-risks"]
  },
  "domain-1-lesson-11-agentic-workflows-versus-ordinary-automation": {
    artifacts: ["docs/agentic-vs-automation-decision-table.md"],
    terms: ["deterministic", "automation", "agentic", "uncertainty", "stop condition"],
    sources: ["ms-gh600-guide", "gh-agentic-workflows", "gh-actions-workflows"]
  },
  "domain-2-lesson-08-evaluate-the-execution-context-for-an-agent": {
    artifacts: ["docs/execution-context-checklist.md", "docs/agent-tool-permission-matrix.md", "docs/environment-constraints.md"],
    terms: ["repository", "branch", "runner", "token", "secret", "environment", "MCP", "approval"],
    sources: ["ms-gh600-guide", "ms-tooling-mcp-envs", "gh-actions-workflows", "gh-copilot-setup-steps"]
  },
  "domain-2-lesson-20-tool-risk-classification": {
    artifacts: ["docs/tool-risk-classification.md", "docs/agent-tool-permission-matrix.md", "docs/mcp-tool-policy.md"],
    terms: ["read-only", "write-capable", "privileged", "secret", "production", "irreversible", "rollback"],
    sources: ["ms-gh600-guide", "ms-tooling-mcp-envs", "gh-mcp-toolsets", "gh-mcp-server-access"]
  },
  "domain-2-lesson-28-traceability-through-session-logs-and-audit-evidence": {
    artifacts: ["docs/agent-session-log-review.md", "docs/audit-trail.md", "docs/pr-evidence-table.md"],
    terms: ["session log", "issue timeline", "commits", "workflow run", "review comments", "rollback"],
    sources: ["ms-gh600-guide", "gh-copilot-cloud-agent", "gh-actions-workflows"]
  },
  "domain-3-lesson-13-memory-reset-and-expiry-decisions": {
    artifacts: ["docs/memory-reset-decision.md", "docs/agent-memory-policy.md", "docs/stale-context-checklist.md"],
    terms: ["preserve", "prune", "expire", "reset", "stale", "sensitive"],
    sources: ["ms-gh600-guide", "ms-agentic-foundations", "gh-copilot-memory"]
  },
  "domain-4-lesson-06-classify-root-causes-including-reasoning-errors-tool-misuse-and-context-or-envir": {
    artifacts: ["docs/root-cause-classification.md", "docs/agent-failure-analysis.md"],
    terms: ["reasoning", "instruction", "missing context", "stale context", "tool misuse", "permission", "environment", "threshold"],
    sources: ["ms-gh600-guide", "ms-foundry-responsible-ai", "gh-actions-workflows"]
  },
  "domain-4-lesson-10-static-analysis-codeql-secret-scanning-dependency-checks": {
    artifacts: ["docs/security-scan-evidence.md", "docs/regression-checklist.md"],
    terms: ["CodeQL", "code scanning", "secret scanning", "dependency review", "failed check", "remediation", "regression"],
    sources: ["gh-code-scanning", "gh-codeql-code-scanning", "gh-secret-scanning", "gh-dependency-review", "gh-dependency-review-action"]
  },
  "domain-4-lesson-11-accessibility-scans-as-evaluation-signals": {
    artifacts: ["docs/accessibility-scan-evidence.md", "docs/agent-evaluation-plan.md"],
    terms: ["accessibility", "automated", "manual", "keyboard", "limitations", "owner decision"],
    sources: ["ms-accessibility-evaluation-testing", "ms-accessibility-testing", "ms-edge-accessibility-testing"]
  },
  "domain-6-lesson-05-scope-permissions-and-execution-contexts-to-enforce-least-privilege-access": {
    artifacts: ["docs/least-privilege-access-review.md", "docs/agent-tool-permission-matrix.md", "docs/approval-policy.md"],
    terms: ["repository", "branch", "workflow", "token", "secret", "environment", "MCP", "least privilege", "audit"],
    sources: ["ms-gh600-guide", "ms-tooling-mcp-envs", "ms-responsible-ai-principles", "gh-mcp-server-access"]
  }
};

const bannedGenericFragments = [
  "make it scoped",
  "keep it safe",
  "follow governance",
  "ensure accountability",
  "make the work traceable",
  "use GitHub controls",
  "use controls and evidence to govern the agent",
  "A team wants an agent to handle"
];

const requiredNewArtifacts = [
  "docs/agent-plan-approval-record.md",
  "docs/pr-evidence-table.md",
  "docs/workflow-evidence-record.md",
  "docs/agentic-vs-automation-decision-table.md",
  "docs/execution-context-checklist.md",
  "docs/tool-risk-classification.md",
  "docs/agent-session-log-review.md",
  "docs/memory-reset-decision.md",
  "docs/root-cause-classification.md",
  "docs/accessibility-scan-evidence.md"
];

const errors = [];

function fail(message) {
  errors.push(message);
}

function text(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(text).join(" ");
  if (typeof value === "object") return Object.values(value).map(text).join(" ");
  return String(value);
}

function normalized(value) {
  return text(value).toLowerCase().replace(/\s+/g, " ").trim();
}

function requireIncludes(haystack, needle, context) {
  if (!normalized(haystack).includes(needle.toLowerCase())) fail(`${context} must include "${needle}"`);
}

function checkNoDuplicate(label, entries) {
  const seen = new Map();
  for (const [context, value] of entries) {
    const key = normalized(value);
    if (!key) continue;
    if (seen.has(key)) fail(`${context} duplicates ${label} from ${seen.get(key)}`);
    else seen.set(key, context);
  }
}

for (const artifactPath of requiredNewArtifacts) {
  if (!templatePathMap.has(artifactPath)) fail(`template library missing ${artifactPath}`);
  if (!fs.existsSync(path.join(root, artifactPath))) fail(`template markdown file missing ${artifactPath}`);
}

for (const [lessonId, requirement] of Object.entries(targets)) {
  const lesson = lessonMap.get(lessonId);
  if (!lesson) {
    fail(`missing targeted lesson ${lessonId}`);
    continue;
  }

  const lessonText = text(lesson);
  for (const fragment of bannedGenericFragments) {
    if (lessonText.includes(fragment)) fail(`${lessonId} still contains generic fragment "${fragment}"`);
  }

  const artifactPaths = (lesson.filesToCreate || []).map((artifact) => artifact.path);
  for (const artifactPath of requirement.artifacts) {
    if (!artifactPaths.includes(artifactPath)) fail(`${lessonId} missing required artifact ${artifactPath}`);
  }
  for (const artifactPath of artifactPaths) {
    if (!templatePathMap.has(artifactPath)) fail(`${lessonId} artifact ${artifactPath} has no template-library entry`);
  }
  for (const sourceId of requirement.sources) {
    if (!sourceIds.has(sourceId)) fail(`source ${sourceId} missing from sources.json`);
    if (!lesson.sourceIds?.includes(sourceId)) fail(`${lessonId} missing exact source ${sourceId}`);
  }
  for (const term of requirement.terms) {
    requireIncludes(lessonText, term, lessonId);
  }

  if (!lesson.workedExamQuestion?.scenario || !lesson.workedExamQuestion?.strongAnswer) fail(`${lessonId} missing worked exam example`);
  if (!lesson.practicalExample || normalized(lesson.practicalExample).length < 150) fail(`${lessonId} practicalExample is too thin`);
  if (!lesson.examTrap || normalized(lesson.examTrap).length < 40) fail(`${lessonId} examTrap is too thin`);
  if (!lesson.actionSteps?.some((step) => /create|inspect|record|approve|reject|rollback|escalate/i.test(step))) {
    fail(`${lessonId} lacks concrete learner action verbs`);
  }
  if (!/approval|approve|rollback|recovery|escalat|block/i.test(lessonText)) {
    fail(`${lessonId} lacks approval, rollback, recovery, or escalation point`);
  }

  const scenario = scenarioMap.get(lessonId);
  if (!scenario) fail(`${lessonId} missing linked scenario`);
  else {
    for (const term of requirement.terms.slice(0, 3)) requireIncludes(scenario, term, `scenario ${scenario.id}`);
  }

  for (const labId of lesson.relatedLabs || []) {
    const lab = labMap.get(labId);
    if (!lab) {
      fail(`${lessonId} references missing lab ${labId}`);
      continue;
    }
    requireIncludes(lab, requirement.artifacts[0], `lab ${labId}`);
    requireIncludes(lab, "reviewer", `lab ${labId}`);
    requireIncludes(lab, "evidence", `lab ${labId}`);
  }

  const relatedQuiz = lesson.relatedQuiz || [];
  if (relatedQuiz.length !== 5) fail(`${lessonId} must retain 5 linked quiz questions`);
  for (const quizId of relatedQuiz) {
    const quiz = quizMap.get(quizId);
    if (!quiz) {
      fail(`${lessonId} references missing quiz ${quizId}`);
      continue;
    }
    requireIncludes(quiz, requirement.artifacts[0], `quiz ${quizId}`);
    if (!quiz.wrongRationales || quiz.wrongRationales.length !== 3) fail(`quiz ${quizId} must explain all wrong answers`);
    if (!/trap|wrong|reject|fails|unsafe/i.test(text(quiz))) fail(`quiz ${quizId} does not test a tempting wrong choice`);
  }

  const cards = flashcards.filter((card) => card.skillId === lesson.skillId);
  if (cards.length < 3) fail(`${lessonId} needs at least 3 flashcards`);
  for (const card of cards.slice(0, 3)) {
    requireIncludes(card, requirement.artifacts[0], `flashcard ${card.id}`);
  }
}

checkNoDuplicate("scenario body", Object.keys(targets).map((id) => [`lesson ${id}`, lessonMap.get(id)?.scenario?.body]));
checkNoDuplicate("practicalExample", Object.keys(targets).map((id) => [`lesson ${id}`, lessonMap.get(id)?.practicalExample]));
checkNoDuplicate("examTrap", Object.keys(targets).map((id) => [`lesson ${id}`, lessonMap.get(id)?.examTrap]));

if (!fs.existsSync(path.join(root, "docs", "STRICT_AUDIT_REMEDIATION_REPORT.md"))) {
  fail("docs/STRICT_AUDIT_REMEDIATION_REPORT.md is missing");
}
if (!fs.existsSync(path.join(root, "docs", "STRICT_101_LESSON_QUALITY_AUDIT.md"))) {
  fail("docs/STRICT_101_LESSON_QUALITY_AUDIT.md is missing");
}

if (errors.length) {
  console.error("Remediation QA failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(JSON.stringify({
  remediatedLessonsChecked: Object.keys(targets).length,
  requiredArtifactsChecked: requiredNewArtifacts.length,
  status: "passed"
}, null, 2));
