# GH-600 Agentic AI Developer Study Site

A static GitHub Pages study site for the GitHub Certified: Agentic AI Developer GH-600 beta exam.

## What is included

- Coursera-style learning dashboard
- Six exam domain pages
- Topic checklist with local progress tracking
- LocalStorage completion tracking
- Quizzes by domain
- Final mock exam
- Flashcards
- Study plan
- Agent governance templates and prompts
- GitHub Pages workflow

## Run locally

```bash
npm run check
npm run start
```

Open `http://localhost:8080`.

## Deploy to GitHub Pages

1. Create a GitHub repository.
2. Push this folder to the repository.
3. Go to Settings > Pages.
4. Select GitHub Actions as the source.
5. Push to `main`. The workflow in `.github/workflows/pages.yml` will publish the site.

## Important exam note

This is a study aid, not an official Microsoft or GitHub resource. Use the official GH-600 study guide as the source of truth and check it again before the exam because the beta objectives can change.
