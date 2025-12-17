# Security Policy

## Overview

**Police of Code** is a static analysis tool focused on detecting security vulnerabilities, reliability risks, and maintainability issues in JavaScript and TypeScript codebases.
Security is a core concern of this project, both in terms of the tool’s own integrity and the trust users place in its analysis results.

This document defines how security issues are handled, reported, evaluated, and resolved.

---

## Supported Versions

Only actively maintained versions receive security updates.

| Version | Supported |
|--------:|:---------:|
| `main`  | Yes       |
| `< 1.0` | No        |

Security fixes are always applied to the `main` branch first.

---

## Threat Model

The primary threat vectors considered by this project include:

- Malicious input designed to crash or exploit the analyzer
- Crafted source code intended to bypass detection rules
- Dependency-level vulnerabilities
- Supply chain attacks
- Unsafe execution paths during analysis

**Police of Code does not execute analyzed code.**
All analysis is static and performed exclusively through AST inspection.

---

## Security Guarantees

The project enforces the following guarantees:

- No runtime execution of target source code
- No network access during analysis
- No file system writes outside explicit user intent
- Deterministic rule execution
- Clear separation between input parsing and rule evaluation

These guarantees significantly reduce the attack surface.

---

## Reporting a Vulnerability

### Responsible Disclosure
If you discover a security vulnerability, please report it responsibly.

**Do not open a public issue.**

Instead, contact the maintainers directly via:

```css
0xlayout@atomicmail.io
```

Include the following information:

|  | 
|---------------|
| Description of the vulnerability  | 
| Steps to reproduce |
| Affected versions |
| Potential impact |
| Any proof-of-concept material (if applicable) |
|  | 

## Vulnerability Severity Classification
Reported issues are classified using the following scale:

| Severity | Description                                                          |
| -------: | -------------------------------------------------------------------- |
| Critical | Remote code execution, data exfiltration, or supply chain compromise |
|     High | Denial of service, sandbox escape, integrity violation               |
|   Medium | Rule bypass, incorrect analysis, partial trust violation             |
|      Low | Minor misbehavior, edge cases, non-exploitable flaws                 |

Severity determines response priority and disclosure timeline.

## Disclosure Timeline

| Severity | Initial Response | Fix Target   |
| -------: | ---------------- | ------------ |
| Critical | ≤ 24 hours       | ≤ 72 hours   |
|     High | ≤ 48 hours       | ≤ 7 days     |
|   Medium | ≤ 5 days         | Next release |
|      Low | Best effort      | As scheduled |


## Dependency Security
Dependencies are monitored continuously.
