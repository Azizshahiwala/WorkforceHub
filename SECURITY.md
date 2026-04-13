# Security Policy

## Supported Versions

WorkforceHub is currently maintained as a college project. The following version receives security updates:

| Version | Supported |
|---------|-----------|
| Latest (main branch) | Yes |
| Older commits | No |

---

## Reporting a Vulnerability

If you discover a security vulnerability in WorkforceHub, please **do not open a public GitHub Issue**. Public disclosure of a vulnerability gives malicious actors the opportunity to exploit it before it is fixed.

Instead, please report it responsibly by emailing the maintainer directly:

**Email**: your@email.com  
**Subject line**: `[SECURITY] WorkforceHub - Brief description`

Please include the following in your report:

- A clear description of the vulnerability
- The module or file affected (e.g. `AuthLogin.py`, `Recruitment.jsx`)
- Steps to reproduce the issue
- Potential impact (e.g. unauthorized access, data exposure)
- Your suggested fix if you have one

You will receive a response within **72 hours** acknowledging your report. We will keep you informed of progress toward a fix.

---

## Scope

The following are considered in scope for security reports:

- Authentication and session handling (`AuthLogin.py`)
- Authorization bypass on protected routes
- SQL injection in any database query
- Cross-site scripting (XSS) in React components
- Sensitive data exposure (API keys, passwords, personal employee data)
- CORS misconfiguration allowing unauthorized origins
- Resume upload handling and file processing (`Recruitment.py`, `AISorter.py`)
- OTP bypass in the forgot password flow (`ForgotPasswordPage.jsx`)

The following are **out of scope**:

- Vulnerabilities in third-party dependencies (report these upstream)
- Issues that require physical access to the server
- Social engineering attacks
- Denial of service attacks on the free PythonAnywhere tier
- Issues in development/localhost environment only

---

## Known Security Limitations

WorkforceHub is a college project deployed on free-tier infrastructure. The following known limitations exist and are acknowledged:

**1. SQLite database**
SQLite is not recommended for production multi-user environments. It has no user-level access control and is vulnerable to write contention under concurrent load. A production deployment should migrate to PostgreSQL.

**2. Free tier deployment**
PythonAnywhere free accounts have limited security isolation. The app should not be used to store real personal employee data.

**3. No rate limiting on all endpoints**
Rate limiting via `Core/Limiter.py` is only partially applied. Brute force attacks on login and OTP endpoints are possible. Full rate limiting should be applied before any production use.

**4. AI API keys**
Gemini and Groq API keys are stored as environment variables on PythonAnywhere. Rotating these keys periodically is recommended.

---

## Security Best Practices for Contributors

If you are contributing to WorkforceHub, follow these guidelines:

- **Never commit secrets** — no API keys, passwords, or tokens in any file
- **Never commit `.env` files** — these are gitignored for a reason
- **Never commit `.db` files** — these contain employee data
- **Always use parameterized queries** — never format SQL strings directly with user input
- **Always validate input on the backend** — never trust client-side data
- **Use `encrypter.create_hash()`** for all passwords — never store plaintext
- **Use `authFetch`** for all API calls — never bypass the auth header system
- **Never log sensitive data** — avoid `print(password)` or `print(session)` in production code

---

## Dependency Security

WorkforceHub uses the following key dependencies. Keep these updated:

**Backend:**
- `flask` — web framework
- `flask-cors` — cross-origin handling
- `bcrypt` — password hashing
- `pdfplumber` — PDF parsing
- `google-generativeai` — Gemini AI
- `groq` — Groq/LLaMA AI
- `python-dotenv` — environment variable loading

**Frontend:**
- `react` — UI framework
- `react-router-dom` — routing
- `chart.js` — data visualisation
- `lottie-react` — animations
- `zustand` — state management

To check for known vulnerabilities in Python dependencies:

```bash
pip install pip-audit
pip-audit
```

To check for known vulnerabilities in Node dependencies:

```bash
npm audit
```

---

## Disclosure Policy

Once a reported vulnerability is fixed and deployed, we will:

1. Credit the reporter in the fix commit (unless they request anonymity)
2. Document the fix in the commit message with a `[SECURITY]` prefix
3. Close any related private communication

We follow a **90-day disclosure timeline** — if a fix is not deployed within 90 days of the report, the reporter is free to disclose publicly.
