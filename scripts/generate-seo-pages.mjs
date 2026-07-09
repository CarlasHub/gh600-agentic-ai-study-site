import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const distDir = path.join(rootDir, "dist");
const dataDir = path.join(rootDir, "src", "data");

const siteOrigin = "https://carlashub.github.io";
const basePath = "/gh600-agentic-ai-study-site";
const siteBaseUrl = siteOrigin + basePath;
const lastmod = new Date().toISOString().slice(0, 10);

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf8"));
}

const blueprint = readJson("examBlueprint.json");
const lessons = readJson("lessons.json");
const labs = readJson("labs.json");
const quizzes = readJson("quizzes.json");
const glossary = readJson("glossary.json");
const sources = readJson("sources.json");
const uiWalkthroughs = readJson("uiWalkthroughs.json");
const templateLibrary = readJson("templateLibrary.json");
const sourceMap = new Map(sources.map((source) => [source.id, source]));

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeXml(value = "") {
  return escapeHtml(value);
}

function safeJson(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c").replaceAll(">", "\\u003e").replaceAll("&", "\\u0026");
}

function strip(value = "", max = 158) {
  const text = String(value).replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const clipped = text.slice(0, max).trimEnd();
  const sentenceEnd = Math.max(clipped.lastIndexOf(". "), clipped.lastIndexOf("? "), clipped.lastIndexOf("! "));
  if (sentenceEnd > 80) return clipped.slice(0, sentenceEnd + 1);
  const wordEnd = clipped.lastIndexOf(" ");
  const boundary = wordEnd > 80 ? wordEnd : max;
  return clipped.slice(0, boundary).replace(/[,:;.-]+$/g, "") + "...";
}

function routePath(page, id) {
  if (!page || page === "home") return "/";
  if (page === "domain") return `/domain/${encodeURIComponent(id || "domain-1")}/`;
  if (page === "lesson") return `/lesson/${encodeURIComponent(id || lessons[0].id)}/`;
  if (page === "library") return id ? `/library/${encodeURIComponent(id)}/` : "/library/";
  if (page === "labs") return id ? `/labs/${encodeURIComponent(id)}/` : "/labs/";
  if (page === "quiz") return id ? `/quiz/${encodeURIComponent(id)}/` : "/quiz/";
  if (page === "mock") return id ? `/mock/${encodeURIComponent(id)}/` : "/mock/";
  if (page === "glossary") return id ? `/glossary/${encodeURIComponent(id)}/` : "/glossary/";
  if (page === "walkthroughs") return id ? `/walkthroughs/${encodeURIComponent(id)}/` : "/walkthroughs/";
  return `/${encodeURIComponent(page)}/`;
}

function routeUrl(page, id) {
  return siteBaseUrl + routePath(page, id);
}

function sourceNames(ids = []) {
  return ids.map((id) => sources.find((source) => source.id === id)).filter(Boolean);
}

function lessonDescription(lesson) {
  return `${lesson.title} GH-600 lesson: GitHub controls, scenario, gold lab, quizzes, and official source links.`;
}

function baseCourseSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "GH-600 Developing in Agentic AI Systems Study Platform",
    description: "Complete GH-600 Developing in Agentic AI Systems study platform with lessons, labs, quizzes, mock exams, flashcards, glossary, and source coverage.",
    url: routeUrl("home"),
    provider: {
      "@type": "Person",
      name: "Carla Goncalves",
      url: "https://carlashub.com"
    },
    educationalCredentialAwarded: "GitHub Certified: Agentic AI Developer preparation",
    teaches: [
      "Agentic AI systems",
      "GitHub Copilot coding agent",
      "Model Context Protocol",
      "Responsible AI guardrails",
      "Agent evaluation and observability",
      "Multi-agent workflow coordination"
    ]
  };
}

function staticNav() {
  const links = [
    ["Home", routeUrl("home")],
    ["Blueprint", routeUrl("blueprint")],
    ["Modules", routeUrl("domains")],
    ["Lessons", routeUrl("lessons")],
    ["Library", routeUrl("library")],
    ["Labs", routeUrl("labs")],
    ["Quiz", routeUrl("quiz")],
    ["Glossary", routeUrl("glossary")]
  ];
  return `<nav aria-label="SEO navigation">${links.map(([label, url]) => `<a href="${url}">${escapeHtml(label)}</a>`).join(" ")}</nav>`;
}

function pageShell(title, description, body, route, schema) {
  return {
    title,
    description: strip(description),
    url: routeUrl(route.page, route.id),
    body: `<main id="seo-prerender" class="seo-prerender"><style>.seo-prerender{max-width:980px;margin:2rem auto;padding:1rem;font-family:Inter,system-ui,sans-serif;line-height:1.65}.seo-prerender a{color:#0969da}.seo-prerender nav{display:flex;flex-wrap:wrap;gap:.75rem;margin-bottom:1rem}.seo-prerender section{margin:1.5rem 0}.seo-prerender code{background:#f6f8fa;padding:.1rem .25rem;border-radius:4px}</style>${staticNav()}${body}</main>`,
    schema: schema || {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description: strip(description),
      url: routeUrl(route.page, route.id),
      isPartOf: baseCourseSchema()
    }
  };
}

function list(items, getValue = (item) => item) {
  return `<ul>${items.map((item) => `<li>${getValue(item)}</li>`).join("")}</ul>`;
}

function ordered(items, getValue = (item) => item) {
  return `<ol>${items.map((item) => `<li>${getValue(item)}</li>`).join("")}</ol>`;
}

function tableHtml(table) {
  if (!table?.rows?.length) return "";
  const columns = table.columns || [];
  const head = columns.length ? `<thead><tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr></thead>` : "";
  const body = table.rows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
    .join("");
  return `<section><h2>${escapeHtml(table.title || "Decision table")}</h2>${table.intro ? `<p>${escapeHtml(table.intro)}</p>` : ""}<table>${head}<tbody>${body}</tbody></table></section>`;
}

function lessonDeepeningSections(lesson) {
  const worked = lesson.workedExamQuestion;
  const workedSection = worked
    ? `<section><h2>${escapeHtml(worked.title || "Worked exam-style question")}</h2>${worked.scenario ? `<p>${escapeHtml(worked.scenario)}</p>` : ""}<p><strong>${escapeHtml(worked.question || "")}</strong></p>${ordered(worked.options || [], escapeHtml)}${worked.strongAnswer ? `<p><strong>Strong answer:</strong> ${escapeHtml(worked.strongAnswer)}</p>` : ""}${worked.examTip ? `<p>${escapeHtml(worked.examTip)}</p>` : ""}</section>`
    : "";
  const tableSection = tableHtml(lesson.teachingTable);
  const ui = lesson.uiConfigExample;
  const uiSection = ui
    ? `<section><h2>${escapeHtml(ui.title || "Configuration example")}</h2>${ui.intro ? `<p>${escapeHtml(ui.intro)}</p>` : ""}${ordered(ui.steps || [], escapeHtml)}${ui.expectedEvidence ? `<p><strong>${escapeHtml(ui.expectedEvidence)}</strong></p>` : ""}${ui.sourceNotes?.length ? list(ui.sourceNotes, escapeHtml) : ""}</section>`
    : "";
  return workedSection + tableSection + uiSection;
}

function topicSpecificSection(lesson) {
  const item = lesson.topicSpecificExplanation;
  if (!item?.paragraphs?.length) return "";
  const distinctions = item.distinctions?.length ? list(item.distinctions, escapeHtml) : "";
  return `<section><h2>${escapeHtml(item.title || "What is different about this topic")}</h2>${item.category ? `<h3>${escapeHtml(item.category)}</h3>` : ""}${item.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}${distinctions}${item.examConnection ? `<p>${escapeHtml(item.examConnection)}</p>` : ""}</section>`;
}

function homePage() {
  const body = `<h1>GH-600: Developing in Agentic AI Systems</h1><p>A source-grounded course for learning agentic SDLC workflows, Copilot coding agent, MCP, GitHub controls, evaluation, multi-agent coordination, guardrails, and accountability.</p><section><h2>Study platform coverage</h2>${list([
    `${blueprint.domains.length} course modules`,
    `${lessons.length} lessons`,
    `${labs.length} practical labs`,
    `${quizzes.length} quiz questions`,
    `${templateLibrary.templates.length} agent documentation templates`,
    `${glossary.length} glossary terms`
  ].map(escapeHtml))}</section><section><h2>Start with the modules</h2>${ordered(blueprint.domains, (domain) => `<a href="${routeUrl("domain", domain.id)}">${escapeHtml(domain.title)}</a> <span>${escapeHtml(domain.weight)}</span>`)}</section>`;
  return pageShell("GH-600 Agentic AI Study Platform", "Complete GH-600 Developing in Agentic AI Systems study platform with lessons, labs, quizzes, mock exams, flashcards, glossary, and source coverage.", body, { page: "home" }, baseCourseSchema());
}

function domainsPage() {
  const body = `<h1>GH-600 Course Modules</h1><p>Six course modules following the official GH-600 exam domains.</p>${ordered(blueprint.domains, (domain) => `<a href="${routeUrl("domain", domain.id)}">${escapeHtml(domain.title)}</a> - ${escapeHtml(domain.whatExamTests)}`)}`;
  return pageShell("GH-600 Course Modules", "Six GH-600 study modules following the official exam domains.", body, { page: "domains" });
}

function domainPage(domain) {
  const domainLessons = lessons.filter((lesson) => lesson.domainId === domain.id);
  const body = `<h1>${escapeHtml(domain.title)}</h1><p>${escapeHtml(domain.whatExamTests)}</p><p><strong>Exam weight:</strong> ${escapeHtml(domain.weight)}</p><section><h2>Lessons in this module</h2>${ordered(domainLessons, (lesson) => `<a href="${routeUrl("lesson", lesson.id)}">${escapeHtml(lesson.title)}</a> - ${escapeHtml(lesson.whyExam)}`)}</section><section><h2>Official groups</h2>${list(domain.groups || [], (group) => escapeHtml(group.title))}</section>`;
  return pageShell(`${domain.title} | GH-600 Module`, domain.whatExamTests, body, { page: "domain", id: domain.id }, {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: domain.title,
    description: domain.whatExamTests,
    learningResourceType: "Course module",
    isPartOf: baseCourseSchema(),
    url: routeUrl("domain", domain.id)
  });
}

function lessonsPage() {
  const body = `<h1>All GH-600 Lessons</h1><p>Full lesson library for GH-600 Developing in Agentic AI Systems.</p>${ordered(lessons, (lesson) => `<a href="${routeUrl("lesson", lesson.id)}">${escapeHtml(lesson.title)}</a> <span>${escapeHtml(lesson.domain)}</span>`)}`;
  return pageShell("All GH-600 Lessons", "Full lesson library for GH-600 Developing in Agentic AI Systems.", body, { page: "lessons" });
}

function lessonPage(lesson) {
  const relatedSources = sourceNames(lesson.sourceIds);
  const relatedLabs = (lesson.relatedLabs || []).length
    ? lesson.relatedLabs.map((id) => labs.find((lab) => lab.id === id)).filter(Boolean)
    : labs.filter((lab) => (lab.skillIds || []).includes(lesson.skillId));
  const primaryLab = relatedLabs[0];
  const templateLinks = (lesson.filesToCreate || []).map((artifact) => {
    const template = templateLibrary.templates.find((item) => item.filePath === artifact.path || (item.aliases || []).includes(artifact.path));
    return `<li><code>${escapeHtml(artifact.path)}</code>${template ? ` - <a href="${routeUrl("library", template.id)}">${escapeHtml(template.title)}</a>` : ""}</li>`;
  }).join("");
  const plainLanguage = (lesson.plainLanguage || []).map((item) => `<p>${escapeHtml(item)}</p>`).join("");
  const scenario = lesson.scenario ? `<section><h2>Scenario</h2><p>${escapeHtml(lesson.scenario.body || lesson.scenario.prompt || "")}</p>${lesson.scenario.goodAnswer ? `<p><strong>Strong answer:</strong> ${escapeHtml(lesson.scenario.goodAnswer)}</p>` : ""}</section>` : "";
  const practicalExample = lesson.practicalExample ? `<section><h2>Original teaching example</h2><p>${escapeHtml(lesson.practicalExample)}</p></section>` : "";
  const deepening = lessonDeepeningSections(lesson);
  const topicSpecific = topicSpecificSection(lesson);
  const examStrategy = lesson.examActionDrill?.length ? `<section><h2>Exam strategy</h2>${ordered(lesson.examActionDrill, escapeHtml)}</section>` : "";
  const task = lesson.practicalLabTask || primaryLab;
  const taskSteps = task?.steps || primaryLab?.steps || [];
  const labTask = task ? `<section><h2>Practical lab task</h2><p><strong>${escapeHtml(task.title || primaryLab?.title || "")}</strong></p><p>${escapeHtml(task.objective || primaryLab?.objective || "")}</p>${ordered(taskSteps.slice(0, 5), escapeHtml)}${task.deliverable ? `<p><strong>Deliverable:</strong> ${escapeHtml(task.deliverable)}</p>` : ""}${primaryLab ? `<p><a href="${routeUrl("labs", primaryLab.id)}">Open full lab</a></p>` : ""}</section>` : "";
  const body = `<h1>${escapeHtml(lesson.title)}</h1><p>${escapeHtml(lesson.whyExam)}</p>${plainLanguage ? `<section><h2>Plain-language idea</h2>${plainLanguage}</section>` : ""}<section><h2>Official skill</h2><p>${escapeHtml(lesson.officialSkill)}</p></section><section><h2>Core explanation</h2>${lesson.core.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</section>${topicSpecific}<section><h2>GitHub product behaviour</h2><p>${escapeHtml(lesson.githubDetail)}</p></section>${examStrategy}${practicalExample}${deepening}${labTask}<section><h2>Action steps</h2>${ordered(lesson.actionSteps || [], escapeHtml)}</section>${templateLinks ? `<section><h2>Files and artifacts to create</h2><ul>${templateLinks}</ul></section>` : ""}${scenario}<section><h2>What to know</h2>${list(lesson.takeaways || [], escapeHtml)}</section>${relatedLabs.length ? `<section><h2>Related labs</h2>${list(relatedLabs, (lab) => `<a href="${routeUrl("labs", lab.id)}">${escapeHtml(lab.title)}</a>`)}</section>` : ""}<section><h2>Related sources</h2>${list(relatedSources, (source) => `<a href="${escapeHtml(source.url)}">${escapeHtml(source.title)}</a>`)}</section>`;
  const description = lessonDescription(lesson);
  return pageShell(`${lesson.title} | GH-600 Lesson`, description, body, { page: "lesson", id: lesson.id }, {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: lesson.title,
    description,
    learningResourceType: "Lesson",
    educationalLevel: "Professional certification preparation",
    teaches: lesson.officialSkill,
    isPartOf: baseCourseSchema(),
    url: routeUrl("lesson", lesson.id)
  });
}

function libraryPage() {
  const body = `<h1>${escapeHtml(templateLibrary.title)}</h1><p>${escapeHtml(templateLibrary.summary)}</p>${templateLibrary.sections.map((section) => {
    const templates = templateLibrary.templates.filter((template) => template.sectionId === section.id);
    return `<section><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.description)}</p>${list(templates, (template) => `<a href="${routeUrl("library", template.id)}">${escapeHtml(template.title)}</a> <code>${escapeHtml(template.filePath)}</code>`)}</section>`;
  }).join("")}`;
  return pageShell(templateLibrary.title, templateLibrary.summary, body, { page: "library" });
}

function templateFieldSection(title, items, formatter = escapeHtml) {
  return items?.length ? `<section><h2>${escapeHtml(title)}</h2>${list(items, formatter)}</section>` : "";
}

function templatePage(template) {
  const section = templateLibrary.sections.find((item) => item.id === template.sectionId);
  const sourceLinks = (template.sourceIds || []).map((sourceId) => sourceMap.get(sourceId)).filter(Boolean);
  const miniExample = template.miniExample ? `<section><h2>Mini-example</h2><p><strong>Scenario:</strong> ${escapeHtml(template.miniExample.scenario)}</p><p><strong>Completed example:</strong> ${escapeHtml(template.miniExample.completedExample)}</p></section>` : "";
  const body = `<h1>${escapeHtml(template.title)}</h1><p>${escapeHtml(template.goal)}</p><p><strong>Section:</strong> ${escapeHtml(section?.title || "Template")}</p><p><strong>File path:</strong> <code>${escapeHtml(template.filePath)}</code></p><section><h2>Suggested use</h2><p>${escapeHtml(template.suggestedUse)}</p></section><section><h2>Owner</h2><p>${escapeHtml(template.owner || "")}</p></section><section><h2>Placeholders</h2>${list(template.placeholders || [], (item) => `<code>{{${escapeHtml(item)}}}</code>`)}</section><section><h2>Expectations</h2>${list(template.expectations || [], escapeHtml)}</section>${templateFieldSection("Required fields", template.requiredFields)}${templateFieldSection("Evidence", template.evidence)}${templateFieldSection("Approval and review", template.approvalReview)}${templateFieldSection("Failure modes", template.failureModes)}${templateFieldSection("Recovery or rollback", template.recoveryRollback)}${templateFieldSection("Security and compliance", template.securityCompliance)}${template.gh600Relevance ? `<section><h2>GH-600 relevance</h2><p>${escapeHtml(template.gh600Relevance)}</p></section>` : ""}${miniExample}${templateFieldSection("Sources", sourceLinks, (source) => `<a href="${escapeHtml(source.url)}">${escapeHtml(source.title)}</a>`)}`;
  return pageShell(`${template.title} | Agent Documentation Template`, template.goal, body, { page: "library", id: template.id }, {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: template.title,
    description: strip(template.goal),
    learningResourceType: "Documentation template",
    isPartOf: baseCourseSchema(),
    url: routeUrl("library", template.id)
  });
}

function labsPage() {
  const body = `<h1>GH-600 Practical Labs</h1><p>Hands-on GH-600 labs for GitHub artifacts, validation evidence, recovery habits, and agentic SDLC workflows.</p>${ordered(labs, (lab) => `<a href="${routeUrl("labs", lab.id)}">${escapeHtml(lab.title)}</a> - ${escapeHtml(lab.objective)}`)}`;
  return pageShell("GH-600 Practical Labs", "Hands-on GH-600 labs for GitHub artifacts, validation evidence, recovery habits, and agentic SDLC workflows.", body, { page: "labs" });
}

function labPage(lab) {
  const body = `<h1>${escapeHtml(lab.title)}</h1><p>${escapeHtml(lab.objective)}</p><p><strong>Domain:</strong> ${escapeHtml(lab.domain)}</p><section><h2>Required tools</h2>${list(lab.requiredTools || [], escapeHtml)}</section><section><h2>Setup</h2><p>${escapeHtml(lab.setup)}</p></section><section><h2>Steps</h2>${ordered(lab.steps || [], escapeHtml)}</section><section><h2>Expected result</h2><p>${escapeHtml(lab.expectedResult)}</p></section><section><h2>Validation</h2><p>${escapeHtml(lab.validation)}</p></section><section><h2>Recovery</h2><p>${escapeHtml(lab.recovery)}</p></section>`;
  return pageShell(`${lab.title} | GH-600 Lab`, lab.objective, body, { page: "labs", id: lab.id }, {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: lab.title,
    description: strip(lab.objective),
    learningResourceType: "Hands-on lab",
    educationalLevel: "Professional certification preparation",
    isPartOf: baseCourseSchema(),
    url: routeUrl("labs", lab.id)
  });
}

function glossaryPage() {
  const body = `<h1>GH-600 Glossary</h1><p>Search GitHub, AI-agent, governance, MCP, and SDLC terms for the GH-600 exam.</p>${ordered(glossary, (term) => `<a href="${routeUrl("glossary", term.id)}">${escapeHtml(term.term)}</a> - ${escapeHtml(term.definition)}`)}`;
  return pageShell("GH-600 Glossary", "Search GitHub, AI-agent, governance, MCP, and SDLC terms for the GH-600 exam.", body, { page: "glossary" });
}

function glossaryTermPage(term) {
  const related = (term.relatedLessons || []).map((id) => lessons.find((lesson) => lesson.id === id)).filter(Boolean);
  const body = `<h1>${escapeHtml(term.term)}</h1><p>${escapeHtml(term.definition)}</p><section><h2>Related lessons</h2>${list(related, (lesson) => `<a href="${routeUrl("lesson", lesson.id)}">${escapeHtml(lesson.title)}</a>`)}</section>`;
  return pageShell(`${term.term} | GH-600 Glossary`, term.definition, body, { page: "glossary", id: term.id }, {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: strip(term.definition),
    inDefinedTermSet: routeUrl("glossary"),
    url: routeUrl("glossary", term.id)
  });
}

function walkthroughsPage() {
  const body = `<h1>GitHub Control-Plane Walkthroughs</h1><p>Accessible study walkthroughs for GH-600 GitHub workflows and control points.</p>${ordered(uiWalkthroughs, (item) => `<a href="${routeUrl("walkthroughs", item.id)}">${escapeHtml(item.title)}</a> - ${escapeHtml(item.examTrap)}`)}`;
  return pageShell("GitHub Control-Plane Walkthroughs", "Accessible study walkthroughs for GH-600 GitHub workflows and control points.", body, { page: "walkthroughs" });
}

function walkthroughPage(item) {
  const body = `<h1>${escapeHtml(item.title)}</h1><p>${escapeHtml(item.examTrap)}</p><section><h2>Steps</h2>${ordered(item.steps || [], escapeHtml)}</section><section><h2>Verify</h2>${list(item.verify || [], escapeHtml)}</section>`;
  return pageShell(`${item.title} | GH-600 Walkthrough`, item.examTrap, body, { page: "walkthroughs", id: item.id });
}

function simplePage(page, title, description) {
  return pageShell(title, description, `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p>`, { page }, page === "quiz" ? {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: title,
    description,
    educationalLevel: "Professional certification preparation",
    isPartOf: baseCourseSchema(),
    url: routeUrl(page)
  } : undefined);
}

function allPages() {
  return [
    { route: { page: "home" }, priority: "1.0", page: homePage() },
    { route: { page: "blueprint" }, priority: "0.9", page: simplePage("blueprint", "GH-600 Exam Blueprint", "Official GH-600 skill coverage mapped to lessons, quiz questions, labs, flashcards, and sources.") },
    { route: { page: "domains" }, priority: "0.9", page: domainsPage() },
    { route: { page: "lessons" }, priority: "0.9", page: lessonsPage() },
    { route: { page: "walkthroughs" }, priority: "0.8", page: walkthroughsPage() },
    { route: { page: "library" }, priority: "0.9", page: libraryPage() },
    { route: { page: "labs" }, priority: "0.9", page: labsPage() },
    { route: { page: "quiz" }, priority: "0.7", page: simplePage("quiz", "GH-600 Quiz Engine", "Immediate feedback practice for GH-600 domains, skills, and scenario judgement.") },
    { route: { page: "mock" }, priority: "0.7", page: simplePage("mock", "GH-600 Exam Simulator", "Timed GH-600 scenario exam simulator aligned to domain weights.") },
    { route: { page: "flashcards" }, priority: "0.7", page: simplePage("flashcards", "GH-600 Flashcards", "Search, flip, and review GH-600 flashcards for exam recall.") },
    { route: { page: "glossary" }, priority: "0.8", page: glossaryPage() },
    { route: { page: "readiness" }, priority: "0.6", page: simplePage("readiness", "GH-600 Readiness Dashboard", "Study readiness evidence based on lessons, mock scores, quiz practice, and labs.") },
    { route: { page: "accuracy" }, priority: "0.6", page: simplePage("accuracy", "GH-600 Accuracy Dashboard", "Source monitoring and content validation for the GH-600 study platform.") },
    { route: { page: "study-plan" }, priority: "0.7", page: simplePage("study-plan", "GH-600 Study Plans", "Choose a GH-600 study schedule based on your exam timeline.") },
    { route: { page: "cram" }, priority: "0.7", page: simplePage("cram", "GH-600 Cram Guide", "Final GH-600 review for high-yield agentic AI, MCP, GitHub, and governance topics.") },
    ...blueprint.domains.map((domain) => ({ route: { page: "domain", id: domain.id }, priority: "0.9", page: domainPage(domain) })),
    ...lessons.map((lesson) => ({ route: { page: "lesson", id: lesson.id }, priority: "0.85", page: lessonPage(lesson) })),
    ...uiWalkthroughs.map((item) => ({ route: { page: "walkthroughs", id: item.id }, priority: "0.7", page: walkthroughPage(item) })),
    ...templateLibrary.templates.map((template) => ({ route: { page: "library", id: template.id }, priority: "0.8", page: templatePage(template) })),
    ...labs.map((lab) => ({ route: { page: "labs", id: lab.id }, priority: "0.8", page: labPage(lab) })),
    ...glossary.map((term) => ({ route: { page: "glossary", id: term.id }, priority: "0.65", page: glossaryTermPage(term) }))
  ];
}

function writeRobots(targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, "robots.txt"), [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${siteBaseUrl}/sitemap.xml`,
    ""
  ].join("\n"));
}

function writeSitemap(targetDir, pages) {
  fs.mkdirSync(targetDir, { recursive: true });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(({ route, priority }) => `  <url>\n    <loc>${escapeXml(routeUrl(route.page, route.id))}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`).join("\n")}\n</urlset>\n`;
  fs.writeFileSync(path.join(targetDir, "sitemap.xml"), xml);
}

function replaceOrInsertHead(html, selector, replacement) {
  const patterns = {
    title: /<title>[\s\S]*?<\/title>/,
    description: /<meta name="description" content="[^"]*"\s*\/?>/,
    canonical: /<link rel="canonical" href="[^"]*"\s*\/?>/,
    ogTitle: /<meta property="og:title" content="[^"]*"\s*\/?>/,
    ogDescription: /<meta property="og:description" content="[^"]*"\s*\/?>/,
    ogUrl: /<meta property="og:url" content="[^"]*"\s*\/?>/,
    twitterTitle: /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    twitterDescription: /<meta name="twitter:description" content="[^"]*"\s*\/?>/
  };
  if (patterns[selector].test(html)) return html.replace(patterns[selector], replacement);
  return html.replace("</head>", `    ${replacement}\n  </head>`);
}

function renderHtml(baseHtml, page) {
  let html = baseHtml;
  html = html
    .replaceAll('href="./favicon.ico"', `href="${basePath}/favicon.ico"`)
    .replaceAll('href="./favicon.png"', `href="${basePath}/favicon.png"`)
    .replaceAll('href="./apple-touch-icon.png"', `href="${basePath}/apple-touch-icon.png"`);
  html = replaceOrInsertHead(html, "title", `<title>${escapeHtml(page.title)}</title>`);
  html = replaceOrInsertHead(html, "description", `<meta name="description" content="${escapeHtml(page.description)}" />`);
  html = replaceOrInsertHead(html, "canonical", `<link rel="canonical" href="${escapeHtml(page.url)}" />`);
  html = replaceOrInsertHead(html, "ogTitle", `<meta property="og:title" content="${escapeHtml(page.title)}" />`);
  html = replaceOrInsertHead(html, "ogDescription", `<meta property="og:description" content="${escapeHtml(page.description)}" />`);
  html = replaceOrInsertHead(html, "ogUrl", `<meta property="og:url" content="${escapeHtml(page.url)}" />`);
  html = replaceOrInsertHead(html, "twitterTitle", `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`);
  html = replaceOrInsertHead(html, "twitterDescription", `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`);
  html = html.replace("</head>", `    <script type="application/ld+json" id="route-structured-data">${safeJson(page.schema)}</script>\n  </head>`);
  return html.replace('<div id="root"></div>', `<div id="root"></div>\n    ${page.body}`);
}

function writeStaticPages(targetDir, pages) {
  const indexPath = path.join(targetDir, "index.html");
  if (!fs.existsSync(indexPath)) {
    throw new Error(`Cannot generate SEO pages because ${indexPath} does not exist. Run vite build first.`);
  }
  const baseHtml = fs.readFileSync(indexPath, "utf8");
  for (const item of pages) {
    const route = routePath(item.route.page, item.route.id);
    if (route === "/") continue;
    const target = path.join(targetDir, route.replace(/^\/+|\/+$/g, ""), "index.html");
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, renderHtml(baseHtml, item.page));
  }
}

const pages = allPages();
const args = new Set(process.argv.slice(2));

if (!args.has("--dist")) {
  writeRobots(publicDir);
  writeSitemap(publicDir, pages);
  console.log(`Generated public robots.txt and sitemap.xml with ${pages.length} URLs.`);
}

if (args.has("--dist")) {
  writeRobots(distDir);
  writeSitemap(distDir, pages);
  writeStaticPages(distDir, pages);
  console.log(`Generated dist SEO pages for ${pages.length - 1} clean routes.`);
}
