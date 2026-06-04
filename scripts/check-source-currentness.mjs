import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "src", "data");
const docsDir = path.join(root, "docs");
const sources = JSON.parse(fs.readFileSync(path.join(dataDir, "sources.json"), "utf8"));

const checkedAt = new Date().toISOString();
const results = [];

for (const source of sources) {
  const result = {
    id: source.id,
    title: source.title,
    url: source.url,
    checkedAt,
    status: "unknown",
    statusCode: null,
    finalUrl: null,
    lastModified: null,
    contentType: null,
    note: ""
  };

  try {
    const response = await fetch(source.url, {
      method: "HEAD",
      redirect: "follow",
      headers: {
        "User-Agent": "gh600-study-site-currentness-check/1.0"
      }
    });
    result.statusCode = response.status;
    result.finalUrl = response.url;
    const lastModified = response.headers.get("last-modified");
    result.lastModified = lastModified && !/invalid date/i.test(lastModified) ? lastModified : null;
    result.contentType = response.headers.get("content-type");
    result.status = response.ok ? "reachable" : "needs-review";
    if (!response.ok) result.note = "HEAD request did not return a successful status.";
  } catch (error) {
    result.status = "needs-review";
    result.note = `HEAD failed: ${error.message}`;
  }

  results.push(result);
}

const failures = results.filter((item) => item.status !== "reachable");
const report = {
  checkedAt,
  sourceCount: sources.length,
  reachable: results.length - failures.length,
  needsReview: failures.length,
  results
};

fs.writeFileSync(path.join(dataDir, "sourceStatus.json"), JSON.stringify({
  lastChecked: checkedAt.slice(0, 10),
  policy: "Automated currentness checks verify reachability and basic metadata only. Human review is required for changed exam objectives or product behavior.",
  sources: results
}, null, 2) + "\n");

const markdown = [
  "# Source Currentness Check",
  "",
  `Checked: ${checkedAt}`,
  "",
  `Sources checked: ${sources.length}`,
  `Reachable: ${report.reachable}`,
  `Needs review: ${report.needsReview}`,
  "",
  "Source | Status | HTTP | Last modified | Note",
  "--- | --- | --- | --- | ---",
  ...results.map((item) => `${item.title.replaceAll("|", "/")} | ${item.status} | ${item.statusCode ?? ""} | ${item.lastModified ?? ""} | ${item.note || "OK"}`)
].join("\n");

fs.writeFileSync(path.join(docsDir, "SOURCE_CURRENTNESS_REPORT.md"), markdown + "\n");

console.log(JSON.stringify({
  checkedAt,
  sourceCount: sources.length,
  reachable: report.reachable,
  needsReview: report.needsReview
}, null, 2));

if (failures.length) {
  console.error("Some sources need review:");
  for (const item of failures) console.error(`- ${item.id}: ${item.note || item.statusCode}`);
  process.exit(1);
}
