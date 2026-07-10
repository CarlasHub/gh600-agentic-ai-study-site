import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "src", "data");
const docsDir = path.join(root, "docs");
const sources = JSON.parse(fs.readFileSync(path.join(dataDir, "sources.json"), "utf8"));
const previousStatusPath = path.join(dataDir, "sourceStatus.json");
const previousStatus = fs.existsSync(previousStatusPath)
  ? JSON.parse(fs.readFileSync(previousStatusPath, "utf8"))
  : { sources: [] };
const previousById = new Map((previousStatus.sources || []).map((source) => [source.id, source]));

const checkedAt = new Date().toISOString();
const results = [];

const STOP_WORDS = new Set([
  "about",
  "after",
  "agent",
  "agents",
  "also",
  "before",
  "being",
  "could",
  "every",
  "github",
  "guide",
  "learn",
  "microsoft",
  "needs",
  "other",
  "should",
  "source",
  "study",
  "their",
  "there",
  "these",
  "using",
  "where",
  "which",
  "while",
  "with",
  "would"
]);

function stripHtml(value) {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, "\"")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMainText(body) {
  const main = body.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const article = body.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
  return stripHtml(main?.[1] || article?.[1] || body);
}

function extractTitle(body) {
  const title = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  return title ? stripHtml(title) : null;
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function keywords(text, limit = 24) {
  const counts = new Map();
  const words = text.toLowerCase().replace(/[^a-z0-9+#./-]+/g, " ").split(/\s+/);
  for (const word of words) {
    if (word.length < 5 || /^\d+$/.test(word) || STOP_WORDS.has(word)) continue;
    counts.set(word, (counts.get(word) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([word]) => word);
}

function comparablePrevious(previous) {
  return Boolean(previous?.contentHash || previous?.etag || previous?.lastModified);
}

function keywordOverlap(previous, result) {
  const previousKeywords = new Set((previous?.contentKeywords || []).map((term) => String(term).toLowerCase()));
  const currentKeywords = new Set((result?.contentKeywords || []).map((term) => String(term).toLowerCase()));
  if (!previousKeywords.size || !currentKeywords.size) return 0;
  const shared = [...previousKeywords].filter((term) => currentKeywords.has(term)).length;
  return shared / Math.min(previousKeywords.size, currentKeywords.size);
}

function changeReviewState(previous, result) {
  if (result.status !== "reachable") return "unreachable";
  if (!previous || !comparablePrevious(previous)) return "baseline-established";

  const changedSignals = [];
  if (previous.contentHash && result.contentHash && previous.contentHash !== result.contentHash) {
    const overlap = keywordOverlap(previous, result);
    result.semanticKeywordOverlap = Number(overlap.toFixed(2));
    if (overlap >= 0.7) {
      changedSignals.push("content hash with stable keywords");
      result.note = `Content hash changed, but source keyword overlap remained ${(overlap * 100).toFixed(0)}%; no objective-level drift signal.`;
    } else {
      changedSignals.push("content hash");
    }
  }
  if (!previous.contentHash && previous.etag && result.etag && previous.etag !== result.etag) {
    changedSignals.push("ETag");
  }
  if (!previous.contentHash && !previous.etag && previous.lastModified && result.lastModified && previous.lastModified !== result.lastModified) {
    changedSignals.push("Last-Modified");
  }
  if (previous.finalUrl && result.finalUrl && previous.finalUrl !== result.finalUrl) {
    changedSignals.push("final URL");
  }

  result.changedSignals = changedSignals;
  const blockingSignals = changedSignals.filter((signal) => signal !== "content hash with stable keywords");
  return blockingSignals.length ? "source-review-needed" : "current";
}

async function fetchSource(source) {
  const result = {
    id: source.id,
    title: source.title,
    url: source.url,
    checkedAt,
    status: "unknown",
    statusCode: null,
    finalUrl: null,
    lastModified: null,
    etag: null,
    contentType: null,
    contentHash: null,
    contentLength: null,
    pageTitle: null,
    contentKeywords: [],
    reviewState: "unknown",
    changedSignals: [],
    note: ""
  };

  try {
    const response = await fetch(source.url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "User-Agent": "gh600-study-site-currentness-check/2.0"
      },
      signal: AbortSignal.timeout(30000)
    });

    result.statusCode = response.status;
    result.finalUrl = response.url;
    result.lastModified = response.headers.get("last-modified");
    result.etag = response.headers.get("etag");
    result.contentType = response.headers.get("content-type");
    result.status = response.ok ? "reachable" : "unreachable";

    const body = await response.text();
    result.contentLength = body.length;
    if (body) {
      const contentText = extractMainText(body);
      result.contentHash = sha256(contentText);
      result.pageTitle = extractTitle(body);
      result.contentKeywords = keywords(`${source.title} ${source.why} ${contentText}`);
    }
    if (!response.ok) result.note = "GET request did not return a successful status.";
  } catch (error) {
    result.status = "unreachable";
    result.note = `GET failed: ${error.message}`;
  }

  const previous = previousById.get(source.id);
  result.reviewState = changeReviewState(previous, result);
  if (result.reviewState === "source-review-needed") {
    result.note = `Review required: ${result.changedSignals.join(", ")} changed since previous baseline.`;
  } else if (result.reviewState === "baseline-established") {
    result.note = result.note || "Enhanced source fingerprint baseline established.";
  } else {
    result.note = result.note || "OK";
  }

  return result;
}

for (const source of sources) {
  results.push(await fetchSource(source));
}

const unreachable = results.filter((item) => item.status !== "reachable");
const reviewNeeded = results.filter((item) => item.reviewState === "source-review-needed");
const baselineEstablished = results.filter((item) => item.reviewState === "baseline-established");
const report = {
  checkedAt,
  sourceCount: sources.length,
  reachable: results.length - unreachable.length,
  unreachable: unreachable.length,
  reviewNeeded: reviewNeeded.length,
  baselineEstablished: baselineEstablished.length,
  results
};

fs.writeFileSync(path.join(dataDir, "sourceStatus.json"), JSON.stringify({
  lastChecked: checkedAt.slice(0, 10),
  checkedAt,
  policy: "Automated currentness checks verify reachability, redirects, headers, source fingerprints, and extracted source keywords. Source changes are review triggers; human review is required before changing content assumptions.",
  sourceSnapshotId: "gh600-source-baseline-2026-06-11",
  sources: results
}, null, 2) + "\n");

const markdown = [
  "# Source Currentness Check",
  "",
  `Checked: ${checkedAt}`,
  "",
  `Sources checked: ${sources.length}`,
  `Reachable: ${report.reachable}`,
  `Unreachable: ${report.unreachable}`,
  `Review needed: ${report.reviewNeeded}`,
  `Baseline established: ${report.baselineEstablished}`,
  "",
  "Source | Status | Review state | HTTP | Last modified | ETag | Changed signals | Note",
  "--- | --- | --- | --- | --- | --- | --- | ---",
  ...results.map((item) => [
    item.title.replaceAll("|", "/"),
    item.status,
    item.reviewState,
    item.statusCode ?? "",
    item.lastModified ?? "",
    item.etag ? "`" + item.etag.replaceAll("`", "") + "`" : "",
    item.changedSignals?.join(", ") || "",
    item.note || "OK"
  ].join(" | ")),
  "",
  "## Maintainer Instructions",
  "",
  "- `source-review-needed` means the source is reachable but a tracked signal changed. Open the source, compare affected content, and record the decision in `docs/DATA_ACCURACY_ACTION_LOG.md`.",
  "- `baseline-established` appears when a source had no previous fingerprint. It should move to `current` on the next unchanged run.",
  "- `unreachable` is a blocking release risk and should be fixed before relying on the site for exam preparation."
].join("\n");

fs.writeFileSync(path.join(docsDir, "SOURCE_CURRENTNESS_REPORT.md"), markdown + "\n");

console.log(JSON.stringify({
  checkedAt,
  sourceCount: sources.length,
  reachable: report.reachable,
  unreachable: report.unreachable,
  reviewNeeded: report.reviewNeeded,
  baselineEstablished: report.baselineEstablished
}, null, 2));

if (reviewNeeded.length) {
  console.error("Some sources changed and need human review:");
  for (const item of reviewNeeded) console.error(`- ${item.id}: ${item.changedSignals.join(", ")}`);
}

if (unreachable.length) {
  console.error("Some sources are unreachable:");
  for (const item of unreachable) console.error(`- ${item.id}: ${item.note || item.statusCode}`);
  process.exit(1);
}
