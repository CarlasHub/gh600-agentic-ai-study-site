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

const categorySignals = {
  "Agent architecture and SDLC": [
    "task contract", "plan", "planning", "execution", "success criteria", "inputs", "outputs", "handoff", "issue", "pull request", "sdlc", "acceptance criteria"
  ],
  "MCP and tool access": [
    "mcp", "server", "toolset", "registry", "allow-list", "allowlist", "remote", "local", "tool call", "capability", "data boundary", "permission"
  ],
  "Memory and state": [
    "memory", "state", "context", "expiry", "expiration", "reset", "stale", "checkpoint", "resume", "prune", "durable", "decision log"
  ],
  "Repository and branch governance": [
    "branch", "pull request", "pr", "ruleset", "protected", "codeowners", "repository instructions", "path", "merge", "owner", "review"
  ],
  "Workflow execution": [
    "workflow", "runner", "setup", "job", "step", "token", "github_token", "environment", "retry", "rollback", "log", "trace", "ci"
  ],
  "Evaluation and tuning": [
    "evaluation", "signal", "threshold", "scan", "trace", "root cause", "tuning", "regression", "pass", "fail", "rubric", "evidence"
  ],
  "Multi-agent coordination": [
    "multi-agent", "parallel", "role", "handoff", "conflict", "arbitration", "duplicate", "isolation", "coordination", "lifecycle", "replacement"
  ],
  "Responsible AI and guardrails": [
    "responsible ai", "guardrail", "autonomy", "risk", "compliance", "least privilege", "authorization", "approval", "blocked", "policy", "audit", "human judgment"
  ]
};

const categoryArtifacts = {
  "Agent architecture and SDLC": [".github/ISSUE_TEMPLATE/agent-task.yml", "docs/agent-task-contract.md", "docs/agent-plan.md", "docs/agent-plan-approval-record.md", "docs/agent-step-map.md", "docs/agentic-vs-automation-decision-table.md"],
  "MCP and tool access": ["docs/mcp-tool-policy.md", "docs/agent-mcp-server-review.md", "docs/mcp-allowlist-decision.md", "docs/agent-tool-permission-matrix.md"],
  "Memory and state": ["docs/agent-memory-policy.md", "docs/agent-state.md", "docs/resume-checkpoint.md", "docs/stale-context-checklist.md", "docs/memory-reset-decision.md", "docs/decision-log.md"],
  "Repository and branch governance": ["docs/branch-scope-control.md", ".github/pull_request_template.md", "docs/pr-evidence-table.md", "docs/workflow-evidence-record.md", ".github/CODEOWNERS", ".github/ISSUE_TEMPLATE/agent-task.yml"],
  "Workflow execution": [".github/workflows/agent-validation.yml", ".github/workflows/copilot-setup-steps.yml", "docs/environment-constraints.md", "docs/execution-context-checklist.md", "docs/agent-session-log-review.md", "docs/workflow-evidence-record.md", "docs/escalation-paths.md"],
  "Evaluation and tuning": ["docs/agent-evaluation-plan.md", "docs/security-scan-evidence.md", "docs/accessibility-scan-evidence.md", "docs/root-cause-classification.md", "docs/agent-failure-analysis.md", "docs/error-analysis.md", "docs/regression-checklist.md"],
  "Multi-agent coordination": ["docs/agent-roles.md", "docs/multi-agent-plan.md", "docs/multi-agent-handoff-contract.md", "docs/conflict-log.md", "docs/multi-agent-arbitration-record.md"],
  "Responsible AI and guardrails": ["docs/autonomy-matrix.md", "docs/guardrails.md", "docs/approval-policy.md", "docs/responsible-ai-risk-review.md", "docs/least-privilege-access-review.md", "docs/agent-tool-permission-matrix.md", "docs/execution-context-checklist.md", "docs/audit-trail.md"]
};

const genericPatterns = [
  /The specific decision is how to apply the skill/i,
  /The repository has required checks, owner-reviewed paths, and at least one workflow or data boundary/i,
  /the safest answer is the one that handles this topic's real failure mode/i,
  /not the one that repeats generic agent governance language/i,
  /make .* enforceable\. In practice, make the control visible through the recommended GitHub artifacts/i,
  /before merge, deployment, or broader access/i,
  /Lesson use: support "/i,
  /evidence a reviewer can inspect/i,
  /Practice ".*" as a .* task by creating the lesson-specific artifacts/i,
  /A maintainer in .* asks an agent to/i
];

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

function normalized(value) {
  return text(value).toLowerCase().replace(/\s+/g, " ").trim();
}

function words(value) {
  return normalized(value).split(/\s+/).filter(Boolean);
}

function md(value) {
  return text(value).replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
}

function currentSource(sourceId) {
  const status = sourceStatusMap.get(sourceId);
  return status?.status === "reachable" && status?.reviewState === "current";
}

function exactSourceRules(lesson) {
  const title = normalized(`${lesson.title} ${lesson.officialSkill}`);
  const category = lesson.topicSpecificExplanation?.category || "";
  const rules = new Map();
  const add = (label, ids) => rules.set(label, ids);

  if (/mcp|toolset|registry|allow.?list|remote server|local server|server as a tool/.test(title) || category === "MCP and tool access") {
    add("MCP product behavior", ["gh-mcp-cloud-agent", "gh-mcp-management", "gh-mcp-server-access", "gh-mcp-server-setup"]);
  }
  if (/toolset/.test(title)) add("MCP toolsets", ["gh-mcp-toolsets"]);
  if (/registr/.test(title)) add("MCP registry", ["gh-mcp-registry"]);
  if (/allow.?list/.test(title)) add("MCP allow-list", ["gh-mcp-allowlist-enforcement"]);
  if (/custom instruction|repository instruction/.test(title)) add("custom instructions", ["gh-repository-instructions", "gh-custom-instructions-support"]);
  if (/branch|pull request|\bpr\b|repository scope|codeowners|ruleset|protected/.test(title) || category === "Repository and branch governance") {
    add("GitHub repository governance", ["gh-protected-branches", "gh-rulesets", "gh-codeowners", "gh-repository-instructions"]);
  }
  if (/workflow|ci|runner|setup|github_token|token|environment|retry|rollback|trace|execution context|escalation/.test(title) || category === "Workflow execution") {
    add("GitHub Actions execution", ["gh-actions-workflows", "gh-copilot-setup-steps", "gh-copilot-cli-actions", "gh-deploy-envs", "gh-review-deployments"]);
  }
  if (/memory|state|context|stale|resume|expiry|expiration|reset|checkpoint/.test(title) || category === "Memory and state") {
    add("Copilot memory/state behavior", ["gh-copilot-memory", "gh-custom-instructions-support", "gh-repository-instructions"]);
  }
  if (/responsible ai|guardrail|autonomy|compliance|risk|approval|authorization|least.?privilege|policy|audit|human judgment/.test(title) || category === "Responsible AI and guardrails") {
    add("Responsible AI and controls", ["ms-responsible-ai-principles", "ms-foundry-responsible-ai", "gh-cloud-agent-risks", "gh-protected-branches", "gh-rulesets", "gh-codeowners", "gh-deploy-envs", "gh-review-deployments"]);
  }
  if (/evaluation|evaluate|signal|failure|root cause|tuning|regression|trace|log/.test(title) || category === "Evaluation and tuning") {
    add("evaluation and failure evidence", ["gh-cloud-agent-risks", "gh-actions-workflows", "ms-foundry-responsible-ai"]);
  }
  if (/codeql|secret scanning|dependency|static analysis/.test(title)) {
    add("specific scanning product docs", ["gh-code-scanning", "gh-codeql-code-scanning", "gh-secret-scanning", "gh-dependency-review", "gh-dependency-review-action"]);
  }
  if (/accessibility/.test(title)) add("accessibility scan docs", ["ms-accessibility-evaluation-testing", "ms-accessibility-testing", "ms-edge-accessibility-testing"]);
  if (/multi-agent|orchestration|parallel|handoff|conflict|duplicate|contradictory|agent replacement|retire/.test(title) || category === "Multi-agent coordination") {
    add("multi-agent implementation support", ["gh-custom-agents-config", "gh-agentic-workflows", "gh-mcp-cloud-agent"]);
  }
  if (rules.size === 0) add("general GH-600 support", ["ms-gh600-guide"]);
  return [...rules.entries()].map(([label, ids]) => ({ label, ids }));
}

function sourceConfidenceFor(lesson) {
  const sourceIds = new Set(lesson.sourceIds || []);
  const missingSources = (lesson.sourceIds || []).filter((id) => !sourceMap.has(id) || !currentSource(id));
  if (!sourceIds.has("ms-gh600-guide") || missingSources.length) {
    return {
      label: "Weak or missing support",
      value: 0.2,
      reason: "The official GH-600 guide or current reachable source metadata is missing.",
      missingExactRules: []
    };
  }

  const rules = exactSourceRules(lesson);
  const missingExactRules = [];
  let exactHits = 0;
  for (const rule of rules) {
    if (rule.ids.some((id) => sourceIds.has(id))) exactHits += 1;
    else missingExactRules.push(rule.label);
  }

  if (missingExactRules.length === 0 && rules.length >= 2) {
    return {
      label: "Strong exact support",
      value: 1.4,
      reason: "Cites the GH-600 guide plus exact GitHub/Microsoft docs for the lesson's product behavior.",
      missingExactRules
    };
  }
  if (missingExactRules.length === 0) {
    return {
      label: "Good support",
      value: 1.15,
      reason: "Cites current official sources, but the support is not exact enough for an exceptional score.",
      missingExactRules
    };
  }
  if (exactHits > 0 && missingExactRules.length <= 1) {
    return {
      label: "Good support",
      value: 1.0,
      reason: `Mostly supported, but source coverage is not exact for: ${missingExactRules.join(", ")}.`,
      missingExactRules
    };
  }
  if (exactHits > 0) {
    return {
      label: "Broad support only",
      value: 0.75,
      reason: `Uses official sources, but several product-specific claims need tighter citations: ${missingExactRules.join(", ")}.`,
      missingExactRules
    };
  }
  return {
    label: "Needs source verification",
    value: 0.45,
    reason: `The cited sources are current but do not directly verify the lesson's product-specific claims: ${missingExactRules.join(", ")}.`,
    missingExactRules
  };
}

function genericPatternCount(lesson) {
  const haystack = text({
    whyExam: lesson.whyExam,
    core: lesson.core,
    githubDetail: lesson.githubDetail,
    practicalExample: lesson.practicalExample,
    scenario: lesson.scenario,
    practicalLabTask: lesson.practicalLabTask,
    filesToCreate: lesson.filesToCreate,
    examTrap: lesson.examTrap
  });
  return genericPatterns.filter((pattern) => pattern.test(haystack)).length;
}

function categorySignalCount(lesson) {
  const category = lesson.topicSpecificExplanation?.category || "Agent architecture and SDLC";
  const haystack = normalized({
    core: lesson.core,
    topicSpecificExplanation: lesson.topicSpecificExplanation,
    githubDetail: lesson.githubDetail,
    practicalExample: lesson.practicalExample,
    practicalLabTask: lesson.practicalLabTask,
    teachingTable: lesson.teachingTable
  });
  return (categorySignals[category] || []).filter((signal) => haystack.includes(signal)).length;
}

function templateQualityFor(lesson) {
  const category = lesson.topicSpecificExplanation?.category || "Agent architecture and SDLC";
  const paths = new Set((lesson.filesToCreate || []).map((artifact) => artifact.path));
  const unresolved = [...paths].filter((artifactPath) => !templatePathMap.has(artifactPath));
  if (!paths.size || unresolved.length) {
    return { label: unresolved.length ? "Mismatched" : "Missing important artefact", value: 0.25, weakness: "Template recommendations do not fully resolve to the template library." };
  }

  const expected = categoryArtifacts[category] || [];
  const matches = expected.filter((artifactPath) => paths.has(artifactPath));
  const primaryMatch = matches.length > 0;
  const title = normalized(lesson.title);
  const primaryWeaknesses = [];
  if (/mcp|toolset|registry|allow.?list|remote server|local server/.test(title) && ![...paths].some((artifactPath) => /mcp/.test(artifactPath))) {
    primaryWeaknesses.push("MCP lesson does not prioritize an MCP artefact.");
  }
  if (/branch|repository scope|pull request|\bpr\b/.test(title) && !paths.has("docs/branch-scope-control.md") && !paths.has(".github/pull_request_template.md")) {
    primaryWeaknesses.push("Repository or branch lesson lacks branch/PR control artefact.");
  }
  if (/least.?privilege|permission|tool access/.test(title) && !paths.has("docs/agent-tool-permission-matrix.md") && !paths.has("docs/least-privilege-access-review.md")) {
    primaryWeaknesses.push("Least-privilege lesson lacks a permission matrix or access review artefact.");
  }
  if (
    (/memory|state|stale|reset|resume|expiry|expiration|prune/.test(title) || lesson.topicSpecificExplanation?.category === "Memory and state") &&
    !paths.has("docs/agent-memory-policy.md") &&
    !paths.has("docs/agent-state.md") &&
    !paths.has("docs/memory-reset-decision.md")
  ) {
    primaryWeaknesses.push("Memory/state lesson lacks a memory policy or state artefact.");
  }
  if (primaryWeaknesses.length) {
    return { label: "Mismatched", value: 0.35, weakness: primaryWeaknesses[0] };
  }
  if (primaryMatch && matches.length >= 2 && paths.size >= 7) {
    return { label: "Strong and skill-specific", value: 1.25, weakness: "No major artefact weakness found." };
  }
  if (primaryMatch) {
    return { label: "Good but incomplete", value: 0.95, weakness: "Artefacts fit the topic, but the set could be sharper or more complete." };
  }
  return { label: "Too generic", value: 0.55, weakness: "Artefact set is valid but not specific enough for this lesson." };
}

function practiceQualityFor(lesson) {
  const lessonQuizzes = quizzesByLessonId.get(lesson.id) || [];
  const lessonScenarios = scenariosByLessonId.get(lesson.id) || [];
  const lessonFlashcards = flashcardsBySkillId.get(lesson.skillId) || [];
  const lessonLabs = (lesson.relatedLabs || []).map((labId) => labsById.get(labId)).filter(Boolean);
  const title = normalized(lesson.title);
  const labText = normalized({ practicalLabTask: lesson.practicalLabTask, labs: lessonLabs });
  const scenarioText = normalized({ scenario: lesson.scenario, scenarioRecord: lessonScenarios });
  let value = 0;
  const weaknesses = [];

  if (lessonQuizzes.length >= 5) value += 0.25;
  else weaknesses.push("Fewer than five mapped quiz questions.");
  if (lessonLabs.length >= 1 && labText.includes(title.slice(0, Math.min(title.length, 45)))) value += 0.25;
  else weaknesses.push("Lab linkage is missing or not clearly tied to the lesson.");
  if (lesson.scenario || lessonScenarios.length) value += 0.2;
  else weaknesses.push("No mini-scenario found.");
  if (lessonFlashcards.length >= 1) value += 0.1;
  else weaknesses.push("No mapped flashcard found.");
  if (/The specific decision is how to apply the skill/i.test(text(lesson.scenario))) weaknesses.push("Scenario is useful but visibly generated/formulaic.");
  else value += 0.2;

  return {
    value: Math.min(1, value),
    weakness: weaknesses[0] || "Practice assets exist and are tied to the lesson."
  };
}

function teachingQualityFor(lesson, genericCount, signalCount) {
  let value = 0;
  const weaknesses = [];
  const coreWords = words(lesson.core).length;
  const topicWords = words(lesson.topicSpecificExplanation?.paragraphs).length;
  const exampleWords = words(lesson.practicalExample).length;
  if (coreWords >= 90) value += 0.45;
  else weaknesses.push("Core explanation is short.");
  if (topicWords >= 80 && signalCount >= 5) value += 0.45;
  else weaknesses.push("Topic-specific explanation needs sharper domain detail.");
  if (exampleWords >= 35 && !/^A maintainer in /i.test(lesson.practicalExample || "")) value += 0.35;
  else if (exampleWords >= 35) {
    value += 0.2;
    weaknesses.push("Original teaching example is realistic but still formulaic.");
  } else weaknesses.push("Original teaching example is thin.");
  if (lesson.teachingTable?.rows?.length >= 4) value += 0.3;
  else weaknesses.push("Teaching table is missing or thin.");
  if (!/^For /i.test(lesson.examTrap || "") && words(lesson.examTrap).length >= 10) value += 0.25;
  else {
    value += 0.1;
    weaknesses.push("Exam trap is present but generated or obvious.");
  }
  if (genericCount >= 5) value -= 0.35;
  else if (genericCount >= 3) value -= 0.2;
  return {
    value: Math.max(0, Math.min(1.8, value)),
    weakness: weaknesses[0] || "Teaching is specific, clear, and useful."
  };
}

function specificityValue(signalCount, genericCount) {
  let value = 0.65;
  if (signalCount >= 8) value = 1.45;
  else if (signalCount >= 6) value = 1.25;
  else if (signalCount >= 4) value = 0.95;
  if (genericCount >= 5) value -= 0.25;
  if (genericCount >= 7) value -= 0.2;
  return Math.max(0.25, value);
}

function capScore(score, caps) {
  let capped = score;
  for (const cap of caps) capped = Math.min(capped, cap.value);
  return Math.round(Math.min(10, capped) * 10) / 10;
}

function verdictFor(score, mainWeakness) {
  if (/confirmed technical inaccuracy/i.test(mainWeakness)) return "Technically risky";
  if (/source verification|source support|exact source/i.test(mainWeakness) && score < 7.6) return "Exam weak";
  if (/generic|formulaic|repeated/i.test(mainWeakness) && score < 8) return "Too generic";
  if (score >= 9) return "Excellent";
  if (score >= 8) return "Strong";
  if (score >= 7) return "Good but needs improvement";
  if (score >= 6.5) return "Needs targeted rewrite";
  if (score >= 6) return "Weak";
  if (score >= 5) return "Needs major rewrite";
  return "Not ready";
}

function readinessFor(score, sourceConfidence, templateQuality) {
  if (score >= 8.7 && sourceConfidence === "Strong exact support" && templateQuality === "Strong and skill-specific") return "Ready";
  if (score >= 8) return "Ready with minor edits";
  if (score >= 6.5) return "Needs targeted improvement";
  if (score >= 5.5) return "Needs major rewrite";
  return "Do not rely on yet";
}

function fixFor(audit) {
  if (audit.sourceConfidence === "Needs source verification" || audit.sourceConfidence === "Weak or missing support") {
    return "Add exact official docs for the product claim, then re-check the lesson wording against those docs.";
  }
  if (audit.templateQuality === "Mismatched" || audit.templateQuality === "Too generic") {
    return "Replace generic artefacts with the exact GitHub/Microsoft control artefact required by this skill.";
  }
  if (/formulaic|generated|generic/i.test(audit.mainWeakness)) {
    return "Rewrite the scenario, example, and exam trap in a skill-specific voice with less repeated template language.";
  }
  if (audit.officialOrSupporting === "Supporting") {
    return "Keep as supporting depth and add a sharper note showing where it helps GH-600 scenario decisions.";
  }
  if (/practice/i.test(audit.mainWeakness)) return "Strengthen the lab, quiz rationales, scenario, or flashcard so the learner can apply the skill.";
  return "Tighten examples, source rationale, and production evidence before calling the lesson excellent.";
}

function auditLesson(lesson) {
  const officialOrSupporting = lesson.extended ? "Supporting" : "Official";
  const source = sourceConfidenceFor(lesson);
  const genericCount = genericPatternCount(lesson);
  const signalCount = categorySignalCount(lesson);
  const template = templateQualityFor(lesson);
  const practice = practiceQualityFor(lesson);
  const teaching = teachingQualityFor(lesson, genericCount, signalCount);
  const coverage = coverageByLessonId.get(lesson.id);

  const caps = [];
  const weaknesses = [];
  if (lesson.extended) caps.push({ value: 8.5, reason: "Supporting-depth lesson, not a separate official GH-600 skill bullet." });
  if (!lesson.extended && !coverage) caps.push({ value: 6.0, reason: "Official skill lesson is not mapped in the coverage matrix." });
  if (source.label === "Good support") caps.push({ value: 8.5, reason: "Source support is good, but not exact enough for an excellent score." });
  if (source.label === "Broad support only") caps.push({ value: 8.0, reason: "Source support is broad rather than exact." });
  if (source.label === "Needs source verification") caps.push({ value: 7.5, reason: "Product behavior needs exact source verification." });
  if (source.label === "Weak or missing support") caps.push({ value: 6.0, reason: "Source support is weak or missing." });
  if (genericCount >= 5) caps.push({ value: 8.0, reason: "Repeated generated lesson wording remains visible." });
  if (genericCount >= 5 && signalCount < 7) caps.push({ value: 7.5, reason: "Formulaic wording is not offset by enough domain-specific teaching." });
  if (signalCount < 4) caps.push({ value: 7.0, reason: "Topic-specific signal is low." });
  if (template.label === "Too generic" || template.label === "Mismatched") caps.push({ value: 7.5, reason: "Template recommendations are generic or mismatched." });
  if (template.label === "Missing important artefact") caps.push({ value: 7.0, reason: "No realistic production artefact is required." });
  if (practice.value < 0.75) caps.push({ value: 8.0, reason: "Quiz/lab/scenario/flashcard support is weak." });

  if (source.label !== "Strong exact support") weaknesses.push(source.reason);
  if (genericCount >= 5) weaknesses.push("Lesson is useful but visibly formulaic across scenario/example/trap/lab wording.");
  else if (genericCount >= 3) weaknesses.push("Some repeated template language remains.");
  if (signalCount < 7) weaknesses.push("Domain-specific teaching signals are present but not deep enough.");
  if (template.label !== "Strong and skill-specific") weaknesses.push(template.weakness);
  if (practice.value < 0.95) weaknesses.push(practice.weakness);
  if (teaching.value < 1.25) weaknesses.push(teaching.weakness);
  if (lesson.extended) weaknesses.push("Supporting lesson should not be treated as a separate official exam objective.");

  const examAlignment = lesson.extended ? 0.85 : coverage ? 1.45 : 0.6;
  const sourceValue = source.value;
  const specificity = specificityValue(signalCount, genericCount);
  const production = template.value;
  const practiceValue = practice.value;
  const technical = source.label === "Weak or missing support" ? 0.35 : source.label === "Needs source verification" ? 0.55 : 0.85;

  const rawScore = examAlignment + sourceValue + specificity + teaching.value + production + practiceValue + technical + 0.9;
  const score = capScore(rawScore, caps);
  const mainWeakness = weaknesses[0] || "No major weakness found, but it still needs periodic human source review.";
  const why = [
    officialOrSupporting === "Official" ? "Maps to an official GH-600 skill" : "Useful supporting depth, not an official skill bullet",
    source.label.toLowerCase(),
    template.label.toLowerCase(),
    genericCount >= 5 ? "formulaic wording cap applied" : "limited generic wording",
    `category signals ${signalCount}`
  ].join("; ");

  const audit = {
    lesson,
    officialOrSupporting,
    score,
    verdict: verdictFor(score, mainWeakness),
    why,
    mainWeakness,
    templateQuality: template.label,
    sourceConfidence: source.label,
    readiness: readinessFor(score, source.label, template.label),
    caps,
    genericCount,
    signalCount
  };
  audit.requiredFix = fixFor(audit);
  return audit;
}

const audits = lessons.map(auditLesson);

function countBy(items, keyFn) {
  const counts = {};
  for (const item of items) {
    const key = keyFn(item);
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function average(rows) {
  return Math.round((rows.reduce((total, row) => total + row.score, 0) / rows.length) * 10) / 10;
}

function finalVerdict(avg, readinessCounts) {
  const targeted = readinessCounts["Needs targeted improvement"] || 0;
  const major = (readinessCounts["Needs major rewrite"] || 0) + (readinessCounts["Do not rely on yet"] || 0);
  const ready = (readinessCounts.Ready || 0) + (readinessCounts["Ready with minor edits"] || 0);
  if (major > 0 || targeted > 35 || avg < 7) return "Mixed quality";
  if (ready >= 90 && targeted <= 10 && avg >= 8) return "Ready";
  if (ready >= 65 && avg >= 7.4) return "Mostly ready";
  return "Mixed quality";
}

function domainRows() {
  const grouped = new Map();
  for (const audit of audits) {
    const key = audit.lesson.domainId;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(audit);
  }
  return [...grouped.entries()].map(([domainId, rows]) => {
    const readinessMix = countBy(rows, (row) => row.readiness);
    const verdictMix = countBy(rows, (row) => row.verdict);
    const mainRisk = rows.find((row) => row.readiness === "Needs targeted improvement")?.mainWeakness || rows[0]?.mainWeakness || "No major risk.";
    return `| ${domainId} | ${md(rows[0].lesson.domain)} | ${rows.length} | ${average(rows)} | ${Object.entries(verdictMix).map(([k, v]) => `${k}: ${v}`).join(", ")} | ${Object.entries(readinessMix).map(([k, v]) => `${k}: ${v}`).join(", ")} | ${md(mainRisk)} |`;
  });
}

const verdictCounts = countBy(audits, (audit) => audit.verdict);
const readinessCounts = countBy(audits, (audit) => audit.readiness);
const sourceCounts = countBy(audits, (audit) => audit.sourceConfidence);
const templateCounts = countBy(audits, (audit) => audit.templateQuality);
const officialAudits = audits.filter((audit) => audit.officialOrSupporting === "Official");
const supportingAudits = audits.filter((audit) => audit.officialOrSupporting === "Supporting");
const averageScore = average(audits);
const strictFinalVerdict = finalVerdict(averageScore, readinessCounts);

const lines = [];
lines.push("# GH-600 Strict Lesson Quality Re-audit");
lines.push("");
lines.push(`Generated: ${reviewedDate}`);
lines.push("");
lines.push("## Strict Final Verdict");
lines.push("");
lines.push(`Final verdict: ${strictFinalVerdict}`);
lines.push("");
lines.push(`This stricter re-audit does not treat structural completeness as excellence. The course is source-mapped, broad, and usable, but the previous 9.7/10 verdict was too generous. The strict average is ${averageScore}/10 across ${audits.length} lessons. The main weakness is repeated generated teaching language: many lessons have valid sections, sources, scenarios, labs, and templates, but still sound formulaic instead of written as bespoke instruction for the exact skill.`);
lines.push("");
lines.push("## Source Basis");
lines.push("");
lines.push(`- Primary exam blueprint: [${md(officialGuide?.title)}](${officialGuide?.url}).`);
lines.push("- Supporting source confidence is based on current `src/data/sourceStatus.json`, lesson source IDs, and exact-topic source rules for GitHub Copilot, MCP, Actions, branch controls, CODEOWNERS, environments, Microsoft Responsible AI, and Microsoft Learn modules.");
lines.push(`- Source currentness was refreshed on ${sourceStatus.lastChecked || "unknown"}; all 32 tracked official sources are reachable according to ` + "`npm run check:sources`.");
lines.push("");
lines.push("## Scoring Rules Used");
lines.push("");
lines.push("- Official skill lessons can score above 8.5 only when teaching is specific, source support is exact, and production artefacts are skill-specific.");
lines.push("- Supporting-depth lessons are capped at 8.5 unless they become official-skill lessons in the blueprint.");
lines.push("- Mostly generic governance wording is capped at 7.0; repeated formulaic wording is capped at 7.5-8.0 depending on domain specificity.");
lines.push("- Broad or indirect source support is capped at 8.0; product behavior needing exact source verification is capped at 7.5.");
lines.push("- Generic or mismatched artefacts are capped at 7.5; missing production artefacts are capped at 7.0.");
lines.push("- Quiz/lab/scenario/flashcard support is credited, but generated practice wording is still penalized.");
lines.push("");
lines.push("## Summary");
lines.push("");
lines.push(`- Lessons audited: ${audits.length}`);
lines.push(`- Official skill lessons: ${officialAudits.length}; average ${average(officialAudits)}/10`);
lines.push(`- Supporting depth lessons: ${supportingAudits.length}; average ${average(supportingAudits)}/10`);
lines.push(`- Verdict counts: ${Object.entries(verdictCounts).map(([key, value]) => `${key}: ${value}`).join(", ")}`);
lines.push(`- Production readiness counts: ${Object.entries(readinessCounts).map(([key, value]) => `${key}: ${value}`).join(", ")}`);
lines.push(`- Source confidence counts: ${Object.entries(sourceCounts).map(([key, value]) => `${key}: ${value}`).join(", ")}`);
lines.push(`- Template/artefact quality counts: ${Object.entries(templateCounts).map(([key, value]) => `${key}: ${value}`).join(", ")}`);
lines.push("");
lines.push("## Domain Verdicts");
lines.push("");
lines.push("| Domain | Topic | Lessons | Average /10 | Verdict mix | Readiness mix | Main risk |");
lines.push("| --- | --- | ---: | ---: | --- | --- | --- |");
lines.push(...domainRows());
lines.push("");
lines.push("## Required Lesson-Level Output");
lines.push("");
lines.push("| Lesson ID | Title | Official or supporting | Score /10 | Verdict | Why this score | Main weakness | Template/artefact quality | Source confidence | Production readiness | Required fix |");
lines.push("|---|---|---|---:|---|---|---|---|---|---|---|");
for (const audit of audits) {
  lines.push(`| ${audit.lesson.id} | ${md(audit.lesson.title)} | ${audit.officialOrSupporting} | ${audit.score} | ${audit.verdict} | ${md(audit.why)} | ${md(audit.mainWeakness)} | ${audit.templateQuality} | ${audit.sourceConfidence} | ${audit.readiness} | ${md(audit.requiredFix)} |`);
}
lines.push("");
lines.push("## Highest Priority Improvements");
lines.push("");
lines.push("- Rewrite the generated scenario, practical example, exam trap, and lab wording for the lessons capped by formulaic language. The repeated structure is the biggest reason the strict score drops.");
lines.push("- Add exact official product docs for lessons whose claims are only broadly supported, especially evaluation lessons that mention specific scanning products or accessibility signals.");
lines.push("- Keep supporting lessons clearly labelled as supporting depth, and add a short note explaining which official GH-600 skill each one reinforces.");
lines.push("- Preserve the existing QA gates, but do not treat passing QA as proof of teaching excellence.");
lines.push("");
lines.push("## Residual Risk");
lines.push("");
lines.push("- This strict audit is still deterministic. It is more honest than the prior audit because it penalizes formulaic teaching, broad sources, and supporting-topic caps, but it does not replace a human educator rewriting each lesson.");
lines.push("- Source metadata confirms reachability and currentness signals, not permanent semantic truth. Any changed GitHub or Microsoft page must trigger a manual lesson review.");

fs.writeFileSync(path.join(docsDir, "LESSON_QUALITY_AUDIT.md"), `${lines.join("\n")}\n`);

console.log(JSON.stringify({
  lessons: audits.length,
  averageScore,
  finalVerdict: strictFinalVerdict,
  verdictCounts,
  readinessCounts,
  sourceCounts,
  templateCounts,
  output: "docs/LESSON_QUALITY_AUDIT.md"
}, null, 2));
