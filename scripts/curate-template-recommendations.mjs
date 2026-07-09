import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "src", "data");
const docsDir = path.join(root, "docs");
const reviewedAt = "2026-07-09";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n");
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function asList(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function flatList(value) {
  return asList(value).flat().filter(Boolean);
}

const templateLibraryPath = path.join(dataDir, "templateLibrary.json");
const lessonsPath = path.join(dataDir, "lessons.json");
const sourcesPath = path.join(dataDir, "sources.json");

const templateLibrary = readJson(templateLibraryPath);
const lessons = readJson(lessonsPath);
const sources = readJson(sourcesPath);
const sourceMap = new Map(sources.map((source) => [source.id, source]));

const sectionSourceIds = {
  "task-intake": ["ms-gh600-guide", "ms-agent-architecture-sdlc", "gh-copilot-cloud-agent", "gh-cloud-agent-risks"],
  "repository-instructions": ["ms-gh600-guide", "gh-repository-instructions", "gh-custom-instructions-support", "gh-codeowners", "gh-rulesets"],
  "planning-handoffs": ["ms-gh600-guide", "ms-agent-architecture-sdlc", "gh-copilot-cloud-agent", "gh-agentic-workflows"],
  "review-approval": ["ms-gh600-guide", "gh-protected-branches", "gh-rulesets", "gh-codeowners", "gh-deploy-envs", "gh-review-deployments", "ms-responsible-ai-principles"],
  "tools-mcp": ["ms-gh600-guide", "ms-tooling-mcp-envs", "gh-mcp-cloud-agent", "gh-mcp-toolsets", "gh-mcp-server-access", "gh-mcp-allowlist-enforcement"],
  "evaluation-observability": ["ms-gh600-guide", "gh-actions-workflows", "gh-cloud-agent-risks", "ms-foundry-responsible-ai"],
  "memory-release": ["ms-gh600-guide", "ms-agentic-foundations", "gh-copilot-memory", "gh-repository-instructions", "gh-actions-workflows"]
};

const ownerBySection = {
  "task-intake": "Requester plus repository maintainer",
  "repository-instructions": "Repository maintainer or platform owner",
  "planning-handoffs": "Agent workflow owner",
  "review-approval": "Repository maintainer, CODEOWNER, or risk owner",
  "tools-mcp": "Platform owner or tool/MCP administrator",
  "evaluation-observability": "Quality, security, or release owner",
  "memory-release": "Workflow owner or reviewer taking over the task"
};

const defaultDetailBySection = {
  "task-intake": {
    requiredFields: ["Goal", "Allowed scope", "Denied scope", "Inputs", "Outputs", "Validation", "Stop conditions"],
    evidence: ["Issue link", "Task contract", "Acceptance criteria", "Reviewer decision"],
    approvalReview: ["Human approval before sensitive files, broad tools, or unclear scope are changed"],
    failureModes: ["Goal is vague", "Scope expands silently", "Validation is added after implementation"],
    recoveryRollback: ["Stop the agent, rewrite the task boundary, and reopen with explicit evidence requirements"],
    securityCompliance: ["Classify risk tier before granting write, workflow, secret, deployment, or MCP access"],
    gh600Relevance: "Tests whether the learner can convert a broad request into a bounded agent task before execution."
  },
  "repository-instructions": {
    requiredFields: ["Repository purpose", "Commands", "Sensitive paths", "Validation policy", "Stop rules"],
    evidence: ["Instruction file diff", "PR checklist", "Owner review"],
    approvalReview: ["Maintainer approval when instructions change agent behavior or safety boundaries"],
    failureModes: ["Instructions are too broad", "Commands are stale", "Sensitive areas are not named"],
    recoveryRollback: ["Revert the instruction change or add a narrower nested instruction file"],
    securityCompliance: ["Avoid exposing secrets, production paths, or broad permissions as default instructions"],
    gh600Relevance: "Tests whether repository-level behavior is controlled through durable GitHub instructions."
  },
  "planning-handoffs": {
    requiredFields: ["Objective", "Assumptions", "Files", "Steps", "Validation", "Owner", "Next decision"],
    evidence: ["Approved plan", "Handoff packet", "Decision log", "PR comment"],
    approvalReview: ["Approval before execution when the plan touches sensitive paths or expands scope"],
    failureModes: ["Plan and execution happen in one step", "Handoff omits risk", "Next owner is unclear"],
    recoveryRollback: ["Return to planning state, assign an owner, and preserve current evidence before continuing"],
    securityCompliance: ["Do not carry private or stale context into a handoff without review"],
    gh600Relevance: "Tests separation of planning, execution, handoff, and reviewable evidence."
  },
  "review-approval": {
    requiredFields: ["Risk class", "Approval owner", "Blocked actions", "Validation evidence", "Rollback path"],
    evidence: ["CODEOWNERS review", "Ruleset result", "Environment approval", "Audit note"],
    approvalReview: ["Named owner approval before privileged, irreversible, production, or compliance-sensitive action"],
    failureModes: ["Approval is ceremonial", "Policy violation is logged only after execution", "Owner is not accountable"],
    recoveryRollback: ["Block the action, preserve evidence, and route to the risk owner for a controlled path"],
    securityCompliance: "Apply least privilege and explicit authorization for security, privacy, compliance, and Responsible AI risk.",
    gh600Relevance: "Tests right-sized human intervention, guardrails, least privilege, and accountability."
  },
  "tools-mcp": {
    requiredFields: ["Tool or server", "Allowed operation", "Denied operation", "Data boundary", "Approval owner", "Evidence"],
    evidence: ["Permission matrix", "MCP registry or allow-list decision", "Tool-call log", "Escalation record"],
    approvalReview: ["Platform owner review before adding write-capable tools, remote servers, or broader toolsets"],
    failureModes: ["All tools enabled", "Server approved but toolset too broad", "Data boundary undocumented"],
    recoveryRollback: ["Disable the tool, revoke the server or toolset, and rerun validation with reduced access"],
    securityCompliance: "Treat MCP and tools as external capability boundaries that can expose data or act autonomously.",
    gh600Relevance: "Tests tool choice, MCP governance, execution context, and least-privilege tool access."
  },
  "evaluation-observability": {
    requiredFields: ["Expected result", "Signal", "Threshold", "Failure class", "Owner", "Rerun evidence"],
    evidence: ["Workflow run", "Scan output", "Trace review", "Failure analysis", "Tuning log"],
    approvalReview: ["Quality or security owner signs off before accepting residual risk or tuning changes"],
    failureModes: ["Agent confidence replaces evidence", "Tuning happens before root cause", "Regression checks are skipped"],
    recoveryRollback: ["Restore baseline behavior, classify root cause, and rerun the original plus adjacent cases"],
    securityCompliance: "Preserve scan findings, trace data, and accepted-risk decisions without leaking sensitive information.",
    gh600Relevance: "Tests evaluation signals, error analysis, tuning, and evidence-backed release decisions."
  },
  "memory-release": {
    requiredFields: ["Current state", "Decision", "Assumption", "Expiry trigger", "Refresh source", "Next owner"],
    evidence: ["State file", "Decision log", "Checkpoint", "Stale-context checklist"],
    approvalReview: ["Reviewer approval before reusing remembered context after source, branch, policy, or owner changes"],
    failureModes: ["Stale memory is trusted", "Assumptions overwrite facts", "Handoff loses open risk"],
    recoveryRollback: ["Reset memory, refresh current GitHub artifacts, and append a superseding decision"],
    securityCompliance: "Do not retain sensitive data, secrets, private context, or expired assumptions in agent memory.",
    gh600Relevance: "Tests memory scope, state continuity, context refresh, and durable evidence across sessions."
  }
};

const newTemplates = [
  {
    id: "agent-step-map",
    sectionId: "task-intake",
    title: "Agent Step Map",
    filePath: "docs/agent-step-map.md",
    goal: "Map an agent task into ordered intake, context, planning, approval, execution, validation, review, and handoff steps.",
    suggestedUse: "Use when the lesson asks what an agent should do first, next, or never before implementation.",
    placeholders: ["step", "allowed_action", "blocked_action", "approval_owner", "evidence", "stop_condition"],
    expectations: ["Steps are ordered.", "Approval points occur before risky action.", "Each step produces reviewer-visible evidence."]
  },
  {
    id: "agent-anti-pattern-review",
    sectionId: "task-intake",
    title: "Agent Anti-pattern Review",
    filePath: "docs/agent-anti-pattern-review.md",
    goal: "Identify unsafe agent workflow patterns and pair each one with a concrete GitHub control.",
    suggestedUse: "Use before accepting broad, vague, over-permissioned, or evidence-light agent work.",
    placeholders: ["anti_pattern", "symptom", "risk", "mitigation", "github_control", "evidence"],
    expectations: ["Each anti-pattern has a mitigation.", "Mitigation changes workflow behavior.", "Evidence proves the mitigation was applied."]
  },
  {
    id: "branch-scope-control",
    sectionId: "repository-instructions",
    title: "Branch Scope Control",
    filePath: "docs/branch-scope-control.md",
    goal: "Constrain agent work to a branch, issue, allowed paths, required checks, and reviewer-owned merge path.",
    suggestedUse: "Use when a lesson covers branch-based scope, repository scope, autonomous branch creation, or safe PR creation.",
    placeholders: ["branch_name", "issue_url", "allowed_paths", "denied_paths", "required_checks", "codeowner", "ruleset"],
    expectations: ["Branch scope is tied to an issue.", "Allowed and denied paths are explicit.", "Merge evidence includes checks and owner review."]
  },
  {
    id: "mcp-allowlist-decision",
    sectionId: "tools-mcp",
    title: "MCP Allow-list Decision",
    filePath: "docs/mcp-allowlist-decision.md",
    goal: "Record whether an MCP server or toolset is allowed, denied, or escalated for a specific agent task.",
    suggestedUse: "Use for MCP registry, allow-list, server access, remote server, local server, or toolset lessons.",
    placeholders: ["server", "registry", "toolset", "allowed_operations", "denied_operations", "data_scope", "reviewer"],
    expectations: ["Server trust and toolset scope are separate decisions.", "Denied operations are visible.", "Escalation has an owner."]
  },
  {
    id: "least-privilege-access-review",
    sectionId: "review-approval",
    title: "Least-privilege Access Review",
    filePath: "docs/least-privilege-access-review.md",
    goal: "Review repository, branch, workflow, MCP, secret, environment, and deployment access against task need.",
    suggestedUse: "Use when a lesson covers permissions, execution contexts, tool access, or guardrails.",
    placeholders: ["access_surface", "needed_for_task", "granted_level", "denied_level", "evidence", "reviewer"],
    expectations: ["Every access surface has a task need.", "Excess permission is denied.", "Escalation requires evidence."]
  },
  {
    id: "sensitive-action-control",
    sectionId: "review-approval",
    title: "Sensitive Action Control",
    filePath: "docs/sensitive-action-control.md",
    goal: "Define controls for irreversible, privileged, production, data-handling, compliance, or deployment actions.",
    suggestedUse: "Use before an agent can perform actions that need explicit authorization or controlled paths.",
    placeholders: ["action", "risk", "blocked_by_default", "controlled_path", "approval_owner", "rollback", "audit"],
    expectations: ["Sensitive action is blocked by default.", "Controlled path is named.", "Rollback and audit evidence are required."]
  },
  {
    id: "policy-violation-record",
    sectionId: "review-approval",
    title: "Policy Violation Record",
    filePath: "docs/policy-violation-record.md",
    goal: "Record blocked, denied, or escalated agent actions that violate security, compliance, or Responsible AI policy.",
    suggestedUse: "Use when guardrails block an action or when an agent requests a risky exception.",
    placeholders: ["policy", "violating_action", "detection", "decision", "owner", "corrective_action", "audit_link"],
    expectations: ["Violation is recorded before continuation.", "Owner decision is explicit.", "Corrective path prevents repeat failure."]
  },
  {
    id: "regression-checklist",
    sectionId: "evaluation-observability",
    title: "Regression Checklist",
    filePath: "docs/regression-checklist.md",
    goal: "Verify that prompt, memory, tool, workflow, or guardrail changes did not break previously passing behavior.",
    suggestedUse: "Use after tuning, root-cause fixes, scan remediation, or workflow changes.",
    placeholders: ["baseline_case", "adjacent_case", "command", "threshold", "result", "owner", "rollback_trigger"],
    expectations: ["Baseline and adjacent cases are rerun.", "Thresholds are explicit.", "Rollback trigger is named."]
  },
  {
    id: "multi-agent-arbitration-record",
    sectionId: "planning-handoffs",
    title: "Multi-agent Arbitration Record",
    filePath: "docs/multi-agent-arbitration-record.md",
    goal: "Record the human-owned decision when multiple agents produce overlapping or contradictory work.",
    suggestedUse: "Use when agents conflict, duplicate effort, edit overlapping files, or disagree on success.",
    placeholders: ["conflict", "agent_outputs", "evidence_compared", "arbiter", "decision", "rejected_alternative"],
    expectations: ["Arbiter is named.", "Evidence compared is listed.", "Rejected alternatives are preserved."]
  },
  {
    id: "duplicate-effort-checklist",
    sectionId: "planning-handoffs",
    title: "Duplicate Effort Checklist",
    filePath: "docs/duplicate-effort-checklist.md",
    goal: "Detect whether agents are solving the same work, touching the same scope, or producing redundant evidence.",
    suggestedUse: "Use before and during parallel multi-agent execution.",
    placeholders: ["agent", "assigned_scope", "overlap_signal", "duplicate_work", "decision", "owner"],
    expectations: ["Parallel scopes are compared.", "Overlap is resolved before merge.", "One owner keeps the final path."]
  },
  {
    id: "agent-lifecycle-record",
    sectionId: "planning-handoffs",
    title: "Agent Lifecycle Record",
    filePath: "docs/agent-lifecycle-record.md",
    goal: "Record agent addition, reconfiguration, replacement, retirement, preserved state, and audit continuity.",
    suggestedUse: "Use when adding, updating, replacing, or retiring agents in active workflows.",
    placeholders: ["agent_name", "change_type", "reason", "state_preserved", "handoff", "risk", "owner"],
    expectations: ["State survives lifecycle change.", "Replacement does not disrupt active work.", "Audit trail remains continuous."]
  }
];
const newTemplateIds = new Set(newTemplates.map((template) => template.id));

const aliasUpdates = {
  "agent-plan": ["docs/planning-execution-gate.md", "docs/agent-plan-review-checklist.md"],
  "audit-trail": ["docs/agent-deviation-log.md", "docs/agent-evidence-package.md", "docs/validation-evidence.md"],
  "responsible-ai-risk-review": ["docs/agent-risk-review.md"],
  "approval-policy": ["docs/pre-action-approval-policy.md", "docs/human-intervention-policy.md"],
  "autonomy-matrix": ["docs/agent-autonomy-model.md"],
  "tool-permission-matrix": ["docs/tool-permission-matrix.md"]
};

const specificDetails = {
  "branch-scope-control": {
    sourceIds: ["ms-gh600-guide", "gh-copilot-cloud-agent", "gh-protected-branches", "gh-rulesets", "gh-codeowners", "gh-actions-workflows"],
    evidence: ["Branch name and linked issue", "Allowed and denied path list", "Required check results", "CODEOWNERS review", "Branch protection or ruleset status"],
    approvalReview: ["CODEOWNER or repository maintainer approval before merge, with ruleset or branch-protection evidence when protected paths are touched"],
    failureModes: ["Branch exists but allowed paths are not defined", "Agent edits unrelated repository areas", "Required checks or owner review are bypassed"],
    recoveryRollback: ["Close or reset the branch, restore denied-path changes, and reopen with a corrected branch scope record"],
    securityCompliance: ["Protected paths, workflow files, secrets, environments, and deployment changes require owner review before merge"],
    gh600Relevance: "Teaches that branch-based scope requires an issue boundary, allowed paths, checks, and owner review; the branch alone is not the control.",
    miniExample: {
      scenario: "A cloud agent may create a branch for a checkout bug but must not edit authentication or deployment files.",
      completedExample: "Record `agent/checkout-validation`, allowed paths `/src/checkout/**`, denied paths `/.github/workflows/**` and `/src/auth/**`, required test `npm run check`, CODEOWNER `@platform/security`, and ruleset evidence."
    }
  },
  "mcp-allowlist-decision": {
    sourceIds: ["ms-gh600-guide", "ms-tooling-mcp-envs", "gh-mcp-management", "gh-mcp-registry", "gh-mcp-server-access", "gh-mcp-allowlist-enforcement", "gh-mcp-toolsets"],
    evidence: ["MCP server ID", "Registry or allow-list status", "Selected toolsets", "Denied operations", "Tool-call or dry-run evidence", "Escalation owner"],
    approvalReview: ["Platform owner approval before enabling an untrusted server, write-capable toolset, or broader data boundary"],
    failureModes: ["Server is approved but the toolset is still too broad", "Local server is trusted without review", "Allow-list decision is missing from the PR"],
    recoveryRollback: ["Disable the MCP server or toolset, revoke access, and rerun the agent task with the approved capability boundary"],
    securityCompliance: ["Treat MCP server access as an external capability and data-exposure decision, not only a developer convenience"],
    gh600Relevance: "Teaches that MCP server approval, registry policy, allow-list status, and toolset selection are separate exam decisions.",
    miniExample: {
      scenario: "An agent needs GitHub issue context through an MCP server but does not need write operations.",
      completedExample: "Allow the GitHub remote MCP server from the approved registry, select read-only issue/search toolsets, deny mutation tools, record data scope, and route write access to platform-owner approval."
    }
  },
  "least-privilege-access-review": {
    sourceIds: ["ms-gh600-guide", "gh-cloud-agent-risks", "gh-copilot-cli-actions", "gh-mcp-server-access", "gh-deploy-envs", "gh-review-deployments"],
    evidence: ["Access surface inventory", "Task need for each permission", "Denied permission list", "Workflow token scope", "MCP and environment access decision"],
    approvalReview: ["Risk owner approval for any permission that exceeds task need or touches protected environments, secrets, or deployment paths"],
    failureModes: ["Broad workflow token is used for convenience", "MCP write tools are enabled for read-only work", "Secret or deployment access is not tied to the task"],
    recoveryRollback: ["Revoke excess access, rerun validation with least privilege, and record the denied surface in the PR"],
    securityCompliance: ["Least privilege must cover repository, branch, workflow, MCP, secret, environment, and deployment access surfaces"],
    gh600Relevance: "Teaches that least privilege applies across repository, branch, workflow token, MCP, secret, environment, and deployment surfaces.",
    miniExample: {
      scenario: "An agent requests workflow and MCP access to update docs.",
      completedExample: "Grant repository read plus docs-path write through PR, deny secret and deployment access, deny write-capable MCP toolsets, and require escalation evidence for broader scope."
    }
  },
  "sensitive-action-control": {
    sourceIds: ["ms-gh600-guide", "ms-responsible-ai-principles", "gh-protected-branches", "gh-rulesets", "gh-codeowners", "gh-deploy-envs", "gh-review-deployments"],
    evidence: ["Sensitive action classification", "Blocked-by-default rule", "Controlled path", "Approval owner", "Rollback plan", "Audit entry"],
    approvalReview: ["Explicit human authorization before irreversible, privileged, production, data-handling, compliance, or deployment actions"],
    failureModes: ["Agent proceeds because the PR will be reviewed later", "Approval owner is unnamed", "Rollback is described only after execution"],
    recoveryRollback: ["Stop execution, preserve evidence, route to the approval owner, and continue only through the documented controlled path"],
    securityCompliance: ["Sensitive actions require explicit authorization, least privilege, owner review, and auditable evidence before action"],
    gh600Relevance: "Teaches when irreversible, privileged, production, or compliance-sensitive actions need explicit authorization or a controlled path.",
    miniExample: {
      scenario: "An agent proposes changing a deployment workflow and rotating a production secret.",
      completedExample: "Block autonomous execution, require CODEOWNER and environment reviewer approval, document rollback, and preserve audit evidence before any controlled path continues."
    }
  },
  "policy-violation-record": {
    sourceIds: ["ms-gh600-guide", "ms-responsible-ai-principles", "ms-foundry-responsible-ai", "gh-cloud-agent-risks", "gh-rulesets", "gh-codeowners"],
    evidence: ["Policy name", "Blocked action", "Detection point", "Owner decision", "Corrective action", "Audit link"],
    approvalReview: ["Policy owner review before any exception or alternative controlled path is accepted"],
    failureModes: ["Violation is explained after execution", "Exception lacks an owner", "Corrective action does not prevent repeat behavior"],
    recoveryRollback: ["Deny the action, remove unsafe output, document the violation, and add a guardrail or test for recurrence"],
    securityCompliance: ["Security, compliance, privacy, and Responsible AI violations must be blocked and recorded before continuation"],
    gh600Relevance: "Teaches that a policy-violating action should be blocked and recorded, not allowed and explained afterward.",
    miniExample: {
      scenario: "An agent attempts to expose customer data in a test fixture.",
      completedExample: "Record the privacy policy violation, deny the action, assign the data owner, require sanitized fixtures, and link the corrective PR evidence."
    }
  },
  "multi-agent-arbitration-record": {
    sourceIds: ["ms-gh600-guide", "ms-agentic-foundations", "gh-custom-agents-config", "gh-agentic-workflows", "gh-cloud-agent-risks"],
    evidence: ["Conflicting outputs", "Branches or files affected", "Evidence compared", "Arbiter", "Decision", "Rejected alternative"],
    approvalReview: ["Named human arbiter decides which output survives before conflicting branches merge"],
    failureModes: ["Agents resolve disagreement by consensus", "Duplicate work merges twice", "Rejected assumptions are lost"],
    recoveryRollback: ["Pause affected agents, preserve both outputs, choose one owner, and close or rebase conflicting branches"],
    securityCompliance: ["Conflicting agent outputs that touch sensitive paths require owner review before continuation"],
    gh600Relevance: "Teaches that conflicting agent outputs need human-owned arbitration with evidence, not agent consensus.",
    miniExample: {
      scenario: "A builder agent and tester agent disagree whether a failing check is flaky.",
      completedExample: "Pause both branches, compare logs and diffs, assign the release owner as arbiter, accept the tester evidence, and record the rejected builder assumption."
    }
  }
};

function defaultDetails(template) {
  const defaults = defaultDetailBySection[template.sectionId] || defaultDetailBySection["planning-handoffs"];
  const specific = specificDetails[template.id] || {};
  const sourceIds = specific.sourceIds || sectionSourceIds[template.sectionId] || ["ms-gh600-guide"];
  const requiredFields = flatList(specific.requiredFields).length
    ? flatList(specific.requiredFields)
    : newTemplateIds.has(template.id) && flatList(template.placeholders).length >= 3
    ? flatList(template.placeholders)
    : (flatList(template.requiredFields).length ? flatList(template.requiredFields) : (flatList(template.placeholders).length >= 3 ? flatList(template.placeholders) : flatList(defaults.requiredFields)));
  return {
    owner: template.owner || ownerBySection[template.sectionId] || "Repository maintainer",
    requiredFields,
    evidence: flatList(specific.evidence).length ? flatList(specific.evidence) : (flatList(template.evidence).length ? flatList(template.evidence) : flatList(defaults.evidence)),
    approvalReview: flatList(specific.approvalReview).length ? flatList(specific.approvalReview) : (flatList(template.approvalReview).length ? flatList(template.approvalReview) : flatList(defaults.approvalReview)),
    failureModes: flatList(specific.failureModes).length ? flatList(specific.failureModes) : (flatList(template.failureModes).length ? flatList(template.failureModes) : flatList(defaults.failureModes)),
    recoveryRollback: flatList(specific.recoveryRollback).length ? flatList(specific.recoveryRollback) : (flatList(template.recoveryRollback).length ? flatList(template.recoveryRollback) : flatList(defaults.recoveryRollback)),
    securityCompliance: flatList(specific.securityCompliance).length ? flatList(specific.securityCompliance) : (flatList(template.securityCompliance).length ? flatList(template.securityCompliance) : flatList(defaults.securityCompliance)),
    gh600Relevance: template.gh600Relevance || specific.gh600Relevance || defaults.gh600Relevance,
    sourceIds: unique([...(template.sourceIds || []), ...sourceIds]),
    miniExample: template.miniExample || specific.miniExample || {
      scenario: `A reviewer needs to decide whether an agent task using ${template.title} can continue.`,
      completedExample: `Fill ${template.filePath} with task scope, evidence, owner, approval decision, and rollback path before the agent proceeds.`
    },
    lastReviewed: reviewedAt
  };
}

function upsertTemplate(template) {
  const index = templateLibrary.templates.findIndex((item) => item.id === template.id);
  if (index >= 0) {
    templateLibrary.templates[index] = {
      ...templateLibrary.templates[index],
      ...template,
      aliases: unique([...(templateLibrary.templates[index].aliases || []), ...(template.aliases || [])])
    };
  } else {
    templateLibrary.templates.push(template);
  }
}

for (const template of newTemplates) upsertTemplate(template);
for (const [templateId, aliases] of Object.entries(aliasUpdates)) {
  const template = templateLibrary.templates.find((item) => item.id === templateId);
  if (template) template.aliases = unique([...(template.aliases || []), ...aliases]);
}

templateLibrary.version = "2026.07.09";
templateLibrary.summary = "Reusable, source-backed templates for scoped agent work, repository instructions, tool and MCP governance, evaluation, handoffs, approvals, memory, and release learning.";
templateLibrary.templates = templateLibrary.templates.map((template) => ({
  ...template,
  ...defaultDetails(template)
}));

const sectionOrder = new Map(templateLibrary.sections.map((section, index) => [section.id, index]));
templateLibrary.templates.sort((a, b) => {
  const section = (sectionOrder.get(a.sectionId) ?? 99) - (sectionOrder.get(b.sectionId) ?? 99);
  return section || a.title.localeCompare(b.title);
});

function markdownList(items) {
  return asList(items).map((item) => `- ${item}`).join("\n");
}

function sourceList(sourceIds) {
  return unique(sourceIds).map((id) => {
    const source = sourceMap.get(id);
    return source ? `- [${source.title}](${source.url})` : `- ${id}`;
  }).join("\n");
}

function templateMarkdown(template) {
  const rows = unique(template.requiredFields || template.placeholders || []).map((field) => (
    `| ${field} | \`{{${field.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")}}}\` | Link or owner proving the value is current |`
  )).join("\n");
  return `# ${template.title}

## Purpose

${template.goal}

## When To Use

${template.suggestedUse}

## Owner

${template.owner}

## Required Fields

${markdownList(template.requiredFields)}

## Evidence

${markdownList(template.evidence)}

## Approval And Review

${markdownList(template.approvalReview)}

## Failure Modes

${markdownList(template.failureModes)}

## Recovery Or Rollback

${markdownList(template.recoveryRollback)}

## Security And Compliance

${markdownList(template.securityCompliance)}

## GH-600 Relevance

${template.gh600Relevance}

## Sources

${sourceList(template.sourceIds)}

## Mini-example

Scenario: ${template.miniExample.scenario}

Completed example: ${template.miniExample.completedExample}

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
${rows}

## Review Checklist

- [ ] The artifact names the task, owner, and approval path.
- [ ] The evidence is linked or easy to reproduce.
- [ ] The artifact blocks or escalates risky action before execution.
- [ ] The rollback or recovery path is clear.
- [ ] Source-backed assumptions were checked on ${reviewedAt} or later.
`;
}

for (const template of templateLibrary.templates) {
  if (!template.filePath.startsWith("docs/") || !template.filePath.endsWith(".md")) continue;
  fs.mkdirSync(path.dirname(path.join(root, template.filePath)), { recursive: true });
  fs.writeFileSync(path.join(root, template.filePath), templateMarkdown(template));
}

function libraryMarkdown() {
  const lines = [
    "# Agent Documentation Template Library",
    "",
    "This library turns GH-600 agent work into scoped, reviewable, evidence-backed GitHub artifacts.",
    "",
    `Version: ${templateLibrary.version}`,
    `Reviewed: ${reviewedAt}`,
    "",
    "## Research Grounding",
    "",
    "- The official GH-600 study guide defines the exam domains and skill bullets.",
    "- GitHub Docs sources define product behavior for Copilot coding agent, MCP, Actions, branch protection, rulesets, CODEOWNERS, environments, and repository instructions.",
    "- Microsoft Learn and Microsoft Responsible AI sources define architecture, SDLC, governance, and Responsible AI expectations.",
    "",
    "## Template Standard",
    "",
    "Every template in the library now carries purpose, when to use it, owner, required fields, evidence, approval/review, failure modes, recovery/rollback, security/compliance, GH-600 relevance, sources, and a mini-example.",
    ""
  ];
  for (const section of templateLibrary.sections) {
    const templates = templateLibrary.templates.filter((template) => template.sectionId === section.id);
    lines.push(`## ${section.title}`, "", section.description, "", "| Template | Path | Use when | GH-600 relevance |", "| --- | --- | --- | --- |");
    for (const template of templates) {
      lines.push(`| ${template.title} | \`${template.filePath}\` | ${template.suggestedUse.replaceAll("|", "/")} | ${template.gh600Relevance.replaceAll("|", "/")} |`);
    }
    lines.push("");
  }
  lines.push("## Primary Sources", "");
  for (const source of sources.filter((item) => item.id === "ms-gh600-guide" || item.publisher === "GitHub Docs" || /Responsible AI|Agentic AI|MCP|SDLC/i.test(item.title))) {
    lines.push(`- [${source.title}](${source.url})`);
  }
  return lines.join("\n") + "\n";
}

function readHeadJson(relativePath) {
  try {
    return JSON.parse(execSync(`git show HEAD:${relativePath}`, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
  } catch {
    return null;
  }
}

function auditMarkdown() {
  const previousLessons = readHeadJson("src/data/lessons.json") || [];
  const previousLibrary = readHeadJson("src/data/templateLibrary.json") || { templates: [] };
  const previousLessonMap = new Map(previousLessons.map((lesson) => [lesson.id, lesson]));
  const previousTemplateIds = new Set(previousLibrary.templates.map((template) => template.id));
  const currentTemplateIds = new Set(templateLibrary.templates.map((template) => template.id));
  const addedTemplates = templateLibrary.templates.filter((template) => !previousTemplateIds.has(template.id));
  const changedLessonRecommendations = lessons.filter((lesson) => {
    const before = previousLessonMap.get(lesson.id);
    if (!before) return true;
    return JSON.stringify((before.filesToCreate || []).map((item) => item.path)) !== JSON.stringify((lesson.filesToCreate || []).map((item) => item.path));
  });
  const issueOnly = lessons.filter((lesson) => (lesson.filesToCreate || []).length === 1 && lesson.filesToCreate[0].path === ".github/ISSUE_TEMPLATE/agent-task.yml");
  const differentArtifactRequired = lessons.filter((lesson) => !(lesson.filesToCreate || []).some((item) => item.path === ".github/ISSUE_TEMPLATE/agent-task.yml"));
  const byDomain = lessons.reduce((counts, lesson) => {
    counts[lesson.domainId] = (counts[lesson.domainId] || 0) + 1;
    return counts;
  }, {});
  const categoryCounts = lessons.reduce((counts, lesson) => {
    const category = lesson.templateRecommendationProfile?.category || lesson.topicSpecificExplanation?.category || "Unclassified";
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});

  return [
    "# Lesson Template Recommendation Audit",
    "",
    `Reviewed: ${reviewedAt}`,
    "",
    "## Verdict",
    "",
    "The lesson recommendations now use source-backed GitHub artifacts by domain and topic. The generic issue template remains available, but no lesson relies on it as the only recommendation.",
    "",
    "## Totals",
    "",
    `- Total lessons checked: ${lessons.length}`,
    `- Lessons with changed recommendation paths since the previous commit: ${changedLessonRecommendations.length}`,
    `- Templates in library: ${templateLibrary.templates.length}`,
    `- Templates added: ${addedTemplates.length}`,
    `- Existing templates improved with production fields: ${templateLibrary.templates.length - addedTemplates.length}`,
    `- Lessons where issue template alone was enough: ${issueOnly.length}`,
    `- Lessons where a different or additional artifact was required: ${differentArtifactRequired.length}`,
    "",
    "## Lessons By Domain",
    "",
    ...Object.entries(byDomain).map(([domainId, count]) => `- ${domainId}: ${count}`),
    "",
    "## Recommendation Categories",
    "",
    ...Object.entries(categoryCounts).sort().map(([category, count]) => `- ${category}: ${count}`),
    "",
    "## Templates Added",
    "",
    ...(addedTemplates.length ? addedTemplates.map((template) => `- ${template.title} - \`${template.filePath}\``) : ["- None"]),
    "",
    "## Lessons Where The Generic Issue Template Was Sufficient Alone",
    "",
    issueOnly.length ? issueOnly.map((lesson) => `- ${lesson.id}`).join("\n") : "None. The issue template is useful intake, but every final lesson needs at least one more production artifact.",
    "",
    "## Examples Of Corrected Recommendation Logic",
    "",
    "- Domain 1 task-definition lessons pair the issue template with task contract, plan, PR evidence, CODEOWNERS, approval gate, handoff, or step-map artifacts.",
    "- Domain 2 branch-scope lessons now prefer branch scope, CODEOWNERS, PR, environment constraints, tool matrix, and escalation artifacts instead of MCP policy by default.",
    "- Domain 2 MCP lessons keep MCP policy, MCP server review, allow-list decision, tool matrix, environment constraints, and validation workflow artifacts.",
    "- Domain 3 lessons prefer memory policy, state record, resume checkpoint, stale-context checklist, decision log, and context handoff.",
    "- Domain 4 lessons prefer evaluation plan, validation workflow, scan evidence, failure analysis, tuning log, trace review, and regression checklist.",
    "- Domain 5 lessons prefer agent roles, multi-agent plan, handoff contract, conflict log, arbitration, duplicate-effort, recovery, and lifecycle records.",
    "- Domain 6 lessons prefer autonomy matrix, guardrails, approval policy, Responsible AI risk review, least-privilege review, sensitive action control, policy violation record, and audit trail.",
    "",
    "## Source Basis",
    "",
    ...sources.filter((source) => source.id === "ms-gh600-guide" || currentTemplateIds.size && /GitHub Docs|Microsoft Learn|Microsoft/i.test(source.publisher)).map((source) => `- [${source.title}](${source.url})`),
    "",
    "## QA Rules Added",
    "",
    "- Lesson artifact paths must resolve to a template library path or alias.",
    "- Every lesson must have at least one domain-specific artifact.",
    "- Branch-scope lessons must not recommend MCP policy unless the lesson itself is MCP-related.",
    "- Template records must include production fields for owner, required fields, evidence, approval, failure modes, recovery, security/compliance, GH-600 relevance, sources, and mini-example.",
    "- Recommended template files must exist.",
    "",
    "## Remaining Risks",
    "",
    "- GitHub and Microsoft documentation can change after this review date; source currentness checks remain required before release.",
    "- The mapping is intentionally conservative. Some real organizations may add stricter local artifacts for regulated environments.",
    "- UI labels in GitHub products may drift even when the underlying control concept remains accurate."
  ].join("\n") + "\n";
}

writeJson(templateLibraryPath, templateLibrary);
fs.writeFileSync(path.join(docsDir, "TEMPLATE_LIBRARY.md"), libraryMarkdown());
fs.writeFileSync(path.join(docsDir, "LESSON_TEMPLATE_RECOMMENDATION_AUDIT.md"), auditMarkdown());

console.log(JSON.stringify({
  templates: templateLibrary.templates.length,
  newTemplates: newTemplates.length,
  markdownTemplatesWritten: templateLibrary.templates.filter((template) => template.filePath.startsWith("docs/") && template.filePath.endsWith(".md")).length,
  lessonsChecked: lessons.length
}, null, 2));
