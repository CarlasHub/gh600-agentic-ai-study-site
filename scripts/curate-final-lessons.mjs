import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "src", "data");
const reviewedAt = "2026-07-08";
const sourceSnapshot = "gh600-source-baseline-2026-06-11";
const preserveEditorialLessons = new Set([
  "domain-1-lesson-01-identify-steps-for-agents-to-perform",
  "domain-1-lesson-02-identify-and-mitigate-common-anti-patterns-in-agents",
  "domain-1-lesson-03-define-inputs-outputs-and-success-criteria-for-agents",
  "domain-1-lesson-04-configure-agent-planning-to-be-distinct-from-agent-execution",
  "domain-1-lesson-05-configure-an-agent-to-output-a-structured-plan",
  "domain-1-lesson-06-validate-agent-plans",
  "domain-1-lesson-07-prevent-agent-action-until-the-agent-checked-and-approved",
  "domain-1-lesson-08-plan-and-implement-the-degree-of-agent-autonomy-including-guardrails",
  "domain-1-lesson-09-configure-agent-to-produce-inspectable-artifacts-within-standard-development-too",
  "domain-1-lesson-10-configure-human-intervention-for-autonomous-agents-without-slowing-delivery"
]);
const titleOverrides = {
  "domain-2-lesson-15-implement-retries": "Implement retries for agent workflows",
  "domain-2-lesson-16-implement-rollbacks": "Implement rollbacks for agent workflows",
  "domain-2-lesson-27-environment-specific-constraints": "Environment-specific constraints for agent workflows"
};

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
}

function writeJson(name, value) {
  fs.writeFileSync(path.join(dataDir, name), JSON.stringify(value, null, 2) + "\n");
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function sentenceCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function lowerTitle(lesson) {
  const title = titleOverrides[lesson.id] || lesson.title;
  return title.charAt(0).toLowerCase() + title.slice(1);
}

function lessonTitle(lesson) {
  return titleOverrides[lesson.id] || lesson.title;
}

function asArtifact(pathValue, purpose) {
  return { path: pathValue, purpose };
}

function makeAccuracy() {
  return {
    reviewedAt,
    sourceSnapshot,
    verification: "human-reviewed",
    reviewRequiredOnSourceChange: true
  };
}

const domainProfiles = {
  "domain-1": {
    repo: "checkout-platform",
    issue: "govern a cloud-agent checkout change before implementation",
    examLens: "agent architecture, SDLC boundaries, planning, approval, and reviewable GitHub evidence",
    taskObject: "issue, structured plan, branch, pull request, checks, and review handoff",
    defaultRisk: "the agent starts changing code before scope, approval, and validation are explicit",
    evidence: "issue fields, plan gate, PR evidence table, check runs, CODEOWNERS review, and ruleset status",
    sources: [
      "ms-gh600-guide",
      "ms-agentic-foundations",
      "ms-agent-architecture-sdlc",
      "gh-copilot-cloud-agent",
      "gh-repository-instructions",
      "gh-actions-workflows",
      "gh-protected-branches",
      "gh-codeowners",
      "gh-rulesets",
      "gh-cloud-agent-risks"
    ],
    artifacts: [
      [".github/ISSUE_TEMPLATE/agent-task.yml", "Captures goal, scope, inputs, outputs, validation, evidence, and stop conditions before the agent starts."],
      ["docs/agent-plan.md", "Separates the agent's proposed reasoning and scope from any code-changing action."],
      [".github/pull_request_template.md", "Requires changed files, checks, approvals, evidence, and residual risk in the pull request."],
      [".github/CODEOWNERS", "Routes sensitive paths to the human owners who must approve them before merge."],
      ["docs/agent-handoff.md", "Records completed work, evidence, blocked work, and the next human decision."]
    ],
    terms: ["SDLC control plane", "task contract", "plan gate", "pull request evidence", "CODEOWNERS review", "ruleset"]
  },
  "domain-2": {
    repo: "platform-tools",
    issue: "configure a tool-backed agent without over-permissioning the execution path",
    examLens: "tool choice, MCP configuration, execution context, environment limits, retries, rollback, and trace evidence",
    taskObject: "tool plan, MCP policy, setup workflow, branch scope, workflow logs, and escalation record",
    defaultRisk: "the agent receives broad tool or environment access when a narrower capability would complete the task",
    evidence: "tool permission matrix, MCP registry or allow-list decision, setup logs, workflow run, retry record, and rollback note",
    sources: [
      "ms-gh600-guide",
      "ms-tooling-mcp-envs",
      "gh-mcp-cloud-agent",
      "gh-mcp-server-setup",
      "gh-mcp-toolsets",
      "gh-mcp-chat",
      "gh-actions-workflows",
      "gh-copilot-setup-steps",
      "gh-copilot-cli-actions",
      "gh-agentic-workflows",
      "gh-cloud-agent-risks"
    ],
    artifacts: [
      ["docs/tool-permission-matrix.md", "Maps each tool to task need, access level, denied use, validation evidence, and escalation path."],
      ["docs/mcp-tool-policy.md", "Defines approved MCP servers, allowed toolsets, data boundaries, and review requirements."],
      [".github/workflows/copilot-setup-steps.yml", "Installs dependencies and records setup evidence for Copilot cloud agent execution."],
      [".github/workflows/agent-validation.yml", "Runs the checks that prove the agent's tool-backed work is safe to review."],
      ["docs/escalation-paths.md", "Explains what the agent must do when a tool fails, access is denied, or a broader permission is needed."]
    ],
    terms: ["MCP", "toolset", "execution context", "setup workflow", "GITHUB_TOKEN", "least privilege"]
  },
  "domain-3": {
    repo: "long-running-refactor",
    issue: "resume a stateful agent task without reusing stale or conflicting context",
    examLens: "memory scope, durable state, context drift, state sharing, and continuity across tools",
    taskObject: "agent state record, decision log, memory policy, context handoff, workflow artifact, and PR update",
    defaultRisk: "the agent trusts remembered context after the issue, branch, CI, or requirements have changed",
    evidence: "agent-state file, decision log, current issue comments, branch diff, latest check run, and stale-context checklist",
    sources: [
      "ms-gh600-guide",
      "ms-agentic-foundations",
      "gh-copilot-memory",
      "gh-custom-instructions-support",
      "gh-repository-instructions",
      "gh-actions-workflows",
      "gh-copilot-cloud-agent",
      "ms-foundry-responsible-ai"
    ],
    artifacts: [
      ["docs/agent-state.md", "Captures current progress, open questions, branch, files, checks, and next decision."],
      ["docs/decision-log.md", "Records durable decisions with owner, date, reason, and evidence."],
      ["docs/agent-memory-policy.md", "Defines what the agent may remember, reuse, expire, prune, or reset."],
      ["docs/context-handoff.md", "Shares state across agents, tools, or sessions without relying on chat memory alone."],
      ["docs/stale-context-checklist.md", "Forces a refresh of issue, PR, branch, instructions, source docs, and CI before resuming."]
    ],
    terms: ["short-term memory", "long-term memory", "external memory", "durable state", "context drift", "state handoff"]
  },
  "domain-4": {
    repo: "security-cleanup",
    issue: "evaluate agent output with checks, traces, scans, and root-cause evidence",
    examLens: "success criteria, evaluation signals, failure classification, tuning, regression checks, and automated scan evidence",
    taskObject: "evaluation plan, workflow checks, scan outputs, error analysis, tuning log, and regression result",
    defaultRisk: "the agent treats a passing narrative or a removed check as evidence of correctness",
    evidence: "expected outcome table, workflow logs, scan results, trace review, failure classification, tuning log, and rerun checks",
    sources: [
      "ms-gh600-guide",
      "gh-actions-workflows",
      "gh-cloud-agent-risks",
      "ms-foundry-responsible-ai",
      "gh-deploy-envs",
      "gh-rulesets",
      "gh-codeowners"
    ],
    artifacts: [
      ["docs/evaluation-plan.md", "Defines expected outcomes, operational constraints, pass/fail signals, and evidence sources."],
      ["docs/error-analysis.md", "Classifies failures by reasoning, tool misuse, context, environment, permission, instruction, or data cause."],
      ["docs/tuning-log.md", "Records instruction, memory, workflow, and tool changes made after evaluation."],
      [".github/workflows/agent-validation.yml", "Runs build, tests, scans, and evidence collection for agent changes."],
      ["docs/security-scan-evidence.md", "Summarizes automated scan results, unresolved findings, owner review, and accepted risk."]
    ],
    terms: ["evaluation signal", "trace", "root cause", "automated scan", "tuning log", "regression check"]
  },
  "domain-5": {
    repo: "multi-agent-release",
    issue: "coordinate planner, builder, tester, reviewer, and release agents without losing auditability",
    examLens: "multi-agent orchestration, isolation, conflict handling, handoffs, degraded behavior, and agent lifecycle governance",
    taskObject: "multi-agent plan, role map, branch isolation, conflict log, handoff packet, and recovery decision",
    defaultRisk: "parallel agents overwrite each other, duplicate effort, or produce contradictory outputs without arbitration",
    evidence: "role map, branch map, conflict log, handoff contract, audit trail, failed-agent record, and recovery plan",
    sources: [
      "ms-gh600-guide",
      "ms-agentic-foundations",
      "gh-custom-agents-config",
      "gh-mcp-cloud-agent",
      "gh-actions-workflows",
      "gh-cloud-agent-risks",
      "gh-agentic-workflows"
    ],
    artifacts: [
      ["docs/agent-roles.md", "Defines each agent role, responsibility, allowed actions, and review owner."],
      ["docs/multi-agent-plan.md", "Coordinates sequence, parallel work, file ownership, dependencies, and stop conditions."],
      ["docs/multi-agent-handoff-contract.md", "Transfers branch, files, evidence, risks, and next owner between agents."],
      ["docs/conflict-log.md", "Records overlapping edits, duplicate work, contradictory outputs, arbitration, and final decision."],
      ["docs/recovery-plan.md", "Explains rollback, replacement, retirement, or human-in-the-loop recovery when agents degrade."]
    ],
    terms: ["orchestration", "agent isolation", "handoff", "conflict log", "degraded execution", "agent lifecycle"]
  },
  "domain-6": {
    repo: "regulated-api",
    issue: "apply guardrails and accountability to a compliance-sensitive agent workflow",
    examLens: "autonomy levels, security and compliance risk, policy blocking, explicit authorization, least privilege, and accountable review",
    taskObject: "autonomy matrix, guardrail policy, approval record, CODEOWNERS review, environment protection, and audit trail",
    defaultRisk: "the agent performs irreversible, privileged, or compliance-sensitive work without the right human judgment",
    evidence: "risk classification, autonomy level, denied actions, approval record, ruleset result, environment review, and audit notes",
    sources: [
      "ms-gh600-guide",
      "ms-responsible-ai-principles",
      "ms-foundry-responsible-ai",
      "gh-cloud-agent-risks",
      "gh-protected-branches",
      "gh-rulesets",
      "gh-codeowners",
      "gh-deploy-envs",
      "gh-review-deployments",
      "gh-mcp-server-access",
      "gh-agentic-workflows"
    ],
    artifacts: [
      ["docs/autonomy-matrix.md", "Maps action types to autonomy level, approval requirement, validation evidence, and owner."],
      ["docs/guardrails.md", "Defines blocked actions, allowed paths, policy constraints, and escalation routes."],
      ["docs/approval-policy.md", "Explains when explicit authorization is required and which GitHub control records it."],
      ["docs/responsible-ai-risk-review.md", "Reviews privacy, safety, security, transparency, and accountability risks for the agent task."],
      ["docs/audit-trail.md", "Collects PR, workflow, approval, environment, and review evidence for accountability."]
    ],
    terms: ["guardrail", "autonomy level", "least privilege", "explicit authorization", "Responsible AI", "audit trail"]
  }
};

const topicRules = [
  {
    name: "MCP governance",
    match: /mcp|toolset|registry|allow list|allow-list|allowlist|server access|remote mcp/i,
    teaches: "connecting agents to MCP capabilities only through approved servers, toolsets, registries, and allow-list policy",
    controls: "MCP server configuration, registry-only policy, server access settings, allow-list enforcement, and toolset restrictions",
    evidence: "approved server ID, registry URL, selected toolset, policy screenshot or note, tool-call evidence, and escalation record",
    risk: "unapproved local servers or broad toolsets expose data and write capabilities the task does not need",
    sources: ["ms-tooling-mcp-envs", "gh-mcp-cloud-agent", "gh-mcp-management", "gh-mcp-registry", "gh-mcp-server-access", "gh-mcp-allowlist-enforcement", "gh-mcp-toolsets", "gh-mcp-chat"],
    artifacts: [
      ["docs/mcp-tool-policy.md", "Lists approved MCP servers, allowed toolsets, denied capabilities, data scope, and escalation rule."],
      ["docs/agent-mcp-server-review.md", "Reviews the selected MCP server against registry, allow-list, access, and evidence requirements."],
      ["docs/tool-permission-matrix.md", "Maps MCP tools to read-only or write-capable use and explains why each tool is necessary."]
    ],
    terms: ["MCP registry", "server access", "allow-list enforcement", "toolset", "remote MCP server"]
  },
  {
    name: "Tool permission design",
    match: /tool|permission|read-only|write-capable|scope|least-privilege|least privilege/i,
    teaches: "matching each tool to a narrow task need and denying capabilities that do not produce required evidence",
    controls: "custom-agent tool lists, MCP toolsets, repository and branch scope, workflow permissions, and escalation records",
    evidence: "permission matrix, allowed and denied tool list, validation result, failed-tool log, and reviewer approval for escalation",
    risk: "broad tools let the agent modify code, workflow state, or external systems without a task-specific reason",
    sources: ["ms-tooling-mcp-envs", "gh-custom-agents-config", "gh-mcp-toolsets", "gh-cloud-agent-risks", "gh-copilot-cli-actions", "gh-agentic-workflows"],
    artifacts: [
      ["docs/tool-permission-matrix.md", "Defines allowed tools, denied tools, access level, data scope, validation, and escalation owner."],
      ["docs/environment-constraints.md", "Constrains runner, network, secrets, workflow permissions, and external systems for the agent."],
      ["docs/escalation-paths.md", "Explains what evidence the agent must provide before asking for broader tool access."]
    ],
    terms: ["read-only tool", "write-capable tool", "permission boundary", "workflow permission", "escalation"]
  },
  {
    name: "Workflow execution",
    match: /ci workflow|workflow|actions|setup|environment|execution context|constraints|retries|retry|rollback|error handling|traceability|accountability/i,
    teaches: "using GitHub Actions, setup steps, logs, retries, rollback notes, and trace records to make execution reliable and reviewable",
    controls: "workflow events, jobs, steps, setup logs, `GITHUB_TOKEN` permissions, branch scope, protected environments, and trace logs",
    evidence: "workflow run URL, setup log, check result, retry reason, rollback decision, escalation note, and PR evidence table",
    risk: "the agent hides execution failure, retries blindly, or invokes automation with more permission than the task requires",
    sources: ["ms-tooling-mcp-envs", "gh-actions-workflows", "gh-copilot-setup-steps", "gh-copilot-cli-actions", "gh-agentic-workflows", "gh-deploy-envs", "gh-review-deployments"],
    artifacts: [
      [".github/workflows/copilot-setup-steps.yml", "Prepares the cloud-agent environment and leaves setup logs for review."],
      [".github/workflows/agent-validation.yml", "Runs validation and records workflow evidence before review or merge."],
      ["docs/recovery-plan.md", "Documents rollback, retry, escalation, and stop conditions for failed execution."]
    ],
    terms: ["workflow run", "setup step", "retry", "rollback", "traceability"]
  },
  {
    name: "Repository governance",
    match: /branch|pull request|pr|issue|repository|codeowners|ruleset|protected|artifacts|instructions/i,
    teaches: "turning agent work into normal GitHub artifacts that reviewers can inspect before risky actions continue",
    controls: "GitHub Issues, repository instructions, branches, pull requests, required checks, CODEOWNERS, branch protection, and rulesets",
    evidence: "issue contract, branch diff, PR summary, check run, CODEOWNERS review, ruleset result, and handoff comment",
    risk: "the agent's chat summary replaces durable GitHub evidence and reviewers cannot reconstruct the decision",
    sources: ["ms-agent-architecture-sdlc", "gh-copilot-cloud-agent", "gh-repository-instructions", "gh-actions-workflows", "gh-protected-branches", "gh-rulesets", "gh-codeowners"],
    artifacts: [
      [".github/ISSUE_TEMPLATE/agent-task.yml", "Makes the task boundary and acceptance criteria explicit before agent work starts."],
      [".github/copilot-instructions.md", "Gives repository-specific build, test, scope, and safety instructions to Copilot."],
      [".github/pull_request_template.md", "Requires plan, changed files, checks, approvals, and residual risk evidence."]
    ],
    terms: ["GitHub issue", "pull request", "branch protection", "ruleset", "CODEOWNERS"]
  },
  {
    name: "Memory and state",
    match: /memory|state|context|stale|drift|resume|handoff|durable|conflicting/i,
    teaches: "deciding what the agent may remember, what must be refreshed, and what must be written to durable GitHub artifacts",
    controls: "Copilot Memory, repository instructions, decision logs, PR comments, workflow artifacts, state files, and stale-context checks",
    evidence: "memory policy, state checkpoint, current issue and PR review, latest branch diff, latest workflow result, and decision log",
    risk: "old assumptions survive across sessions and conflict with current issue comments, source code, CI, or reviewer decisions",
    sources: ["ms-agentic-foundations", "gh-copilot-memory", "gh-custom-instructions-support", "gh-repository-instructions", "gh-actions-workflows", "ms-foundry-responsible-ai"],
    artifacts: [
      ["docs/agent-state.md", "Records current task state, decisions, files, checks, blockers, and next owner."],
      ["docs/agent-memory-policy.md", "Defines memory scope, expiration, pruning, reset, and review rules."],
      ["docs/context-handoff.md", "Carries state between sessions, tools, or agents without relying on chat memory."]
    ],
    terms: ["Copilot Memory", "state checkpoint", "context drift", "stale context", "durable artifact"]
  },
  {
    name: "Evaluation and tuning",
    match: /evaluation|evaluate|signals|scanning|scan|failure|root cause|tune|tuning|refine|regression|overfitting|accessibility/i,
    teaches: "turning agent results into measurable signals, classifying failures, and tuning only after evidence explains the cause",
    controls: "workflow checks, scan outputs, logs, traces, evaluation plans, tuning logs, regression checks, rulesets, and reviewer notes",
    evidence: "expected-versus-actual table, check logs, scan evidence, root-cause label, tuning change, regression rerun, and accepted-risk note",
    risk: "the agent changes instructions, memory, or tool access before the failure mode is understood and retested",
    sources: ["ms-foundry-responsible-ai", "gh-actions-workflows", "gh-cloud-agent-risks", "gh-deploy-envs", "gh-rulesets", "gh-codeowners"],
    artifacts: [
      ["docs/evaluation-plan.md", "Defines success criteria, operational constraints, signals, thresholds, and evidence sources."],
      ["docs/error-analysis.md", "Classifies failures and explains whether the cause was reasoning, tool, context, environment, or instruction."],
      ["docs/tuning-log.md", "Records each behavior change and the regression evidence after tuning."]
    ],
    terms: ["evaluation signal", "root-cause analysis", "scan evidence", "tuning", "regression"]
  },
  {
    name: "Multi-agent coordination",
    match: /multi-agent|orchestration|parallel|conflict|handoff|duplicate|contradictory|roles|replacement|retirement|retire|degraded/i,
    teaches: "coordinating multiple agents with isolated ownership, explicit handoffs, conflict arbitration, and lifecycle decisions",
    controls: "custom-agent roles, branch isolation, handoff contracts, conflict logs, workflow artifacts, audit trail, and recovery plan",
    evidence: "role map, branch ownership map, handoff packet, conflict record, failed-agent state, recovery decision, and final review note",
    risk: "multiple agents modify overlapping scope or pass contradictory conclusions without a human-owned arbitration point",
    sources: ["ms-agentic-foundations", "gh-custom-agents-config", "gh-mcp-cloud-agent", "gh-actions-workflows", "gh-cloud-agent-risks", "gh-agentic-workflows"],
    artifacts: [
      ["docs/agent-roles.md", "Defines planner, builder, tester, reviewer, security, docs, and release responsibilities."],
      ["docs/multi-agent-plan.md", "Maps sequencing, parallel branches, file ownership, dependencies, and stop conditions."],
      ["docs/conflict-log.md", "Records overlap, duplicate effort, contradictions, arbitration, and final decision."]
    ],
    terms: ["orchestration pattern", "branch isolation", "handoff packet", "conflict arbitration", "agent lifecycle"]
  },
  {
    name: "Guardrails and approvals",
    match: /guardrail|autonomy|human|approval|authorization|irreversible|compliance|security|responsible ai|policy|audit|risk|velocity/i,
    teaches: "right-sizing autonomy through risk classification, policy blocking, least privilege, explicit authorization, and audit evidence",
    controls: "autonomy matrix, guardrail policy, branch protection, rulesets, CODEOWNERS, protected environments, MCP access policy, and audit trail",
    evidence: "risk tier, allowed action, denied action, approval owner, check result, environment review, PR review, and audit note",
    risk: "approvals become ceremony while privileged or irreversible actions remain possible before a human decision",
    sources: ["ms-responsible-ai-principles", "ms-foundry-responsible-ai", "gh-cloud-agent-risks", "gh-protected-branches", "gh-rulesets", "gh-codeowners", "gh-deploy-envs", "gh-review-deployments", "gh-mcp-server-access"],
    artifacts: [
      ["docs/autonomy-matrix.md", "Maps actions to allowed autonomy, required review, validation, and owner."],
      ["docs/guardrails.md", "Defines blocked actions, policy boundaries, approval gates, and escalation rules."],
      ["docs/approval-policy.md", "Shows which changes require explicit authorization before the agent continues."]
    ],
    terms: ["autonomy level", "guardrail", "explicit authorization", "protected environment", "audit evidence"]
  }
];

function topicFor(lesson) {
  const title = lesson.title;
  const matches = topicRules.filter((rule) => rule.match.test(title));
  const profile = domainProfiles[lesson.domainId];
  const primary = matches[0] || {
    name: profile.examLens,
    teaches: `applying the skill "${lessonTitle(lesson)}" as a concrete GitHub control rather than a vague agent instruction`,
    controls: profile.taskObject,
    evidence: profile.evidence,
    risk: profile.defaultRisk,
    sources: profile.sources,
    artifacts: [],
    terms: []
  };
  return {
    ...primary,
    sources: unique([...(primary.sources || []), ...matches.flatMap((rule) => rule.sources || [])]),
    artifacts: [...(primary.artifacts || []), ...matches.flatMap((rule) => rule.artifacts || [])],
    terms: unique([...(primary.terms || []), ...matches.flatMap((rule) => rule.terms || [])])
  };
}

function sourcePack(lesson, topic) {
  const profile = domainProfiles[lesson.domainId];
  const ids = unique([
    "ms-gh600-guide",
    ...topic.sources,
    ...profile.sources,
    ...(lesson.sourceIds || [])
  ]);
  const broad = new Set([
    "ms-gh600-guide",
    "ms-agentic-foundations",
    "ms-agent-architecture-sdlc",
    "ms-tooling-mcp-envs",
    "ms-responsible-ai-principles",
    "ms-foundry-responsible-ai"
  ]);
  const hasMicrosoft = ids.some((id) => id.startsWith("ms-"));
  const hasGithub = ids.some((id) => id.startsWith("gh-"));
  const specificCount = ids.filter((id) => !broad.has(id)).length;
  if (!hasMicrosoft) ids.push("ms-agentic-foundations");
  if (!hasGithub) ids.push("gh-copilot-cloud-agent");
  if (specificCount < 2) ids.push("gh-actions-workflows", "gh-cloud-agent-risks");
  return unique(ids);
}

function documentationProfile(lesson, topic, sourceIds) {
  return {
    level: "primary-source-pack",
    primarySourceIds: sourceIds,
    selectionRationale: [
      `The official GH-600 study guide anchors ${lesson.title} to the current exam blueprint and domain weighting.`,
      `The GitHub Docs sources show the concrete controls for ${topic.controls}, so the lesson teaches implementable behavior.`,
      `The Microsoft Learn or Responsible AI source keeps ${lesson.title} tied to governance, safety, and production SDLC expectations.`
    ]
  };
}

function artifactsFor(lesson, topic) {
  const profile = domainProfiles[lesson.domainId];
  return unique([...topic.artifacts, ...profile.artifacts].map(([artifactPath]) => artifactPath))
    .slice(0, 7)
    .map((artifactPath) => {
      const found = [...topic.artifacts, ...profile.artifacts].find(([candidate]) => candidate === artifactPath);
      return asArtifact(
        artifactPath,
        `${found?.[1] || "Records the lesson-specific control and review evidence."} Lesson use: support the skill "${lessonTitle(lesson)}" with evidence a reviewer can inspect.`
      );
    });
}

function keyTermsFor(lesson, topic) {
  const profile = domainProfiles[lesson.domainId];
  return unique([lesson.title, topic.name, ...topic.terms, ...profile.terms, "GH-600 evidence", "human review"]).slice(0, 8);
}

function reviseLesson(lesson) {
  if (preserveEditorialLessons.has(lesson.id)) return lesson;
  const profile = domainProfiles[lesson.domainId];
  const topic = topicFor(lesson);
  const sourceIds = sourcePack(lesson, topic);
  const examStatus = lesson.extended
    ? "This is a supporting lesson, not a separate official GH-600 skill bullet; it deepens a behavior that appears inside the domain."
    : "This is an official GH-600 skill from the Microsoft Learn study guide.";
  const skill = lessonTitle(lesson);
  const skillLower = lowerTitle(lesson);
  const artifacts = artifactsFor(lesson, topic);
  const scenarioBody = `In the ${profile.repo} repository, a maintainer asks an agent to ${profile.issue}. The specific decision is how to apply the skill "${skill}". The repository has required checks, owner-reviewed paths, and at least one workflow or data boundary that could be unsafe if the agent continues without the right control.`;

  return {
    ...lesson,
    title: skill,
    qualityTier: "gold",
    sourceIds,
    whyExam: `${examStatus} GH-600 scenario questions can ask which control, artifact, or human decision makes the skill "${skill}" safe inside ${profile.examLens}.`,
    plainLanguage: [
      `The skill "${skill}" means turning an agent instruction into a concrete GitHub workflow decision. The agent should know what it may read, what it may change, which tool or memory boundary applies, and what evidence must exist before a reviewer trusts the result.`,
      `For this lesson, do not memorize a slogan. Learn the operating pattern: define the boundary, choose the GitHub or Copilot control, make the agent produce inspectable evidence, and stop before ${topic.risk}.`
    ],
    core: [
      `"${skill}" teaches ${topic.teaches}. On GH-600, the correct answer usually names a GitHub-visible control rather than saying the agent should be careful.`,
      `Start by identifying the request, the execution boundary, the allowed tools or memory, the output artifact, the validation signal, and the human decision point. This converts the skill into a reviewable task instead of an open-ended prompt.`,
      `In GitHub, implement the lesson through ${topic.controls}. The exact control can vary by scenario, but it must be visible in an issue, branch, pull request, workflow run, policy, or documented review artifact.`,
      `Strong evidence for ${skillLower} includes ${topic.evidence}. A reviewer should be able to inspect those artifacts without relying on the agent's final chat summary.`,
      `Wrong answers usually move too fast, grant broad autonomy, skip a plan or check, hide uncertainty, or postpone review until after ${topic.risk}. Choose the answer that prevents the failure before execution, not the one that explains it afterward.`
    ],
    githubDetail: `Use ${topic.controls} to make ${skillLower} enforceable. In practice, connect the lesson to ${profile.taskObject}; then require ${topic.evidence} before merge, deployment, or broader access.`,
    practicalExample: `A maintainer in ${profile.repo} asks an agent to ${profile.issue}. A strong implementation of the skill "${skill}" creates or updates ${artifacts.slice(0, 3).map((item) => `\`${item.path}\``).join(", ")}, runs the named validation path, and records ${topic.evidence} in the pull request before the next risky action is allowed.`,
    examTrap: `For ${skill}, choosing the option that sounds efficient but lets the agent continue before ${topic.risk}.`,
    scenario: {
      title: `${skill} in ${profile.repo}`,
      body: scenarioBody,
      goodAnswer: `Apply the skill "${skill}" by setting the narrow boundary first, using ${topic.controls}, requiring ${topic.evidence}, and pausing for the named human owner when the task crosses a sensitive, privileged, or uncertain boundary.`,
      trap: `Letting the agent proceed because it is already making progress, while ${topic.risk}.`
    },
    takeaways: [
      `${skill} must produce a concrete GitHub control or artifact, not only a better prompt.`,
      `The safest answer defines scope, tool or memory boundary, evidence, and approval before risky execution.`,
      `Reviewer-visible evidence matters more than agent confidence or a polished final summary.`,
      `${lesson.extended ? "Treat this support lesson as practical reinforcement for the official domain, not as a separate exam objective." : "Tie this official skill directly to the GH-600 blueprint wording and domain weight."}`
    ],
    revisionQuestions: [
      `Which official GH-600 domain behavior does ${skill} support?`,
      `What GitHub artifact would prove ${skillLower} was handled correctly?`,
      `Which tool, memory, repository, workflow, or approval boundary is most important here?`,
      `What would be too permissive or too late in an exam answer about ${skill}?`,
      `What evidence would a reviewer inspect before allowing the next action?`
    ],
    relatedLabs: [],
    relatedQuiz: [],
    caseStudy: {
      title: `Case study: ${profile.repo}`,
      repository: profile.repo,
      issue: `Agent task: ${skillLower}`,
      situation: `The team uses GitHub as the control plane for an agentic SDLC workflow. The immediate skill is "${skill}", and the agent must operate inside the repository's checks, owner review, and documented execution boundaries.`,
      decision: `Use ${topic.controls}; capture ${topic.evidence}; and make the reviewer decide whether the agent may continue, revise, or stop.`,
      wrongMove: `The risky move is to let the agent continue because output looks useful while ${topic.risk}.`,
      reviewArtifact: `Expected artifact: ${artifacts.slice(0, 2).map((item) => item.path).join(" plus ")} with source-backed evidence and a clear next human decision.`,
      reviewerQuestion: `Does the evidence prove ${skillLower}, or does it only show that the agent produced output?`
    },
    actionOverview: `The skill "${skill}" becomes exam-ready when you can choose the right GitHub control, write the artifact, validate the result, and explain the stop condition.`,
    actionSteps: [
      `Restate the repository task and the exact skill: ${skillLower}.`,
      `Name the allowed inputs, editable scope, denied scope, and tool or memory boundary before execution.`,
      `Select the GitHub or Copilot control: ${topic.controls}.`,
      `Create or update ${artifacts.slice(0, 2).map((item) => `\`${item.path}\``).join(" and ")} so the rule is durable.`,
      `Define validation evidence before work starts: ${topic.evidence}.`,
      `Add the human approval point for sensitive files, broad access, irreversible action, or policy uncertainty.`,
      `Run or require the check, scan, workflow, or review that proves the control worked.`,
      `Write the PR or handoff note with changed files, evidence, unresolved risk, and next decision.`,
      `Reject any answer path where ${topic.risk}.`
    ],
    filesToCreate: artifacts,
    agentRequestTemplate: `For this GH-600 lesson, handle the skill "${skill}" as a controlled GitHub workflow. Before acting, return the task boundary, allowed tools or memory, denied actions, source-backed control, files or policies to update, validation evidence, approval gate, and stop conditions. Do not continue if ${topic.risk}; ask for a reviewer decision with evidence instead.`,
    enterpriseChecklist: [
      `${skill} is mapped to the official domain and source-backed control set.`,
      `The agent has the smallest useful repository, branch, tool, workflow, or memory scope.`,
      `The required evidence is durable in GitHub artifacts, not only in chat.`,
      `Sensitive or irreversible actions stop for a named human owner before execution.`,
      `The PR or handoff lets a reviewer approve, reject, or request revision without reconstructing hidden context.`
    ],
    whatNotToDo: [
      `Do not treat agent confidence as proof that ${skill} was done correctly.`,
      `Do not grant broad tool, repository, workflow, memory, or deployment access because review happens later.`,
      `Do not hide failure, uncertainty, or scope expansion outside the issue, PR, log, or decision artifact.`
    ],
    examActionDrill: [
      `Identify the control plane object: issue, branch, PR, workflow, MCP policy, memory record, environment, or approval.`,
      `Choose the answer that creates evidence before the risky action occurs.`,
      `Eliminate answers that skip scope, least privilege, validation, human review, or durable handoff.`
    ],
    keyTerms: keyTermsFor(lesson, topic),
    accuracy: makeAccuracy(),
    documentationProfile: documentationProfile(lesson, topic, sourceIds)
  };
}

function labFor(lesson, nextNumber) {
  const profile = domainProfiles[lesson.domainId];
  const topic = topicFor(lesson);
  const sourceIds = sourcePack(lesson, topic);
  const skill = lessonTitle(lesson);
  const skillLower = lowerTitle(lesson);
  const artifacts = artifactsFor(lesson, topic).slice(0, 3);
  return {
    id: `lab-${String(nextNumber).padStart(2, "0")}-${lesson.id.replace(/^domain-\d+-lesson-\d+-/, "").slice(0, 54).replace(/-$/, "")}`,
    title: `${skill} evidence lab`,
    labType: "Gold lesson lab",
    qualityTier: "gold",
    lessonIds: [lesson.id],
    domainId: lesson.domainId,
    domain: lesson.domain,
    skillIds: [lesson.skillId],
    objective: `Create a reviewable GitHub evidence package that demonstrates the skill "${skill}" using the lesson's source-backed controls, validation path, and human decision point.`,
    requiredTools: [
      "GitHub issue or task contract",
      "Markdown editor",
      "Pull request template",
      "Workflow or validation evidence",
      "Source links from the lesson"
    ],
    setup: `Use a sample repository named ${profile.repo}. Work as if a GitHub agent will perform the task after your plan is approved.`,
    steps: [
      `Write the task request and mark the target skill as ${skillLower}.`,
      `List the allowed inputs, editable files or paths, denied scope, and required evidence.`,
      `Create the primary artifact \`${artifacts[0]?.path || "docs/agent-plan.md"}\` and tie it to the lesson source pack.`,
      `Create a second control artifact \`${artifacts[1]?.path || "docs/approval-policy.md"}\` that names the approval or stop condition.`,
      `Define the validation route using checks, workflow logs, scan output, review notes, or state evidence as appropriate.`,
      `Add a failure case: what the agent must do if ${topic.risk}.`,
      `Write the PR handoff: changed artifacts, evidence, source links, open risks, and next human decision.`
    ],
    expectedResult: `A lesson-specific evidence package that proves ${skillLower} through concrete GitHub artifacts, validation evidence, source links, and a clear approval or stop decision.`,
    validation: `A reviewer can inspect only the created artifacts and answer what the agent may do, what it may not do, which evidence proves success, and who owns the next decision.`,
    commonFailure: `The lab stays generic and describes responsible agent use without naming the GitHub control, evidence, or approval path for ${skillLower}.`,
    recovery: `Rewrite the artifacts around ${topic.controls}, add ${topic.evidence}, and require a reviewer decision before the agent continues.`,
    examRelevance: `Rehearses GH-600 questions that ask how to apply ${skillLower} inside production SDLC workflows with GitHub as the control plane.`,
    sourceIds,
    accuracy: makeAccuracy()
  };
}

function quizSetFor(lesson) {
  const profile = domainProfiles[lesson.domainId];
  const topic = topicFor(lesson);
  const sourceIds = sourcePack(lesson, topic);
  const skill = lessonTitle(lesson);
  const skillLower = lowerTitle(lesson);
  return [
    {
      question: `A maintainer asks a GitHub agent to apply the skill "${skill}" in ${profile.repo}. Which first response is strongest?`,
      options: [
        "Let the agent begin implementation and summarize the decision later.",
        `Create a scoped plan that names ${topic.controls}, required evidence, and the human stop point before execution.`,
        "Grant broad repository and workflow access because the branch will still require review.",
        "Ask the agent to choose whatever tool path seems fastest after exploring the repository."
      ],
      correctIndex: 1,
      correctExplanation: `Correct: ${skill} must become a bounded GitHub workflow with controls, evidence, and approval before the agent takes risky action.`,
      wrongRationales: [
        { optionIndex: 0, rationale: "Implementation first reverses the control order and can create risk before scope or validation is agreed." },
        { optionIndex: 2, rationale: "Branch review is useful, but it does not justify unnecessary tool, workflow, or repository permission." },
        { optionIndex: 3, rationale: "Agent exploration must happen inside a reviewed boundary, not define the boundary after access is granted." }
      ],
      examTrap: `Letting speed outrank the control needed for ${skillLower}.`
    },
    {
      question: `Which reviewer-visible evidence best proves the skill "${skill}" was handled correctly in this repository workflow?`,
      options: [
        "A confident final message from the agent with no links to artifacts.",
        `${topic.evidence}, connected to the issue, branch, pull request, workflow, or policy record.`,
        "A note that the agent did not see any obvious errors during its work.",
        "A broad checklist copied from another lesson without task-specific source links."
      ],
      correctIndex: 1,
      correctExplanation: `Correct: reviewer-visible evidence is the difference between actual GH-600 control and a generic agent summary because it lets another person verify scope, validation, and approval.`,
      wrongRationales: [
        { optionIndex: 0, rationale: "A final message is not independently reviewable and does not prove the control was enforced in the repository workflow." },
        { optionIndex: 2, rationale: "No obvious errors is a weak claim; the exam expects named validation, source-backed controls, and evidence." },
        { optionIndex: 3, rationale: "Generic checklists do not prove this specific skill or connect the task to official sources and artifacts." }
      ],
      examTrap: "Accepting narration as evidence."
    },
    {
      question: `What is the main risk when a GH-600 scenario about the skill "${skill}" chooses the fastest agent path?`,
      options: [
        `The path may allow ${topic.risk} before the reviewer sees evidence.`,
        "The agent will always refuse to create a branch.",
        "GitHub Actions cannot be used for agent validation.",
        "Human review is never useful for agentic workflows."
      ],
      correctIndex: 0,
      correctExplanation: `Correct: GH-600 favors preventing the lesson-specific failure before execution because late explanation cannot undo unsafe access, hidden state, or missing approval evidence.`,
      wrongRationales: [
        { optionIndex: 1, rationale: "Agents can work with branches when configured and reviewed appropriately; the problem is uncontrolled scope." },
        { optionIndex: 2, rationale: "Workflow checks and logs are common evidence sources for agent validation and should not be dismissed." },
        { optionIndex: 3, rationale: "Human review is essential for sensitive, uncertain, irreversible, or compliance-relevant decisions in governed workflows." }
      ],
      examTrap: "Choosing speed without identifying the failure mode."
    },
    {
      question: `A reviewer says the agent already completed the work for the skill "${skill}". What should they inspect before approval?`,
      options: [
        "Only the changed files, because evidence slows down delivery.",
        "Only the original prompt, because prompts define all expected behavior.",
        `The task boundary, source-backed control, ${topic.evidence}, and unresolved risk in the PR or handoff.`,
        "Only whether the agent used advanced reasoning."
      ],
      correctIndex: 2,
      correctExplanation: `Correct: approval should be based on scope, control, validation, evidence, and residual risk, not on output alone or the agent's confidence.`,
      wrongRationales: [
        { optionIndex: 0, rationale: "Changed files do not explain whether the agent stayed within scope or met the required control." },
        { optionIndex: 1, rationale: "The prompt is input, not proof that the work stayed safe and correct." },
        { optionIndex: 3, rationale: "Reasoning claims are not enough without artifacts, validation evidence, and reviewer-visible decision records." }
      ],
      examTrap: "Approving output without checking the control path."
    },
    {
      question: `Which answer should you eliminate in a GH-600 question about the skill "${skill}"?`,
      options: [
        `The answer that defines scope, uses ${topic.controls}, and records reviewable evidence.`,
        "The answer that narrows access and asks for approval before sensitive expansion.",
        "The answer that makes validation and handoff visible in GitHub artifacts.",
        `The answer that lets the agent continue even though ${topic.risk}.`
      ],
      correctIndex: 3,
      correctExplanation: `Correct: GH-600 wrong answers often allow the exact failure the lesson is meant to prevent, especially when they defer evidence or approval until after execution.`,
      wrongRationales: [
        { optionIndex: 0, rationale: "That answer contains the correct structure: boundary, source-backed controls, validation, and reviewer-visible evidence." },
        { optionIndex: 1, rationale: "Narrow access and pre-action approval are usually the safer pattern for sensitive scope." },
        { optionIndex: 2, rationale: "Visible validation and handoff are core evidence patterns across the exam and should be retained." }
      ],
      examTrap: "Missing the delayed-control pattern in a wrong answer."
    }
  ].map((item, index) => ({
    ...item,
    difficulty: index === 0 ? "Applied" : "Scenario",
    sourceIds,
    accuracy: makeAccuracy()
  }));
}

const lessons = readJson("lessons.json");
const labs = readJson("labs.json");
const quizzes = readJson("quizzes.json");
const scenarios = readJson("scenarios.json");

const existingLabIds = new Set(labs.map((lab) => lab.id));
let nextLabNumber = labs.reduce((max, lab) => {
  const match = lab.id.match(/^lab-(\d+)/);
  return match ? Math.max(max, Number(match[1])) : max;
}, 0) + 1;

const curatedLessons = lessons.map(reviseLesson);
const lessonMap = new Map(curatedLessons.map((lesson) => [lesson.id, lesson]));
const newLabs = [];

for (const lesson of curatedLessons) {
  if (lesson.accuracy?.verification !== "human-reviewed") continue;
  const existingGoldLabs = [...labs, ...newLabs].filter((lab) => lab.qualityTier === "gold" && (lab.lessonIds || []).includes(lesson.id));
  if (!existingGoldLabs.length) {
    let lab = labFor(lesson, nextLabNumber++);
    while (existingLabIds.has(lab.id)) lab = labFor(lesson, nextLabNumber++);
    existingLabIds.add(lab.id);
    newLabs.push(lab);
    lesson.relatedLabs = [lab.id];
  } else {
    lesson.relatedLabs = [existingGoldLabs[0].id];
  }

  const lessonQuizIds = quizzes.filter((quiz) => quiz.lessonId === lesson.id).map((quiz) => quiz.id).sort();
  lesson.relatedQuiz = lessonQuizIds.slice(0, 5);
}

const quizByLesson = new Map();
for (const lesson of curatedLessons) {
  if (lesson.accuracy?.verification !== "human-reviewed") continue;
  quizByLesson.set(lesson.id, quizSetFor(lesson));
}

const curatedQuizzes = quizzes.map((quiz) => {
  const lesson = lessonMap.get(quiz.lessonId);
  if (!lesson || lesson.accuracy?.verification !== "human-reviewed") return quiz;
  if (lesson.id.startsWith("domain-1-lesson-0") || lesson.id === "domain-1-lesson-10-configure-human-intervention-for-autonomous-agents-without-slowing-delivery") {
    return quiz;
  }
  const lessonQuizIds = lesson.relatedQuiz || [];
  const index = lessonQuizIds.indexOf(quiz.id);
  if (index < 0 || index > 4) return quiz;
  const replacement = quizByLesson.get(lesson.id)[index];
  return {
    ...quiz,
    ...replacement,
    id: quiz.id,
    domainId: lesson.domainId,
    domain: lesson.domain,
    skillId: lesson.skillId,
    lessonId: lesson.id
  };
});

const scenarioByLesson = new Map(scenarios.map((scenario) => [scenario.lessonId, scenario]));
let nextScenarioNumber = scenarios.reduce((max, scenario) => {
  const match = scenario.id.match(/^scenario-(\d+)/);
  return match ? Math.max(max, Number(match[1])) : max;
}, 0) + 1;
const curatedScenarios = [...scenarios];

for (const lesson of curatedLessons) {
  if (!lesson.scenario) continue;
  const sourceIds = lesson.sourceIds;
  const scenarioUpdate = {
    title: lesson.scenario.title,
    domainId: lesson.domainId,
    lessonId: lesson.id,
    prompt: lesson.scenario.body,
    goodAnswer: lesson.scenario.goodAnswer,
    trap: lesson.scenario.trap,
    sourceIds,
    accuracy: makeAccuracy()
  };
  const existing = scenarioByLesson.get(lesson.id);
  if (existing) {
    Object.assign(existing, scenarioUpdate);
  } else {
    curatedScenarios.push({
      id: `scenario-${String(nextScenarioNumber++).padStart(2, "0")}`,
      ...scenarioUpdate
    });
  }
}

writeJson("lessons.json", curatedLessons);
writeJson("labs.json", [...labs, ...newLabs]);
writeJson("quizzes.json", curatedQuizzes);
writeJson("scenarios.json", curatedScenarios);

console.log(JSON.stringify({
  finalLessons: curatedLessons.filter((lesson) => lesson.accuracy?.verification === "human-reviewed").length,
  newGoldLabs: newLabs.length,
  totalLabs: labs.length + newLabs.length,
  scenarios: curatedScenarios.length,
  quizzes: curatedQuizzes.length
}, null, 2));
