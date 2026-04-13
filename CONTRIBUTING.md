# Contributing to WorkforceHub

Thank you for your interest in contributing to WorkforceHub! This document outlines the process and guidelines for contributing to this project.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Branch Naming](#branch-naming)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)
  
---

## Getting Started

WorkforceHub is a full-stack HR management system built with:

- **Frontend**: React (Vite) — deployed on Vercel
- **Backend**: Flask + SQLite — deployed on PythonAnywhere
- **AI**: Gemini 2.5 Flash (resume parsing), Groq/LLaMA (interview questions)

Before contributing, please read the [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Project Structure
workforce/
├── src/
│   ├── pages/          # React page components (HR, Admin, Employee)
│   ├── layout/         # Layout wrappers per role
│   ├── HR/             # HR navbar and sidebar
│   ├── Admin/          # Admin navbar and sidebar
│   ├── Employees/      # Employee navbar and sidebar
│   ├── Misc/           # Shared components (MessageBox, Logout, etc.)
│   ├── styles/         # CSS files per module
│   └── Backend/        # Flask backend
│       ├── Core/       # AISorter, EmailService, Limiter
│       ├── Database/   # SQLite .db files
│       └── *.py        # Blueprint modules

---

## Development Setup

### Frontend

```bash
git clone https://github.com/yourusername/workforce.git
cd workforce/src
npm install
npm run dev
```

Create a `.env` file in `src/`:

VITE_API_BASE_URL=http://localhost:5000/api
VITE_PY_PATH=http://localhost:5000
VITE_WEB_PATH=http://localhost:5173

### Backend

```bash
cd src/Backend
python3.10 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python Server.py
```

Create a `.env` file in the project root:

FLASK_SECRET_KEY=your-secret-key
API_KEY=your-gemini-key
GROQ_API_KEY=your-groq-key
smtp_server=smtp.gmail.com
smtp_port=587
smtp_username=your@email.com
smtp_password=your-app-password

> Never commit your `.env` file. It is listed in `.gitignore`.

---

## How to Contribute

1. **Fork** the repository
2. **Create a branch** from `main` using the naming convention below
3. **Make your changes** following the code style guidelines
4. **Test locally** — both frontend and backend
5. **Open a Pull Request** with a clear description
   
---

## Branch Naming

Use the following prefixes:

| Type | Format | Example |
|------|--------|---------|
| New feature | `feature/short-description` | `feature/mobile-sidebar` |
| Bug fix | `fix/short-description` | `fix/otp-type-mismatch` |
| UI improvement | `ui/short-description` | `ui/payroll-responsive` |
| Documentation | `docs/short-description` | `docs/sequence-diagrams` |
| Refactor | `refactor/short-description` | `refactor/auth-headers` |

---

## Commit Guidelines

Write clear, concise commit messages in the imperative form:
fix css import casing in navbars
add mobile responsive media queries to LeaveManager
refactor session checks to use HeaderAuth
add email notification for promote and demote actions

- Keep commits focused — one logical change per commit
- Reference issues where applicable: `fix OTP comparison bug (#12)`
- Never commit `.env`, `*.db`, `node_modules`, or `__pycache__`

---

## Pull Request Process

1. Ensure your branch is up to date with `main` before opening a PR
2. Fill in the PR template:
   - What does this PR do?
   - Which module does it affect?
   - Has it been tested locally?
   - Any known issues or limitations?
3. PRs require at least one review before merging
4. Resolve all review comments before requesting a re-review
5. Squash commits if the history is noisy before merging
   
---

## Code Style

### Frontend (React)

- Use functional components with hooks — no class components
- Keep component files focused — one component per file
- Use `authFetch` from `src/Misc/authFetch.js` for all API calls
- Use `MessageBox` component instead of `window.alert` or `window.confirm`
- CSS files go in `src/styles/<role>/ComponentName.css`
- Use `import.meta.env.VITE_API_BASE_URL` — never hardcode API URLs

### Backend (Flask)

- Each domain gets its own Blueprint file — do not mix concerns
- Use `get_session()` from `HeaderAuth.py` for all auth checks
- Always close database connections in `finally` blocks
- Extract tuples correctly — use `row[0]` not `row`
- Use `PathConfig.py` for all database paths — never hardcode paths
- Handle all exceptions and return meaningful JSON error responses

---

## Reporting Bugs

Open a GitHub Issue with the following information:

- **Module affected** (e.g. Leave Manager, Payroll, Recruitment)
- **Steps to reproduce**
- **Expected behaviour**
- **Actual behaviour**
- **Environment** (local / Vercel + PythonAnywhere)
- **Browser and OS** (if frontend issue)
- **Relevant error from browser console or PythonAnywhere error log**
- 
---

## Feature Requests

Open a GitHub Issue with the label `enhancement` and include:

- A clear description of the feature
- Which user role it affects (HR, Admin, Employee)
- Why it would be useful
- Any implementation ideas you have in mind

---

## Questions

If you have questions about the codebase, open a GitHub Discussion or raise an Issue with the label `question`.
