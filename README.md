<div align="center">

<h1>Police of Code</h1>

<p><strong>Enterprise-grade static analysis with a security-first mindset</strong></p>

<p>
A professional, extensible and educational static code analysis platform designed to enforce security,
reliability and maintainability standards before code reaches production.
</p>

<p>
<a href="https://police-of-code.netlify.app/">
  <strong>Live Website</strong>
</a>
&nbsp;&nbsp;|&nbsp;&nbsp;
<a href="https://github.com/0xlayout/police-of-code">
  <strong>GitHub Repository</strong>
</a>
</p>

</div>

---

## Introduction

Police of Code is a modern static analysis tool built with a clear philosophy: **prevent problems, not incidents**.

The project is inspired by internal security tooling used in large engineering organizations and is designed to look,
feel and behave like a real-world product rather than a demo or toy project.

It serves three purposes simultaneously:

- A serious security-oriented static analyzer
- An educational reference for advanced JavaScript tooling
- A high-quality portfolio project showcasing architecture, UX and engineering discipline

---

## Features

- Security-focused static analysis
- Modular and extensible rule engine
- Clean, deterministic analysis results
- CI/CD friendly exit codes
- Minimalistic yet expressive CLI interface
- Human-readable and machine-readable outputs
- Educational, auditable codebase

---

## Installation

### NPM installation 

```bash
npm install police-of-docs
```

### Local installation 

Clone the repository and install dependencies:

```bash
git clone https://github.com/0xlayout/police-of-code.git
cd police-of-code
npm install
```

The CLI can be executed locally via:

```bash
npx police-of-code
```
---

## Quick Start

Analyze a directory:

```bash
police-of-code scan ./src
```

Run system diagnostics:

```bash
police-of-code doctor
```

List all available rules:

```bash
police-of-code rules
```

Generate a default configuration file:

```bash
police-of-code init
```

---

## CLI Overview

```text
police-of-code <command> [options]
```

### Available Commands

| Command | Description |
|-------|------------|
| `scan` | Analyze a file or directory |
| `doctor` | Run environment diagnostics |
| `rules` | List available analysis rules |
| `init` | Create a default configuration file |

---

### Scan Command Options

<table>
<thead>
<tr>
<th>Option</th>
<th>Description</th>
<th>Default</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>--mode &lt;mode&gt;</code></td>
<td>Reporting tone (<code>serious</code>, <code>sarcastic</code>)</td>
<td><code>serious</code></td>
</tr>
<tr>
<td><code>--format &lt;format&gt;</code></td>
<td>Output format (<code>console</code>, <code>json</code>)</td>
<td><code>console</code></td>
</tr>
<tr>
<td><code>--severity &lt;level&gt;</code></td>
<td>Minimum reported severity</td>
<td><code>low</code></td>
</tr>
<tr>
<td><code>--fail-on &lt;level&gt;</code></td>
<td>Exit with error on severity</td>
<td><code>critical</code></td>
</tr>
<tr>
<td><code>--json-output &lt;file&gt;</code></td>
<td>Write JSON report to file</td>
<td>-</td>
</tr>
</tbody>
</table>

---

## Architecture

```text
police-of-code/
├── src/
│   ├── cli.js
│   ├── analyzer.js
│   ├── parser.js
│   ├── ruleEngine.js
│   ├── rules/
│   ├── reporter.js
│   └── personality.js
├── examples/
├── tests/
├── README.md
└── SECURITY.md
```

The architecture is intentionally layered and modular. Each component has a single responsibility and can evolve independently.

---

## Built-in Rules

| Rule | Category | Severity |
|----|--------|----------|
| `hardcodedSecrets` | Security | Critical |
| `sqlInjection` | Injection | Critical |
| `emptyCatch` | Reliability | Medium |
| `longFunctions` | Maintainability | Low |

---

### Example: Hardcoded Secret

```js
const apiKey = "sk_test_1234567890";
```

Result:

```text
CRITICAL  Hardcoded secret detected
Location: badCode.js:1
```

---

### Example: SQL Injection

```js
db.query("SELECT * FROM users WHERE id = " + userId);
```

Result:

```text
CRITICAL  Possible SQL injection detected
```

---

## Output Model

Police of Code produces deterministic results suitable for both humans and automation.

```text
Scan completed
2 Critical violations
1 Medium violation
Exit code: 2
```

This makes the tool ideal for CI/CD pipelines.

---

## Configuration

Create a configuration file:

```bash
police-of-code init
```

Example configuration:

```json
{
  "mode": "serious",
  "format": "console",
  "severity": "low",
  "failOn": "critical"
}
```

---

## Educational Scope

Police of Code demonstrates real-world concepts such as:

- AST parsing and traversal
- Rule engines and policy enforcement
- Severity classification models
- CLI UX and ergonomics
- Deterministic analysis design
- Secure-by-design development philosophy

---

## Disclaimer

Police of Code is not a replacement for professional security audits, penetration testing or runtime protection systems.
It is intended as a static analysis and educational tool.

---

## Credits

<div align="center">

<strong>Crafted by 0xlayout</strong>

</div>
