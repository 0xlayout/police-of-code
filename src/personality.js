const MODES = {
  strict: "strict",
  sarcastic: "sarcastic"
}

const SARCASTIC_TEMPLATES = {
  critical: {
    message: [
      "This is bad. Like, really bad.",
      "Congratulations, you just summoned a security incident.",
      "Somewhere, a security engineer just felt a disturbance."
    ],
    explanation: [
      "This pattern is a classic example of how systems get compromised.",
      "Attackers love this kind of mistake. Truly.",
      "This is the sort of thing that ends up in post-mortems."
    ]
  },
  high: {
    message: [
      "This is not great.",
      "You probably didn’t mean to do this, but here we are.",
      "This might come back to haunt you."
    ],
    explanation: [
      "This introduces unnecessary risk into the codebase.",
      "It may work now, but it will hurt later.",
      "This reduces reliability and clarity."
    ]
  },
  medium: {
    message: [
      "This could be better.",
      "Not terrible, but not ideal either.",
      "This smells a bit."
    ],
    explanation: [
      "This affects maintainability and long-term quality.",
      "Future you will not enjoy this.",
      "This adds cognitive overhead."
    ]
  },
  low: {
    message: [
      "Minor issue detected.",
      "Nothing dramatic, but worth fixing.",
      "This is a small polish opportunity."
    ],
    explanation: [
      "Improving this increases overall code quality.",
      "Small improvements compound over time.",
      "Clean code matters."
    ]
  }
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function applySarcasm(violation) {
  const severityTemplates = SARCASTIC_TEMPLATES[violation.severity]

  if (!severityTemplates) {
    return violation
  }

  return {
    ...violation,
    message: randomItem(severityTemplates.message),
    explanation: randomItem(severityTemplates.explanation),
    suggestion: violation.suggestion
  }
}

function applyStrict(violation) {
  return violation
}

export function formatViolation(violation, mode = MODES.strict) {
  if (mode === MODES.sarcastic) {
    return applySarcasm(violation)
  }

  return applyStrict(violation)
}

export function resolveMode(input) {
  if (!input) {
    return MODES.strict
  }

  const normalized = String(input).toLowerCase()

  if (normalized === MODES.sarcastic) {
    return MODES.sarcastic
  }

  return MODES.strict
}