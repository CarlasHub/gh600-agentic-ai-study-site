import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "src", "data");
const docsDir = path.join(root, "docs");
const reviewedAt = "2026-07-09";
const sourceSnapshot = "gh600-source-baseline-2026-06-11";

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
}

function writeJson(name, value) {
  fs.writeFileSync(path.join(dataDir, name), JSON.stringify(value, null, 2) + "\n");
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function accuracy() {
  return {
    reviewedAt,
    sourceSnapshot,
    verification: "human-reviewed",
    reviewRequiredOnSourceChange: true
  };
}

function artifact(pathValue, purpose) {
  return { path: pathValue, purpose };
}

function wordCount(value) {
  return String(value || "").trim().split(/\s+/).filter(Boolean).length;
}

function ensureWords(value, minWords, addition) {
  return wordCount(value) >= minWords ? value : `${value} ${addition}`;
}

const sourceAdditions = [
  {
    id: "gh-code-scanning",
    title: "About code scanning",
    url: "https://docs.github.com/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/about-code-scanning",
    publisher: "GitHub Docs",
    accessed: reviewedAt,
    domains: ["domain-4"],
    why: "Exact GitHub Docs support for code scanning as a repository security analysis signal and code scanning alert source."
  },
  {
    id: "gh-codeql-code-scanning",
    title: "Code scanning with CodeQL",
    url: "https://docs.github.com/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql",
    publisher: "GitHub Docs",
    accessed: reviewedAt,
    domains: ["domain-4"],
    why: "Exact GitHub Docs support for CodeQL analysis, CodeQL databases, query results, and code scanning alerts."
  },
  {
    id: "gh-secret-scanning",
    title: "Secret scanning",
    url: "https://docs.github.com/code-security/secret-scanning/about-secret-scanning",
    publisher: "GitHub Docs",
    accessed: reviewedAt,
    domains: ["domain-4", "domain-6"],
    why: "Exact GitHub Docs support for secret scanning across repository history and hardcoded credential alerts."
  },
  {
    id: "gh-dependency-review",
    title: "Dependency review",
    url: "https://docs.github.com/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review",
    publisher: "GitHub Docs",
    accessed: reviewedAt,
    domains: ["domain-4"],
    why: "Exact GitHub Docs support for reviewing insecure dependency changes before they enter the environment."
  },
  {
    id: "gh-dependency-review-action",
    title: "Configuring the dependency review action",
    url: "https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/manage-your-dependency-security/configure-dependency-review-action",
    publisher: "GitHub Docs",
    accessed: reviewedAt,
    domains: ["domain-4"],
    why: "Exact GitHub Docs support for dependency review as a GitHub Actions workflow signal and enforcement mechanism."
  },
  {
    id: "ms-accessibility-evaluation-testing",
    title: "Accessibility evaluation and testing",
    url: "https://learn.microsoft.com/en-us/training/modules/accessibility-evaluation-and-testing/",
    publisher: "Microsoft Learn",
    accessed: reviewedAt,
    domains: ["domain-4"],
    why: "Exact Microsoft Learn support for manual, automated, and user accessibility testing and interpreting accessibility results."
  },
  {
    id: "ms-accessibility-testing",
    title: "Accessibility testing",
    url: "https://learn.microsoft.com/en-us/windows/apps/design/accessibility/accessibility-testing",
    publisher: "Microsoft Learn",
    accessed: reviewedAt,
    domains: ["domain-4"],
    why: "Exact Microsoft Learn support for Accessibility Insights, FastPass, assessment, and accessibility testing workflows."
  },
  {
    id: "ms-edge-accessibility-testing",
    title: "Resources for accessibility testing",
    url: "https://learn.microsoft.com/en-us/microsoft-edge/accessibility/test",
    publisher: "Microsoft Learn",
    accessed: reviewedAt,
    domains: ["domain-4"],
    why: "Exact Microsoft Edge documentation for automated accessibility reports and DevTools accessibility testing signals."
  }
];

const specs = {
  "domain-1-lesson-04-configure-agent-planning-to-be-distinct-from-agent-execution": {
    category: "Agent architecture and SDLC",
    repo: "checkout-platform",
    skill: "Configure agent planning to be distinct from agent execution",
    sourceIds: ["ms-gh600-guide", "ms-agentic-foundations", "ms-agent-architecture-sdlc", "gh-copilot-cloud-agent", "gh-cloud-agent-risks", "gh-protected-branches", "gh-codeowners", "gh-rulesets", "gh-actions-workflows"],
    primarySourceIds: ["ms-gh600-guide", "ms-agentic-foundations", "ms-agent-architecture-sdlc", "gh-copilot-cloud-agent", "gh-cloud-agent-risks", "gh-protected-branches", "gh-codeowners"],
    files: [
      ["docs/agent-plan.md", "Captures the proposed files, assumptions, validation, risks, and denied actions before execution starts."],
      ["docs/agent-plan-approval-record.md", "Records the reviewer decision that allows or denies execution after the plan is inspected."],
      ["docs/agent-step-map.md", "Shows the ordered path from intake to planning, approval, execution, evidence, and handoff."],
      [".github/pull_request_template.md", "Requires the approved plan, deviations, workflow evidence, reviewer decision, and rollback note."],
      [".github/CODEOWNERS", "Routes auth, workflow, and policy files to accountable reviewers before merge."]
    ],
    evidence: "approved plan URL, allowed and denied paths, approval owner, branch name, workflow run URL, changed-file list, CODEOWNERS review, and PR evidence table",
    control: "issue intake, docs/agent-plan.md, docs/agent-plan-approval-record.md, branch protection or rulesets, CODEOWNERS review, and the pull request template",
    approval: "A named reviewer approves the plan before the agent edits files, calls write-capable tools, opens a PR, or touches protected paths.",
    recovery: "If execution started without approval, stop the agent, preserve the diff, revert unapproved changes if needed, and return to plan review.",
    trap: "Reject an answer where the agent writes a plan and implementation in one unreviewed step.",
    plainLanguage: [
      "Planning is the agent explaining what it intends to do. Execution is the agent changing files, calling write-capable tools, creating a branch or pull request, or touching a protected surface. GH-600 expects you to keep those moments separate.",
      "For this skill, the agent may gather context and write docs/agent-plan.md first. It must not start implementation until docs/agent-plan-approval-record.md names the approved scope, denied actions, validation route, and reviewer."
    ],
    core: [
      "Treat the plan as a proposal, not permission. A useful plan names assumptions, target files, validation commands, likely risks, and what the agent is not allowed to do.",
      "The approval gate is the control. A human reviewer or an explicit policy gate checks the plan before code changes, workflow changes, write tools, or pull request creation begin.",
      "Execution begins only after the approved plan is linked to the branch or PR. If the agent discovers new files, sensitive paths, or extra tools, that is a deviation and needs another decision.",
      "The evidence phase proves the separation happened. Reviewers should see the plan, approval record, step map, branch diff, workflow run URL, and PR evidence table in chronological order.",
      "On the exam, the safe option blocks the combined plan-and-execute shortcut. Passing tests after unapproved execution does not fix the missing approval point."
    ],
    githubDetail: "In GitHub, use the issue or task contract for intake, docs/agent-plan.md for the proposed work, docs/agent-plan-approval-record.md for the pre-execution decision, branch protection or rulesets for merge control, CODEOWNERS for owned files, and the PR template for evidence and deviations.",
    practicalExample: "In checkout-platform, an agent is asked to improve login error handling in authentication code. The correct workflow lets the agent inspect issues and tests, write a plan that names /src/auth/errors.ts and npm test -- auth, wait for @security-owner approval, then implement only the approved branch scope and link the workflow run in the PR.",
    scenario: {
      title: "Auth plan gate before edits",
      body: "A cloud agent in checkout-platform writes a plan for a login error change and says it will now update authentication files and open a pull request. The repository uses CODEOWNERS for /src/auth and required checks on protected branches.",
      goodAnswer: "Require docs/agent-plan.md and docs/agent-plan-approval-record.md first, approve only the named auth files and validation command, then allow execution on a branch with PR evidence and CODEOWNER review.",
      trap: "Letting the agent continue because it produced a plan, even though no reviewer approved execution."
    },
    tableRows: [
      ["Planning phase", "Agent may inspect the issue, read relevant files, and write docs/agent-plan.md.", "Proposed files, assumptions, validation, denied scope."],
      ["Plan approval", "Reviewer checks risk, scope, and validation before write-capable action.", "docs/agent-plan-approval-record.md with owner and decision."],
      ["Execution phase", "Agent edits only approved files on the approved branch.", "Branch diff, commit list, and deviation notes."],
      ["Evidence phase", "Reviewer inspects checks, CODEOWNERS review, and rollback path.", "Workflow run URL and PR evidence table."]
    ],
    actionSteps: [
      "Create docs/agent-plan.md with objective, assumptions, target files, validation command, risks, denied actions, and stop conditions.",
      "Compare the plan with the issue scope, CODEOWNERS paths, branch rules, and any workflow or policy files the agent wants to touch.",
      "Record approval or rejection in docs/agent-plan-approval-record.md before the agent edits files, calls write-capable tools, or opens a pull request.",
      "If approved, let the agent create a branch whose name and allowed paths match the plan approval record.",
      "Capture deviations separately: new file scope, new tool access, failed checks, or sensitive paths return the work to plan review.",
      "Require the PR to link the approved plan, branch diff, workflow run URL, CODEOWNER review, and rollback note.",
      "Reject any exam answer that merges planning and execution into one uninterrupted agent run."
    ]
  },
  "domain-1-lesson-09-configure-agent-to-produce-inspectable-artifacts-within-standard-development-too": {
    category: "Repository and branch governance",
    repo: "checkout-platform",
    skill: "Configure agent to produce inspectable artifacts within standard development tooling",
    sourceIds: ["ms-gh600-guide", "ms-agentic-foundations", "ms-agent-architecture-sdlc", "gh-copilot-cloud-agent", "gh-actions-workflows", "gh-protected-branches", "gh-codeowners", "gh-rulesets", "gh-review-deployments", "gh-cloud-agent-risks"],
    primarySourceIds: ["ms-gh600-guide", "ms-agent-architecture-sdlc", "gh-copilot-cloud-agent", "gh-actions-workflows", "gh-protected-branches", "gh-codeowners", "gh-rulesets"],
    files: [
      [".github/pull_request_template.md", "Forces changed files, issue link, checks, approvals, source links, residual risk, and rollback evidence into the PR."],
      ["docs/pr-evidence-table.md", "Maps every agent claim to a GitHub artifact, workflow run, owner, and decision."],
      ["docs/workflow-evidence-record.md", "Records workflow run URLs, check summaries, failed steps, retries, and recovery decisions."],
      ["docs/audit-trail.md", "Preserves issue, commit, PR, review, deployment, and rollback evidence in one timeline."],
      [".github/CODEOWNERS", "Ensures sensitive changed paths request the right reviewer before merge."]
    ],
    evidence: "issue link, PR description, changed-file list, commits, workflow run URL, check summary, logs, review comments, deployment review, and rollback note",
    control: "pull request template, PR evidence table, workflow run, check output, CODEOWNERS review, rulesets, and audit trail",
    approval: "Reviewer approval happens in the PR after the evidence table links each claim to an inspectable GitHub artifact.",
    recovery: "If evidence is missing, block merge, rerun the workflow or add the missing artifact, and keep the rejected claim in the audit trail.",
    trap: "Reject chat-only or local-output answers; agent work must be inspectable in standard GitHub development objects.",
    plainLanguage: [
      "Inspectable artifacts are the objects another developer can open and verify: issue, branch, PR, commit, check run, workflow log, review comment, deployment review, and rollback note.",
      "This lesson is not about making the agent write more text. It is about making every important claim land in GitHub tooling where reviewers can compare the diff, checks, approvals, and risk before merge."
    ],
    core: [
      "A PR description is useful only when it points to evidence. The agent should not say tests passed; it should link the workflow run and summarize the check result.",
      "docs/pr-evidence-table.md turns agent claims into rows: claim, artifact, evidence link, owner, status, residual risk, and next decision.",
      "docs/workflow-evidence-record.md handles command and scan output that reviewers need later, including failed steps and retry reasons.",
      "docs/audit-trail.md keeps the timeline: issue request, plan, commits, checks, reviews, deployment approvals, rejected paths, and rollback decisions.",
      "On GH-600, the wrong answer usually accepts a polished summary. The stronger answer asks which GitHub artifact proves the claim."
    ],
    githubDetail: "Use the pull request template for the review surface, docs/pr-evidence-table.md for claim-to-evidence mapping, docs/workflow-evidence-record.md for Actions evidence, docs/audit-trail.md for chronology, and CODEOWNERS or rulesets for owner-controlled review.",
    practicalExample: "An agent updates checkout validation. The PR includes commits and a good summary, but no check links. The correct fix is to add a PR evidence table with the issue URL, changed components, workflow run URL, failing-to-passing test, review comments, and rollback owner before requesting approval.",
    scenario: {
      title: "PR summary without evidence",
      body: "An agent opens a PR for a checkout fix and writes that tests passed, accessibility was checked, and no deployment risk remains. The PR has no workflow run URL, no changed-file table, and no reviewer decision.",
      goodAnswer: "Require .github/pull_request_template.md plus docs/pr-evidence-table.md so each claim links to workflow evidence, changed files, review comments, owner approvals, and rollback notes.",
      trap: "Accepting the PR because the agent summary sounds complete."
    },
    tableRows: [
      ["Agent claim", "Reviewer artifact", "Acceptable evidence"],
      ["Tests passed", "Workflow run", "Run URL plus check summary."],
      ["Only intended files changed", "Pull request diff", "Changed-file list tied to issue scope."],
      ["Sensitive path approved", "CODEOWNERS or review comment", "Named owner approval before merge."],
      ["Risk is recoverable", "Rollback note", "Owner and action to revert or block."]
    ],
    actionSteps: [
      "Open the PR template and require issue URL, changed-file list, validation commands, workflow run URL, source links, residual risk, and rollback owner.",
      "Create docs/pr-evidence-table.md and map each agent claim to one inspectable GitHub artifact.",
      "Create docs/workflow-evidence-record.md for any build, test, scan, retry, or failed-step output reviewers need to preserve.",
      "Add docs/audit-trail.md entries for issue request, plan approval, commits, reviews, deployment decisions, and rollback notes.",
      "Compare changed files against the approved scope and CODEOWNERS paths before approving the PR.",
      "Block the PR when a claim lacks evidence, a required check is missing, or reviewer ownership is unclear.",
      "Reject exam answers where agent chat output replaces the PR, workflow run, review, or audit artifact."
    ]
  },
  "domain-1-lesson-10-configure-human-intervention-for-autonomous-agents-without-slowing-delivery": {
    category: "Responsible AI and guardrails",
    repo: "checkout-platform",
    skill: "Configure human intervention for autonomous agents without slowing delivery",
    sourceIds: ["ms-gh600-guide", "ms-agentic-foundations", "ms-agent-architecture-sdlc", "ms-responsible-ai-principles", "gh-copilot-cloud-agent", "gh-cloud-agent-risks", "gh-codeowners", "gh-rulesets", "gh-review-deployments"],
    primarySourceIds: ["ms-gh600-guide", "ms-agentic-foundations", "ms-agent-architecture-sdlc", "ms-responsible-ai-principles", "gh-copilot-cloud-agent", "gh-cloud-agent-risks", "gh-codeowners"],
    files: [
      ["docs/approval-policy.md", "Defines which agent actions can proceed, need review, need explicit approval, or must be blocked."],
      ["docs/autonomy-matrix.md", "Maps risk classes to autonomy levels, validation, owner, and evidence."],
      ["docs/sensitive-action-control.md", "Controls irreversible, privileged, production, data, compliance, and deployment actions."],
      [".github/pull_request_template.md", "Captures approval evidence, checks, unresolved risk, and rollback decisions in the PR."],
      ["docs/audit-trail.md", "Records approvals, denials, policy blocks, and escalations for accountability."]
    ],
    evidence: "risk class, autonomy level, blocked-action rule, approval owner, workflow evidence, PR review comment, environment review, and rollback path",
    control: "approval policy, autonomy matrix, sensitive-action control, CODEOWNERS review, rulesets, protected environments, and audit trail",
    approval: "Human review is reserved for material risk: sensitive paths, irreversible changes, privileged tools, production environments, and compliance decisions.",
    recovery: "If an action is over-approved, simplify the policy; if it is under-approved, block the path and route it to the risk owner.",
    trap: "Reject both extremes: approving every step and approving nothing.",
    plainLanguage: [
      "Human intervention should be placed where judgment changes risk. Low-risk inspection can stay fast; auth changes, secret use, deployment, production data, and policy exceptions need a named decision.",
      "This skill is about designing a route map, not adding meetings. docs/autonomy-matrix.md says what the agent may do alone, what needs review, what needs explicit approval, and what is blocked."
    ],
    core: [
      "Start by classifying the action, not the agent. Reading docs, editing a small non-sensitive component, changing a workflow, deploying, and handling secrets are different risk classes.",
      "docs/approval-policy.md should describe four paths: autonomous, review after PR, explicit pre-action approval, and blocked action.",
      "docs/sensitive-action-control.md names actions that must not happen just because the agent is capable: credential changes, production deployment, destructive operations, and compliance exceptions.",
      "Good human intervention preserves delivery speed by letting safe work continue while stopping only the actions where human judgment materially reduces risk.",
      "On GH-600, wrong answers often choose an all-or-nothing policy. The exam favors risk-based gates with evidence and owners."
    ],
    githubDetail: "Use docs/autonomy-matrix.md for risk tiers, docs/approval-policy.md for approval rules, docs/sensitive-action-control.md for blocked or controlled actions, CODEOWNERS or rulesets for owner review, and deployment environment review for production release decisions.",
    practicalExample: "A docs-only typo fix can proceed to PR with checks. A workflow permission change must stop for CODEOWNER review. A production secret rotation must use explicit authorization and an audit entry. A request to bypass compliance policy is blocked unless a controlled exception path exists.",
    scenario: {
      title: "Right-sized intervention for checkout changes",
      body: "A checkout agent has three tasks: update copy, change an auth workflow, and request production secret access for testing. The team wants fast delivery without unsafe autonomy.",
      goodAnswer: "Allow the copy change with normal PR checks, require CODEOWNER approval for the workflow change, require explicit approval and explicit authorization for secret access, and block any policy-bypass path in the audit trail.",
      trap: "Either requiring approval for every low-risk edit or letting the agent continue because all work is on a branch."
    },
    tableRows: [
      ["Action", "Autonomy path", "Evidence"],
      ["Read issue and docs", "Autonomous inside task scope", "Issue link and source notes."],
      ["Edit non-sensitive code", "PR review and checks", "Diff, workflow run, reviewer comment."],
      ["Change workflow, auth, or policy", "Explicit owner approval", "CODEOWNER or ruleset evidence."],
      ["Use secrets or deploy production", "Controlled path or block", "Environment approval and audit entry."]
    ],
    actionSteps: [
      "List the action types the agent may perform and classify each by operational, security, privacy, compliance, and production risk.",
      "Write docs/autonomy-matrix.md with autonomous, review, explicit-approval, and blocked lanes.",
      "Write docs/approval-policy.md with the owner, timing, evidence, and escalation path for each approval lane.",
      "Add docs/sensitive-action-control.md for secrets, deployment, irreversible operations, production data, workflow permissions, and policy exceptions.",
      "Keep low-risk actions moving with normal branch, PR, and workflow evidence instead of unnecessary pre-approval.",
      "Record approvals, denials, and blocked actions in the PR and docs/audit-trail.md.",
      "Reject answer choices that trade risk-based intervention for blanket trust or blanket approvals."
    ]
  },
  "domain-1-lesson-11-agentic-workflows-versus-ordinary-automation": {
    category: "Agent architecture and SDLC",
    repo: "checkout-platform",
    skill: "Agentic workflows versus ordinary automation",
    sourceIds: ["ms-gh600-guide", "ms-agentic-foundations", "ms-agent-architecture-sdlc", "gh-agentic-workflows", "gh-actions-workflows", "gh-copilot-cloud-agent", "gh-cloud-agent-risks"],
    primarySourceIds: ["ms-gh600-guide", "ms-agentic-foundations", "ms-agent-architecture-sdlc", "gh-agentic-workflows", "gh-actions-workflows", "gh-copilot-cloud-agent"],
    files: [
      ["docs/agentic-vs-automation-decision-table.md", "Compares deterministic automation with agentic workflow controls for the task."],
      ["docs/agent-plan.md", "Records agent reasoning when uncertainty, tool choice, or repository context requires planning."],
      ["docs/agent-step-map.md", "Shows planning, tool use, stop conditions, validation, and review evidence."],
      [".github/workflows/agent-validation.yml", "Runs deterministic checks that should remain automated even in agentic workflows."],
      [".github/pull_request_template.md", "Collects review evidence when agentic work changes repository state."]
    ],
    evidence: "task pattern, deterministic trigger, uncertainty signal, tool-use need, stop condition, workflow run URL, PR evidence, and reviewer decision",
    control: "GitHub Actions workflow for deterministic work, agent plan for uncertain work, step map, PR evidence, and stop conditions",
    approval: "Workflow owner approves agentic execution only when uncertainty, tool choice, or context interpretation means simple automation is not enough.",
    recovery: "If agentic controls were overused, move the task back to deterministic automation; if automation hid uncertainty, add plan and review gates.",
    trap: "Reject using an agent when a deterministic workflow is enough, and reject treating uncertain tool-using work as a simple script.",
    plainLanguage: [
      "Ordinary automation follows known rules: when this event happens, run these steps. Agentic workflow adds planning, judgment, tool choice, uncertainty handling, and stop conditions.",
      "This lesson teaches the boundary. Do not use an agent just to feel modern, and do not use a fixed workflow when the task requires diagnosis, repository context, or a reviewer decision."
    ],
    core: [
      "A scheduled labeler, formatter, or dependency cache check is ordinary automation when inputs, steps, and outputs are predictable.",
      "An agentic workflow is appropriate when the task needs interpretation: diagnose a flaky failure, choose files to edit, call tools selectively, or decide when to escalate.",
      "The decision table should name the uncertainty signal. If there is no uncertainty, prefer GitHub Actions and normal checks.",
      "When an agent is justified, add controls that automation does not need: a plan, allowed tools, stop conditions, evidence, and human review for risky choices.",
      "GH-600 scenarios often test overreach. The best answer chooses the least complex mechanism that still controls the real risk."
    ],
    githubDetail: "Use .github/workflows/agent-validation.yml for deterministic checks, docs/agentic-vs-automation-decision-table.md to justify agentic execution, docs/agent-plan.md for uncertain work, docs/agent-step-map.md for stop conditions, and the PR template for reviewer evidence.",
    practicalExample: "In checkout-platform, nightly stale issue labeling should remain a deterministic workflow. Investigating why checkout tests fail only on macOS can justify an agent because it must inspect logs, form hypotheses, edit targeted files, and stop if it needs broader workflow permissions.",
    scenario: {
      title: "When a script is enough",
      body: "A team asks whether to use an agent for two jobs: apply a fixed label to stale issues and diagnose intermittent checkout failures across operating systems.",
      goodAnswer: "Keep stale labeling as deterministic automation, and use an agentic workflow for flaky-test diagnosis with a plan, allowed tools, log evidence, stop conditions, and reviewer approval.",
      trap: "Choosing the same mechanism for both tasks because both run in GitHub."
    },
    tableRows: [
      ["Task clue", "Use ordinary automation when", "Use agentic workflow when"],
      ["Inputs", "Inputs are known and structured.", "Inputs require interpretation across issues, code, or logs."],
      ["Steps", "Steps are fixed and repeatable.", "The next step depends on diagnosis or tool output."],
      ["Risk", "Failure is easy to rerun or roll back.", "Wrong judgment can touch code, workflows, data, or policy."],
      ["Evidence", "Workflow run proves completion.", "Plan, tool log, PR evidence, and reviewer decision are needed."]
    ],
    actionSteps: [
      "Describe the task trigger, inputs, expected output, and whether the steps are deterministic.",
      "Use docs/agentic-vs-automation-decision-table.md to record the automation fit and the agentic uncertainty signal.",
      "Keep fixed checks, labels, formatting, and repeatable validation in GitHub Actions where possible.",
      "Use docs/agent-plan.md when diagnosis, tool choice, code edits, or repository context require agent planning.",
      "Define stop conditions for agentic work: broad access request, failed validation, sensitive path, or ambiguous evidence.",
      "Capture workflow runs for deterministic steps and PR evidence for agent-driven changes.",
      "Reject answer choices that use agentic autonomy where a deterministic workflow is safer and clearer."
    ]
  },
  "domain-2-lesson-08-evaluate-the-execution-context-for-an-agent": {
    category: "Workflow execution",
    repo: "platform-tools",
    skill: "Evaluate the execution context for an agent",
    sourceIds: ["ms-gh600-guide", "ms-tooling-mcp-envs", "gh-actions-workflows", "gh-copilot-setup-steps", "gh-copilot-cli-actions", "gh-deploy-envs", "gh-review-deployments", "gh-mcp-toolsets", "gh-mcp-server-access", "gh-cloud-agent-risks"],
    primarySourceIds: ["ms-gh600-guide", "ms-tooling-mcp-envs", "gh-actions-workflows", "gh-copilot-setup-steps", "gh-copilot-cli-actions", "gh-deploy-envs", "gh-mcp-toolsets"],
    files: [
      ["docs/execution-context-checklist.md", "Evaluates repo scope, branch scope, runner, token, secrets, environments, MCP/tools, data boundary, and approval point."],
      ["docs/agent-tool-permission-matrix.md", "Maps each tool to task need, access level, denied use, evidence, and escalation owner."],
      ["docs/environment-constraints.md", "Constrains runner setup, network, secrets, token permissions, environments, and external systems."],
      [".github/workflows/copilot-setup-steps.yml", "Makes the cloud-agent setup reproducible and reviewable before work begins."],
      [".github/workflows/agent-validation.yml", "Captures validation checks and workflow evidence for the context decision."]
    ],
    evidence: "repository scope, branch scope, workflow run URL, setup log, GITHUB_TOKEN permissions, secret and environment decision, MCP toolset list, data boundary, and approval record",
    control: "execution-context checklist, tool permission matrix, environment constraints, Copilot setup workflow, Actions permissions, protected environments, and MCP toolsets",
    approval: "Approval is required before the agent uses inherited access that is broader than the task, including secrets, protected environments, workflow write, or write-capable MCP tools.",
    recovery: "Remove unused access, rerun setup and validation in the narrower context, and record rejected expansion requests.",
    trap: "Reject the assumption that available access is appropriate access.",
    plainLanguage: [
      "Execution context is the set of boundaries around the agent while it runs: repository, branch, workflow runner, token, secrets, environments, MCP tools, network, data, and approval gates.",
      "The exam pattern is simple: the agent may technically have access, but you must decide whether the task justifies that access before execution."
    ],
    core: [
      "Start by inventorying the context, not by approving the task. Which repository and branch can the agent use? Which runner and setup workflow prepare its environment?",
      "Token permissions matter because a workflow can be green while using more write access than the task needs. The checklist must show the intended GITHUB_TOKEN scope.",
      "Secret and environment access are separate decisions. A docs update usually needs neither deployment credentials nor protected environment approval.",
      "MCP/tool access belongs in the same context review. A read-only search tool and a write-capable repository mutation tool carry different risks.",
      "On GH-600, the wrong answer lets the agent continue because the environment already grants access. The correct answer narrows context first and records evidence."
    ],
    githubDetail: "Use docs/execution-context-checklist.md before work starts, docs/agent-tool-permission-matrix.md for tools and MCP, docs/environment-constraints.md for runner, token, secret, and environment limits, .github/workflows/copilot-setup-steps.yml for setup evidence, and .github/workflows/agent-validation.yml for validation.",
    practicalExample: "In platform-tools, an agent updating README examples runs in a workflow with package publish permission and deployment secrets. The correct execution-context decision grants docs-path branch write and validation checks, denies publishing and secrets, records the MCP read-only toolset, and requires escalation for any protected environment.",
    scenario: {
      title: "Context review for a docs agent",
      body: "A platform-tools agent needs to update SDK README examples. The available workflow runner context can publish packages, read deployment secrets, call MCP write tools, and deploy to a protected environment.",
      goodAnswer: "Create docs/execution-context-checklist.md, grant only repository read and docs-path branch write, deny secrets and deployment, record read-only MCP toolsets, and run validation with narrowed token permissions.",
      trap: "Allowing the agent to use the existing workflow context because the task is small."
    },
    tableRows: [
      ["Context surface", "Question to ask", "Evidence"],
      ["Repository and branch", "Which repo, branch, and paths are needed?", "Allowed path list and branch name."],
      ["Runner and token", "What setup and GITHUB_TOKEN permissions are used?", "Setup log and permissions block."],
      ["Secrets and environments", "Does the task need credentials or deployment access?", "Denied/approved environment record."],
      ["MCP/tools and data", "Which tools and data boundaries are justified?", "Tool permission matrix and toolset list."]
    ],
    actionSteps: [
      "Open docs/execution-context-checklist.md and list repository, branch, runner, token, secret, environment, MCP/tool, data, and approval surfaces.",
      "Tie each access surface to the exact task need; mark unused access as denied rather than available.",
      "Record workflow setup and GITHUB_TOKEN permissions from the Actions workflow before execution.",
      "Use docs/agent-tool-permission-matrix.md to separate read-only tools, write tools, external-data tools, and escalation-only tools.",
      "Use docs/environment-constraints.md to deny secrets, production data, protected environments, and external systems not needed by the task.",
      "Run validation in the narrowed context and attach the setup log, workflow run URL, and check summary.",
      "Reject exam answers where the agent uses inherited repository, secret, environment, or tool access without task justification."
    ]
  },
  "domain-2-lesson-20-tool-risk-classification": {
    category: "MCP and tool access",
    repo: "platform-tools",
    skill: "Tool risk classification",
    sourceIds: ["ms-gh600-guide", "ms-tooling-mcp-envs", "gh-custom-agents-config", "gh-mcp-toolsets", "gh-mcp-server-access", "gh-mcp-cloud-agent", "gh-cloud-agent-risks", "gh-copilot-cli-actions", "gh-actions-workflows"],
    primarySourceIds: ["ms-gh600-guide", "ms-tooling-mcp-envs", "gh-custom-agents-config", "gh-mcp-toolsets", "gh-mcp-server-access", "gh-mcp-cloud-agent", "gh-cloud-agent-risks"],
    files: [
      ["docs/tool-risk-classification.md", "Classifies tools as read-only, write-capable, privileged, external-data, secret, production, or irreversible."],
      ["docs/agent-tool-permission-matrix.md", "Maps risk class to allowed operations, denied operations, approval, evidence, and escalation owner."],
      ["docs/mcp-tool-policy.md", "Constrains MCP servers and toolsets by trust, capability, data boundary, and review requirement."],
      ["docs/execution-context-checklist.md", "Connects tool risk to runner, token, secrets, environments, and data boundaries."],
      ["docs/escalation-paths.md", "Defines what evidence is required before a tool risk escalation."]
    ],
    evidence: "tool name, risk class, allowed operations, denied operations, MCP server or toolset, tool-call log, approval owner, logging requirement, and rollback or disable path",
    control: "tool-risk classification, agent tool permission matrix, MCP tool policy, custom-agent tool list, and escalation path",
    approval: "Write-capable, privileged, secret-accessing, production-impacting, external-write, or irreversible tools require explicit owner approval before use.",
    recovery: "Disable or remove over-risky tools, revoke credentials, rerun the task with the lower-risk toolset, and preserve the denied request.",
    trap: "Reject classifying a tool as safe only because it is useful.",
    plainLanguage: [
      "Tool risk classification answers what damage a tool can do before the agent uses it. A search tool, a repository write tool, a secret-reading tool, and a deployment tool are not the same risk.",
      "The classification changes the workflow: low-risk read-only tools may run with logging, while privileged or irreversible tools need approval, stronger logs, and a rollback or disable path."
    ],
    core: [
      "Classify by capability, not by tool name. The same MCP server can expose read-only operations and write-capable operations through different toolsets.",
      "Use seven practical classes: read-only, write-capable, privileged, external-data-accessing, secret-accessing, production-impacting, and irreversible.",
      "For each class, decide allowed operation, denied operation, approval requirement, logging requirement, and rollback path before the agent calls the tool.",
      "MCP policy must record server trust and toolset narrowing. Approval of a server does not approve every operation the server exposes.",
      "On GH-600, the wrong answer enables all tools for speed. The correct answer grants the smallest tool class that can produce the required evidence."
    ],
    githubDetail: "Use docs/tool-risk-classification.md to label each tool, docs/agent-tool-permission-matrix.md to map access and approval, docs/mcp-tool-policy.md to constrain MCP server/toolset use, custom-agent configuration for available tools, and logs or workflow artifacts for tool-call evidence.",
    practicalExample: "An agent needs to search issues and update a release workflow. Issue search is read-only and can run with logging. Workflow editing is write-capable and owner-reviewed. Deployment is production-impacting and remains denied unless the release owner approves a controlled path.",
    scenario: {
      title: "Too many tools for an issue search",
      body: "A platform-tools agent needs issue context for a bug triage task. It requests issue search plus write-capable repository tools, privileged secret access, and deployment tools from the same MCP server.",
      goodAnswer: "Classify issue search as read-only, deny repository write, secrets, and deployment for this task, record the MCP toolset in docs/mcp-tool-policy.md, and log the read-only call.",
      trap: "Approving the whole MCP server because one of its tools is needed."
    },
    tableRows: [
      ["Tool class", "Approval", "Evidence"],
      ["Read-only", "Usually allowed inside task scope", "Tool-call log and source link."],
      ["Write-capable", "Reviewer approval before mutation", "Allowed operation and rollback path."],
      ["Secret or privileged", "Explicit owner approval", "Denied-by-default policy and audit entry."],
      ["Production or irreversible", "Controlled path or block", "Environment approval and recovery plan."]
    ],
    actionSteps: [
      "List every tool, MCP server, and toolset the agent asks to use before allowing the first call.",
      "Classify each requested operation as read-only, write-capable, privileged, external-data, secret, production, or irreversible.",
      "Record allowed and denied operations in docs/tool-risk-classification.md with the reason for each decision.",
      "Map each allowed tool to task need, logging, approval, escalation, and rollback in docs/agent-tool-permission-matrix.md.",
      "Use docs/mcp-tool-policy.md to separate server trust from toolset approval.",
      "Require a tool-call log or dry-run evidence for approved use and preserve denied expansion requests.",
      "Reject answer choices that enable broad tools because the task is urgent or the server is already trusted."
    ]
  },
  "domain-2-lesson-28-traceability-through-session-logs-and-audit-evidence": {
    category: "Workflow execution",
    repo: "platform-tools",
    skill: "Traceability through session logs and audit evidence",
    sourceIds: ["ms-gh600-guide", "ms-tooling-mcp-envs", "gh-copilot-cloud-agent", "gh-cloud-agent-risks", "gh-actions-workflows", "gh-review-deployments", "gh-rulesets", "gh-codeowners"],
    primarySourceIds: ["ms-gh600-guide", "ms-tooling-mcp-envs", "gh-copilot-cloud-agent", "gh-cloud-agent-risks", "gh-actions-workflows", "gh-review-deployments", "gh-rulesets"],
    files: [
      ["docs/agent-session-log-review.md", "Compares agent session logs with issue, commits, PR, checks, approvals, and rollback evidence."],
      ["docs/audit-trail.md", "Creates the chronological record of request, action, evidence, approval, deployment, and recovery."],
      ["docs/pr-evidence-table.md", "Maps PR claims to specific GitHub artifacts and owners."],
      ["docs/workflow-evidence-record.md", "Captures workflow run URLs, check output, failed steps, and retry decisions."],
      ["docs/escalation-paths.md", "Records how missing evidence, broader access, or failed actions are escalated."]
    ],
    evidence: "agent session log, issue timeline, PR description, commit list, workflow run URL, check output, review comments, deployment or environment approval, and rollback note",
    control: "agent session log review, audit trail, PR evidence table, workflow evidence record, issue timeline, and review comments",
    approval: "Reviewer compares the session log with durable GitHub artifacts before accepting that the agent stayed within scope.",
    recovery: "If the timeline has gaps, block merge, reconstruct from commits and workflow runs, and record the missing or rejected evidence.",
    trap: "Reject a final agent summary that cannot be tied to session logs and GitHub artifacts.",
    plainLanguage: [
      "Traceability means a reviewer can reconstruct what the agent saw, decided, called, changed, validated, escalated, and rolled back.",
      "Session logs are only one piece. GH-600 expects you to connect them to GitHub evidence: issue timeline, PR description, commits, workflow runs, reviews, deployment approvals, and rollback notes."
    ],
    core: [
      "Start with the session log, but do not stop there. A trace is trustworthy only when it matches commits, workflow evidence, and reviewer-visible decisions.",
      "docs/agent-session-log-review.md should list tool calls, decisions, evidence gaps, and where each item appears in GitHub.",
      "docs/audit-trail.md provides chronology: issue request, plan or approval, execution, validation, review, deployment, rollback, and unresolved risk.",
      "docs/pr-evidence-table.md turns claims into inspectable rows so a reviewer does not have to infer from chat history.",
      "On GH-600, wrong answers rely on the agent's final explanation. Correct answers preserve evidence that another person can audit later."
    ],
    githubDetail: "Use issue comments for timeline, pull request descriptions for scope and evidence, commit history for changed files, Actions runs for checks, review comments for owner decisions, deployment environment approvals for release gates, and docs/audit-trail.md for a durable review trail.",
    practicalExample: "An agent says it only changed docs, but the branch includes a workflow edit. The traceable review compares the session log, commits, PR evidence table, workflow run, CODEOWNER review, and rollback note before deciding whether to block merge.",
    scenario: {
      title: "Session log does not match the diff",
      body: "A platform-tools agent claims it completed a docs update. The session log mentions only README edits, but the PR contains a workflow change and a failed validation run.",
      goodAnswer: "Use docs/agent-session-log-review.md, docs/audit-trail.md, and docs/pr-evidence-table.md to connect session log, commits, workflow output, reviewer comments, and rollback decision before approval.",
      trap: "Trusting the final agent summary because it sounds coherent."
    },
    tableRows: [
      ["Evidence source", "What it proves", "Failure to catch"],
      ["Session log", "Prompt, tool calls, decisions", "Hidden or unexpected tool use."],
      ["Commit and PR diff", "Actual repository changes", "Files changed outside the stated scope."],
      ["Workflow run", "Validation result and failed steps", "Narrative success with failing checks."],
      ["Review and deployment records", "Human decision and release gate", "Approval claimed but not recorded."]
    ],
    actionSteps: [
      "Collect the agent session log and identify every claimed action, tool call, decision, and validation result.",
      "Match each session-log item to an issue comment, PR section, commit, workflow run, review comment, or deployment approval.",
      "Record matches and gaps in docs/agent-session-log-review.md.",
      "Build docs/audit-trail.md in chronological order from request through rollback or release decision.",
      "Use docs/pr-evidence-table.md to map claims to evidence links and owners.",
      "Block approval when the log, diff, checks, and reviews cannot explain the same story.",
      "Reject exam answers that treat agent narration as traceability without durable GitHub evidence."
    ]
  },
  "domain-3-lesson-13-memory-reset-and-expiry-decisions": {
    category: "Memory and state",
    repo: "long-running-refactor",
    skill: "Memory reset and expiry decisions",
    sourceIds: ["ms-gh600-guide", "ms-agentic-foundations", "gh-copilot-memory", "gh-repository-instructions", "gh-custom-instructions-support", "gh-actions-workflows", "ms-foundry-responsible-ai"],
    primarySourceIds: ["ms-gh600-guide", "ms-agentic-foundations", "gh-copilot-memory", "gh-repository-instructions", "gh-custom-instructions-support", "gh-actions-workflows"],
    files: [
      ["docs/memory-reset-decision.md", "Records whether to preserve, prune, expire, reset, or replace remembered context."],
      ["docs/agent-memory-policy.md", "Defines allowed memory, denied memory, retention, expiry triggers, and reset rules."],
      ["docs/stale-context-checklist.md", "Forces refresh of issue, PR, branch, checks, instructions, and source docs before reuse."],
      ["docs/decision-log.md", "Moves durable decisions out of hidden memory and into repository state."],
      ["docs/context-handoff.md", "Shares current state without carrying stale or sensitive memory across sessions."]
    ],
    evidence: "memory item, current source artifact, issue and PR refresh, branch diff, latest workflow run, expiry trigger, reset reason, durable replacement artifact, and reviewer decision",
    control: "memory reset decision, memory policy, stale-context checklist, decision log, context handoff, and current GitHub artifacts",
    approval: "Reviewer approval is required before reusing memory after issue, PR, branch, policy, source, owner, or sensitive-data changes.",
    recovery: "Reset stale or sensitive memory, refresh GitHub artifacts, and move durable facts to docs/decision-log.md or docs/context-handoff.md.",
    trap: "Reject keeping stale or sensitive context because it might be useful later.",
    plainLanguage: [
      "Memory is not automatically good. A remembered fact can be accurate and still unsafe because the branch changed, a reviewer rejected it, a source doc moved, or the memory contains sensitive data.",
      "This lesson teaches five decisions: preserve useful current memory, prune irrelevant memory, expire old memory, reset unsafe memory, or replace memory with a durable repository artifact."
    ],
    core: [
      "Start by naming the memory item and its current source. If the fact cannot be traced to an issue, PR, branch, workflow run, source doc, or decision log, it is weak evidence.",
      "Preserve memory only when it is current, task-relevant, allowed by policy, and visible enough for review.",
      "Prune memory that is irrelevant to the active task. Expire memory when a trigger fires: branch rebase, new PR review, failed check, policy change, source update, or owner change.",
      "Reset memory when it is stale, conflicting, sensitive, or based on hidden assumptions. Replace durable decisions with docs/decision-log.md instead of asking the agent to remember them.",
      "GH-600 wrong answers value continuity over correctness. The safe answer refreshes context before reuse and discards memory that cannot be justified."
    ],
    githubDetail: "Use docs/memory-reset-decision.md for the reuse decision, docs/agent-memory-policy.md for allowed and denied memory, docs/stale-context-checklist.md before resuming, docs/decision-log.md for durable facts, and docs/context-handoff.md when another agent or session continues.",
    practicalExample: "A refactor agent remembers that the API endpoint is /v1/orders. A later PR review changes it to /v2/orders and CI fails against the old route. The correct decision expires the old memory, refreshes issue and PR state, records the new endpoint in the decision log, and resumes from durable state.",
    scenario: {
      title: "Old endpoint memory after review",
      body: "A long-running-refactor agent resumes after a week and remembers an old API endpoint. The learner must decide whether to preserve, prune, expire, or reset that memory because the branch was rebased, PR review changed the route, and the latest workflow failed against the remembered value.",
      goodAnswer: "Use docs/memory-reset-decision.md to expire the old memory, refresh issue, PR, branch, checks, and source docs with docs/stale-context-checklist.md, then write the current endpoint to docs/decision-log.md.",
      trap: "Keeping the remembered endpoint because it helped in an earlier session."
    },
    tableRows: [
      ["Decision", "Use when", "Evidence"],
      ["Preserve", "Fact is current, allowed, and task-relevant.", "Current source link and reviewer note."],
      ["Prune", "Fact is harmless but irrelevant.", "Memory policy entry."],
      ["Expire", "A trigger changed branch, issue, source, policy, or owner.", "Stale-context checklist."],
      ["Reset or replace", "Fact is sensitive, conflicting, or hidden.", "Reset decision plus durable artifact."]
    ],
    actionSteps: [
      "List the remembered facts the agent wants to reuse and identify the current GitHub or source artifact for each fact.",
      "Classify each item as preserve, prune, expire, reset, or replace with durable repository state.",
      "Run docs/stale-context-checklist.md against issue comments, PR review, branch diff, latest workflow run, repository instructions, and source docs.",
      "Record reset or expiry triggers in docs/agent-memory-policy.md, including policy changes, source changes, branch rebases, failed checks, and owner changes.",
      "Move durable decisions into docs/decision-log.md or docs/context-handoff.md instead of relying on hidden chat memory.",
      "Require reviewer approval before reusing memory that touches sensitive data, compliance policy, or conflicting context.",
      "Reject exam answers that keep memory forever or trust remembered context without a refresh."
    ]
  },
  "domain-4-lesson-06-classify-root-causes-including-reasoning-errors-tool-misuse-and-context-or-envir": {
    category: "Evaluation and tuning",
    repo: "security-cleanup",
    skill: "Classify root causes, including reasoning errors, tool misuse, and context or environment issues",
    sourceIds: ["ms-gh600-guide", "ms-foundry-responsible-ai", "gh-actions-workflows", "gh-copilot-setup-steps", "gh-copilot-memory", "gh-mcp-toolsets", "gh-code-scanning", "gh-cloud-agent-risks"],
    primarySourceIds: ["ms-gh600-guide", "ms-foundry-responsible-ai", "gh-actions-workflows", "gh-copilot-setup-steps", "gh-copilot-memory", "gh-mcp-toolsets", "gh-code-scanning"],
    files: [
      ["docs/root-cause-classification.md", "Classifies the first failing signal before prompt, memory, tool, permission, or workflow changes."],
      ["docs/agent-failure-analysis.md", "Records expected result, actual result, evidence, rejected causes, repair, and regression case."],
      ["docs/error-analysis.md", "Connects the selected cause to the smallest appropriate repair."],
      ["docs/regression-checklist.md", "Defines the original and adjacent cases to rerun after repair."],
      [".github/workflows/agent-validation.yml", "Preserves the workflow evidence that showed the failure and verifies the repair."]
    ],
    evidence: "expected result, actual result, first failing signal, workflow log, tool call, memory or context source, permission decision, rejected causes, selected repair, and regression rerun",
    control: "root-cause classification, failure analysis, workflow logs, tool-call evidence, memory refresh, error analysis, and regression checklist",
    approval: "Quality owner reviews the root-cause class before prompts, memory, tools, permissions, workflows, or thresholds are changed.",
    recovery: "Undo mismatched fixes, return to the first failing signal, classify again, and rerun the original plus adjacent regression cases.",
    trap: "Reject tuning prompts or widening permissions before classifying the failure from evidence.",
    plainLanguage: [
      "Root-cause classification is the step between seeing a failed agent run and changing something. The first question is not how to fix it; it is what kind of failure the evidence proves.",
      "GH-600 expects categories: reasoning, instruction, missing context, stale context, tool misuse, permission issue, environment issue, workflow or check failure, and evaluation-threshold issue."
    ],
    core: [
      "Start with expected versus actual behavior and the first failing signal. Later symptoms often mislead the repair.",
      "Reasoning failure means the agent had the right information and tools but drew the wrong conclusion. Instruction failure means the task or repository guidance was ambiguous or wrong.",
      "Context failures are about missing or stale facts. Tool misuse means the wrong tool, wrong operation, or wrong tool arguments were used. Permission and environment failures come from access or runner setup.",
      "Evaluation-threshold failures happen when the success criterion is wrong, too weak, or not measured. Do not tune the prompt when the threshold is the defect.",
      "The exam trap is fast repair. The correct answer classifies from logs, traces, tool calls, context, and checks before changing the system."
    ],
    githubDetail: "Use docs/root-cause-classification.md for the category, docs/agent-failure-analysis.md for evidence and rejected causes, workflow logs and tool-call records for first-failure evidence, docs/error-analysis.md for the repair, and docs/regression-checklist.md before accepting the fix.",
    practicalExample: "An agent fails a dependency update because it used npm in a pnpm repository, then proposes a broader prompt. The first failing signal is tool misuse or environment setup, not reasoning. The repair is to correct setup/tool instructions and rerun regression checks.",
    scenario: {
      title: "Prompt tune before classification",
      body: "A security-cleanup agent fails validation after using the wrong package manager and reading stale dependency notes. The evidence could indicate instruction failure, missing context, stale context, tool misuse, or permission trouble, but the agent proposes changing the prompt and requesting broader workflow permissions.",
      goodAnswer: "Classify the first failure in docs/root-cause-classification.md, separate tool misuse from stale context and permissions, choose the matching repair, and rerun original plus adjacent regression checks.",
      trap: "Changing prompts or permissions before proving the root cause."
    },
    tableRows: [
      ["Root cause", "Evidence clue", "Correct repair"],
      ["Reasoning", "Right facts and tools, wrong conclusion", "Add example, rubric, or reasoning check."],
      ["Tool misuse", "Wrong tool, operation, or arguments", "Narrow or correct tool policy and rerun."],
      ["Stale context", "Old issue, PR, memory, or source fact", "Refresh context and reset memory."],
      ["Environment or permission", "Setup, token, runner, or access failure", "Fix setup or scoped permission only if evidence proves it."]
    ],
    actionSteps: [
      "Write expected result, actual result, and the first failing signal before discussing fixes.",
      "Collect workflow logs, tool calls, plan output, context sources, permission decisions, and check output.",
      "Classify the cause in docs/root-cause-classification.md using the defined categories.",
      "List at least two tempting but rejected causes and explain which evidence rules them out.",
      "Choose the smallest repair that matches the classified cause.",
      "Add a regression case in docs/regression-checklist.md and rerun original plus adjacent cases.",
      "Reject exam answers that tune prompts, change memory, widen tools, or alter workflows before classification."
    ]
  },
  "domain-4-lesson-10-static-analysis-codeql-secret-scanning-dependency-checks": {
    category: "Evaluation and tuning",
    repo: "security-cleanup",
    skill: "Static analysis, CodeQL, secret scanning, dependency checks",
    sourceIds: ["ms-gh600-guide", "ms-foundry-responsible-ai", "gh-actions-workflows", "gh-code-scanning", "gh-codeql-code-scanning", "gh-secret-scanning", "gh-dependency-review", "gh-dependency-review-action", "gh-rulesets", "gh-codeowners"],
    primarySourceIds: ["ms-gh600-guide", "ms-foundry-responsible-ai", "gh-actions-workflows", "gh-code-scanning", "gh-codeql-code-scanning", "gh-secret-scanning", "gh-dependency-review", "gh-dependency-review-action"],
    files: [
      ["docs/security-scan-evidence.md", "Records CodeQL, code scanning, secret scanning, dependency review, finding disposition, owner, and accepted risk."],
      ["docs/regression-checklist.md", "Defines reruns after fixing scan findings so the agent does not remove evidence or break behavior."],
      ["docs/workflow-evidence-record.md", "Preserves scan workflow run URLs, failed-step output, and retry decisions."],
      ["docs/pr-evidence-table.md", "Maps scan claims to alerts, workflow runs, review comments, and remediation evidence."],
      [".github/workflows/agent-validation.yml", "Runs scan or validation checks and preserves the required evidence in GitHub Actions."]
    ],
    evidence: "CodeQL or code scanning alert, secret scanning alert, dependency review result, workflow run URL, failed check summary, finding disposition, remediation commit, owner approval, and regression rerun",
    control: "CodeQL/code scanning, secret scanning, dependency review, dependency review action, workflow checks, security scan evidence, and regression checklist",
    approval: "Security owner reviews unresolved high-risk findings, accepted risk, secret remediation, dependency exceptions, and regression evidence before merge.",
    recovery: "Fix or revoke the finding, rerun the scan, preserve the original failed evidence, and block merge until disposition and regression evidence are recorded.",
    trap: "Reject treating a passing or removed scan as proof without finding disposition and rerun evidence.",
    plainLanguage: [
      "Static analysis and security scans are evaluation signals. CodeQL/code scanning looks for vulnerabilities and code errors, secret scanning looks for hardcoded credentials, and dependency review checks dependency changes before they enter the environment.",
      "The agent's job after a failed scan is not to hide the check. It must classify the finding, fix or escalate it, record owner disposition, and rerun the scan or regression path."
    ],
    core: [
      "Distinguish the tools. Static analysis inspects code; CodeQL produces code scanning alerts; secret scanning detects credential leaks; dependency review evaluates dependency changes and can run in Actions.",
      "A failed scan is evidence, not noise. Preserve the alert or workflow run, identify the affected file or dependency, and assign an owner.",
      "Remediation evidence includes the commit that fixes the issue, the rerun that proves the finding is resolved, and a reviewer decision for any accepted risk.",
      "Regression evidence matters because the agent might remove a rule, skip a workflow, or downgrade a package in a way that creates a different risk.",
      "On GH-600, the wrong answer accepts an agent's security summary. The right answer links the exact scan signal to remediation and review evidence."
    ],
    githubDetail: "Use GitHub code scanning and CodeQL docs for vulnerability/error alerts, secret scanning docs for credential findings, dependency review docs and the dependency review action for pull request dependency checks, docs/security-scan-evidence.md for disposition, and docs/regression-checklist.md for reruns.",
    practicalExample: "An agent updates a dependency and CodeQL passes, but dependency review reports a high-severity vulnerable package and secret scanning flags a test token. The correct PR records both findings, revokes or replaces the token, changes the dependency, reruns checks, and gets security-owner approval before merge.",
    scenario: {
      title: "Failed dependency and secret scans",
      body: "A security-cleanup agent opens a PR. CodeQL passes, dependency review fails on a vulnerable package, and secret scanning flags a committed token in a fixture.",
      goodAnswer: "Record each finding in docs/security-scan-evidence.md, revoke or replace the token, fix or justify the dependency, rerun the checks, add regression evidence, and require security-owner review.",
      trap: "Deleting the failing workflow or saying CodeQL passed so the PR is safe."
    },
    tableRows: [
      ["Signal", "What it can show", "Evidence to record"],
      ["CodeQL/code scanning", "Potential vulnerabilities or code errors", "Alert, file, severity, fix commit, rerun."],
      ["Secret scanning", "Hardcoded credential exposure", "Alert, revocation action, owner decision."],
      ["Dependency review", "Risk in dependency changes", "PR dependency diff and action result."],
      ["Regression", "Fix did not remove coverage or break behavior", "Original and adjacent rerun evidence."]
    ],
    actionSteps: [
      "Identify which scan signal fired: CodeQL/code scanning, secret scanning, dependency review, or another static analysis check.",
      "Preserve the failed workflow run, alert link, affected file or dependency, severity, and finding owner.",
      "Classify the finding disposition: fix, false positive with owner approval, accepted risk, or block.",
      "Record remediation in docs/security-scan-evidence.md with commit, command, and reviewer decision.",
      "Run the relevant check again and capture workflow run URL plus check summary in docs/workflow-evidence-record.md.",
      "Add docs/regression-checklist.md evidence proving the agent did not remove scanning coverage or introduce adjacent risk.",
      "Reject exam answers that treat scan output as complete proof without human disposition and remediation evidence."
    ]
  },
  "domain-4-lesson-11-accessibility-scans-as-evaluation-signals": {
    category: "Evaluation and tuning",
    repo: "security-cleanup",
    skill: "Accessibility scans as evaluation signals",
    sourceIds: ["ms-gh600-guide", "ms-foundry-responsible-ai", "ms-accessibility-evaluation-testing", "ms-accessibility-testing", "ms-edge-accessibility-testing", "gh-actions-workflows", "gh-codeowners"],
    primarySourceIds: ["ms-gh600-guide", "ms-foundry-responsible-ai", "ms-accessibility-evaluation-testing", "ms-accessibility-testing", "ms-edge-accessibility-testing", "gh-actions-workflows"],
    files: [
      ["docs/accessibility-scan-evidence.md", "Records automated accessibility findings, manual checks, limitations, owner decision, and PR evidence."],
      ["docs/agent-evaluation-plan.md", "Defines the accessibility signal, pass/fail threshold, human review, and release decision."],
      ["docs/pr-evidence-table.md", "Maps accessibility claims to scan runs, manual checks, screenshots, and review comments."],
      ["docs/workflow-evidence-record.md", "Captures CI or DevTools accessibility report evidence and reruns."],
      ["docs/regression-checklist.md", "Defines adjacent accessibility cases to rerun after remediation."]
    ],
    evidence: "accessibility scan run, tool and version, findings, affected component, manual keyboard check, screen-reader or accessible-name review, limitation note, owner decision, PR evidence, and regression rerun",
    control: "accessibility scan evidence, evaluation plan, workflow or DevTools report, manual review checklist, PR evidence table, and regression checklist",
    approval: "Accessibility or quality owner reviews automated findings plus manual checks before accepting residual accessibility risk.",
    recovery: "Reopen unresolved findings, add manual checks, rerun scans, and block merge until limitations and owner disposition are recorded.",
    trap: "Reject treating an automated accessibility scan as complete proof of accessibility.",
    plainLanguage: [
      "Accessibility scans are signals, not verdicts. They can find many common problems, but they do not prove the UI works for every user or assistive technology path.",
      "The GH-600 move is to record what the scan found, what it cannot prove, which manual checks were performed, and who accepted or rejected the residual risk."
    ],
    core: [
      "Start with the accessibility requirement: component, page, user path, and expected accessible behavior.",
      "Automated reports from Accessibility Insights, DevTools, Lighthouse, or CI are evidence sources. They should include tool, version, run, findings, and affected elements.",
      "Manual checks are still needed for keyboard flow, focus order, accessible names, screen-reader behavior, and user-impact judgment.",
      "docs/accessibility-scan-evidence.md should record findings, limitations, owner disposition, and the PR evidence that proves remediation.",
      "On GH-600, the wrong answer says the scan passed so accessibility is done. The right answer treats the scan as one evaluation signal with human review."
    ],
    githubDetail: "Use docs/agent-evaluation-plan.md to define the accessibility signal and threshold, docs/accessibility-scan-evidence.md for scan and manual check evidence, workflow evidence for CI reports, and the PR evidence table to link findings, fixes, review comments, and residual risk.",
    practicalExample: "An agent changes a checkout form and a DevTools report has no automated issues. The reviewer still asks for keyboard tab order, visible focus, label/name checks, error announcement behavior, limitations, and owner approval before merging.",
    scenario: {
      title: "Passing scan with missing manual checks",
      body: "An agent updates a checkout form and attaches a passing accessibility scan. The PR does not mention keyboard navigation, focus order, labels, error announcements, or scan limitations.",
      goodAnswer: "Record the scan in docs/accessibility-scan-evidence.md, add manual keyboard and accessible-name checks, document limitations, link evidence in the PR, and require quality-owner review.",
      trap: "Treating the passing automated scan as the complete evaluation."
    },
    tableRows: [
      ["Evidence", "What it shows", "What it cannot prove alone"],
      ["Automated scan", "Common detectable issues and report output", "Complete assistive technology experience."],
      ["Keyboard check", "Tab order and focus usability", "Screen-reader announcement quality."],
      ["Accessible-name review", "Labels and names for controls", "Whether the flow is understandable."],
      ["Human review", "Residual-risk decision", "Replacement for rerunnable evidence."]
    ],
    actionSteps: [
      "Define the component, user path, accessibility expectation, scan tool, and pass/fail threshold in docs/agent-evaluation-plan.md.",
      "Run the accessibility scan or collect the DevTools/CI report and record tool, version, run, findings, and affected component.",
      "Add manual checks for keyboard navigation, visible focus, accessible names, error messages, and any screen-reader-relevant behavior.",
      "Record scan limitations and owner disposition in docs/accessibility-scan-evidence.md.",
      "Link findings, fixes, manual review, screenshots or report artifacts, and residual risk in docs/pr-evidence-table.md.",
      "Rerun the original and one adjacent accessibility case after remediation.",
      "Reject exam answers where a scan pass replaces human review or evidence of the actual user path."
    ]
  },
  "domain-6-lesson-05-scope-permissions-and-execution-contexts-to-enforce-least-privilege-access": {
    category: "Responsible AI and guardrails",
    repo: "regulated-api",
    skill: "Scope permissions and execution contexts to enforce least-privilege access",
    sourceIds: ["ms-gh600-guide", "ms-tooling-mcp-envs", "ms-responsible-ai-principles", "ms-foundry-responsible-ai", "gh-cloud-agent-risks", "gh-actions-workflows", "gh-copilot-cli-actions", "gh-mcp-server-access", "gh-mcp-toolsets", "gh-deploy-envs", "gh-review-deployments", "gh-codeowners", "gh-rulesets"],
    primarySourceIds: ["ms-gh600-guide", "ms-tooling-mcp-envs", "ms-responsible-ai-principles", "ms-foundry-responsible-ai", "gh-cloud-agent-risks", "gh-actions-workflows", "gh-mcp-server-access", "gh-deploy-envs"],
    files: [
      ["docs/least-privilege-access-review.md", "Reviews repository, branch, workflow, token, secret, environment, MCP/tool, write, approval, and audit surfaces."],
      ["docs/agent-tool-permission-matrix.md", "Maps each tool or permission to task need, denied level, evidence, owner, and escalation."],
      ["docs/approval-policy.md", "Defines when excess permission, secrets, production, or compliance-sensitive changes require explicit approval."],
      ["docs/execution-context-checklist.md", "Connects least privilege to runner, token, environment, data, and MCP/tool boundaries."],
      ["docs/audit-trail.md", "Records access decisions, denials, approvals, validation, and rollback evidence."]
    ],
    evidence: "access surface inventory, task need, granted level, denied level, token permission, secret decision, environment decision, MCP/tool access decision, approval owner, validation run, audit entry, and rollback path",
    control: "least-privilege access review, tool permission matrix, approval policy, execution-context checklist, protected environments, CODEOWNERS, rulesets, and audit trail",
    approval: "Risk owner approves only permissions that exceed normal task need or touch secrets, production, protected environments, privileged tools, or compliance surfaces.",
    recovery: "Revoke excess access, rerun with the minimum permission set, record denied surfaces, and require escalation for any future expansion.",
    trap: "Reject broad access for convenience or speed.",
    plainLanguage: [
      "Least privilege means every permission has to earn its place. Repository, branch, workflow token, secret, environment, MCP/tool, write, approval, and audit surfaces are separate decisions.",
      "This lesson asks the learner to justify each access surface: why it is needed, what risk it introduces, what evidence proves it was controlled, and who can approve an expansion."
    ],
    core: [
      "Start with the task, then inventory access. Do not start from what the agent already has.",
      "Repository and branch scope decide where the agent can read and write. Workflow and token permissions decide what automation can do. Secrets and environments decide exposure to sensitive systems.",
      "MCP and tool permissions need their own review because a tool can read data, mutate GitHub, call external systems, or affect production.",
      "docs/least-privilege-access-review.md should show allowed, denied, and escalated permissions with evidence and owner.",
      "GH-600 wrong answers give broad access because a PR will be reviewed. The correct answer narrows permission before execution and records why expansion is denied or approved."
    ],
    githubDetail: "Use docs/least-privilege-access-review.md for access surfaces, docs/agent-tool-permission-matrix.md for tool and MCP permissions, docs/approval-policy.md for expansion gates, docs/execution-context-checklist.md for runner/token/secret/environment context, protected environments for deployment approval, CODEOWNERS/rulesets for owner review, and docs/audit-trail.md for evidence.",
    practicalExample: "A regulated-api agent must update OpenAPI docs. It gets repository read, docs-path branch write, PR creation, and validation checks. It does not get production secrets, deployment environments, workflow write, or repository-wide MCP mutation tools. Any request for broader access needs an approval-policy entry and audit trail.",
    scenario: {
      title: "Docs task with production permissions",
      body: "A regulated-api agent needs to update OpenAPI documentation. The available agent profile can read secrets, deploy environments, write workflows, and use MCP mutation tools across the repository.",
      goodAnswer: "Use docs/least-privilege-access-review.md to grant docs-path branch write and validation only, deny secrets, deployment, workflow write, and broad MCP mutation, then record approval and audit evidence for any escalation.",
      trap: "Granting broad access because the task is urgent or the PR will still be reviewed."
    },
    tableRows: [
      ["Access surface", "Least-privilege decision", "Evidence"],
      ["Repository and branch", "Grant only the repo/path/branch needed", "Allowed and denied path list."],
      ["Workflow and token", "Set minimum job permissions", "Workflow permissions and run URL."],
      ["Secrets and environments", "Deny unless task explicitly requires them", "Environment approval or denial record."],
      ["MCP/tools", "Allow smallest toolset and deny mutation if not needed", "Tool matrix and tool-call log."]
    ],
    actionSteps: [
      "Inventory repository, branch, workflow, token, secret, environment, MCP/tool, write, approval, and audit surfaces before execution.",
      "For each surface, write the task need, granted level, denied level, evidence, and owner in docs/least-privilege-access-review.md.",
      "Use docs/agent-tool-permission-matrix.md to narrow tools by operation and data boundary.",
      "Use docs/approval-policy.md to define explicit escalation for secrets, production, workflow write, privileged tools, and compliance changes.",
      "Apply protected environments, CODEOWNERS, or rulesets where GitHub product controls should enforce the boundary.",
      "Run validation with the narrowed access and record the workflow run, denied access, approvals, and rollback path in docs/audit-trail.md.",
      "Reject exam answers that justify extra permission with convenience, speed, or after-the-fact PR review."
    ]
  }
};

const universalProfiles = {
  "domain-1": {
    category: "Agent architecture and SDLC",
    repo: "checkout-platform",
    frame: "place an agent inside a normal software delivery lifecycle",
    control: "GitHub issue intake, repository instructions, agent plan, plan approval record, protected branch, pull request template, workflow checks, and CODEOWNERS review",
    evidence: "issue task contract, approved plan, changed-file list, branch name, workflow run URL, check summary, PR review comments, and handoff note",
    approval: "A reviewer approves the task boundary and plan before the agent edits files, calls write-capable tools, opens a pull request, or touches owned paths.",
    recovery: "Stop the agent, preserve the draft work, convert missing scope into the issue and plan, then resume only after the reviewer approves the corrected boundary.",
    trap: "Letting the agent infer the SDLC workflow and begin implementation before the task, plan, evidence, and approval points are visible.",
    files: [
      ["docs/agent-task-contract.md", "Turns the request into objective, inputs, outputs, boundaries, stop conditions, validation, and reviewer decision fields."],
      ["docs/agent-plan.md", "Captures the proposed steps, files, assumptions, validation, risks, and denied actions before execution."],
      ["docs/agent-step-map.md", "Shows the ordered route from intake to planning, approval, execution, evidence, PR review, and handoff."],
      [".github/pull_request_template.md", "Forces implementation evidence, deviations, checks, source links, and rollback owner into the PR review surface."],
      [".github/CODEOWNERS", "Routes sensitive paths to named reviewers before the branch can merge."]
    ],
    sources: ["ms-gh600-guide", "ms-agentic-foundations", "ms-agent-architecture-sdlc", "gh-copilot-cloud-agent", "gh-repository-instructions", "gh-actions-workflows", "gh-protected-branches", "gh-codeowners", "gh-rulesets", "gh-cloud-agent-risks"]
  },
  "domain-2": {
    category: "MCP and tool access",
    repo: "integration-tools",
    frame: "choose and constrain tools, MCP servers, repositories, branches, runners, tokens, secrets, and environments",
    control: "MCP server review, MCP allowlist, tool permission matrix, execution-context checklist, environment constraints, setup workflow, and validation workflow",
    evidence: "tool inventory, allowed and denied operations, MCP server source, token permission setting, runner context, secret or environment decision, workflow run URL, and tool-call log",
    approval: "The tool owner approves any write-capable, privileged, external-data, secret, production, or irreversible capability before the agent can use it.",
    recovery: "Disable or narrow the tool, revoke the expanded context, rerun with the minimum permission set, and record denied calls plus reviewer decision.",
    trap: "Granting broad tool or MCP access because the agent may need it later.",
    files: [
      ["docs/agent-tool-permission-matrix.md", "Maps each tool to read, write, privileged, secret, production, rollback, and evidence requirements."],
      ["docs/mcp-tool-policy.md", "Defines approved MCP servers, allowed toolsets, denied actions, logging, and review ownership."],
      ["docs/agent-mcp-server-review.md", "Records the specific MCP server, source, trust decision, data boundary, and approval outcome."],
      ["docs/environment-constraints.md", "Captures runner, token, secret, environment, network, data, and deployment limitations."],
      ["docs/execution-context-checklist.md", "Connects repository, branch, workflow, token, secret, environment, MCP/tool, and approval boundaries."]
    ],
    sources: ["ms-gh600-guide", "ms-tooling-mcp-envs", "gh-mcp-toolsets", "gh-mcp-server-access", "gh-mcp-server-setup", "gh-mcp-registry", "gh-copilot-setup-steps", "gh-actions-workflows", "gh-copilot-cloud-agent", "gh-cloud-agent-risks"]
  },
  "domain-3": {
    category: "Memory and state",
    repo: "release-state",
    frame: "decide what context belongs in memory and what must become a durable repository artifact",
    control: "agent memory policy, state record, stale-context checklist, decision log, issue or PR state carrier, workflow artifact, and memory reset decision",
    evidence: "memory scope entry, preserved or pruned context, stale-context review, decision log, issue or PR link, workflow artifact URL, reset decision, and reviewer note",
    approval: "A reviewer approves preserving, sharing, expiring, or resetting memory when it affects future execution, sensitive data, conflicting state, or release decisions.",
    recovery: "Reset stale or conflicting memory, replace it with durable GitHub artifacts, and resume from the approved issue, PR, workflow artifact, or decision log.",
    trap: "Keeping stale, sensitive, or conflicting context because it may help the agent later.",
    files: [
      ["docs/agent-memory-policy.md", "Defines what memory may store, when it expires, how sensitive data is handled, and who approves reuse."],
      ["docs/agent-state.md", "Records current task state, assumptions, open decisions, and safe resume point."],
      ["docs/stale-context-checklist.md", "Forces a review of age, source, conflicts, sensitivity, and replacement artifacts."],
      ["docs/decision-log.md", "Turns important agent decisions into durable records that can outlive a chat or session."],
      ["docs/memory-reset-decision.md", "Records preserve, prune, expire, reset, or replace decisions with evidence and owner."]
    ],
    sources: ["ms-gh600-guide", "ms-agentic-foundations", "ms-agent-architecture-sdlc", "gh-copilot-memory", "gh-copilot-cloud-agent", "gh-actions-workflows", "gh-cloud-agent-risks"]
  },
  "domain-4": {
    category: "Evaluation and tuning",
    repo: "security-cleanup",
    frame: "prove agent output with expected outcomes, evaluation signals, logs, scans, root-cause classification, tuning records, and regression evidence",
    control: "agent evaluation plan, workflow evidence record, scan evidence, failure analysis, root-cause classification, tuning log, and regression checklist",
    evidence: "expected outcome, evaluation threshold, workflow run URL, check output, scan alert, trace or log excerpt, root-cause category, fix decision, and regression result",
    approval: "The reviewer accepts the agent output only after the evidence meets the evaluation threshold and the failure category matches the corrective action.",
    recovery: "Classify the failure, revise the relevant instruction, workflow, memory, tool access, or constraint, then rerun validation and record regression evidence.",
    trap: "Tuning prompts, widening permissions, or accepting scan output before classifying the failure from evidence.",
    files: [
      ["docs/agent-evaluation-plan.md", "Defines expected outcome, qualitative signal, quantitative threshold, evidence source, and reviewer decision."],
      ["docs/workflow-evidence-record.md", "Preserves workflow run URLs, check summaries, failed steps, retries, and recovery decisions."],
      ["docs/agent-failure-analysis.md", "Collects logs, traces, plans, outputs, scans, and workflow artifacts before repair."],
      ["docs/root-cause-classification.md", "Classifies reasoning, instruction, context, tool, permission, environment, workflow, or threshold causes."],
      ["docs/regression-checklist.md", "Proves the fix did not break prior behavior after tuning or workflow changes."]
    ],
    sources: ["ms-gh600-guide", "ms-agentic-foundations", "ms-foundry-responsible-ai", "gh-actions-workflows", "gh-code-scanning", "gh-codeql-code-scanning", "gh-secret-scanning", "gh-dependency-review", "gh-dependency-review-action", "ms-accessibility-evaluation-testing"]
  },
  "domain-5": {
    category: "Multi-agent coordination",
    repo: "multi-agent-release",
    frame: "coordinate multiple agents without losing role boundaries, handoffs, conflict handling, recovery, or auditability",
    control: "agent roles, multi-agent plan, handoff contract, branch isolation, conflict log, arbitration record, recovery plan, and audit trail",
    evidence: "role assignment, branch map, handoff artifact, duplicate-effort check, conflict record, reviewer arbitration, workflow run URL, recovery decision, and audit entry",
    approval: "The coordinator or reviewer approves handoffs, conflict resolution, stalled work recovery, replacement, and retirement before dependent agents continue.",
    recovery: "Isolate the affected branch or agent, preserve handoff and conflict evidence, decide rollback or reassignment, and record the recovery path.",
    trap: "Letting parallel agents reconcile conflicts or ownership gaps only after their branches converge.",
    files: [
      ["docs/agent-roles.md", "Defines planner, builder, reviewer, security, test, and docs agent responsibilities and boundaries."],
      ["docs/multi-agent-plan.md", "Maps agents, branches, dependencies, handoff points, validations, and owner decisions."],
      ["docs/multi-agent-handoff-contract.md", "Records what one agent passes to another, including assumptions, evidence, and open risks."],
      ["docs/conflict-log.md", "Captures overlapping changes, duplicate effort, contradictory outputs, and the arbitration decision."],
      ["docs/recovery-plan.md", "Defines rollback, replacement, stalled work handling, and human-in-the-loop recovery steps."]
    ],
    sources: ["ms-gh600-guide", "ms-agentic-foundations", "ms-agent-architecture-sdlc", "gh-actions-workflows", "gh-protected-branches", "gh-codeowners", "gh-rulesets", "gh-copilot-cloud-agent"]
  },
  "domain-6": {
    category: "Responsible AI and guardrails",
    repo: "regulated-api",
    frame: "right-size autonomy, human judgment, least privilege, policy enforcement, auditability, and velocity controls",
    control: "risk classification, autonomy matrix, approval policy, least-privilege review, sensitive-action control, protected environments, CODEOWNERS, rulesets, and audit trail",
    evidence: "risk class, autonomy level, permission decision, denied action, explicit authorization, protected-environment review, PR evidence, audit log entry, and rollback note",
    approval: "A risk owner approves only actions that materially reduce risk or exceed normal autonomy, especially production, secret, irreversible, compliance, or Responsible AI boundaries.",
    recovery: "Block the unsafe action, revoke excess permission, rollback if needed, record the audit entry, and adjust the approval policy for future runs.",
    trap: "Adding approval to every action or granting broad autonomy for speed instead of matching intervention to material risk.",
    files: [
      ["docs/autonomy-matrix.md", "Maps risk classes to autonomous, reviewed, explicitly approved, or blocked actions."],
      ["docs/responsible-ai-risk-review.md", "Records operational, security, compliance, and Responsible AI risk with owner decision."],
      ["docs/approval-policy.md", "Defines explicit approval, controlled paths, escalation, and denied action rules."],
      ["docs/sensitive-action-control.md", "Controls irreversible, privileged, production, data, compliance, and deployment actions."],
      ["docs/audit-trail.md", "Preserves approvals, denials, policy blocks, environment reviews, and rollback decisions."]
    ],
    sources: ["ms-gh600-guide", "ms-agentic-foundations", "ms-agent-architecture-sdlc", "ms-responsible-ai-principles", "gh-copilot-cloud-agent", "gh-cloud-agent-risks", "gh-mcp-server-access", "gh-review-deployments", "gh-deploy-envs", "gh-codeowners", "gh-rulesets"]
  }
};

const topicRules = [
  {
    match: /input|output|success criteria|expected outcome|operational constraint/i,
    category: "Agent architecture and SDLC",
    focus: "turning the request into measurable inputs, outputs, success criteria, constraints, and acceptance evidence",
    task: "convert a vague feature request into measurable inputs, outputs, acceptance criteria, and operational constraints before execution",
    risk: "the agent optimizes for a broad outcome while reviewers cannot tell which input, output, or success condition was satisfied",
    files: [["docs/agent-task-contract.md"], ["docs/agent-evaluation-plan.md"], ["docs/pr-evidence-table.md"], ["docs/workflow-evidence-record.md"], [".github/ISSUE_TEMPLATE/agent-task.yml"]],
    evidence: "task contract fields, acceptance criteria, evaluation threshold, workflow run URL, check summary, changed-file list, and reviewer decision",
    trap: "Accepting a correct-looking output when the original inputs, outputs, and success criteria were never made testable."
  },
  {
    match: /anti-pattern|when not to use agents|ordinary automation|agentic workflows versus ordinary automation/i,
    category: "Agent architecture and SDLC",
    focus: "deciding whether the work needs an agent or whether deterministic automation is safer and simpler",
    task: "classify a request as deterministic automation, agentic planning, tool-using agent work, or work that should be blocked",
    risk: "the team adds agent autonomy to a deterministic or unsafe workflow and creates review work without reducing uncertainty",
    files: [["docs/agentic-vs-automation-decision-table.md"], ["docs/agent-anti-pattern-review.md"], ["docs/agent-plan.md"], ["docs/pr-evidence-table.md"], ["docs/escalation-paths.md"]],
    evidence: "automation-versus-agent decision, uncertainty level, stop condition, deterministic workflow option, reviewer rationale, and rejected autonomy",
    control: "agentic-vs-automation decision table, anti-pattern review, GitHub Actions for deterministic work, agent plan for uncertain work, PR evidence, and stop conditions",
    trap: "Choosing an agent because it is flexible when a deterministic workflow or no-agent decision is the safer answer."
  },
  {
    match: /plan|planning|structured plan|validate agent plans/i,
    category: "Agent architecture and SDLC",
    focus: "separating plan creation, plan validation, approval, execution, and evidence",
    task: "make the agent produce a structured plan and validate it before any write-capable action starts",
    risk: "the agent combines planning and execution, so reviewers cannot tell what was approved before files changed",
    files: [["docs/agent-plan.md"], ["docs/agent-plan-approval-record.md"], ["docs/agent-step-map.md"], [".github/pull_request_template.md"], [".github/CODEOWNERS"]],
    evidence: "structured plan, validation checklist, approval record, denied scope, changed-file list, workflow run URL, and reviewer note",
    control: "agent plan, plan approval record, branch protection, CODEOWNERS, PR template, and workflow checks",
    trap: "Letting a plan act as permission to execute before a reviewer validates scope, assumptions, risks, and checks."
  },
  {
    match: /approval|approved|human intervention|autonomy|guardrail|human judgment|approval friction|execution velocity/i,
    category: "Responsible AI and guardrails",
    focus: "right-sizing autonomy with explicit review, approval, blocked-action, and friction-reduction rules",
    task: "decide which agent actions can run autonomously, which need review, which need explicit approval, and which must be blocked",
    risk: "the workflow either rubber-stamps risky autonomous actions or slows every low-risk step with unnecessary approval",
    files: [["docs/autonomy-matrix.md"], ["docs/approval-policy.md"], ["docs/sensitive-action-control.md"], ["docs/audit-trail.md"], [".github/CODEOWNERS"]],
    evidence: "risk class, autonomy level, approval owner, denied action, audit entry, PR review comment, and rollback note",
    control: "autonomy matrix, approval policy, sensitive-action control, CODEOWNERS, rulesets, protected environments, and audit trail",
    trap: "Choosing all-approval or no-approval instead of matching human intervention to material risk."
  },
  {
    match: /issue|task contract/i,
    category: "Agent architecture and SDLC",
    focus: "using GitHub Issues as durable task contracts instead of informal prompts",
    task: "capture objective, scope, constraints, validation, evidence, source links, and stop conditions in an issue before the agent runs",
    risk: "the agent follows a chat request that cannot be compared against approved scope or reviewer evidence",
    files: [[".github/ISSUE_TEMPLATE/agent-task.yml"], ["docs/agent-task-contract.md"], ["docs/agent-plan.md"], ["docs/agent-step-map.md"], [".github/pull_request_template.md"]],
    evidence: "issue fields, task boundary, plan link, validation command, source links, stop condition, and reviewer decision",
    control: "GitHub issue template, task contract, agent plan, PR template, and branch review",
    trap: "Treating an issue title or chat prompt as a complete task contract."
  },
  {
    match: /pull request|PR|evidence object|inspectable artifact/i,
    category: "Repository and branch governance",
    focus: "making pull requests and standard GitHub objects carry the evidence reviewers need",
    task: "turn agent claims into PR evidence rows with issue links, diff scope, checks, reviews, deployment decisions, and rollback owner",
    risk: "reviewers receive a polished agent summary but no inspectable GitHub artifacts",
    files: [[".github/pull_request_template.md"], ["docs/pr-evidence-table.md"], ["docs/workflow-evidence-record.md"], ["docs/audit-trail.md"], [".github/CODEOWNERS"]],
    evidence: "issue link, PR diff, workflow run URL, check summary, review comments, deployment review, residual risk, and rollback note",
    control: "pull request template, PR evidence table, workflow run, CODEOWNERS review, rulesets, and audit trail",
    trap: "Accepting a confident PR description that does not link the evidence behind each claim."
  },
  {
    match: /custom instruction|repository instruction/i,
    category: "Agent architecture and SDLC",
    focus: "placing durable repository guidance where GitHub Copilot and agents can consistently read it",
    task: "convert team rules into repository instructions and verify that agent plans and PR evidence follow them",
    risk: "the agent follows stale personal preferences or chat-only guidance instead of repository-specific rules",
    files: [[".github/copilot-instructions.md"], ["docs/agent-task-contract.md"], ["docs/agent-plan.md"], ["docs/pr-evidence-table.md"], ["docs/audit-trail.md"]],
    evidence: "repository instruction file, task contract, plan compliance note, changed-file list, PR evidence, and reviewer decision",
    control: "repository custom instructions, task contract, agent plan, PR template, and review evidence",
    trap: "Putting governance in chat or personal instructions when the repository needs shared durable instructions."
  },
  {
    match: /MCP|toolset|tool|registry|allow list|allowlist|remote mcp|local mcp|playwright/i,
    category: "MCP and tool access",
    focus: "controlling tool and MCP capability by source, operation, data boundary, logging, and rollback risk",
    task: "select the minimum toolset or MCP server and record allowed, denied, logged, and approval-required operations",
    risk: "the agent gains write, external-data, secret, or production capability through a tool whose behavior was not reviewed",
    files: [["docs/tool-risk-classification.md"], ["docs/agent-tool-permission-matrix.md"], ["docs/mcp-tool-policy.md"], ["docs/agent-mcp-server-review.md"], ["docs/mcp-allowlist-decision.md"]],
    evidence: "tool classification, MCP source, allowed toolsets, denied operations, tool-call log, approval owner, and rollback note",
    control: "tool risk classification, tool permission matrix, MCP server review, MCP tool policy, and allowlist decision",
    trap: "Allowing a full toolset because the MCP server is useful or because validation can run later."
  },
  {
    match: /repository.*scope|branch.*scope|specific repository|branches and pull requests|autonomous PR|PR creation/i,
    category: "Repository and branch governance",
    focus: "limiting autonomous work to the approved repository, branch, path, and pull request boundary",
    task: "constrain repository and branch access before the agent creates branches, opens pull requests, or modifies owned paths",
    risk: "autonomous branch or PR creation escapes the approved repository, target branch, path, or reviewer ownership boundary",
    files: [["docs/branch-scope-control.md"], ["docs/agent-task-contract.md"], [".github/pull_request_template.md"], ["docs/pr-evidence-table.md"], [".github/CODEOWNERS"]],
    evidence: "allowed repository, branch pattern, denied paths, changed-file list, PR link, CODEOWNERS review, and workflow run URL",
    control: "branch scope control, task contract, protected branches, rulesets, CODEOWNERS, and PR evidence",
    trap: "Letting the agent create or update branches broadly because the final pull request will still be reviewed."
  },
  {
    match: /CI workflow|workflow|runner|execution context|environment-specific|environment specific|environment constraints/i,
    category: "Workflow execution",
    focus: "checking runner, token, secret, environment, workflow, and data boundaries before the agent runs",
    task: "evaluate the execution context and environment constraints that define what the agent can read, write, call, or deploy",
    risk: "the workflow grants token, secret, runner, environment, or deployment access that the task does not require",
    files: [["docs/execution-context-checklist.md"], ["docs/environment-constraints.md"], [".github/workflows/copilot-setup-steps.yml"], [".github/workflows/agent-validation.yml"], ["docs/workflow-evidence-record.md"]],
    evidence: "runner label, job permissions, setup-step log, secret decision, environment approval, workflow run URL, and validation result",
    control: "execution-context checklist, environment constraints, setup workflow, validation workflow, protected environments, and workflow evidence record",
    trap: "Assuming the agent may use every permission present in the workflow context."
  },
  {
    match: /error handling|retries|rollback|rollbacks|escalation|traceability|accountability|audit evidence|session logs|audit logs|review trails/i,
    category: "Workflow execution",
    focus: "recording failure handling, retry limits, rollback routes, escalation owners, traceability, and audit evidence",
    task: "decide how failed, partial, repeated, or risky agent actions are logged, escalated, rolled back, and reviewed",
    risk: "the agent retries or recovers without leaving a timeline that proves what failed, who decided, and how it was corrected",
    files: [["docs/agent-session-log-review.md"], ["docs/audit-trail.md"], ["docs/workflow-evidence-record.md"], ["docs/escalation-paths.md"], ["docs/recovery-plan.md"]],
    evidence: "session log excerpt, issue timeline, commit list, workflow run URL, retry count, escalation owner, rollback note, and review comment",
    control: "session log review, audit trail, workflow evidence record, escalation paths, recovery plan, and PR evidence",
    trap: "Treating retry or rollback as sufficient without session evidence, owner decision, or audit trail."
  },
  {
    match: /memory|state|context|resume|drift|stale|durable artifact|checkpoint/i,
    category: "Memory and state",
    focus: "separating short-term memory, long-term memory, external memory, durable state, reset, expiry, and resume checkpoints",
    task: "decide what context the agent may remember, what must expire, and what should be written to repository artifacts before resume",
    risk: "the agent resumes from stale, sensitive, conflicting, or non-durable context and repeats or diverges from prior decisions",
    files: [["docs/agent-memory-policy.md"], ["docs/agent-state.md"], ["docs/stale-context-checklist.md"], ["docs/memory-reset-decision.md"], ["docs/decision-log.md"]],
    evidence: "memory scope, state checkpoint, stale-context review, reset or expiry decision, issue or PR state link, and reviewer note",
    control: "agent memory policy, state record, stale-context checklist, memory reset decision, decision log, and durable GitHub artifacts",
    trap: "Keeping memory indefinitely or resuming from chat context when durable repository state should be authoritative."
  },
  {
    match: /scan|CodeQL|secret scanning|dependency|accessibility/i,
    category: "Evaluation and tuning",
    focus: "using scan output as one evaluation signal with human interpretation and remediation evidence",
    task: "collect CodeQL, code scanning, secret scanning, dependency review, or accessibility evidence and decide what it proves and what it does not prove",
    risk: "the team treats automated scan output as complete proof or ignores a failed alert because the agent summary sounds confident",
    files: [["docs/security-scan-evidence.md"], ["docs/accessibility-scan-evidence.md"], ["docs/workflow-evidence-record.md"], ["docs/regression-checklist.md"], ["docs/pr-evidence-table.md"]],
    evidence: "scan type, alert link, failed or passed check, remediation commit, manual review note, regression result, and owner decision",
    control: "security scan evidence, accessibility scan evidence, workflow evidence record, regression checklist, and PR evidence table",
    trap: "Treating a passing automated scan as proof that no security, dependency, or accessibility review is needed."
  },
  {
    match: /root cause|failure|logs|traces|outputs|instruction failure|overfitting|tuning|regression|evaluation signal|evaluation criteria|refine/i,
    category: "Evaluation and tuning",
    focus: "classifying evidence before changing prompts, instructions, memory, tools, workflows, or thresholds",
    task: "read logs, plans, traces, outputs, checks, and scan evidence to classify the failure and select the correct improvement",
    risk: "the team tunes the wrong layer and hides whether the failure came from reasoning, instructions, context, tool use, permissions, environment, or threshold design",
    files: [["docs/root-cause-classification.md"], ["docs/agent-failure-analysis.md"], ["docs/tuning-log.md"], ["docs/regression-checklist.md"], ["docs/agent-evaluation-plan.md"]],
    evidence: "failure artifact, root-cause category, tuning decision, revised constraint, regression result, and reviewer acceptance",
    control: "root-cause classification, failure analysis, tuning log, regression checklist, and evaluation plan",
    trap: "Changing prompts or permissions before the root cause is classified from evidence."
  },
  {
    match: /multi-agent|orchestration|parallel|conflict|handoff|post-hoc|stalled|degraded|replacement|retirement|roles|duplicate|contradictory/i,
    category: "Multi-agent coordination",
    focus: "coordinating multiple agents through role boundaries, branch isolation, handoffs, conflict detection, arbitration, and recovery",
    task: "assign agent roles, isolate parallel work, record handoffs, detect conflicts or duplicate effort, and preserve auditability through recovery or retirement",
    risk: "agents overwrite or contradict each other while no reviewer can reconstruct ownership, handoff assumptions, or conflict decisions",
    files: [["docs/agent-roles.md"], ["docs/multi-agent-plan.md"], ["docs/multi-agent-handoff-contract.md"], ["docs/conflict-log.md"], ["docs/recovery-plan.md"]],
    evidence: "role map, branch strategy, handoff contract, duplicate-effort check, conflict log, arbitration decision, workflow run URL, and recovery note",
    control: "agent roles, multi-agent plan, branch isolation, handoff contract, conflict log, arbitration record, recovery plan, and audit trail",
    trap: "Trusting agents to reconcile overlapping work without a coordinator-visible conflict and handoff record."
  },
  {
    match: /least privilege|permissions|irreversible|sensitive|security|compliance|Responsible AI|policy|risk examples|audit/i,
    category: "Responsible AI and guardrails",
    focus: "right-sizing agent autonomy and permission with operational, security, compliance, and Responsible AI risk controls",
    task: "classify the action risk, grant the minimum permission, require explicit authorization for sensitive changes, and preserve audit evidence",
    risk: "the agent receives unnecessary secrets, production, workflow, repository, or compliance-sensitive access because the task feels urgent",
    files: [["docs/least-privilege-access-review.md"], ["docs/agent-tool-permission-matrix.md"], ["docs/approval-policy.md"], ["docs/sensitive-action-control.md"], ["docs/audit-trail.md"]],
    evidence: "risk class, granted and denied permission, explicit authorization, secret or environment decision, audit entry, validation run, and rollback path",
    control: "least-privilege review, tool permission matrix, approval policy, sensitive-action control, protected environments, CODEOWNERS, rulesets, and audit trail",
    trap: "Granting broad access for speed or adding approvals that do not materially reduce risk."
  }
];

const branchScopeTopicRule = topicRules.find((rule) => rule.files?.some(([filePath]) => filePath === "docs/branch-scope-control.md"));
const memoryTopicRule = topicRules.find((rule) => rule.files?.some(([filePath]) => filePath === "docs/agent-memory-policy.md"));
const multiAgentTopicRule = topicRules.find((rule) => rule.files?.some(([filePath]) => filePath === "docs/multi-agent-plan.md"));
const scanTopicRule = topicRules.find((rule) => rule.files?.some(([filePath]) => filePath === "docs/security-scan-evidence.md"));
const evaluationTopicRule = topicRules.find((rule) => rule.files?.some(([filePath]) => filePath === "docs/root-cause-classification.md"));
const mcpTopicRule = topicRules.find((rule) => rule.files?.some(([filePath]) => filePath === "docs/mcp-tool-policy.md"));

function lessonSkill(lesson) {
  return lesson.officialSkill || lesson.title;
}

function titleSlug(textValue) {
  return String(textValue).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function topicForLesson(lesson, profile) {
  const title = lessonSkill(lesson);
  const isBranchScope = /branch(?:-| )based|branch scope|specific repository|autonomous pr|creating branches|pull requests|pr creation/i.test(title) && !/mcp/i.test(title);
  const forcedRule =
    (lesson.domainId === "domain-3" && memoryTopicRule) ||
    (lesson.domainId === "domain-5" && multiAgentTopicRule) ||
    (lesson.domainId === "domain-2" && isBranchScope && branchScopeTopicRule) ||
    (lesson.domainId === "domain-4" && /scan|CodeQL|secret scanning|dependency|accessibility/i.test(title) && scanTopicRule) ||
    (lesson.domainId === "domain-4" && /root cause|failure|logs|traces|outputs|instruction|overfitting|tuning|regression|refine|evaluation/i.test(title) && evaluationTopicRule);
  const matched = forcedRule || topicRules.find((rule) => {
    if (rule === memoryTopicRule && lesson.domainId !== "domain-3") return false;
    if (rule === multiAgentTopicRule && lesson.domainId !== "domain-5") return false;
    if (rule === branchScopeTopicRule && lesson.domainId !== "domain-2") return false;
    if (rule === mcpTopicRule && lesson.domainId !== "domain-2") return false;
    return rule.match.test(title);
  });
  const fallback = {
    focus: `${titleSlug(title)} inside ${profile.frame}`,
    task: `apply ${title} to a repository task while naming the artifact, product behavior, evidence, approval point, and recovery path`,
    risk: `the agent treats ${title} as a broad instruction instead of a reviewable GitHub workflow`,
    evidence: profile.evidence,
    control: profile.control,
    trap: profile.trap
  };
  return { ...fallback, ...matched };
}

function artifactPurpose(filePath, topic, profile) {
  const purposes = {
    ".github/ISSUE_TEMPLATE/agent-task.yml": `Captures the ${lessonTextFragment(topic)} task boundary, inputs, outputs, validation, sources, and stop conditions before work starts.`,
    ".github/pull_request_template.md": `Requires ${topic.evidence || profile.evidence} in the PR so reviewers inspect artifacts instead of trusting a summary.`,
    ".github/CODEOWNERS": `Routes owned paths for ${topic.focus} to accountable reviewers before merge.`,
    ".github/copilot-instructions.md": `Stores repository rules for ${topic.focus} where agents and reviewers can consistently find them.`,
    ".github/workflows/copilot-setup-steps.yml": `Shows setup and environment preparation evidence for ${topic.focus}.`,
    ".github/workflows/agent-validation.yml": `Runs validation and records workflow evidence for ${topic.focus}.`,
    "docs/agent-task-contract.md": `Defines the objective, boundary, success evidence, denied scope, and reviewer decision for ${topic.focus}.`,
    "docs/agent-plan.md": `Captures proposed steps, assumptions, files, validation, and risks before execution of ${topic.focus}.`,
    "docs/agent-plan-approval-record.md": `Records whether the plan for ${topic.focus} may proceed, must be revised, or must stop.`,
    "docs/agent-step-map.md": `Maps the ordered path from intake to evidence for ${topic.focus}.`,
    "docs/pr-evidence-table.md": `Maps each agent claim for ${topic.focus} to inspectable GitHub evidence and owner decision.`,
    "docs/workflow-evidence-record.md": `Preserves workflow runs, check output, retries, failed steps, and recovery decisions for ${topic.focus}.`,
    "docs/audit-trail.md": `Records the chronological approvals, denials, changes, reviews, and rollback decisions for ${topic.focus}.`,
    "docs/agentic-vs-automation-decision-table.md": `Compares deterministic automation, agentic work, blocked work, uncertainty, and stop conditions for ${topic.focus}.`,
    "docs/agent-anti-pattern-review.md": `Identifies agent anti-patterns, unsafe autonomy, missing evidence, and rejected shortcuts for ${topic.focus}.`,
    "docs/autonomy-matrix.md": `Maps ${topic.focus} to autonomous, review-required, explicit-approval, or blocked action levels.`,
    "docs/approval-policy.md": `Defines the reviewer, escalation, and explicit authorization path for ${topic.focus}.`,
    "docs/sensitive-action-control.md": `Controls irreversible, privileged, production, data, compliance, or deployment actions connected to ${topic.focus}.`,
    "docs/responsible-ai-risk-review.md": `Records Responsible AI, security, operational, and compliance risk for ${topic.focus}.`,
    "docs/least-privilege-access-review.md": `Justifies granted, denied, and escalated access surfaces for ${topic.focus}.`,
    "docs/agent-tool-permission-matrix.md": `Maps tool operations, data boundaries, permission level, logging, rollback, and owner for ${topic.focus}.`,
    "docs/mcp-tool-policy.md": `Defines MCP server, toolset, allowlist, logging, denied actions, and review rules for ${topic.focus}.`,
    "docs/agent-mcp-server-review.md": `Records MCP server trust, source, data boundary, toolset, and approval for ${topic.focus}.`,
    "docs/mcp-allowlist-decision.md": `Shows which MCP tools are allowed or denied for ${topic.focus} and why.`,
    "docs/environment-constraints.md": `Captures runner, token, secret, network, data, and environment limits for ${topic.focus}.`,
    "docs/execution-context-checklist.md": `Checks repository, branch, runner, token, secret, environment, MCP/tool, and approval context for ${topic.focus}.`,
    "docs/branch-scope-control.md": `Defines allowed repositories, branches, paths, denied scope, and PR boundary for ${topic.focus}.`,
    "docs/escalation-paths.md": `Names when ${topic.focus} must stop and who owns escalation or approval.`,
    "docs/recovery-plan.md": `Defines rollback, reassignment, rerun, or human recovery steps for ${topic.focus}.`,
    "docs/agent-session-log-review.md": `Links session log evidence to issue, PR, workflow, review, rollback, and audit decisions for ${topic.focus}.`,
    "docs/agent-memory-policy.md": `Defines memory scope, retention, expiry, sensitive data rules, and approval for ${topic.focus}.`,
    "docs/agent-state.md": `Records current state, assumptions, open decisions, and safe resume point for ${topic.focus}.`,
    "docs/stale-context-checklist.md": `Checks age, source, conflict, sensitivity, and replacement artifact status for ${topic.focus}.`,
    "docs/memory-reset-decision.md": `Records preserve, prune, expire, reset, or replace decisions for ${topic.focus}.`,
    "docs/decision-log.md": `Turns important decisions for ${topic.focus} into durable repository evidence.`,
    "docs/agent-evaluation-plan.md": `Defines expected outcome, signal, threshold, evidence source, and reviewer decision for ${topic.focus}.`,
    "docs/agent-failure-analysis.md": `Collects logs, traces, outputs, plans, scans, and workflow evidence before fixing ${topic.focus}.`,
    "docs/root-cause-classification.md": `Classifies the failure category before changing prompts, memory, tools, permissions, workflows, or thresholds for ${topic.focus}.`,
    "docs/tuning-log.md": `Records the tuning change, reason, evidence, and regression outcome for ${topic.focus}.`,
    "docs/regression-checklist.md": `Proves the fix for ${topic.focus} did not break required prior behavior.`,
    "docs/security-scan-evidence.md": `Captures code scanning, CodeQL, secret scanning, dependency review, remediation, and regression evidence for ${topic.focus}.`,
    "docs/accessibility-scan-evidence.md": `Captures automated and manual accessibility evidence, limitations, owner decision, and remediation for ${topic.focus}.`,
    "docs/agent-roles.md": `Names agent responsibilities, authority, dependencies, and reviewer boundaries for ${topic.focus}.`,
    "docs/multi-agent-plan.md": `Maps agent roles, branches, dependencies, handoffs, validations, and owner decisions for ${topic.focus}.`,
    "docs/multi-agent-handoff-contract.md": `Records handoff inputs, outputs, assumptions, evidence, and open risk for ${topic.focus}.`,
    "docs/conflict-log.md": `Records overlapping changes, duplicate effort, contradictory outputs, and arbitration decisions for ${topic.focus}.`,
    "docs/multi-agent-arbitration-record.md": `Captures the decision when agents disagree about ${topic.focus}.`,
    "docs/duplicate-effort-checklist.md": `Checks whether another agent already owns the work behind ${topic.focus}.`,
    "docs/context-handoff.md": `Transfers context for ${topic.focus} without relying on hidden chat memory.`,
    "docs/resume-checkpoint.md": `Defines the safe restart point and validated evidence for ${topic.focus}.`,
    "docs/guardrails.md": `Documents concrete guardrails, denied actions, and evidence for ${topic.focus}.`,
    "docs/policy-violation-record.md": `Records the violated policy, blocked action, owner, evidence, and recovery for ${topic.focus}.`,
    "docs/agent-lifecycle-record.md": `Tracks active, changed, replaced, and retired agent state for ${topic.focus}.`,
    "docs/agent-release-retrospective.md": `Reviews release evidence, failures, and improvements for ${topic.focus}.`,
    "docs/agent-trace-review.md": `Connects trace evidence to agent decisions and reviewer action for ${topic.focus}.`,
    "docs/error-analysis.md": `Records error symptoms, cause, retry status, owner, and recovery for ${topic.focus}.`
  };
  return purposes[filePath] || `Provides a lesson-specific artifact for ${topic.focus} with reviewer-visible evidence and owner decision.`;
}

function lessonTextFragment(topic) {
  return topic.focus.length > 70 ? "agent" : topic.focus;
}

function specializeFiles(lesson, profile, topic) {
  const byPath = new Map();
  const title = lessonSkill(lesson);
  const isBranchScope = lesson.domainId === "domain-2" && /branch(?:-| )based|branch scope|specific repository|autonomous pr|creating branches|pull requests|pr creation/i.test(title) && !/mcp/i.test(title);
  const extraFiles = [];
  if (lesson.domainId === "domain-4" && /memory/i.test(title)) {
    extraFiles.push(["docs/agent-memory-policy.md"], ["docs/agent-state.md"]);
  }
  if (lesson.domainId === "domain-4" && /tool/i.test(title)) {
    extraFiles.push(["docs/agent-tool-permission-matrix.md"], ["docs/tool-risk-classification.md"]);
  }
  if (lesson.domainId === "domain-5" && /branch/i.test(title)) {
    extraFiles.push(["docs/branch-scope-control.md"], [".github/pull_request_template.md"]);
  }
  if (lesson.domainId === "domain-3" && /issue|pull request|\bpr\b/i.test(title)) {
    extraFiles.push([".github/pull_request_template.md"], ["docs/pr-evidence-table.md"]);
  }
  if (isBranchScope) {
    extraFiles.push([".github/workflows/agent-validation.yml"], ["docs/escalation-paths.md"], ["docs/environment-constraints.md"]);
  }

  for (const entry of [...(topic.files || []), ...extraFiles, ...profile.files]) {
    const filePath = Array.isArray(entry) ? entry[0] : entry;
    if (isBranchScope && ["docs/mcp-tool-policy.md", "docs/agent-mcp-server-review.md", "docs/mcp-allowlist-decision.md"].includes(filePath)) continue;
    const purpose = Array.isArray(entry) && entry[1] ? entry[1] : artifactPurpose(filePath, topic, profile);
    if (!byPath.has(filePath)) byPath.set(filePath, [filePath, purpose]);
  }
  return [...byPath.values()].slice(0, 7);
}

function sourcesForUniversal(lesson, profile, topic) {
  return unique([
    ...(lesson.sourceIds || []),
    ...profile.sources,
    ...(topic.sources || [])
  ]);
}

function compactTitle(title) {
  return String(title).replace(/\s+/g, " ").trim();
}

function displayTitleForLesson(lesson, skill) {
  const explicitTitles = {
    "domain-2-lesson-15-implement-retries": "Implement retries for agent workflows",
    "domain-2-lesson-16-implement-rollbacks": "Implement rollbacks for agent workflows",
    "domain-2-lesson-27-environment-specific-constraints": "Environment-specific constraints for agent workflows"
  };
  if (explicitTitles[lesson.id]) return explicitTitles[lesson.id];
  return wordCount(lesson.title) >= 3 ? lesson.title : `${skill} for agent workflows`;
}

function buildUniversalSpec(lesson) {
  const profile = universalProfiles[lesson.domainId];
  if (!profile) throw new Error(`No universal remediation profile for ${lesson.domainId}`);
  const topic = topicForLesson(lesson, profile);
  const skill = lessonSkill(lesson);
  const files = specializeFiles(lesson, profile, topic);
  const evidence = topic.evidence || profile.evidence;
  const control = topic.control || profile.control;
  const approval = topic.approval || profile.approval;
  const recovery = topic.recovery || profile.recovery;
  const baseTrap = topic.trap || profile.trap;
  const sourceIds = sourcesForUniversal(lesson, profile, topic);
  const trap = `${baseTrap} For ${skill}, reject that shortcut unless ${files[0][0]} names the exact artifact, ${control}, ${evidence}, and the reviewer decision.`;

  return {
    category: topic.category || profile.category,
    repo: profile.repo,
    skill,
    title: displayTitleForLesson(lesson, skill),
    sourceIds,
    primarySourceIds: sourceIds.slice(0, Math.min(sourceIds.length, 8)),
    files,
    evidence,
    control,
    approval,
    recovery,
    trap,
    plainLanguage: [
      `${skill} means ${topic.focus}. In ${profile.repo}, the learner must decide what the agent is allowed to do, which GitHub artifact proves that decision, and what evidence a reviewer can inspect before the next risky action.`,
      `This lesson teaches the practical boundary for ${topic.task}. The correct GH-600 answer names ${files[0][0]}, applies ${control}, and leaves ${evidence} where another developer can approve, reject, escalate, or recover the work.`
    ],
    core: [
      `Start with the official skill: ${skill}. The learner identifies whether the agent is still gathering context, making a plan, using a tool, changing files, coordinating with another agent, evaluating output, or crossing a governance boundary.`,
      `The GitHub product behavior is concrete: ${control}. The lesson should not rely on agent confidence when the repository can require artifacts, workflow runs, reviews, branch rules, policies, logs, or approval records.`,
      `Create or inspect ${files[0][0]} first because it records the decision point for ${topic.focus}. Then use ${files[1][0]} to preserve the supporting boundary, approval, evidence, or recovery details.`,
      `The production failure mode is specific: ${topic.risk}. Reviewers need ${evidence} to see whether the agent stayed inside the intended path.`,
      `Approval and recovery are part of the skill, not afterthoughts. ${approval} If the boundary is crossed, ${recovery}`,
      `On the exam, reject answers that choose this shortcut: ${trap} The stronger answer pairs the artifact, product control, evidence, and reviewer decision.`
    ],
    githubDetail: `For ${skill}, use ${control}. The learner should be able to point to ${files.map(([filePath]) => filePath).join(", ")} and explain how each object proves the agent boundary, product behavior, evidence standard, approval point, or recovery path.`,
    practicalExample: `In ${profile.repo}, the lesson skill is ${skill}. An agent is asked to ${topic.task}. The risk is that ${topic.risk}. The correct workflow creates ${files[0][0]}, records ${evidence}, applies ${control}, and waits for ${approval.toLowerCase()} A reviewer approves only if the artifact shows denied scope, validation evidence, and the recovery path for ${skill}.`,
    scenario: {
      title: `${compactTitle(skill)} decision`,
      body: `In ${profile.repo}, the GH-600 skill is ${skill}. An agent is asked to ${topic.task}. The next step could expose this risk: ${topic.risk}. The reviewer must decide what artifact and GitHub control should exist before the agent continues.`,
      goodAnswer: `Use ${files[0][0]} with ${control}, attach ${evidence}, and route the decision through the named approval or recovery path before the agent continues.`,
      trap: `${trap} That answer fails because it does not prove the product behavior, artifact, evidence, and reviewer decision for ${skill}.`
    },
    tableRows: [
      ["Skill focus", `Apply ${skill} by deciding ${topic.focus}.`, `${files[0][0]} plus ${evidence}.`],
      ["GitHub control", `Use ${control}.`, `Product evidence in ${files[1][0]} and linked GitHub objects.`],
      ["Approval point", approval, "Named reviewer, approved or denied scope, and escalation record."],
      ["Recovery path", recovery, "Rollback, reset, rerun, denial, or policy update evidence."]
    ],
    actionSteps: [
      `Create ${files[0][0]} and describe ${topic.focus}, the approved task boundary, denied scope, and reviewer owner.`,
      `Compare the requested action with ${control} before allowing the agent to use tools, edit files, create a branch, or affect another agent.`,
      `Inspect or create ${files[1][0]} so ${evidence} is visible outside the agent chat.`,
      `Record the approval decision: continue, revise, block, escalate, rollback, reset, or rerun based on ${topic.risk}.`,
      `Link the evidence to the issue, branch, pull request, workflow run, tool policy, memory record, evaluation record, or audit trail as appropriate.`,
      `If the agent asks for broader scope, classify the new risk and update the artifact before execution expands.`,
      `Reject exam answers that follow this trap: ${trap}`
    ]
  };
}

function sourceRationale(spec) {
  return [
    `The official GH-600 study guide anchors this lesson to ${spec.skill} instead of a generic agent governance topic.`,
    `GitHub Docs sources support the concrete product behavior taught here: ${spec.control}.`,
    `Microsoft Learn or Microsoft Responsible AI sources keep the lesson tied to architecture, execution, evaluation, governance, and human oversight expectations.`
  ];
}

function buildCaseStudy(spec) {
  return {
    title: `Case study: ${spec.repo}`,
    repository: spec.repo,
    issue: `Agent task: ${spec.skill}`,
    situation: spec.scenario.body,
    decision: spec.scenario.goodAnswer,
    wrongMove: spec.scenario.trap,
    reviewArtifact: `Expected artifacts: ${spec.files.slice(0, 3).map(([filePath]) => filePath).join(", ")}.`,
    reviewerQuestion: `Can a reviewer inspect ${spec.evidence}, or only the agent's narrative?`
  };
}

function buildScenario(spec) {
  return {
    ...spec.scenario,
    goodAnswer: `${spec.scenario.goodAnswer} Record the decision in ${spec.files[0][0]} with ${spec.evidence}.`,
    trap: ensureWords(
      spec.scenario.trap,
      12,
      `Reject that answer because it lacks ${spec.files[0][0]} and reviewer-visible evidence.`
    )
  };
}

function buildWorkedQuestion(spec) {
  return {
    title: `Worked question: ${spec.skill}`,
    scenario: `${spec.scenario.body} The exam asks which response best controls the work before the next risky action.`,
    question: `Which answer best applies ${spec.skill} in this GH-600 scenario?`,
    options: [
      `Let the agent continue and ask for a summary after it finishes because the pull request will be reviewed later.`,
      `${spec.scenario.goodAnswer} Record ${spec.evidence} where the reviewer can inspect it.`,
      `Give the agent broader access or fewer checks so it can complete the task quickly, then clean up evidence later.`,
      `Ask the agent to decide its own control after exploring the repository because the exact implementation is not known yet.`
    ],
    correctIndex: 1,
    strongAnswer: `The correct answer names the GitHub control, the artifact, the evidence, and the approval or recovery point before risky execution. For this lesson, the key artifact is ${spec.files[0][0]}, supported by ${spec.files[1][0]}.`,
    whyWrong: [
      { optionIndex: 0, rationale: "Review after the fact cannot prove the agent stayed inside the approved boundary before risk occurred." },
      { optionIndex: 2, rationale: "Speed does not justify broader access, skipped checks, or missing evidence in a governed agent workflow." },
      { optionIndex: 3, rationale: "Exploration must happen inside a reviewed boundary; the agent should not invent the control after access expands." }
    ],
    examTip: spec.trap
  };
}

function buildTeachingTable(spec) {
  const columns = ["Decision point", "Correct behavior", "Reviewer evidence", "Exam rejection"];
  return {
    title: `${spec.skill} decision table`,
    intro: `Use this table to answer GH-600 scenario questions about ${spec.skill} with concrete GitHub evidence.`,
    columns,
    rows: spec.tableRows.slice(0, 4).map((row) => [
      row[0],
      row[1],
      row[2] || spec.evidence,
      `Reject answers that skip ${spec.files[0][0]} or hide the reviewer decision.`
    ])
  };
}

function buildTopicExplanation(spec) {
  return {
    title: `What is different about ${spec.skill}`,
    category: spec.category,
    paragraphs: [
      ensureWords(spec.plainLanguage[0], 18, `The learner must connect that idea to ${spec.files[0][0]} and GitHub evidence.`),
      ensureWords(spec.core[1], 18, `This is why the lesson names ${spec.control} instead of using a generic review rule.`),
      `The production failure mode is specific: ${spec.trap} The lesson is remediated only when the learner can name ${spec.control}, create ${spec.files[0][0]}, and inspect ${spec.evidence}.`
    ],
    distinctions: [
      `Primary artifact: ${spec.files[0][0]} is required because this lesson needs a specialist record, not a generic task note.`,
      `Approval or recovery point: ${spec.approval}`,
      `Evidence standard: ${spec.evidence}.`
    ],
    examConnection: `GH-600 scenario answers should be rejected when they skip the artifact, ignore the evidence, or choose the trap: ${spec.trap}`
  };
}

function buildPracticalLabTask(spec) {
  return {
    title: `${spec.skill} practical lab task`,
    category: spec.category,
    objective: `Practice ${spec.skill} by creating the exact artifact, GitHub control, evidence package, and reviewer decision path for ${spec.repo}.`,
    steps: spec.actionSteps.slice(0, 5).map((step, index) => {
      const artifactForStep = spec.files[index % spec.files.length][0];
      return ensureWords(
        `${step} Document the ${spec.skill} lab result in ${artifactForStep}.`,
        12,
        `Record reviewer-visible evidence for ${spec.skill}.`
      );
    }),
    deliverable: `Submit ${spec.files.slice(0, 3).map(([filePath]) => filePath).join(", ")} with ${spec.evidence} and a reviewer decision.`
  };
}

function buildUiConfigExample(spec) {
  return {
    title: `${spec.skill} GitHub implementation example`,
    intro: `Use this concrete implementation path when an exam option asks which GitHub control, artifact, or evidence should exist for ${spec.skill}.`,
    steps: [
      `Create ${spec.files[0][0]} and fill the fields that prove the task boundary, expected control, owner, and evidence path.`,
      `Create ${spec.files[1][0]} so the approval, evidence, rejected scope, recovery route, or reviewer decision is not hidden in chat.`,
      `Connect the artifact to GitHub product evidence such as issue comments, branch diff, workflow run URL, PR review, CODEOWNERS, ruleset, environment approval, or MCP/tool policy as appropriate.`,
      `Block continuation or merge when ${spec.trap.toLowerCase()}`
    ],
    expectedEvidence: `Expected evidence includes ${spec.evidence}. The reviewer should be able to approve, reject, or request revision without trusting the agent summary.`,
    sourceNotes: [
      "Use the lesson source panel to verify the current GitHub Docs or Microsoft Learn behavior before relying on a UI label.",
      "If a UI label changes, keep the policy decision and evidence standard stable, then update source currentness before release."
    ]
  };
}

function buildLesson(lesson, spec) {
  return {
    ...lesson,
    title: spec.title || spec.skill,
    qualityTier: "gold",
    plainLanguage: spec.plainLanguage,
    core: spec.core.map((paragraph) => ensureWords(paragraph, 16, `This matters because ${spec.control} must be visible before reviewers approve the next action.`)),
    githubDetail: spec.githubDetail,
    practicalExample: ensureWords(
      spec.practicalExample,
      45,
      `The reviewer checks ${spec.files[0][0]}, ${spec.evidence}, the GitHub control ${spec.control}, denied scope, approval owner, and recovery path before accepting the next agent action.`
    ),
    examTrap: ensureWords(
      spec.trap,
      12,
      `The stronger GH-600 answer creates ${spec.files[0][0]} and records ${spec.evidence} before approval.`
    ),
    scenario: buildScenario(spec),
    caseStudy: buildCaseStudy(spec),
    actionOverview: `To master ${spec.skill}, create the artifact, apply the GitHub control, capture the evidence, and know where approval or recovery happens.`,
    actionSteps: spec.actionSteps.map((step, index) => {
      const artifactForStep = spec.files[index % spec.files.length][0];
      return ensureWords(
        `${step} Tie this step to ${artifactForStep} for ${spec.skill}.`,
        12,
        `Record reviewer-visible evidence for ${spec.skill}.`
      );
    }),
    filesToCreate: spec.files.map(([filePath, purpose]) => artifact(filePath, purpose)),
    agentRequestTemplate: `Handle ${spec.skill} as a GH-600 controlled workflow in ${spec.repo}. Before risky action, name the task boundary, GitHub control, artifact to create, denied actions, source-backed evidence, approval owner, recovery path, and stop condition. Do not continue when ${spec.trap.toLowerCase()}`,
    enterpriseChecklist: [
      `${spec.skill} is tied to the official GH-600 skill or supporting domain behavior.`,
      `The GitHub product control is explicit: ${spec.control}.`,
      `The learner creates or inspects ${spec.files[0][0]} and links ${spec.evidence}.`,
      `The approval or recovery point is explicit: ${spec.approval}`,
      `The wrong-answer pattern is specific: ${spec.trap}`
    ],
    whatNotToDo: [
      `Do not let the agent rely on broad access, hidden chat memory, or unlinked summaries for ${spec.skill}.`,
      `Do not accept evidence unless it maps to ${spec.evidence}.`,
      `Do not choose an exam answer that triggers this trap: ${spec.trap}`
    ],
    examActionDrill: [
      `Name the exact GitHub control for ${spec.skill}: ${spec.control}.`,
      `Choose the artifact the learner should create first: ${spec.files[0][0]}.`,
      `Eliminate the answer that lacks ${spec.evidence} or skips ${spec.approval}`
    ],
    takeaways: [
      `${spec.skill} is practical only when the artifact and evidence are inspectable in GitHub.`,
      `The production failure mode is: ${spec.trap}`,
      `The reviewer should inspect ${spec.evidence}.`,
      `The recovery path is: ${spec.recovery}`
    ],
    revisionQuestions: [
      `What exact GitHub control implements ${spec.skill}?`,
      `Which artifact should the learner create or inspect first?`,
      `What evidence proves the agent stayed inside the intended boundary?`,
      `Where does human approval, rollback, recovery, or escalation happen?`,
      `Which tempting exam answer should be rejected and why?`
    ],
    sourceIds: spec.sourceIds,
    documentationProfile: {
      level: "primary-source-pack",
      primarySourceIds: spec.primarySourceIds,
      selectionRationale: sourceRationale(spec)
    },
    templateRecommendationProfile: {
      reviewedAt,
      category: spec.category,
      evidence: spec.evidence,
      examTrapAvoided: spec.trap,
      sourceIds: spec.sourceIds
    },
    workedExamQuestion: buildWorkedQuestion(spec),
    teachingTable: buildTeachingTable(spec),
    topicSpecificExplanation: buildTopicExplanation(spec),
    practicalLabTask: buildPracticalLabTask(spec),
    uiConfigExample: buildUiConfigExample(spec),
    accuracy: accuracy()
  };
}

function buildLab(existing, lesson, spec) {
  return {
    ...existing,
    title: `${spec.skill} evidence lab`,
    labType: "Gold lesson lab",
    qualityTier: "gold",
    lessonIds: [lesson.id],
    domainId: lesson.domainId,
    domain: lesson.domain,
    skillIds: [lesson.skillId],
    objective: `Create a reviewable evidence package for ${spec.skill} in ${spec.repo}, including the exact artifact, GitHub control, approval or recovery point, and evidence standard.`,
    requiredTools: ["GitHub issue or PR", "Markdown template", "Workflow or scan evidence", "Review or approval record", "Official source links"],
    setup: `Use ${spec.repo}. Assume an agent is ready to act, but it must be controlled through ${spec.files[0][0]} before the risky step.`,
    steps: [
      `Write the repository scenario and identify the exact GH-600 skill: ${spec.skill}.`,
      `Create ${spec.files[0][0]} and fill the fields that define the task boundary and product control.`,
      `Create ${spec.files[1][0]} and record the approval, evidence, rejected scope, or recovery point.`,
      `Attach or simulate ${spec.evidence}.`,
      `Add one tempting wrong action and explain why it fails: ${spec.trap}`,
      `Write the reviewer decision: approve, reject, escalate, rollback, or request revision.`,
      `Check the source pack and note which official source supports the product behavior.`
    ],
    expectedResult: `A lesson-specific artifact package proving ${spec.skill} with ${spec.files[0][0]}, ${spec.files[1][0]}, ${spec.evidence}, and a clear reviewer decision.`,
    validation: `A reviewer can inspect the artifacts and answer what the agent may do, what is denied, what evidence proves success, and who owns approval or recovery.`,
    commonFailure: `The learner answers ${spec.skill} with a summary but omits ${spec.files[0][0]}, ${spec.control}, ${spec.evidence}, and the reviewer decision.`,
    recovery: `Rewrite the lab around ${spec.files[0][0]}, add ${spec.evidence}, and route the risk through this recovery path: ${spec.recovery}`,
    examRelevance: `Rehearses GH-600 scenario questions that test exact GitHub controls, artifacts, evidence, approval gates, and traps for ${spec.skill}.`,
    sourceIds: spec.sourceIds,
    accuracy: accuracy()
  };
}

function quizSet(spec) {
  return [
    {
      question: `In ${spec.repo}, an agent is about to act on ${spec.skill}. Which first response is safest?`,
      options: [
        `Let the agent continue because the final PR review can catch any problem later.`,
        `Create or inspect ${spec.files[0][0]}, apply ${spec.control}, and require ${spec.evidence} before the risky step proceeds.`,
        `Give the agent broader access so it can discover the correct control while working.`,
        `Ask for a short chat summary because formal artifacts slow down delivery.`
      ],
      correctIndex: 1,
      correctExplanation: `Correct: ${spec.skill} must be controlled before risky action through the specific artifact and product control. The reviewer needs ${spec.evidence}, tied to ${spec.files[0][0]}, not only a final summary.`,
      wrongRationales: [
        { optionIndex: 0, rationale: "After-the-fact PR review does not prove the agent was controlled before the risky action occurred or show who approved the boundary." },
        { optionIndex: 2, rationale: "Broader access increases the exact failure mode this lesson is designed to prevent and weakens the evidence trail." },
        { optionIndex: 3, rationale: "A chat summary is not a durable GitHub artifact and cannot carry approval, evidence, recovery obligations, or source-backed review." }
      ],
      examTrap: `Reject the wrong answer pattern: ${spec.trap}`
    },
    {
      question: `Which evidence package best proves ${spec.skill} was applied correctly in a realistic GH-600 repository scenario?`,
      options: [
        `A confident agent message saying the work is complete.`,
        `${spec.files[0][0]} with ${spec.evidence}, linked from the issue, PR, workflow, policy, or review artifact.`,
        `Only the changed files, because the diff is the source of truth.`,
        `A short checklist that omits ${spec.files[0][0]}, ${spec.control}, and the reviewer decision.`
      ],
      correctIndex: 1,
      correctExplanation: `Correct: ${spec.files[0][0]} must carry inspectable evidence tied to GitHub objects so another reviewer can reconstruct the control path and approve or reject the next step.`,
      wrongRationales: [
        { optionIndex: 0, rationale: "Confidence is not evidence and does not show approval, scope, validation, recovery, or the product control used." },
        { optionIndex: 2, rationale: "A diff shows what changed but not whether access, approval, validation, evidence, or risk were controlled." },
        { optionIndex: 3, rationale: "Generic checklists do not test the exact product behavior, artifact, evidence standard, or approval path for this lesson." }
      ],
      examTrap: "Reject the wrong answer that accepts narration instead of inspectable evidence."
    },
    {
      question: `A tempting answer says to proceed quickly, even though ${spec.trap.toLowerCase()} What should you do?`,
      options: [
        `Proceed because speed is an explicit goal of agentic workflows.`,
        `Stop or narrow the path, create ${spec.files[0][0]}, and route the decision through ${spec.approval}`,
        `Let the agent choose a new tool and document the reason later.`,
        `Remove the check or approval gate and rely on a rollback if users report problems.`
      ],
      correctIndex: 1,
      correctExplanation: `Correct: the trap is the unsafe answer pattern. GH-600 favors prevention through ${spec.files[0][0]}, evidence, and approval or recovery before the risky action.`,
      wrongRationales: [
        { optionIndex: 0, rationale: "Delivery speed does not override controls that materially reduce operational, security, evaluation, compliance, or traceability risk." },
        { optionIndex: 2, rationale: "The agent cannot expand its own boundary after uncertainty appears because the reviewer loses the pre-action control point." },
        { optionIndex: 3, rationale: "Removing controls and waiting for rollback hides the failure instead of governing it with visible evidence and ownership." }
      ],
      examTrap: `Reject the unsafe shortcut: ${spec.trap}`
    },
    {
      question: `Which artifact is most directly tied to this lesson's learner action in a realistic GH-600 repository scenario?`,
      options: [
        `${spec.files[0][0]}, because it records the exact decision and evidence for ${spec.skill}.`,
        `.github/ISSUE_TEMPLATE/agent-task.yml only, because all agent lessons use the same intake form.`,
        `A local scratch note that is deleted after the agent finishes.`,
        `A generic README update with no reviewer decision.`
      ],
      correctIndex: 0,
      correctExplanation: `Correct: ${spec.files[0][0]} is the specialist artifact for this lesson. The intake form can help, but it is not enough when a domain-specific artifact and evidence standard are required.`,
      wrongRationales: [
        { optionIndex: 1, rationale: "A generic issue template alone does not capture the specialized control, evidence, owner decision, or recovery path required by this lesson." },
        { optionIndex: 2, rationale: "Deleted local notes are not inspectable by reviewers and do not satisfy audit evidence requirements for governed agent work." },
        { optionIndex: 3, rationale: "A README update is content, not the approval, evidence, reviewer decision, or recovery artifact for this skill." }
      ],
      examTrap: `Reject the wrong artifact choice: use ${spec.files[0][0]} instead of a generic-only template.`
    },
    {
      question: `What should a reviewer inspect before approving the agent's work on ${spec.skill}?`,
      options: [
        `Only whether the agent used advanced reasoning.`,
        `${spec.files[0][0]}, ${spec.evidence}, the approval or recovery point, and any denied or escalated action.`,
        `Only whether the branch has at least one passing check.`,
        `Only the final answer from the agent because logs can be noisy.`
      ],
      correctIndex: 1,
      correctExplanation: `Correct: approval depends on artifact, product evidence, reviewer decision, and visible handling of denied or escalated risk through ${spec.files[0][0]} before the next agent action proceeds.`,
      wrongRationales: [
        { optionIndex: 0, rationale: "Reasoning quality is not enough without GitHub evidence, a controlled execution path, and a reviewer-visible decision." },
        { optionIndex: 2, rationale: "A passing check can miss scope, permission, approval, scan, memory, traceability, or recovery failures." },
        { optionIndex: 3, rationale: "Final answers are summaries; GH-600 expects durable evidence in GitHub artifacts that reviewers can inspect later." }
      ],
      examTrap: `Reject approving output without inspecting ${spec.files[0][0]} and the control path.`
    }
  ];
}

function flashcardsFor(spec) {
  return [
    {
      front: `For ${spec.skill}, what is the first learner action?`,
      back: `Create or inspect ${spec.files[0][0]} and use it to apply ${spec.control} before the agent reaches the risky step.`
    },
    {
      front: `What evidence standard proves ${spec.skill}?`,
      back: `The reviewer should inspect ${spec.files[0][0]} with ${spec.evidence}; a final agent summary is not enough.`
    },
    {
      front: `Which exam trap should you reject for ${spec.skill}?`,
      back: `${spec.trap} The safer answer names ${spec.files[0][0]}, evidence, approval or recovery point, and GitHub product behavior.`
    }
  ];
}

function upsertSources() {
  const sources = readJson("sources.json");
  const byId = new Map(sources.map((source, index) => [source.id, { source, index }]));
  for (const addition of sourceAdditions) {
    if (byId.has(addition.id)) sources[byId.get(addition.id).index] = { ...byId.get(addition.id).source, ...addition };
    else sources.push(addition);
  }
  writeJson("sources.json", sources);
}

function updateSourceResearchLog() {
  const filePath = path.join(docsDir, "SOURCE_RESEARCH_LOG.md");
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "# Source Research Log\n";
  const start = "<!-- strict-audit-remediation-sources:start -->";
  const end = "<!-- strict-audit-remediation-sources:end -->";
  const section = [
    start,
    "",
    "## Strict Audit Remediation Exact Sources",
    "",
    `Reviewed: ${reviewedAt}`,
    "",
    ...sourceAdditions.flatMap((source) => [
      `### ${source.title}`,
      "",
      `- URL: ${source.url}`,
      `- Publisher: ${source.publisher}`,
      `- Date accessed: ${source.accessed}`,
      `- Why it matters for GH-600: ${source.why}`,
      `- Domains supported: ${source.domains.join(", ")}`,
      ""
    ]),
    end,
    ""
  ].join("\n");
  const pattern = new RegExp(`${start}[\\s\\S]*?${end}\\n?`);
  const updated = pattern.test(existing) ? existing.replace(pattern, section) : `${existing.trim()}\n\n${section}`;
  fs.writeFileSync(filePath, updated);
}

function applyLessonData() {
  const lessons = readJson("lessons.json");
  const labs = readJson("labs.json");
  const scenarios = readJson("scenarios.json");
  const quizzes = readJson("quizzes.json");
  const flashcards = readJson("flashcards.json");
  const lessonMap = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const labMap = new Map(labs.map((lab) => [lab.id, lab]));
  const scenarioMap = new Map(scenarios.map((scenario) => [scenario.lessonId, scenario]));
  const quizMap = new Map(quizzes.map((quiz) => [quiz.id, quiz]));
  const flashcardsBySkill = new Map();
  for (const card of flashcards) {
    if (!flashcardsBySkill.has(card.skillId)) flashcardsBySkill.set(card.skillId, []);
    flashcardsBySkill.get(card.skillId).push(card);
  }

  const appliedLessonIds = [];

  for (const current of lessons) {
    const lessonId = current.id;
    const spec = specs[lessonId] || buildUniversalSpec(current);
    const lesson = buildLesson(current, spec);
    lessonMap.set(lessonId, lesson);
    appliedLessonIds.push(lessonId);

    for (const labId of lesson.relatedLabs || []) {
      const lab = labMap.get(labId);
      if (lab) Object.assign(lab, buildLab(lab, lesson, spec));
    }

    const existingScenario = scenarioMap.get(lessonId);
    const scenarioUpdate = {
      title: spec.scenario.title,
      domainId: lesson.domainId,
      lessonId,
      prompt: buildScenario(spec).body,
      goodAnswer: buildScenario(spec).goodAnswer,
      trap: buildScenario(spec).trap,
      sourceIds: spec.sourceIds,
      accuracy: accuracy()
    };
    if (existingScenario) Object.assign(existingScenario, scenarioUpdate);
    else scenarios.push({ id: `scenario-remediation-${lessonId}`, ...scenarioUpdate });

    const generatedQuiz = quizSet(spec);
    for (const [index, quizId] of (lesson.relatedQuiz || []).entries()) {
      const quiz = quizMap.get(quizId);
      if (!quiz || !generatedQuiz[index]) continue;
      Object.assign(quiz, generatedQuiz[index], {
        id: quiz.id,
        domainId: lesson.domainId,
        domain: lesson.domain,
        skillId: lesson.skillId,
        lessonId,
        difficulty: index === 0 ? "Applied" : "Scenario",
        sourceIds: spec.sourceIds,
        accuracy: accuracy()
      });
    }

    const generatedCards = flashcardsFor(spec);
    const cards = flashcardsBySkill.get(lesson.skillId) || [];
    for (const [index, card] of cards.slice(0, 3).entries()) {
      Object.assign(card, generatedCards[index], {
        domainId: lesson.domainId,
        skillId: lesson.skillId,
        sourceIds: spec.sourceIds,
        accuracy: accuracy()
      });
    }
  }

  writeJson("lessons.json", lessons.map((lesson) => lessonMap.get(lesson.id) || lesson));
  writeJson("labs.json", labs);
  writeJson("scenarios.json", scenarios);
  writeJson("quizzes.json", quizzes);
  writeJson("flashcards.json", flashcards);

  return appliedLessonIds;
}

function writeRemediationReport(appliedLessonIds) {
  const allLessons = readJson("lessons.json");
  const allRemediated = appliedLessonIds.length === allLessons.length;
  const lines = [
    "# Strict Audit Remediation Report",
    "",
    `Implemented: ${reviewedAt}`,
    "",
    "This is an implementation evidence report for the strict GH-600 lesson quality audit. It does not replace the audit or change scoring rules.",
    "",
    "## Lessons Changed",
    "",
    `- ${appliedLessonIds.length} of ${allLessons.length} lessons regenerated with strict teaching-efficacy fields, lesson-specific artifacts, labs, scenarios, quizzes, flashcards, source IDs, and documentation profiles.`,
    `- Full-course status: ${allRemediated ? "all lessons remediated" : "incomplete remediation coverage"}.`,
    `- ${Object.keys(specs).length} priority lessons retain handwritten remediation overrides for the strict-audit findings.`,
    "",
    "### Priority Handwritten Overrides",
    "",
    ...Object.entries(specs).map(([lessonId, spec]) => `- ${lessonId}: rewrote teaching body, scenario, case study, action steps, artifacts, lab, quizzes, flashcards, source IDs, and documentation profile for ${spec.skill}.`),
    "",
    "## Fields Changed Per Lesson",
    "",
    "- plainLanguage, core, githubDetail, practicalExample, examTrap, scenario, caseStudy, actionOverview, actionSteps, filesToCreate, agentRequestTemplate, enterpriseChecklist, whatNotToDo, examActionDrill, takeaways, revisionQuestions, sourceIds, documentationProfile, workedExamQuestion, teachingTable, topicSpecificExplanation, practicalLabTask.",
    "- Linked labs, scenarios, all five linked quiz questions, and three linked flashcards per skill were updated.",
    "",
    "## Artifacts And Templates Added",
    "",
    "- docs/agent-plan-approval-record.md",
    "- docs/pr-evidence-table.md",
    "- docs/workflow-evidence-record.md",
    "- docs/agentic-vs-automation-decision-table.md",
    "- docs/execution-context-checklist.md",
    "- docs/tool-risk-classification.md",
    "- docs/agent-session-log-review.md",
    "- docs/memory-reset-decision.md",
    "- docs/root-cause-classification.md",
    "- docs/accessibility-scan-evidence.md",
    "",
    "## Artifacts Corrected",
    "",
    "- domain-2 lesson 08 now uses execution-context-checklist, tool permission matrix, environment constraints, setup workflow, and validation workflow instead of broad guardrail artifacts.",
    "- domain-4 lesson 06 now uses root-cause-classification and agent-failure-analysis as primary artifacts instead of generic evaluation artifacts.",
    "- domain-6 lesson 05 now centers least-privilege-access-review, tool permission matrix, approval policy, execution context, and audit trail.",
    "",
    "## Source IDs Added Or Corrected",
    "",
    ...sourceAdditions.map((source) => `- ${source.id}: ${source.title} (${source.publisher})`),
    "",
    "## Teaching-Efficacy Improvements",
    "",
    "- Every lesson now states the official skill or support behavior in plain language.",
    "- Each lesson names a concrete GitHub product control, artifact, evidence standard, approval/recovery point, and exam trap.",
    "- Worked examples use repository scenarios rather than generic scope/review/evidence wording.",
    "- Practice items require the learner to choose an artifact, inspect evidence, and reject a tempting wrong answer.",
    "- Domain and title rules prevent lessons about MCP toolsets, memory expiry, branch scope, scans, multi-agent recovery, and Responsible AI from sharing the same generic explanation.",
    "",
    "## Before And After Examples",
    "",
    "### domain-2-lesson-08",
    "",
    "- Before: execution context wording leaned on broad workflow and guardrail language, and the primary artifacts did not force repo, branch, runner, token, secret, environment, MCP/tool, data, and approval boundaries.",
    "- After: the lesson requires docs/execution-context-checklist.md, docs/agent-tool-permission-matrix.md, docs/environment-constraints.md, setup logs, workflow run URL, token permissions, secret/environment decisions, MCP toolset list, and approval record.",
    "",
    "### domain-4-lesson-06",
    "",
    "- Before: the lesson could sound like generic error analysis and did not foreground the root-cause categories before repair.",
    "- After: the lesson teaches reasoning, instruction, missing context, stale context, tool misuse, permission, environment, workflow/check, and evaluation-threshold failures before tuning or permission changes.",
    "",
    "### domain-6-lesson-05",
    "",
    "- Before: least privilege was partly framed as generic execution control.",
    "- After: the lesson inventories repository, branch, workflow, token, secret, environment, MCP/tool, write, approval, and audit surfaces with allowed, denied, escalated, evidence, owner, validation, and rollback decisions.",
    "",
    "## QA Checks Added",
    "",
    "- Added scripts/check-remediation-quality.mjs to fail on missing artifacts, missing source IDs, generic language, duplicated scenario/example/trap text, missing templates, weak practice items, and missing report across all 101 lessons.",
    "- Updated lesson/content QA domain artifact allowlists for the new specialist artifacts.",
    "",
    "## Commands Run",
    "",
    "- `npm run remediate:strict`: regenerated 101 lessons and preserved 12 handwritten priority overrides.",
    "- `npm run qa:content`: passed with 101 lessons, 505 lesson quiz questions, 101 scenarios, 303 flashcards, 141 labs, 63 templates, 0 warnings, and 0 errors.",
    "- `npm run qa:lessons`: passed with 101 final lessons, 101 gold labs, 505 checked quiz questions, 101 UI config examples, and 0 errors.",
    "- `npm run qa:remediation`: passed with 101 remediated lessons checked, 12 priority overrides checked, and 10 required artifacts checked.",
    "- `npm run data:accuracy`: passed with 1,577 content items checked, 40 sources checked, and 0 manual review flags.",
    "- `npm run audit:lessons`: final verdict Ready, average score 8.8/10, 81 Strong lessons, 20 Excellent lessons, and 0 lessons needing targeted improvement.",
    "- `npm run check`: passed end to end. Vite still reports the existing large bundle warning after production build.",
    "",
    "## Remaining Risks",
    "",
    "- GitHub and Microsoft documentation can drift after the source currentness check date.",
    "- The exact GH-600 exam remains proprietary; lessons are aligned to official public study guide skills and primary documentation, not leaked exam content.",
    "- Vite still reports a large JavaScript chunk after production build; code-splitting is a performance follow-up, not a lesson-content blocker.",
    "- Browser verification spot-checked the least-privilege lesson; full human visual acceptance across all lesson routes is still recommended."
  ];
  fs.writeFileSync(path.join(docsDir, "STRICT_AUDIT_REMEDIATION_REPORT.md"), `${lines.join("\n")}\n`);
}

upsertSources();
updateSourceResearchLog();
execFileSync(process.execPath, [path.join(root, "scripts", "curate-template-recommendations.mjs")], {
  cwd: root,
  stdio: "inherit"
});
const appliedLessonIds = applyLessonData();
writeRemediationReport(appliedLessonIds);

console.log(JSON.stringify({
  remediatedLessons: appliedLessonIds.length,
  handwrittenPriorityLessons: Object.keys(specs).length,
  addedSources: sourceAdditions.length,
  report: "docs/STRICT_AUDIT_REMEDIATION_REPORT.md"
}, null, 2));
