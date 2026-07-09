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
    match: /branch|pull request|\bpr\b|issue|repository|codeowners|ruleset|protected|artifacts|instructions/i,
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

function topicPriority(rule, lesson) {
  const title = lessonTitle(lesson).toLowerCase();
  if (rule.name === "MCP governance" && /mcp|toolset|registry|allow list|allow-list|allowlist|remote server|local server|playwright/.test(title)) return 100;
  if (rule.name === "Repository governance" && /branch|pull request|\bpr\b|issue|repository|codeowners|ruleset|protected|artifacts|instructions|creating branches/.test(title)) return 95;
  if (rule.name === "Workflow execution" && /ci workflow|workflow|actions|setup|environment|execution context|constraints|retries|retry|rollback|error handling|traceability|accountability/.test(title)) return 90;
  if (rule.name === "Memory and state" && /memory|state|context|stale|drift|resume|handoff|durable|conflicting|checkpoint|expiry|expiration|pruning|reset/.test(title)) return 88;
  if (rule.name === "Evaluation and tuning" && /evaluation|evaluate|signals|scanning|scan|failure|root cause|tune|tuning|refine|regression|overfitting|accessibility|static analysis|codeql|secret scanning|dependency/.test(title)) return 86;
  if (rule.name === "Multi-agent coordination" && /multi-agent|orchestration|parallel|conflict|handoff|duplicate|contradictory|roles|replacement|retirement|retire|degraded|lifecycle/.test(title)) return 84;
  if (rule.name === "Guardrails and approvals" && /guardrail|autonomy|human|approval|authorization|irreversible|compliance|security|responsible ai|policy|audit|risk|velocity|least-privilege|least privilege/.test(title)) return 82;
  if (rule.name === "Tool permission design" && /tool|permission|read-only|write-capable|scope|least-privilege|least privilege/.test(title)) return 70;
  return 10;
}

function topicFor(lesson) {
  const title = lesson.title;
  const matches = topicRules
    .filter((rule) => rule.match.test(title))
    .sort((a, b) => topicPriority(b, lesson) - topicPriority(a, lesson));
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

const artifactCatalog = {
  ".github/ISSUE_TEMPLATE/agent-task.yml": "Captures the issue-level goal, scope, non-goals, validation, risk tier, and stop conditions before an agent starts work.",
  "docs/agent-task-contract.md": "Expands the task contract with inputs, outputs, success criteria, tool boundaries, evidence, and approval owners.",
  "docs/agent-step-map.md": "Shows the ordered agent phases from intake through handoff so reviewers can evaluate the safest next step.",
  "docs/agent-anti-pattern-review.md": "Records unsafe workflow symptoms, risk impact, mitigation controls, and the GitHub evidence that proves the mitigation.",
  "docs/agent-plan.md": "Separates planning from execution by recording assumptions, target files, validation, risks, and approval points before edits.",
  ".github/pull_request_template.md": "Requires changed files, checks, approvals, source links, residual risk, and rollback evidence in the pull request.",
  ".github/CODEOWNERS": "Routes sensitive paths, policy files, workflows, and owned domains to accountable reviewers before merge.",
  ".github/copilot-instructions.md": "Defines repository-specific instructions, build/test commands, safety boundaries, and stop conditions for Copilot.",
  "AGENTS.md": "Defines local operating rules for agents, including scope, validation, evidence, and stop conditions.",
  "docs/agent-approval-gates.md": "Names the human approval point for sensitive, irreversible, privileged, or uncertain agent actions.",
  "docs/approval-policy.md": "Explains when explicit authorization is required and which GitHub control records the decision.",
  "docs/branch-scope-control.md": "Documents branch purpose, allowed paths, denied paths, required checks, CODEOWNERS review, and ruleset or protection evidence.",
  "docs/agent-tool-permission-matrix.md": "Maps each tool to task need, access level, denied use, data boundary, validation evidence, and escalation owner.",
  "docs/mcp-tool-policy.md": "Defines approved MCP servers, allowed toolsets, denied capabilities, data boundaries, and review requirements.",
  "docs/agent-mcp-server-review.md": "Reviews an MCP server against registry, allow-list, remote/local trust, data exposure, toolset, and audit requirements.",
  "docs/mcp-allowlist-decision.md": "Records the MCP allow-list or registry decision, selected server, selected toolsets, denied operations, and reviewer approval.",
  "docs/environment-constraints.md": "Constrains runner, network, secrets, token permissions, environments, and external systems for agent execution.",
  ".github/workflows/copilot-setup-steps.yml": "Prepares the Copilot cloud-agent environment and leaves setup logs for dependency and environment review.",
  ".github/workflows/agent-validation.yml": "Runs repeatable build, test, scan, or validation checks and preserves workflow evidence for review.",
  "docs/escalation-paths.md": "Explains what evidence the agent must provide before asking for broader scope, stronger tools, or human intervention.",
  "docs/recovery-plan.md": "Documents retry, rollback, containment, replacement, and human-in-the-loop recovery when agent work fails.",
  "docs/agent-trace-review.md": "Captures tool calls, handoffs, guardrail events, workflow logs, and unexpected behavior from an agent run.",
  "docs/agent-state.md": "Records current progress, branch, files, checks, blockers, assumptions, and next owner for long-running work.",
  "docs/agent-memory-policy.md": "Defines what the agent may remember, reuse, expire, prune, reset, redact, or write to durable state.",
  "docs/context-handoff.md": "Transfers state between sessions, agents, or tools without relying on hidden chat memory.",
  "docs/decision-log.md": "Records durable decisions with owner, date, source evidence, rationale, superseding rule, and review trigger.",
  "docs/resume-checkpoint.md": "Creates a safe checkpoint for resumed work, including current state, validation status, and stale-context checks.",
  "docs/stale-context-checklist.md": "Forces a refresh of issue, PR, branch, CI, instructions, source docs, and policy before reused context is trusted.",
  "docs/agent-evaluation-plan.md": "Defines success criteria, evaluation signals, thresholds, datasets, human review, and release decision rules.",
  "docs/security-scan-evidence.md": "Records CodeQL, secret scanning, dependency, policy, or accessibility scan scope, findings, disposition, and owner.",
  "docs/agent-failure-analysis.md": "Classifies failures by reasoning, prompt, context, tool, environment, handoff, evaluation, or governance root cause.",
  "docs/error-analysis.md": "Converts incorrect, unsafe, or incomplete behavior into a specific root-cause fix and regression case.",
  "docs/tuning-log.md": "Records instruction, memory, tool, routing, or guardrail changes with before/after evidence and rollback plan.",
  "docs/regression-checklist.md": "Lists baseline cases, adjacent cases, rerun commands, thresholds, and owner approval after tuning or fixes.",
  "docs/agent-roles.md": "Defines each agent role, responsibility, input, output, tool boundary, handoff rule, and stop condition.",
  "docs/multi-agent-plan.md": "Coordinates sequencing, parallel branches, file ownership, dependencies, validation, and stop conditions.",
  "docs/multi-agent-handoff-contract.md": "Transfers branch, files, decisions, evidence, open risks, and next owner between agents.",
  "docs/conflict-log.md": "Records overlapping edits, duplicate work, contradictory outputs, arbitration, and final decision.",
  "docs/multi-agent-arbitration-record.md": "Names the human arbitration owner and final decision when agent outputs conflict or overlap.",
  "docs/duplicate-effort-checklist.md": "Checks whether multiple agents are solving the same work, touching the same files, or producing redundant evidence.",
  "docs/agent-lifecycle-record.md": "Records agent addition, reconfiguration, replacement, retirement, preserved state, and audit continuity.",
  "docs/autonomy-matrix.md": "Maps action types to autonomy level, allowed behavior, blocked behavior, approval requirement, validation, and owner.",
  "docs/guardrails.md": "Defines blocked actions, controlled paths, policy boundaries, trigger conditions, and safe alternatives.",
  "docs/responsible-ai-risk-review.md": "Reviews fairness, reliability, privacy, security, transparency, accountability, and human oversight risk.",
  "docs/least-privilege-access-review.md": "Reviews repository, branch, workflow, MCP, secret, environment, and deployment access against task need.",
  "docs/sensitive-action-control.md": "Defines controls for irreversible, privileged, production, data-handling, compliance, or deployment actions.",
  "docs/policy-violation-record.md": "Records blocked or denied actions, violated policy, evidence, owner decision, and corrective path.",
  "docs/audit-trail.md": "Collects chronological PR, workflow, approval, environment, tool-call, and review evidence for accountability.",
  "docs/agent-handoff.md": "Captures completed steps, changed artifacts, validation, open risks, blocked work, and the next human decision."
};

const baseArtifacts = [
  ".github/ISSUE_TEMPLATE/agent-task.yml",
  "docs/agent-task-contract.md",
  "docs/agent-plan.md",
  ".github/pull_request_template.md"
];

function artifactsFrom(paths, lesson) {
  return unique(paths)
    .slice(0, 8)
    .map((artifactPath) => asArtifact(
      artifactPath,
      `${artifactCatalog[artifactPath] || "Records the lesson-specific control and review evidence."} Lesson use: support "${lessonTitle(lesson)}" with evidence a reviewer can inspect.`
    ));
}

function templateRecommendationPaths(lesson, topic) {
  const title = lessonTitle(lesson).toLowerCase();
  const category = topicSpecificCategory(lesson, topic);
  const paths = [];

  if (lesson.domainId === "domain-1") {
    paths.push(...baseArtifacts, ".github/CODEOWNERS", "docs/agent-approval-gates.md", "docs/agent-handoff.md");
    if (/step|decompos|perform/.test(title)) paths.push("docs/agent-step-map.md");
    if (/anti-pattern|mitigate/.test(title)) paths.push("docs/agent-anti-pattern-review.md", "docs/agent-tool-permission-matrix.md");
    if (/planning|structured plan|validate agent plans/.test(title)) paths.push("docs/agent-approval-gates.md", "docs/responsible-ai-risk-review.md");
    if (/autonomy|guardrail|human intervention|checked and approved/.test(title)) paths.push("docs/autonomy-matrix.md", "docs/guardrails.md", "docs/approval-policy.md");
    if (/inspectable|artifact|pull request/.test(title)) paths.push("docs/audit-trail.md", "docs/agent-trace-review.md");
    return paths;
  }

  if (lesson.domainId === "domain-2") {
    if (category === "MCP and tool access") {
      paths.push(
        "docs/mcp-tool-policy.md",
        "docs/agent-mcp-server-review.md",
        "docs/mcp-allowlist-decision.md",
        "docs/agent-tool-permission-matrix.md",
        "docs/environment-constraints.md",
        "docs/escalation-paths.md",
        ".github/workflows/copilot-setup-steps.yml",
        ".github/workflows/agent-validation.yml"
      );
      return paths;
    }
    if (/branch|repository scope|specific repository|pull request|autonomous pr|creating branches/.test(title)) {
      paths.push(
        "docs/branch-scope-control.md",
        ".github/ISSUE_TEMPLATE/agent-task.yml",
        ".github/CODEOWNERS",
        ".github/pull_request_template.md",
        "docs/environment-constraints.md",
        "docs/agent-tool-permission-matrix.md",
        "docs/escalation-paths.md"
      );
      return paths;
    }
    if (category === "Workflow execution") {
      paths.push(
        ".github/workflows/copilot-setup-steps.yml",
        ".github/workflows/agent-validation.yml",
        "docs/environment-constraints.md",
        "docs/recovery-plan.md",
        "docs/escalation-paths.md",
        "docs/agent-trace-review.md",
        "docs/agent-tool-permission-matrix.md"
      );
      return paths;
    }
    paths.push(
      "docs/agent-tool-permission-matrix.md",
      "docs/environment-constraints.md",
      "docs/escalation-paths.md",
      "docs/autonomy-matrix.md",
      "docs/guardrails.md",
      ".github/workflows/agent-validation.yml"
    );
    return paths;
  }

  if (lesson.domainId === "domain-3") {
    paths.push(
      "docs/agent-memory-policy.md",
      "docs/agent-state.md",
      "docs/resume-checkpoint.md",
      "docs/stale-context-checklist.md",
      "docs/decision-log.md",
      "docs/context-handoff.md"
    );
    if (/shared|multi-agent|conflicting/.test(title)) paths.push("docs/agent-roles.md", "docs/conflict-log.md");
    if (/workflow artifact|repository artifact|issues and pull requests/.test(title)) paths.push(".github/pull_request_template.md", ".github/workflows/agent-validation.yml");
    return paths;
  }

  if (lesson.domainId === "domain-4") {
    paths.push(
      "docs/agent-evaluation-plan.md",
      ".github/workflows/agent-validation.yml",
      "docs/security-scan-evidence.md",
      "docs/agent-failure-analysis.md",
      "docs/error-analysis.md",
      "docs/tuning-log.md",
      "docs/regression-checklist.md"
    );
    if (/trace|logs|workflow artifacts/.test(title)) paths.push("docs/agent-trace-review.md");
    if (/memory/.test(title)) paths.push("docs/agent-memory-policy.md", "docs/stale-context-checklist.md");
    if (/tool/.test(title)) paths.push("docs/agent-tool-permission-matrix.md");
    return paths;
  }

  if (lesson.domainId === "domain-5") {
    paths.push(
      "docs/agent-roles.md",
      "docs/multi-agent-plan.md",
      "docs/multi-agent-handoff-contract.md",
      "docs/conflict-log.md",
      "docs/multi-agent-arbitration-record.md",
      "docs/duplicate-effort-checklist.md",
      "docs/recovery-plan.md"
    );
    if (/replace|retire|retirement|lifecycle|add agents|reconfigure/.test(title)) paths.push("docs/agent-lifecycle-record.md");
    if (/parallel|branch/.test(title)) paths.push("docs/branch-scope-control.md", ".github/CODEOWNERS");
    if (/audit|post-hoc|outcomes/.test(title)) paths.push("docs/audit-trail.md", "docs/decision-log.md");
    return paths;
  }

  if (lesson.domainId === "domain-6") {
    paths.push(
      "docs/autonomy-matrix.md",
      "docs/guardrails.md",
      "docs/approval-policy.md",
      "docs/responsible-ai-risk-review.md",
      "docs/least-privilege-access-review.md",
      "docs/sensitive-action-control.md",
      "docs/policy-violation-record.md",
      "docs/audit-trail.md"
    );
    if (/permission|least-privilege|execution context/.test(title)) paths.unshift("docs/agent-tool-permission-matrix.md", "docs/environment-constraints.md");
    if (/velocity|friction|human judgment/.test(title)) paths.push("docs/agent-approval-gates.md");
    return paths;
  }

  return [...baseArtifacts, ...((topic.artifacts || []).map(([artifactPath]) => artifactPath))];
}

function artifactsFor(lesson, topic) {
  return artifactsFrom(templateRecommendationPaths(lesson, topic), lesson);
}

function keyTermsFor(lesson, topic) {
  const profile = domainProfiles[lesson.domainId];
  return unique([lesson.title, topic.name, ...topic.terms, ...profile.terms, "GH-600 evidence", "human review"]).slice(0, 8);
}

const auditRecommendationLabels = {
  "worked-scenario": "Add a richer scenario and one worked exam-style question.",
  "memory-state": "Add concrete memory/state artifact examples and expiry rules.",
  "risk-matrix": "Add a risk matrix with autonomy level and required approval path.",
  "source-config": "Re-check source docs, add current UI/config examples, and mark reviewed.",
  "conflict-tree": "Add a conflict-resolution decision tree and merge/handoff example.",
  "evidence-thresholds": "Add example evidence tables and pass/fail thresholds.",
  "anti-pattern": "Add a named anti-pattern table: symptom, risk, mitigation, GH control.",
  "tuning-before-after": "Add before/after tuning examples and regression safeguards."
};

const auditRecommendationKindByLesson = new Map([
  ["domain-1-lesson-02-identify-and-mitigate-common-anti-patterns-in-agents", "anti-pattern"],
  ["domain-1-lesson-08-plan-and-implement-the-degree-of-agent-autonomy-including-guardrails", "risk-matrix"],
  ["domain-1-lesson-10-configure-human-intervention-for-autonomous-agents-without-slowing-delivery", "risk-matrix"],
  ["domain-1-lesson-15-repository-custom-instructions-as-governance", "source-config"],
  ["domain-2-lesson-04-add-an-mcp-server-as-a-tool-to-an-agent", "source-config"],
  ["domain-2-lesson-05-configure-a-github-remote-mcp-server", "source-config"],
  ["domain-2-lesson-06-configure-the-mcp-registries", "source-config"],
  ["domain-2-lesson-07-configure-mcp-allow-lists", "source-config"],
  ["domain-2-lesson-08-evaluate-the-execution-context-for-an-agent", "memory-state"],
  ["domain-2-lesson-20-tool-risk-classification", "risk-matrix"],
  ["domain-2-lesson-21-github-mcp-server-default-toolsets", "source-config"],
  ["domain-2-lesson-22-remote-mcp-server-versus-local-mcp-server", "source-config"],
  ["domain-2-lesson-23-playwright-mcp-in-agent-validation", "source-config"],
  ["domain-2-lesson-24-repository-level-mcp-configuration", "source-config"],
  ["domain-3-lesson-01-choose-between-short-term-long-term-and-external-memory", "memory-state"],
  ["domain-3-lesson-02-scope-agent-memory-to-task-relevant-information", "memory-state"],
  ["domain-3-lesson-03-define-memory-expiration-pruning-and-reset-rules", "memory-state"],
  ["domain-3-lesson-05-resume-agent-work-without-repeating-steps-or-diverging-from-prior-decisions", "memory-state"],
  ["domain-3-lesson-07-share-agent-state", "memory-state"],
  ["domain-3-lesson-08-prevent-conflicting-context", "conflict-tree"],
  ["domain-3-lesson-09-prevent-stale-context", "memory-state"],
  ["domain-3-lesson-10-repository-artifacts-as-durable-state", "memory-state"],
  ["domain-3-lesson-11-issues-and-pull-requests-as-state-carriers", "memory-state"],
  ["domain-3-lesson-12-workflow-artifacts-as-state-checkpoints", "memory-state"],
  ["domain-3-lesson-13-memory-reset-and-expiry-decisions", "memory-state"],
  ["domain-3-lesson-14-shared-multi-agent-state-contracts", "memory-state"],
  ["domain-4-lesson-02-identify-qualitative-and-quantitative-evaluation-signals-to-evaluate-agents", "evidence-thresholds"],
  ["domain-4-lesson-03-align-evaluation-criteria-with-development-intent", "evidence-thresholds"],
  ["domain-4-lesson-04-generate-evaluation-signals-by-using-automated-scanning-tools", "evidence-thresholds"],
  ["domain-4-lesson-05-identify-failures-by-using-logs-plans-traces-outputs-and-workflow-artifacts", "evidence-thresholds"],
  ["domain-4-lesson-06-classify-root-causes-including-reasoning-errors-tool-misuse-and-context-or-envir", "memory-state"],
  ["domain-4-lesson-08-refine-memory-usage", "memory-state"],
  ["domain-4-lesson-10-static-analysis-codeql-secret-scanning-dependency-checks", "evidence-thresholds"],
  ["domain-4-lesson-11-accessibility-scans-as-evaluation-signals", "evidence-thresholds"],
  ["domain-4-lesson-12-prompt-and-instruction-failure-classification", "evidence-thresholds"],
  ["domain-4-lesson-13-avoiding-overfitting-after-tuning", "tuning-before-after"],
  ["domain-4-lesson-14-regression-checks-after-tuning", "evidence-thresholds"],
  ["domain-5-lesson-03-detect-and-resolve-agent-conflicts-including-overlapping-code-changes-duplicated", "conflict-tree"],
  ["domain-5-lesson-09-implement-multi-agent-recovery-patterns-including-rollback-and-human-in-the-loop", "risk-matrix"],
  ["domain-5-lesson-15-duplicate-effort-detection", "conflict-tree"],
  ["domain-5-lesson-16-contradictory-output-arbitration", "conflict-tree"],
  ["domain-6-lesson-01-classify-agent-actions-by-operational-security-and-compliance-risk-to-right-size", "risk-matrix"],
  ["domain-6-lesson-02-assign-autonomy-levels-to-maximize-delivery-speed-while-remaining-compliant-with", "risk-matrix"],
  ["domain-6-lesson-03-identify-the-subset-of-actions-that-require-human-judgment", "risk-matrix"],
  ["domain-6-lesson-04-block-actions-that-violate-defined-security-compliance-or-responsible-ai-policie", "risk-matrix"],
  ["domain-6-lesson-05-scope-permissions-and-execution-contexts-to-enforce-least-privilege-access", "memory-state"],
  ["domain-6-lesson-06-require-explicit-authorization-or-controlled-paths-for-irreversible-or-complianc", "risk-matrix"],
  ["domain-6-lesson-07-preserve-execution-velocity-by-minimizing-approvals-that-do-not-materially-reduc", "risk-matrix"],
  ["domain-6-lesson-08-operational-security-and-compliance-risk-examples", "risk-matrix"],
  ["domain-6-lesson-10-avoiding-unnecessary-approval-friction", "risk-matrix"],
  ["domain-6-lesson-11-responsible-ai-controls-for-developer-agents", "risk-matrix"]
]);

const uiConfigExampleLessonIds = new Set([
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

const conceptSpecificLessonIds = new Set([
  "domain-3-lesson-06-detect-and-correct-drift-during-extended-agent-execution",
  "domain-5-lesson-06-perform-post-hoc-analysis-of-multi-agent-behavior",
  "domain-5-lesson-08-respond-to-degraded-behavior-or-coordination-across-agents",
  "domain-5-lesson-11-update-reconfigure-or-replace-agents-without-disrupting-active-workflows",
  "domain-5-lesson-12-retire-agents-while-preserving-auditability-and-workflow-continuity",
  "domain-5-lesson-17-agent-replacement-and-retirement-checklist"
]);

function auditKindFor(lesson) {
  return auditRecommendationKindByLesson.get(lesson.id) || "worked-scenario";
}

function primaryArtifact(lesson, topic) {
  return artifactsFor(lesson, topic)[0]?.path || "docs/agent-plan.md";
}

function secondaryArtifact(lesson, topic) {
  return artifactsFor(lesson, topic)[1]?.path || "docs/agent-handoff.md";
}

function workedQuestionFor(lesson, topic, kind) {
  const profile = domainProfiles[lesson.domainId];
  const skill = lessonTitle(lesson);
  const artifact = primaryArtifact(lesson, topic);
  const evidenceArtifact = secondaryArtifact(lesson, topic);
  const kindFocus = {
    "anti-pattern": "spot the anti-pattern before the agent is allowed to act",
    "risk-matrix": "assign the autonomy level and approval path before execution",
    "source-config": "verify the current GitHub configuration path and source-backed setting before approving the agent",
    "memory-state": "write the state artifact and expiry rule before the next session resumes",
    "conflict-tree": "route the conflict through a named arbitration and merge path",
    "evidence-thresholds": "define the pass/fail threshold before treating the agent output as correct",
    "tuning-before-after": "compare the tuning change against a regression safeguard",
    "worked-scenario": "turn the scenario into a bounded GitHub workflow with evidence"
  }[kind];
  return {
    title: "Worked exam-style question",
    scenario: `In ${profile.repo}, an agent is asked to ${profile.issue}. The question focuses on "${skill}". The branch touches a reviewable GitHub workflow, and the team needs a decision that proves the agent stayed inside the intended boundary.`,
    question: `Which answer best applies "${skill}" in a GH-600 scenario?`,
    options: [
      "Let the agent continue while it is making progress, then ask it to summarize what happened at the end.",
      `Require the agent to ${kindFocus}, record the decision in \`${artifact}\`, and attach ${topic.evidence} before broader action continues.`,
      "Give the agent broader repository and workflow access because the pull request will still be reviewed.",
      `Ask the agent to choose its own control after exploring the repository because ${skill.toLowerCase()} depends on implementation details.`
    ],
    correctIndex: 1,
    strongAnswer: `Choose the option that makes "${skill}" concrete before risky execution: it names the boundary, the GitHub control, the evidence, and the human decision path. The expected artifact is \`${artifact}\` or \`${evidenceArtifact}\`, not only a chat summary.`,
    whyWrong: [
      {
        optionIndex: 0,
        rationale: "This delays governance until after the risk has already happened and leaves no pre-action evidence."
      },
      {
        optionIndex: 2,
        rationale: "Pull request review does not justify unnecessary tool, workflow, memory, or repository access."
      },
      {
        optionIndex: 3,
        rationale: "Exploration must happen inside an approved boundary; the agent should not invent the control after access expands."
      }
    ],
    examTip: `For GH-600, prefer the answer that proves ${skill.toLowerCase()} with a GitHub artifact, a validation signal, and an explicit stop or approval rule.`
  };
}

function tableForKind(lesson, topic, kind) {
  const skill = lessonTitle(lesson);
  const profile = domainProfiles[lesson.domainId];
  const artifact = primaryArtifact(lesson, topic);
  if (kind === "anti-pattern") {
    return {
      title: "Anti-pattern table",
      intro: `Use this table to recognize when an answer about "${skill}" is unsafe even if it sounds productive.`,
      columns: ["Symptom", "Risk", "Mitigation", "GitHub control"],
      rows: [
        ["The request says only fix the issue or make it work.", "The agent infers scope and may change sensitive paths.", "Convert the request into inputs, outputs, denied scope, validation, and stop conditions.", ".github/ISSUE_TEMPLATE/agent-task.yml"],
        ["All tools are enabled by default.", "The agent can read, write, or call systems unrelated to the task.", "Approve only the tools and toolsets needed for the current issue.", "docs/tool-permission-matrix.md"],
        ["The plan and implementation happen in one step.", "Reviewers see the decision only after code changed.", "Require a plan gate before write-capable actions.", "docs/agent-plan.md"],
        ["The final summary replaces evidence.", "The reviewer cannot verify checks, approvals, or unresolved risk.", "Require links to checks, diffs, approvals, and handoff notes.", ".github/pull_request_template.md"]
      ]
    };
  }
  if (kind === "risk-matrix") {
    return {
      title: "Autonomy and approval risk matrix",
      intro: `Use this matrix to decide how much autonomy is acceptable for "${skill}" before the agent proceeds.`,
      columns: ["Action", "Risk level", "Allowed autonomy", "Approval path", "Evidence"],
      rows: [
        ["Read repository docs and inspect open issues.", "Low", "Agent may proceed inside the issue scope.", "No pre-approval if scope is already documented.", "Issue link and source notes in the plan."],
        ["Edit application code in non-sensitive paths.", "Medium", "Agent may propose a branch and pull request.", "Reviewer approval before merge.", "Diff, tests, and PR evidence table."],
        ["Change auth, policy, workflow, deployment, or data-handling paths.", "High", "Agent must stop before write or merge.", "CODEOWNERS, ruleset, or protected environment reviewer.", "Approval record plus passing checks."],
        ["Use secrets, production data, irreversible operations, or compliance-sensitive changes.", "Critical", "Agent may only prepare a plan and evidence request.", "Explicit human authorization in the tracked workflow.", "Approval note, audit trail, and rollback or recovery plan."]
      ]
    };
  }
  if (kind === "source-config") {
    return {
      title: "Current configuration evidence table",
      intro: `Use this table to connect "${skill}" to the exact GitHub or MCP configuration evidence a reviewer should expect.`,
      columns: ["Configuration decision", "Setting or file", "Expected evidence", "Source-backed check"],
      rows: [
        ["Repository instructions are part of the control plane.", ".github/copilot-instructions.md", "Instruction file in the pull request and reviewer note that it applies to the repository.", "GitHub Docs support for repository custom instructions."],
        ["MCP access is approved before the agent uses tools.", "Enterprise or organization Copilot MCP settings plus docs/mcp-tool-policy.md", "Approved server, registry, toolset, and denied capabilities are recorded.", "GitHub Docs for MCP server access, registry, allow list, and toolsets."],
        ["Cloud-agent setup is reproducible.", ".github/workflows/copilot-setup-steps.yml", "Setup workflow log shows dependencies and environment preparation.", "GitHub Docs for Copilot setup steps."],
        ["Workflow invocation uses least privilege.", ".github/workflows/agent-validation.yml", "Workflow permissions show only the token access needed for the task.", "GitHub Docs for Actions workflows and Copilot CLI in Actions."]
      ]
    };
  }
  if (kind === "memory-state") {
    return {
      title: "Memory and state artifact examples",
      intro: `Use this table to decide what the agent may remember for "${skill}" and what must expire or be refreshed.`,
      columns: ["Artifact", "What it stores", "Expiry or reset rule", "Review evidence"],
      rows: [
        ["docs/agent-state.md", `Current status for "${skill}", branch, files touched, checks, blockers, and next owner.`, "Refresh before every resumed session and whenever the issue, PR, or branch changes.", "Updated state file linked from the PR or handoff."],
        ["docs/decision-log.md", "Durable decisions, owner, date, source, and reason.", "Never silently overwrite; append a superseding decision with owner and evidence.", "Decision entry that cites the issue, source, or review."],
        ["docs/agent-memory-policy.md", "Allowed memory categories, denied data, retention window, and reset triggers.", "Reset when source docs, policy, secrets, branch base, or task owner changes.", "Policy entry plus reviewer approval for reuse."],
        ["docs/stale-context-checklist.md", "Checks for issue comments, PR reviews, branch diff, CI, instructions, and source docs.", "Run before trusting remembered context after interruption.", "Checklist timestamp and links to current artifacts."]
      ]
    };
  }
  if (kind === "conflict-tree") {
    return {
      title: "Conflict-resolution decision tree",
      intro: `Use this table when "${skill}" creates overlapping or contradictory agent work.`,
      columns: ["Conflict signal", "Decision path", "Owner", "Handoff or merge evidence"],
      rows: [
        ["Two agents changed the same file or workflow.", "Stop both branches, compare diffs, keep one owner, and rebase the survivor.", "Human maintainer or designated reviewer.", "docs/conflict-log.md plus final PR comment."],
        ["Agents solved the same issue in different ways.", "Select the approach that best matches the issue contract and validation evidence.", "Planner or technical lead.", "Decision-log entry with rejected alternative."],
        ["Tester and builder disagree about success.", "Use the pre-defined pass/fail threshold and rerun validation from a clean state.", "Reviewer or quality owner.", "Workflow run, failure classification, and rerun result."],
        ["An agent cannot complete its assigned role.", "Retire or replace the agent after preserving state, branch, artifacts, and open risks.", "Workflow owner.", "Handoff packet and recovery plan."]
      ]
    };
  }
  if (kind === "evidence-thresholds") {
    return {
      title: "Evidence and pass/fail thresholds",
      intro: `Use these thresholds to judge "${skill}" with evidence instead of agent confidence.`,
      columns: ["Signal", "Pass threshold", "Fail signal", "Evidence artifact"],
      rows: [
        ["Functional validation", "Required tests or checks pass on the agent branch.", "A skipped, removed, or failing check is explained away.", ".github/workflows/agent-validation.yml run URL."],
        ["Security or compliance scan", "No unresolved high-risk finding, or accepted risk is approved by owner.", "Secret, dependency, CodeQL, or policy finding lacks owner disposition.", "docs/security-scan-evidence.md."],
        ["Trace or log review", "The log shows the expected tool path, inputs, outputs, and failure handling.", "The agent cannot explain which step produced the result.", "docs/error-analysis.md plus workflow logs."],
        ["Evaluation rubric", "Expected outcome, actual result, and threshold are all recorded.", "Narrative success replaces measured criteria.", "docs/evaluation-plan.md."]
      ]
    };
  }
  if (kind === "tuning-before-after") {
    return {
      title: "Before/after tuning safeguards",
      intro: `Use this table to tune "${skill}" without overfitting to one successful run.`,
      columns: ["Before", "Tuning change", "Regression safeguard", "Evidence"],
      rows: [
        ["Prompt asks the agent to be careful.", "Replace with exact allowed tools, denied scope, evidence, and stop conditions.", "Run the same evaluation plus one adjacent scenario.", "docs/tuning-log.md and evaluation rerun."],
        ["Memory contains stale assumptions from a prior task.", "Add reset triggers for branch, policy, source, and reviewer changes.", "Resume from a clean state and compare decisions.", "docs/agent-memory-policy.md and stale-context checklist."],
        ["Tool access is broad to avoid failures.", "Narrow to the smallest toolset that can produce required evidence.", "Verify denied actions still fail safely.", "docs/tool-permission-matrix.md and workflow log."],
        ["One failing case is patched directly.", "Classify the root cause before changing instructions or tools.", "Rerun old passing cases to catch regressions.", "docs/error-analysis.md and regression check result."]
      ]
    };
  }
  const controlArtifact = topic.name === "Memory and state" || conceptSpecificLessonIds.has(lesson.id) ? secondaryArtifact(lesson, topic) : artifact;
  return {
    title: "Scenario-to-control walkthrough",
    intro: `Use this table to turn "${skill}" from a scenario into a concrete GH-600 answer.`,
    columns: ["Scenario clue", "Decision to make", "GitHub artifact", "Why it matters"],
    rows: [
      [`The repository is ${profile.repo} and the agent is asked to ${profile.issue}.`, "Name the exact skill boundary before execution.", artifact, "The issue or plan proves the agent did not invent scope."],
      [`The lesson is about ${topic.teaches}.`, "Select the control that fits the actual failure mode.", controlArtifact, "The control must match the risk, not just sound responsible."],
      [`The answer mentions ${topic.controls}.`, "Check whether those controls are visible to a reviewer.", secondaryArtifact(lesson, topic), "GH-600 favors evidence that survives outside chat."],
      [`The risky shortcut is that ${topic.risk}.`, "Stop before the shortcut can happen.", ".github/pull_request_template.md", "The PR or handoff must show validation, residual risk, and next owner."]
    ]
  };
}

function uiConfigExampleFor(lesson, topic, kind) {
  if (!uiConfigExampleLessonIds.has(lesson.id) && kind !== "source-config") return undefined;
  const skill = lessonTitle(lesson);
  const isMcp = /mcp|toolset|registry|allow list|allow-list|server access|remote mcp/i.test(skill);
  const isWorkflow = /workflow|ci|retries|rollbacks|escalation|traceability|environment|actions/i.test(skill);
  const isMultiAgent = lesson.domainId === "domain-5";
  const steps = isMcp
    ? [
        "Open the enterprise or organization Copilot settings that govern MCP server access, then record whether access is disabled, registry-only, or allow-list based for this repository.",
        "Record the approved MCP server name, registry URL or remote endpoint, allowed toolsets, denied toolsets, and data boundary in docs/mcp-tool-policy.md.",
        "If the agent runs in the Copilot cloud agent environment, keep dependency setup in .github/workflows/copilot-setup-steps.yml so the setup log is reviewable.",
        "Run the validation workflow or tool-call dry run, then attach the server decision, toolset list, and workflow evidence to the pull request."
      ]
    : isWorkflow
      ? [
          "Create or update .github/workflows/agent-validation.yml with the specific build, test, scan, retry, or rollback evidence this lesson needs.",
          "Keep Copilot cloud-agent dependency setup in .github/workflows/copilot-setup-steps.yml when the agent environment must be prepared before work starts.",
          "Set the smallest workflow permissions needed for the job, and document any permission escalation in docs/escalation-paths.md.",
          "Attach the workflow run URL, failed-step reason, retry or rollback decision, and next reviewer decision to the pull request."
        ]
      : isMultiAgent
        ? [
            "Create docs/agent-roles.md with each agent role, branch or file ownership, allowed actions, and review owner.",
            "Create docs/multi-agent-plan.md before parallel work begins so sequencing, dependencies, and stop conditions are visible.",
            "Record overlap, duplicate effort, contradictory outputs, or agent replacement in docs/conflict-log.md or docs/recovery-plan.md.",
            "Attach the handoff packet and final arbitration decision to the pull request before merging any agent output."
          ]
        : [
            "Create or update .github/copilot-instructions.md with repository-specific build, test, evidence, and stop-condition rules.",
            "Create docs/agent-plan.md before write-capable work begins so planning is separate from execution.",
            "Use .github/pull_request_template.md to require changed files, checks, approvals, source links, and residual risk.",
            "If sensitive files are involved, route review through .github/CODEOWNERS, rulesets, or protected environments before merge."
          ];
  return {
    title: "Concrete GitHub configuration example",
    intro: `Use this as the concrete setup path for "${skill}" when an exam option asks what should be configured or what evidence should exist.`,
    steps,
    expectedEvidence: `Expected evidence: ${topic.evidence}; plus the changed configuration file, setting note, workflow run, approval record, or policy decision that proves the configuration was actually applied.`,
    sourceNotes: [
      "Use the lesson source panel to verify the current GitHub Docs or Microsoft Learn page before treating a UI path or setting name as final.",
      "If a GitHub UI label has changed, keep the policy decision and artifact evidence stable, then update the lesson source review date before release."
    ]
  };
}

function topicSpecificCategory(lesson, topic) {
  const title = lessonTitle(lesson).toLowerCase();
  const value = `${title} ${topic.name} ${topic.teaches}`.toLowerCase();
  if (/mcp|toolset|registry|allow list|allow-list|allowlist|remote server|local server|playwright/.test(title)) return "MCP and tool access";
  if (/memory|state|context|stale|drift|resume|durable|checkpoint|expiry|expiration|pruning|reset/.test(title)) return "Memory and state";
  if (lesson.domainId === "domain-6" || /responsible ai|compliance|guardrail|autonomy|authorization|approval|least-privilege|least privilege|policy|audit|risk|human judgment|irreversible|velocity/.test(title)) return "Responsible AI and guardrails";
  if (lesson.domainId === "domain-5" || /multi-agent|orchestration|parallel|handoff|conflict|duplicate|contradictory|degraded|replacement|retire|retirement|lifecycle/.test(title)) return "Multi-agent coordination";
  if (/branch|pull request|\bpr\b|repository|issue|codeowners|ruleset|protected|instructions|creating branches/.test(title)) return "Repository and branch governance";
  if (lesson.domainId === "domain-4" || /evaluation|evaluate|signal|scan|codeql|secret scanning|dependency|failure|root cause|tuning|regression|accessibility|static analysis|overfitting/.test(title)) return "Evaluation and tuning";
  if (/workflow|actions|setup|environment|retry|rollback|traceability|execution|ci|permission|constraints|error handling/.test(title)) return "Workflow execution";
  if (/tool|permission|read-only|write-capable|scope|least-privilege|least privilege/.test(value)) return "MCP and tool access";
  return "Agent architecture and SDLC";
}

function topicSpecificExplanationFor(lesson, topic, kind) {
  const skill = lessonTitle(lesson);
  const profile = domainProfiles[lesson.domainId];
  const artifact = primaryArtifact(lesson, topic);
  const secondArtifact = secondaryArtifact(lesson, topic);
  const category = topicSpecificCategory(lesson, topic);
  const shared = {
    title: "What is different about this topic",
    category,
    examConnection: `In GH-600 questions about "${skill}", the safest answer is the one that handles this topic's real failure mode, not the one that repeats generic agent governance language.`
  };
  if (category === "MCP and tool access") {
    return {
      ...shared,
      paragraphs: [
        `"${skill}" is about making the agent a client of external capabilities. The important decision is not simply whether a tool is useful; it is which server, registry path, toolset, and access policy expose only the operations the task needs.`,
        `For MCP lessons, read the scenario as a capability-boundary problem. A remote GitHub MCP server, a local server, an allow list, and a toolset are different controls: one decides where the capability comes from, another decides whether it is trusted, and another narrows which operations the agent can call.`,
        `The product behavior to remember is that MCP configuration must be reviewable before the agent relies on it. A strong answer records the approved server and toolset in ${artifact}, then proves the call path with ${topic.evidence}.`
      ],
      distinctions: [
        "Toolset selection is narrower than server approval; do not treat them as the same decision.",
        "Registry or allow-list policy answers trust and discoverability before a tool call happens.",
        "A tool-call log is evidence of use; it is not proof that the server was approved."
      ]
    };
  }
  if (category === "Memory and state") {
    return {
      ...shared,
      paragraphs: [
        `"${skill}" is about time, not just storage. The agent may remember something that used to be true, while the issue, branch, workflow result, source documentation, or reviewer decision has moved on.`,
        `Memory lessons separate three things: short-lived task context, durable repository state, and reusable memory. The exam usually rewards the answer that writes the important decision to ${artifact} and defines when remembered facts must expire or be refreshed.`,
        `A good implementation does not ask the agent to remember better. It gives the agent a reset rule: refresh the issue, PR, branch diff, checks, instructions, and source pack before using old context to continue "${skill}".`
      ],
      distinctions: [
        "A chat memory is convenient context; a repository artifact is reviewable state.",
        "Expiry rules are triggered by change events, not only by elapsed time.",
        "Resetting stale context is safer than explaining a mistake after the branch diverges."
      ]
    };
  }
  if (category === "Repository and branch governance") {
    return {
      ...shared,
      paragraphs: [
        `"${skill}" is about using GitHub repository objects as boundaries. Issues define the task, branches contain the diff, pull requests collect evidence, and CODEOWNERS, rulesets, or branch protection decide who can accept risk.`,
        `Branch and repository scope lessons are easy to overgeneralize. The point is not merely that the work is reviewable; the branch must be tied to the issue, the allowed paths, the expected checks, and the reviewer who owns the next decision.`,
        `When a scenario mentions repository instructions, branch scope, PR evidence, or protected paths, connect "${skill}" to ${artifact} and ${secondArtifact}. Those artifacts show what the agent may change and what must be reviewed before merge.`
      ],
      distinctions: [
        "A branch isolates a diff, but it does not replace path ownership or required review.",
        "A pull request is evidence only when it names scope, checks, approvals, and residual risk.",
        "Repository instructions guide behavior; they do not authorize sensitive changes by themselves."
      ]
    };
  }
  if (category === "Workflow execution") {
    return {
      ...shared,
      paragraphs: [
        `"${skill}" is about the runner environment where agent work becomes executable. GitHub Actions, setup steps, workflow permissions, logs, retries, and rollback records are product surfaces, not just background automation.`,
        `Execution lessons should be read as failure-handling questions. The agent must know what environment it is in, which permissions the workflow grants, which setup steps ran, and what evidence proves a retry or rollback was controlled rather than improvised.`,
        `A strong answer for "${skill}" uses ${artifact} to make the execution path reproducible, then attaches ${topic.evidence} so the reviewer can distinguish a clean run from a hidden recovery or permission workaround.`
      ],
      distinctions: [
        "A successful workflow run is useful evidence only if it ran with the intended permissions and setup.",
        "Retries need a recorded reason; repeated attempts without diagnosis hide the failure mode.",
        "Rollback is a controlled recovery decision, not a vague promise to undo later."
      ]
    };
  }
  if (category === "Evaluation and tuning") {
    return {
      ...shared,
      paragraphs: [
        `"${skill}" is about deciding what counts as correct before accepting the agent output. Tests, scans, traces, logs, and rubrics are separate signals, and each signal needs a threshold or owner decision.`,
        `Evaluation lessons should not sound like general review advice. The difference is that the expected outcome, observed result, failure class, and rerun evidence are written down before tuning changes the agent's instructions, memory, or tools.`,
        `For "${skill}", use ${artifact} to define the signal and ${secondArtifact} to record the failure analysis or tuning decision. That is what prevents the team from overfitting to one passing demonstration.`
      ],
      distinctions: [
        "A scan finding is a signal that needs disposition; it is not automatically the whole verdict.",
        "Tuning should follow root-cause classification, not replace it.",
        "Regression checks protect old passing cases after a prompt, memory, or tool change."
      ]
    };
  }
  if (category === "Multi-agent coordination") {
    return {
      ...shared,
      paragraphs: [
        `"${skill}" is about multiple agents acting as separate workers with separate state, branches, assumptions, and failure modes. Coordination is not a bigger prompt; it is an ownership model.`,
        `Multi-agent lessons become concrete when each agent has a role, file or branch boundary, handoff packet, and conflict rule. Without those boundaries, two good agents can still duplicate work, overwrite changes, or produce incompatible conclusions.`,
        `For "${skill}", the key artifacts are ${artifact} and ${secondArtifact}. They let a human decide which branch, output, or agent state survives when coordination breaks down.`
      ],
      distinctions: [
        "Parallel work is safe only when branch and file ownership are explicit.",
        "Handoffs must transfer evidence and open risk, not only a summary.",
        "Conflict resolution needs a named owner; majority agreement between agents is not governance."
      ]
    };
  }
  if (category === "Responsible AI and guardrails") {
    return {
      ...shared,
      paragraphs: [
        `"${skill}" is about deciding which actions need human judgment because of security, privacy, compliance, safety, or accountability risk. Responsible AI is not a slogan in these lessons; it is the reason an action is allowed, blocked, or escalated.`,
        `Guardrail lessons separate speed from risk reduction. Low-risk inspection can move quickly, but irreversible operations, secrets, production data, policy changes, and compliance-sensitive paths need explicit authorization or a controlled path before execution.`,
        `For "${skill}", use ${artifact} to classify the action and ${secondArtifact} to show the approval or blocked-action record. The exam trap is adding approvals everywhere instead of placing them where they materially reduce risk.`
      ],
      distinctions: [
        "Least privilege controls access; approval controls judgment. Strong answers often need both.",
        "Blocking a policy-violating action is different from asking a reviewer to clean it up later.",
        "Too many low-value approvals can slow delivery without reducing real risk."
      ]
    };
  }
  return {
    ...shared,
    paragraphs: [
      `"${skill}" is about turning the agent's work into an SDLC step a team can own. Planning, approval, execution, validation, and handoff are separate moments, and the exam often tests which moment is missing.`,
      `Architecture lessons are not only about telling the agent to be careful. They ask whether the request has a task contract, whether planning is separate from execution, and whether a reviewer can inspect the artifact that proves the decision.`,
      `For "${skill}", anchor the answer in ${artifact} and ${secondArtifact}. Those files convert an agent conversation into a development workflow with an owner, a boundary, and a next decision.`
    ],
    distinctions: [
      "A plan is useful only when it is inspected before code-changing action.",
      "A task contract should state inputs, outputs, success criteria, denied scope, and stop conditions.",
      "Inspectable artifacts let the next reviewer continue without trusting hidden chat context."
    ]
  };
}

function topicSpecificPlainLanguageFor(lesson, topic) {
  const skill = lessonTitle(lesson);
  const category = topicSpecificCategory(lesson, topic);
  const lines = {
    "MCP and tool access": [
      `"${skill}" is about deciding which external capability the agent may call. Think of MCP as the doorway between the agent and real tools: the server, registry, allow list, and toolset decide what can cross that doorway.`,
      `Learn this lesson by separating trust from capability. A server can be trusted but still too broad; a toolset can be useful but still unsafe for the current task. The right answer narrows both before the agent makes the call.`
    ],
    "Memory and state": [
      `"${skill}" is about what the agent is allowed to carry forward. Memory is useful only when the remembered fact is still true, still allowed, and still visible to the next reviewer.`,
      `Learn this lesson by asking where the state lives, when it expires, and what event forces a reset. The answer is strongest when important state is written to a repository artifact instead of being left inside chat memory.`
    ],
    "Repository and branch governance": [
      `"${skill}" is about using GitHub repository objects as boundaries. The issue defines the work, the branch contains the change, the pull request shows evidence, and ownership rules decide who can accept risk.`,
      `Learn this lesson by following the change from issue to branch to PR. A branch is not enough by itself; the agent also needs allowed paths, expected checks, and a reviewer path for protected or owner-controlled files.`
    ],
    "Workflow execution": [
      `"${skill}" is about the environment where agent work runs. GitHub Actions, setup steps, token permissions, logs, retries, and rollback records determine whether execution was controlled or improvised.`,
      `Learn this lesson by treating a workflow run as evidence with context. A green check is useful only when the workflow had the intended setup, permissions, inputs, and failure-handling path.`
    ],
    "Evaluation and tuning": [
      `"${skill}" is about judging agent output with defined signals. Tests, scans, traces, rubrics, and reviewer notes answer different questions, so the lesson is about choosing the signal that matches the risk.`,
      `Learn this lesson by defining pass/fail evidence before tuning the agent. If the team changes prompts, tools, or memory before understanding the failure, it can overfit to one case and miss the real defect.`
    ],
    "Multi-agent coordination": [
      `"${skill}" is about coordinating separate agents that can hold different assumptions, branches, files, and partial results. The risk is not just bad output; it is unmanaged overlap between workers.`,
      `Learn this lesson by assigning ownership before parallel work starts. Roles, file boundaries, branch ownership, handoff packets, and conflict decisions make multi-agent work inspectable instead of chaotic.`
    ],
    "Responsible AI and guardrails": [
      `"${skill}" is about choosing the right amount of autonomy for the risk. Security, privacy, compliance, safety, and accountability concerns decide whether the agent can act, must ask, or must be blocked.`,
      `Learn this lesson by separating access control from human judgment. Least privilege narrows what the agent can touch; explicit authorization decides whether a high-risk action should happen at all.`
    ],
    "Agent architecture and SDLC": [
      `"${skill}" is about turning an agent request into an SDLC step. A good agent workflow has a task contract, plan gate, execution boundary, validation path, and handoff record.`,
      `Learn this lesson by locating the missing SDLC moment. The exam often asks whether the agent needs a clearer task, a separate plan, a validation step, an approval gate, or a reviewable artifact.`
    ]
  };
  return lines[category];
}

function topicSpecificCoreFor(lesson, topic) {
  const skill = lessonTitle(lesson);
  const skillLower = lowerTitle(lesson);
  const category = topicSpecificCategory(lesson, topic);
  const artifact = primaryArtifact(lesson, topic);
  const secondArtifact = secondaryArtifact(lesson, topic);
  const sourcePhrase = `The source pack for this lesson connects the official GH-600 skill to ${topic.controls}.`;
  const cores = {
    "MCP and tool access": [
      `"${skill}" teaches how to expose tool capability to an agent without turning every available operation into an approved operation. The core decision is server trust, toolset scope, and evidence of the actual tool call.`,
      `Start with the task the agent must complete, then identify the MCP server that provides that capability. Decide whether the server is approved through registry, access, or allow-list policy before the agent can rely on it.`,
      `Next, narrow the server through toolsets. Toolsets matter because a server can expose read, write, issue, pull request, repository, or automation capabilities that are not all appropriate for one task.`,
      `Document the approved server, selected toolset, denied capabilities, and data boundary in ${artifact}. Prove the behavior with ${topic.evidence}, not with a statement that the server was configured.`,
      `Wrong answers treat MCP as a convenience feature. Strong GH-600 answers treat MCP as an external capability boundary that needs approval, narrowing, trace evidence, and escalation when the requested tool is outside policy.`
    ],
    "Memory and state": [
      `"${skill}" teaches how to decide which facts survive across agent turns, sessions, tools, or agents. The core risk is stale truth: a fact can be remembered accurately but no longer be valid.`,
      `Start by classifying the state: immediate context, durable repository state, reusable memory, workflow artifact, or handoff record. Each state type needs a different retention and review rule.`,
      `Write durable decisions, progress, blockers, and branch/check status to ${artifact}. Use ${secondArtifact} to define what expires, what is pruned, and what forces a full reset before work resumes.`,
      `Before the agent continues, refresh issue comments, PR reviews, branch diff, workflow results, repository instructions, and source docs. This is the practical difference between useful continuity and hidden context drift.`,
      `Wrong answers ask the agent to remember more. Strong GH-600 answers define what may be remembered, what must be refreshed, and what must be discarded when the task or evidence changes.`
    ],
    "Repository and branch governance": [
      `"${skill}" teaches how GitHub repository objects constrain agent work. The core idea is not simply that a PR is reviewable; it is that the issue, branch, paths, checks, and owners all carry part of the boundary.`,
      `Start with the issue or task contract, then create a branch whose purpose and allowed file scope match that contract. The branch should isolate work without bypassing CODEOWNERS, rulesets, branch protection, or required checks.`,
      `Use ${artifact} to record the branch or repository boundary and ${secondArtifact} to capture environment, permission, or path constraints. The PR then becomes the place where the diff, checks, and owner review meet.`,
      `For branch-scope scenarios, look for options that prevent cross-branch edits, broad repository exploration, hidden workflow changes, or unreviewed protected-path updates.`,
      `Wrong answers treat branch creation as enough safety. Strong GH-600 answers pair branch isolation with path ownership, validation evidence, and a merge decision by the right reviewer.`
    ],
    "Workflow execution": [
      `"${skill}" teaches how an agent executes work through a reproducible GitHub environment. The core concern is whether the runner, setup, permissions, logs, retries, and rollback path match the intended task.`,
      `Start by naming the workflow or setup file that prepares the environment. Then inspect triggers, job permissions, dependency setup, secret exposure, and any external system the agent could affect.`,
      `Use ${artifact} to make the execution path explicit and ${secondArtifact} to capture validation, recovery, or escalation evidence. The reviewer should be able to reconstruct what ran and why.`,
      `For workflow scenarios, distinguish a clean pass from a hidden workaround. A retry without cause, a rollback without owner approval, or a broad token permission can make a green result untrustworthy.`,
      `Wrong answers focus only on whether the run completed. Strong GH-600 answers verify setup, permission, failure handling, and trace evidence before trusting the agent's execution.`
    ],
    "Evaluation and tuning": [
      `"${skill}" teaches how to decide whether agent output is correct, safe, and stable. The core idea is that different signals answer different questions: tests check behavior, scans check risk, traces check process, and rubrics check intent.`,
      `Start by writing the expected outcome and the threshold before reviewing the output. Then collect the signal that matches the failure mode: logs, plans, traces, workflow artifacts, scans, reviewer notes, or regression checks.`,
      `Use ${artifact} to define the evaluation signal and ${secondArtifact} to record failure classification or tuning decisions. Tuning should be a response to evidence, not a guess after a surprising result.`,
      `For tuning scenarios, protect old passing behavior. A prompt or memory change that fixes one case is not acceptable until regression evidence shows it did not break neighboring cases.`,
      `Wrong answers accept agent confidence or a single passing demonstration. Strong GH-600 answers use thresholds, root-cause classification, and rerun evidence before approval.`
    ],
    "Multi-agent coordination": [
      `"${skill}" teaches how to keep multiple agents from colliding. The core concern is ownership: which agent owns which role, branch, file area, handoff, decision, and recovery path.`,
      `Start by assigning roles and boundaries before parallel execution. Planner, builder, tester, reviewer, security, docs, or release agents need different permissions and different evidence obligations.`,
      `Use ${artifact} to define roles or ownership and ${secondArtifact} to record sequencing, dependencies, handoff evidence, or conflict decisions. Multi-agent output is only trustworthy when each contribution can be traced.`,
      `For conflict scenarios, stop the affected agents, compare branch/file overlap, choose an owner, and record the arbitration. Do not let agents merge contradictory conclusions by consensus or speed.`,
      `Wrong answers add more agents to move faster. Strong GH-600 answers isolate work, preserve handoff evidence, and give humans clear arbitration points when coordination fails.`
    ],
    "Responsible AI and guardrails": [
      `"${skill}" teaches how to right-size autonomy for security, compliance, privacy, safety, and accountability risk. The core decision is whether the agent may act, must request approval, or must be blocked.`,
      `Start by classifying the action, not the agent. Reading documentation, editing low-risk code, changing policy, using secrets, deploying, or touching production data require different autonomy levels.`,
      `Use ${artifact} to map the action to risk and ${secondArtifact} to define blocked actions, controlled paths, approval owners, and audit evidence. The goal is precise control, not approval theater.`,
      `For Responsible AI scenarios, separate least privilege from human judgment. Least privilege limits access; explicit authorization records the accountable decision for high-risk or irreversible actions.`,
      `Wrong answers either trust the agent broadly or require approvals everywhere. Strong GH-600 answers block policy violations, approve only material risk, and preserve evidence for accountability.`
    ],
    "Agent architecture and SDLC": [
      `"${skill}" teaches how to place an agent inside a normal software delivery lifecycle. The core sequence is task contract, plan, approval, execution, validation, PR review, and handoff.`,
      `Start by identifying which SDLC step is missing. The agent may need a clearer issue, a separate plan, structured outputs, approval before action, inspectable artifacts, or a human intervention point.`,
      `Use ${artifact} to turn the request into a durable task boundary and ${secondArtifact} to record plan, evidence, or handoff. The agent's useful output must be something another developer can inspect.`,
      `For architecture scenarios, distinguish planning from execution. A plan can be broad and exploratory; execution must be scoped, validated, and stopped when the task crosses a risky boundary.`,
      `Wrong answers rely on a capable agent to infer the workflow. Strong GH-600 answers put the agent inside explicit SDLC controls before code, tools, or deployment actions begin.`
    ]
  };
  return cores[category].map((paragraph) => paragraph.replaceAll("${skillLower}", skillLower));
}

function topicSpecificActionOverviewFor(lesson, topic) {
  const skill = lessonTitle(lesson);
  const category = topicSpecificCategory(lesson, topic);
  const starts = {
    "MCP and tool access": `Build the "${skill}" learning path around approving the MCP server, narrowing the toolset, and proving the exact tool call.`,
    "Memory and state": `Build the "${skill}" learning path around state type, expiry trigger, refresh evidence, and reset behavior.`,
    "Repository and branch governance": `Build the "${skill}" learning path around issue boundary, branch isolation, allowed paths, PR evidence, and owner review.`,
    "Workflow execution": `Build the "${skill}" learning path around runner setup, workflow permissions, execution logs, failure handling, and recovery evidence.`,
    "Evaluation and tuning": `Build the "${skill}" learning path around signal choice, pass/fail threshold, failure classification, tuning change, and regression proof.`,
    "Multi-agent coordination": `Build the "${skill}" learning path around roles, ownership boundaries, handoff packets, conflict arbitration, and recovery decisions.`,
    "Responsible AI and guardrails": `Build the "${skill}" learning path around risk class, autonomy level, blocked actions, approval owner, and audit evidence.`,
    "Agent architecture and SDLC": `Build the "${skill}" learning path around task contract, planning gate, execution boundary, validation, and handoff.`
  };
  return starts[category];
}

function topicSpecificActionStepsFor(lesson, topic) {
  const skill = lessonTitle(lesson);
  const artifact = primaryArtifact(lesson, topic);
  const secondArtifact = secondaryArtifact(lesson, topic);
  const category = topicSpecificCategory(lesson, topic);
  const scopedSteps = (items) => items.map((step) => (
    step.includes(`"${skill}"`)
      ? step
      : `In the "${skill}" workflow, ${step.charAt(0).toLowerCase()}${step.slice(1)}`
  ));
  const steps = {
    "MCP and tool access": [
      `For "${skill}", state the task capability the agent needs before naming any MCP server.`,
      `Check whether the server should be remote, local, registry-approved, or allow-listed for this repository.`,
      `Choose the narrow toolset that supports "${skill}" and list at least one tool or operation that remains denied.`,
      `Record server name, registry or endpoint, allowed toolset, denied capability, and data boundary in \`${artifact}\`.`,
      `If setup is required, capture the cloud-agent or workflow setup evidence before the first tool call.`,
      `Run a constrained tool-call dry run or validation path and save the call evidence requested by the lesson.`,
      `Escalate instead of expanding access when the agent asks for a server or toolset outside the approved policy.`
    ],
    "Memory and state": [
      `For "${skill}", classify each fact as short-lived context, durable repository state, reusable memory, or data that must not be retained.`,
      `Write current progress, branch, files, checks, blockers, and next owner into \`${artifact}\`.`,
      `Define expiry triggers in \`${secondArtifact}\`: issue change, PR review, branch rebase, source change, policy change, or failed workflow.`,
      `Prune stale or sensitive context before the agent resumes, especially if the remembered fact is not visible in GitHub.`,
      `Refresh issue comments, PR reviews, branch diff, workflow result, repository instructions, and source pack before reuse.`,
      `Record whether the agent continued from durable state, reset memory, or asked a human to resolve conflicting context.`,
      `Reject the answer path where "${skill}" depends on chat memory that no reviewer can inspect.`
    ],
    "Repository and branch governance": [
      `For "${skill}", bind the agent task to a specific issue or task contract before creating or using a branch.`,
      `Name the branch purpose, allowed paths, denied paths, and expected checks in \`${artifact}\`.`,
      `Confirm the branch does not bypass CODEOWNERS, branch protection, rulesets, or required workflow checks.`,
      `Keep repository instructions and environment constraints in \`${secondArtifact}\` when they affect what the agent may change.`,
      `Open the pull request with branch diff, check runs, changed paths, source links, and residual risk evidence.`,
      `Route protected, owner-reviewed, or policy-sensitive paths to the right reviewer before merge.`,
      `Reject the answer path where a branch exists but the agent can still edit unrelated scope or merge without owner review.`
    ],
    "Workflow execution": [
      `For "${skill}", identify the workflow, runner environment, trigger, setup file, and permissions before execution.`,
      `Record dependency setup, environment constraints, token permissions, and denied external systems in \`${artifact}\`.`,
      `Run the workflow or setup path that matches the agent task, then capture the run URL and relevant logs.`,
      `When a step fails, classify the failure before retrying so retries do not hide environment or permission defects.`,
      `Use \`${secondArtifact}\` to record retry limits, rollback criteria, escalation owner, and evidence required before continuation.`,
      `Verify recovery with a fresh run or review note instead of accepting the agent's summary of what it fixed.`,
      `Reject the answer path where "${skill}" succeeds only because the workflow used broader permissions than the task needed.`
    ],
    "Evaluation and tuning": [
      `For "${skill}", write the expected outcome, signal, threshold, and owner before evaluating the agent output.`,
      `Choose the evidence source that matches the risk: test, scan, trace, log, plan, workflow artifact, rubric, or reviewer note.`,
      `Capture expected-versus-actual results in \`${artifact}\` with a pass/fail decision that a reviewer can inspect.`,
      `If the result fails, classify root cause before changing prompts, memory, tools, workflow, or access.`,
      `Record the tuning change in \`${secondArtifact}\` and explain which failure mode it is intended to fix.`,
      `Rerun the original case and at least one adjacent regression case before treating tuning as successful.`,
      `Reject the answer path where "${skill}" relies on agent confidence, a single demonstration, or a removed check.`
    ],
    "Multi-agent coordination": [
      `For "${skill}", define each participating agent's role, branch or file ownership, allowed actions, and reviewer owner.`,
      `Write role boundaries in \`${artifact}\` before agents begin parallel or sequential work.`,
      `Use \`${secondArtifact}\` to record dependencies, handoff packet fields, stop conditions, and merge order.`,
      `Track overlap, duplicate work, contradictory outputs, or stalled agents in the conflict or recovery artifact.`,
      `When agents conflict, pause affected branches, compare evidence, name the human arbitrator, and record the decision.`,
      `Preserve state before replacing, retiring, or rerouting an agent so auditability survives workflow changes.`,
      `Reject the answer path where "${skill}" is handled by adding agents without isolation or handoff evidence.`
    ],
    "Responsible AI and guardrails": [
      `For "${skill}", classify the action by operational, security, privacy, compliance, safety, and accountability risk.`,
      `Map the action to an autonomy level in \`${artifact}\`: proceed, proceed with checks, stop for approval, or block.`,
      `Use \`${secondArtifact}\` to list blocked actions, controlled paths, approval owners, and escalation conditions.`,
      `Apply least privilege to repository, branch, workflow, MCP, secret, environment, and deployment access before execution.`,
      `Require explicit authorization for irreversible, privileged, production, data-handling, or compliance-sensitive changes.`,
      `Record approval, denial, policy block, check result, and audit note where a reviewer can reconstruct the decision.`,
      `Reject the answer path where "${skill}" adds approvals that do not reduce risk or allows risky action before judgment.`
    ],
    "Agent architecture and SDLC": [
      `For "${skill}", write the task contract with goal, inputs, outputs, success criteria, denied scope, and stop conditions.`,
      `Separate planning from execution by recording the plan, assumptions, file targets, validation route, and approval gate in \`${artifact}\`.`,
      `Validate the plan before any code-changing, workflow-changing, permission-changing, or external tool action begins.`,
      `Use \`${secondArtifact}\` to capture changed files, checks, review owner, unresolved risk, and next decision.`,
      `Stop the agent when scope expands, evidence is missing, source docs conflict, or a sensitive path appears.`,
      `Complete the handoff with enough context for another developer to continue without relying on hidden chat state.`,
      `Reject the answer path where "${skill}" depends on the agent inferring SDLC controls after work has started.`
    ]
  };
  return scopedSteps(steps[category]);
}

function topicSpecificExamDrillFor(lesson, topic) {
  const skill = lessonTitle(lesson);
  const category = topicSpecificCategory(lesson, topic);
  const drills = {
    "MCP and tool access": [
      `For "${skill}", identify the requested capability before selecting a server or toolset.`,
      "Eliminate answers that approve a server but forget to narrow toolsets or denied operations.",
      "Prefer the answer with registry, allow-list, tool-call evidence, and escalation for unapproved capability."
    ],
    "Memory and state": [
      `For "${skill}", ask what state is being reused and whether it is still current.`,
      "Eliminate answers that trust remembered context without refreshing issue, PR, branch, checks, and source docs.",
      "Prefer the answer that writes durable state and defines expiry, pruning, or reset triggers."
    ],
    "Repository and branch governance": [
      `For "${skill}", trace the work from issue boundary to branch scope to PR review.`,
      "Eliminate answers where a branch exists but protected paths, allowed files, or required checks are not controlled.",
      "Prefer the answer that pairs branch isolation with path ownership and merge evidence."
    ],
    "Workflow execution": [
      `For "${skill}", inspect setup, permissions, logs, retry behavior, and rollback evidence.`,
      "Eliminate answers that treat a green workflow run as proof without checking runner context or token scope.",
      "Prefer the answer that captures workflow evidence and explains recovery before continuation."
    ],
    "Evaluation and tuning": [
      `For "${skill}", identify the signal and threshold before judging output.`,
      "Eliminate answers that tune prompts, memory, or tools before classifying the failure.",
      "Prefer the answer with expected-versus-actual evidence and regression reruns."
    ],
    "Multi-agent coordination": [
      `For "${skill}", name roles, ownership, handoffs, and arbitration before parallel work.`,
      "Eliminate answers that add agents without branch/file isolation or conflict rules.",
      "Prefer the answer that preserves handoff evidence and assigns a human conflict owner."
    ],
    "Responsible AI and guardrails": [
      `For "${skill}", classify the action risk before assigning autonomy.`,
      "Eliminate answers that either approve everything for speed or require every low-risk step to stop.",
      "Prefer the answer that combines least privilege, policy blocking, explicit authorization, and audit evidence."
    ],
    "Agent architecture and SDLC": [
      `For "${skill}", find the missing SDLC control: task contract, plan gate, validation, approval, or handoff.`,
      "Eliminate answers where the agent starts execution before the plan and boundaries are reviewable.",
      "Prefer the answer that creates durable artifacts before risky action."
    ]
  };
  return drills[category];
}

function topicSpecificPracticalLabTaskFor(lesson, topic) {
  const skill = lessonTitle(lesson);
  const category = topicSpecificCategory(lesson, topic);
  const artifact = primaryArtifact(lesson, topic);
  const secondArtifact = secondaryArtifact(lesson, topic);
  return {
    title: `${skill} topic lab`,
    category,
    objective: `Practice "${skill}" as a ${category.toLowerCase()} task by creating the lesson-specific artifacts, evidence, and reviewer decision path.`,
    steps: topicSpecificActionStepsFor(lesson, topic).slice(0, 5).map((step) => step.replace("For ", "In the lab, for ")),
    deliverable: `Submit \`${artifact}\`, \`${secondArtifact}\`, the validation evidence for ${topic.evidence}, and a short reviewer decision.`
  };
}

function applyAuditEnhancements(lesson) {
  const topic = topicFor(lesson);
  const kind = auditKindFor(lesson);
  const uiConfigExample = uiConfigExampleFor(lesson, topic, kind);
  const templateRecommendations = artifactsFor(lesson, topic);
  return {
    ...lesson,
    filesToCreate: templateRecommendations,
    templateRecommendationProfile: {
      reviewedAt: "2026-07-09",
      category: topicSpecificCategory(lesson, topic),
      evidence: topic.evidence,
      examTrapAvoided: topic.risk,
      sourceIds: sourcePack(lesson, topic)
    },
    plainLanguage: topicSpecificPlainLanguageFor(lesson, topic),
    core: topicSpecificCoreFor(lesson, topic),
    actionOverview: topicSpecificActionOverviewFor(lesson, topic),
    actionSteps: topicSpecificActionStepsFor(lesson, topic),
    examActionDrill: topicSpecificExamDrillFor(lesson, topic),
    practicalLabTask: topicSpecificPracticalLabTaskFor(lesson, topic),
    auditRecommendation: {
      reviewedAt: "2026-07-09",
      kind,
      recommendation: auditRecommendationLabels[kind],
      workbook: "gh600_lesson_teaching_quality_audit.xlsx"
    },
    workedExamQuestion: workedQuestionFor(lesson, topic, kind),
    teachingTable: tableForKind(lesson, topic, kind),
    topicSpecificExplanation: topicSpecificExplanationFor(lesson, topic, kind),
    ...(uiConfigExample ? { uiConfigExample } : {})
  };
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

const curatedLessons = lessons.map((lesson) => applyAuditEnhancements(reviseLesson(lesson)));
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
