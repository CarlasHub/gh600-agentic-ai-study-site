const state = {
  curriculum: null,
  quizzes: null,
  activeDomain: "domain-1",
  activeDoc: "docs/course-overview.md",
  learningMaterials: [],
  progress: JSON.parse(localStorage.getItem("gh600-progress") || "{}")
};

const els = {
  domainNav: document.getElementById("domainNav"),
  domainDetail: document.getElementById("domainDetail"),
  progressPercent: document.getElementById("progressPercent"),
  resetProgress: document.getElementById("resetProgress"),
  startCourse: document.getElementById("startCourse"),
  courseNav: document.getElementById("courseNav"),
  courseDocument: document.getElementById("courseDocument"),
  resourceGrid: document.getElementById("resourceGrid"),
  quizDomain: document.getElementById("quizDomain"),
  startQuiz: document.getElementById("startQuiz"),
  quizBox: document.getElementById("quizBox")
};

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }
  return response.json();
}

async function loadText(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }
  return response.text();
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderInlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function tableToHtml(lines) {
  const rows = lines
    .filter((line) => !/^\|\s*-/.test(line))
    .map((line) => line.split("|").slice(1, -1).map((cell) => renderInlineMarkdown(cell.trim())));
  const [headings, ...bodyRows] = rows;
  const header = headings.map((cell) => `<th scope="col">${cell}</th>`).join("");
  const body = bodyRows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("");
  return `<div class="table-scroll"><table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let paragraph = [];
  let listItems = [];
  let orderedItems = [];
  let tableLines = [];
  let codeLines = [];
  let inCode = false;

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${renderInlineMarkdown(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length) {
      html.push(`<ul>${listItems.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join("")}</ul>`);
      listItems = [];
    }
    if (orderedItems.length) {
      html.push(`<ol>${orderedItems.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join("")}</ol>`);
      orderedItems = [];
    }
  };

  const flushTable = () => {
    if (tableLines.length) {
      html.push(tableToHtml(tableLines));
      tableLines = [];
    }
  };

  lines.forEach((line) => {
    if (line.startsWith("```")) {
      flushParagraph();
      flushList();
      flushTable();
      if (inCode) {
        html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeLines = [];
        inCode = false;
      } else {
        inCode = true;
      }
      return;
    }

    if (inCode) {
      codeLines.push(line);
      return;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushTable();
      return;
    }

    if (line.startsWith("|")) {
      flushParagraph();
      flushList();
      tableLines.push(line);
      return;
    }

    flushTable();

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = Math.min(heading[1].length + 1, 4);
      html.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`);
      return;
    }

    const unordered = line.match(/^-\s+(.+)$/);
    if (unordered) {
      flushParagraph();
      orderedItems = [];
      listItems.push(unordered[1]);
      return;
    }

    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      listItems = [];
      orderedItems.push(ordered[1]);
      return;
    }

    paragraph.push(line.trim());
  });

  flushParagraph();
  flushList();
  flushTable();

  return html.join("");
}

function getLearningMaterials() {
  const documents = [
    {
      title: "Course overview",
      url: "docs/course-overview.md",
      type: "Start here"
    },
    {
      title: "Study plan",
      url: "docs/study-plan.md",
      type: "Learning material"
    },
    {
      title: "Source map",
      url: "docs/source-map.md",
      type: "Source guide"
    },
    ...state.curriculum.domains.map((domain) => ({
      title: domain.title,
      url: domain.doc,
      type: domain.id.replace("domain-", "Domain ")
    }))
  ];

  const topics = state.curriculum.domains.flatMap((domain) => domain.topics.map((topic, index) => ({
    title: topic,
    topicId: topicKey(domain.id, index),
    domainId: domain.id,
    topicIndex: index,
    type: `${domain.id.replace("domain-", "Domain ")} topic`
  })));

  return [...documents, ...topics];
}

function saveProgress() {
  localStorage.setItem("gh600-progress", JSON.stringify(state.progress));
}

function topicKey(domainId, index) {
  return `${domainId}-${index}`;
}

function getAllTopicKeys() {
  return state.curriculum.domains.flatMap((domain) => domain.topics.map((_, index) => topicKey(domain.id, index)));
}

function updateProgress() {
  const keys = getAllTopicKeys();
  const complete = keys.filter((key) => state.progress[key]).length;
  const percent = keys.length ? Math.round((complete / keys.length) * 100) : 0;
  els.progressPercent.textContent = `${percent}%`;
}

function renderNavigation() {
  els.domainNav.innerHTML = "";
  state.curriculum.domains.forEach((domain, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `domain-button${domain.id === state.activeDomain ? " active" : ""}`;
    button.innerHTML = `<strong>${index + 1}. ${domain.title}</strong><span>${domain.weight}</span>`;
    button.addEventListener("click", () => {
      state.activeDomain = domain.id;
      renderNavigation();
      renderDomain();
    });
    els.domainNav.appendChild(button);
  });
}

function renderCourseNav() {
  els.courseNav.innerHTML = state.learningMaterials.map((resource) => `
    <button class="course-nav-button${resource.url === state.activeDoc || resource.topicId === state.activeDoc ? " active" : ""}" type="button" ${resource.url ? `data-doc="${resource.url}"` : `data-topic-id="${resource.topicId}"`}>
      <span>${resource.type}</span>
      <strong>${resource.title}</strong>
    </button>
  `).join("");
}

function findTopic(topicId) {
  for (const domain of state.curriculum.domains) {
    const topicIndex = domain.topics.findIndex((_, index) => topicKey(domain.id, index) === topicId);
    if (topicIndex !== -1) {
      return {
        domain,
        topic: domain.topics[topicIndex],
        topicIndex
      };
    }
  }
  return null;
}

function actionVerb(topic) {
  const firstWord = topic.split(" ")[0].toLowerCase();
  const verbs = {
    map: "connect the idea to a real SDLC stage",
    identify: "recognise the right choice in a scenario",
    recognise: "spot the warning sign early",
    define: "write the boundary clearly before work starts",
    separate: "keep each phase visible and controlled",
    require: "make the control a normal part of the workflow",
    validate: "check the plan before it becomes action",
    prevent: "block unsafe behaviour before it happens",
    set: "choose the right level of freedom and review",
    produce: "leave evidence a reviewer can inspect",
    use: "apply the GitHub control that matches the risk",
    configure: "turn the policy into a repeatable setup",
    understand: "explain the concept in your own words",
    evaluate: "inspect the situation before allowing action",
    scope: "limit access to the smallest useful boundary",
    invoke: "run the workflow through a controlled trigger",
    allow: "permit useful autonomy with reviewable boundaries",
    handle: "adapt safely when the environment changes",
    implement: "make the recovery or guardrail real",
    choose: "select the memory type that fits the job",
    persist: "record the decision somewhere durable",
    resume: "continue from recorded state instead of guessing",
    detect: "notice drift and correct course",
    share: "make state visible without creating conflict",
    align: "connect the agent output to the developer's intent",
    inspect: "look at the evidence, not only the final claim",
    classify: "name the failure so you can fix the right cause",
    revise: "improve the workflow without hiding failure",
    avoid: "protect the signal that revealed a real problem",
    apply: "pick the orchestration pattern that fits the work",
    resolve: "make contradictions visible and decide intentionally",
    document: "record the handoff so the next person can continue",
    add: "change the agent system while keeping an audit trail",
    assign: "match freedom to risk",
    block: "stop actions that cross policy or safety boundaries",
    minimise: "remove review steps that do not reduce real risk",
    preserve: "keep evidence that proves what happened"
  };

  return verbs[firstWord] || "apply the concept in a real workflow";
}

function domainExample(domain, topic) {
  if (domain.id === "domain-1") {
    return `A login-validation issue should not simply say "fix login." For this topic, the agent needs a clear SDLC role, approved scope, expected evidence, and a PR path before code changes begin.`;
  }
  if (domain.id === "domain-2") {
    return `If an agent only needs to update docs, it should not receive production deployment tools. For this topic, choose the smallest tool set that lets the agent complete and prove the task.`;
  }
  if (domain.id === "domain-3") {
    return `If an agent forgets that authentication back-end code is out of scope, it may drift into risky files. For this topic, record the right state and keep memory current.`;
  }
  if (domain.id === "domain-4") {
    return `If an agent says "done" but provides no tests, logs, or PR evidence, the work is not proven. For this topic, judge the output through observable signals.`;
  }
  if (domain.id === "domain-5") {
    return `If a planner and builder disagree, the answer is not to merge both outputs. For this topic, keep roles, handoffs, and conflict resolution visible.`;
  }
  return `If an agent asks for access to secrets or production, slow down. For this topic, classify risk and require the right approval before action.`;
}

function domainSteps(domain, topic) {
  const shared = [
    `Restate the topic in one sentence: ${topic}.`,
    "Find the GitHub control point: issue, branch, PR, check, review, environment, log, or artifact.",
    "Decide what evidence would prove this topic was handled correctly.",
    "Write one rule, template line, or checklist item that makes the behaviour repeatable."
  ];

  const domainSpecific = {
    "domain-1": [
      "Place the agent action in the SDLC: discovery, planning, implementation, validation, review, or release.",
      "Decide whether the agent may act immediately or must stop after planning."
    ],
    "domain-2": [
      "List the tools the task actually needs.",
      "Remove every permission that is not required for this exact task."
    ],
    "domain-3": [
      "Separate current task state from reusable long-term memory.",
      "Define when this information expires or needs review."
    ],
    "domain-4": [
      "Name the expected outcome before judging the agent output.",
      "Collect both objective signals, such as tests, and judgement signals, such as scope fit."
    ],
    "domain-5": [
      "Decide whether one agent is enough before adding more agents.",
      "Assign clear ownership so agents do not edit the same thing accidentally."
    ],
    "domain-6": [
      "Classify the action as low, medium, high, or critical risk.",
      "Match the risk to an autonomy level and approval rule."
    ]
  };

  return [...(domainSpecific[domain.id] || []), ...shared];
}

function topicLessonHtml(topicId) {
  const found = findTopic(topicId);
  if (!found) {
    return "<h2>Topic not found</h2><p>This topic could not be loaded.</p>";
  }

  const { domain, topic, topicIndex } = found;
  const friendlyAction = actionVerb(topic);
  const steps = domainSteps(domain, topic);

  return `
    <p class="eyebrow">${domain.id.replace("domain-", "Domain ")} topic ${topicIndex + 1}</p>
    <h2>${escapeHtml(topic)}</h2>
    <p class="lesson-intro">This page explains one checklist topic in simple language, then gives you a practical way to apply it in a GitHub agent workflow.</p>

    <h3>Plain-language explanation</h3>
    <p>${escapeHtml(topic)} means you can ${escapeHtml(friendlyAction)}. In normal software work, this is about making sure the agent does not guess, wander, overreach, or claim success without proof.</p>
    <p>For GH-600, connect this topic to production-grade SDLC work. The exam is likely to ask what the agent should be allowed to do, what should be recorded, and where a human or automated control should step in.</p>

    <h3>Why it matters</h3>
    <p>Agents can work quickly across files, tools, branches, and pull requests. Without this topic, speed can turn into unclear ownership, unsafe access, missing evidence, or changes that no one can confidently review.</p>

    <h3>Example</h3>
    <p>${escapeHtml(domainExample(domain, topic))}</p>

    <h3>Steps to apply it</h3>
    <ol>${steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>

    <h3>Practice task</h3>
    <p>Take the login-validation scenario from the study plan. Write three lines for this topic: what the agent may do, what it must not do, and what evidence it must show in the PR.</p>

    <h3>What you must know after reading this</h3>
    <ul>
      <li>Explain this topic in one plain sentence.</li>
      <li>Connect it to a GitHub control point such as an issue, branch, PR, check, review, environment, log, or artifact.</li>
      <li>Choose the safest level of agent autonomy for the scenario.</li>
      <li>Name the evidence that proves the agent handled the topic correctly.</li>
      <li>Spot the risky answer in an exam scenario, especially broad permissions, missing review, hidden state, or unsupported claims.</li>
    </ul>
  `;
}

async function openLearningMaterial(path, moveFocus = false) {
  state.activeDoc = path;
  renderCourseNav();
  els.courseDocument.innerHTML = "<p>Loading lesson...</p>";

  try {
    const markdown = await loadText(path);
    els.courseDocument.innerHTML = markdownToHtml(markdown);
    if (moveFocus) {
      els.courseDocument.focus();
    }
  } catch (error) {
    els.courseDocument.innerHTML = `<h2>Could not load lesson</h2><p>${escapeHtml(error.message)}</p>`;
  }
}

function openTopicLesson(topicId, moveFocus = false) {
  state.activeDoc = topicId;
  renderCourseNav();
  els.courseDocument.innerHTML = topicLessonHtml(topicId);
  if (moveFocus) {
    els.courseDocument.focus();
  }
}

function renderDomain() {
  const domain = state.curriculum.domains.find((item) => item.id === state.activeDomain);
  const topics = domain.topics.map((topic, index) => {
    const key = topicKey(domain.id, index);
    const checked = state.progress[key] ? "checked" : "";
    return `
      <li class="topic-item">
        <input type="checkbox" id="${key}" data-topic-key="${key}" ${checked}>
        <label for="${key}">${topic}</label>
        <a class="topic-study-link" href="#course-reader" data-open-topic="${key}">Study topic</a>
      </li>
    `;
  }).join("");

  const practice = domain.practice.map((item) => `<article class="practice-card">${item}</article>`).join("");

  els.domainDetail.innerHTML = `
    <div class="domain-header">
      <div>
        <p class="eyebrow">${domain.id.replace("domain-", "Domain ")}</p>
        <h2>${domain.title}</h2>
        <p>${domain.summary}</p>
      </div>
      <span class="weight">${domain.weight}</span>
    </div>
    <h3>Topics to complete</h3>
    <ul class="topic-list">${topics}</ul>
    <h3>Practical labs</h3>
    <div class="practice-grid">${practice}</div>
    <p><a class="button secondary" href="#course-reader" data-open-doc="${domain.doc}">Open full learning document</a></p>
  `;

  els.domainDetail.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      state.progress[event.target.dataset.topicKey] = event.target.checked;
      saveProgress();
      updateProgress();
    });
  });
}

function renderResources() {
  const visibleMaterials = state.learningMaterials.filter((resource) => resource.url);
  const materialCards = visibleMaterials.map((resource) => `
    <article class="resource-card learning-card">
      <p class="eyebrow">${resource.type}</p>
      <h3>${resource.title}</h3>
      <p><a href="#course-reader" data-open-doc="${resource.url}">Open in course reader</a></p>
    </article>
  `).join("");

  const referenceCards = state.curriculum.resources.map((resource) => `
    <article class="resource-card">
      <p class="eyebrow">${resource.type}</p>
      <h3>${resource.title}</h3>
      <p><a href="${resource.url}" target="_blank" rel="noopener noreferrer">Open resource</a></p>
    </article>
  `).join("");

  els.resourceGrid.innerHTML = `
    <div class="resource-group">
      <h3>Learning materials</h3>
      <p>These open inside the course reader above, so you can read the material without leaving the site.</p>
      <div class="resource-grid">${materialCards}</div>
    </div>
    <div class="resource-group">
      <h3>Official references</h3>
      <div class="resource-grid">${referenceCards}</div>
    </div>
  `;
}

function renderQuizOptions() {
  els.quizDomain.innerHTML = state.curriculum.domains.map((domain) => `<option value="${domain.id}">${domain.title}</option>`).join("");
}

function startQuiz() {
  const domainId = els.quizDomain.value;
  const questions = state.quizzes[domainId] || [];
  let score = 0;
  let answered = 0;

  els.quizBox.innerHTML = questions.map((question, questionIndex) => `
    <article class="question-card" data-question="${questionIndex}">
      <h3>Question ${questionIndex + 1}</h3>
      <p>${question.q}</p>
      ${question.options.map((option, optionIndex) => `<button class="answer-option" type="button" data-question="${questionIndex}" data-option="${optionIndex}">${option}</button>`).join("")}
      <div class="explanation" hidden></div>
    </article>
  `).join("");

  const result = document.createElement("div");
  result.className = "question-card";
  result.setAttribute("aria-live", "polite");
  result.textContent = "Answer all questions to see your score.";
  els.quizBox.appendChild(result);

  els.quizBox.querySelectorAll(".answer-option").forEach((button) => {
    button.addEventListener("click", () => {
      const questionIndex = Number(button.dataset.question);
      const optionIndex = Number(button.dataset.option);
      const card = els.quizBox.querySelector(`[data-question='${questionIndex}']`);
      const question = questions[questionIndex];
      const alreadyAnswered = card.dataset.answered === "true";

      if (alreadyAnswered) {
        return;
      }

      card.dataset.answered = "true";
      answered += 1;

      card.querySelectorAll(".answer-option").forEach((optionButton) => {
        const currentOption = Number(optionButton.dataset.option);
        if (currentOption === question.answer) {
          optionButton.classList.add("correct");
        }
        if (currentOption === optionIndex && currentOption !== question.answer) {
          optionButton.classList.add("incorrect");
        }
        optionButton.disabled = true;
      });

      if (optionIndex === question.answer) {
        score += 1;
      }

      const explanation = card.querySelector(".explanation");
      explanation.hidden = false;
      explanation.textContent = question.explanation;
      result.textContent = answered === questions.length ? `Score: ${score}/${questions.length}` : `Answered ${answered}/${questions.length}`;
    });
  });
}

async function init() {
  try {
    const [curriculum, quizzes] = await Promise.all([
      loadJson("data/curriculum.json"),
      loadJson("data/quizzes.json")
    ]);
    state.curriculum = curriculum;
    state.quizzes = quizzes;
    state.learningMaterials = getLearningMaterials();
    renderNavigation();
    renderDomain();
    renderCourseNav();
    renderResources();
    renderQuizOptions();
    openLearningMaterial(state.activeDoc);
    updateProgress();
  } catch (error) {
    document.querySelector("main").innerHTML = `<section class="hero-copy"><h2>Could not load the study site.</h2><p>${error.message}</p></section>`;
  }
}

els.resetProgress.addEventListener("click", () => {
  state.progress = {};
  saveProgress();
  renderDomain();
  updateProgress();
});

els.startQuiz.addEventListener("click", startQuiz);

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-open-doc]");
  const topicTrigger = event.target.closest("[data-open-topic]");
  if (!trigger && !topicTrigger) {
    return;
  }

  event.preventDefault();
  if (trigger) {
    openLearningMaterial(trigger.dataset.openDoc, true);
  } else {
    openTopicLesson(topicTrigger.dataset.openTopic, true);
  }
  document.querySelector("#course-reader").scrollIntoView();
});

els.courseNav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-doc]");
  const topicButton = event.target.closest("[data-topic-id]");
  if (!button && !topicButton) {
    return;
  }

  if (button) {
    openLearningMaterial(button.dataset.doc, true);
  } else {
    openTopicLesson(topicButton.dataset.topicId, true);
  }
});

els.startCourse.addEventListener("click", () => {
  openLearningMaterial("docs/course-overview.md", true);
});

init();
