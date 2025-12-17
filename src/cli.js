#!/usr/bin/env node

import { Command, Option } from "commander"
import path from "path"
import fs from "fs"
import process from "process"
import pc from "picocolors"
import { analyzeProject } from "./analyzer.js"
import { reportResults } from "./reporter.js"

const pkg = {
  name: "police-of-code",
  version: "1.0.0",
  description: "Security-first static analysis with authority"
}

const severities = ["low", "medium", "high", "critical"]
const formats = ["console", "json"]
const modes = ["serious", "sarcastic"]

const program = new Command()

program
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version, "-v, --version", "Display version information")
  .helpOption("-h, --help", "Display help information")
  .addHelpText(
    "beforeAll",
    pc.bold(pc.blue("\nPOLICE OF CODE\n")) +
    pc.dim("Enforcing code law before production.\n")
  )
  .addHelpText(
    "afterAll",
    "\n" +
    pc.dim("Examples:\n") +
    pc.dim("  $ police-of-code scan ./src\n") +
    pc.dim("  $ police-of-code scan . --severity high --fail-on high\n") +
    pc.dim("  $ police-of-code doctor\n")
  )

program
  .command("scan <target>")
  .description("Analyze a file or directory for security violations")
  .addOption(new Option("--mode <mode>", "Reporting tone").choices(modes).default("serious"))
  .addOption(new Option("--format <format>", "Output format").choices(formats).default("console"))
  .addOption(new Option("--severity <level>", "Minimum reported severity").choices(severities).default("low"))
  .addOption(new Option("--fail-on <level>", "Exit with error if this severity is found").choices(severities).default("critical"))
  .option("--json-output <file>", "Write JSON report to file")
  .option("--quiet", "Suppress banner and non-essential output", false)
  .option("--no-banner", "Disable startup banner")
  .action(async (target, options) => {
    const resolvedTarget = path.resolve(process.cwd(), target)

    if (!fs.existsSync(resolvedTarget)) {
      console.error(pc.red(`Target does not exist: ${resolvedTarget}`))
      process.exit(1)
    }

    if (options.banner && !options.quiet) {
      console.log(
        pc.bold(pc.blue("Police of Code")) +
        pc.dim(` v${pkg.version}`)
      )
    }

    const context = {
      mode: options.mode,
      format: options.format,
      minSeverity: options.severity,
      failOn: options.failOn,
      cwd: process.cwd(),
      timestamp: new Date().toISOString()
    }

    try {
      const results = await analyzeProject(resolvedTarget, context)
      reportResults(results, context)

      if (options.jsonOutput) {
        fs.writeFileSync(
          path.resolve(options.jsonOutput),
          JSON.stringify(results, null, 2)
        )
      }

      const found = results.violations.map(v => v.severity)
      const failIndex = severities.indexOf(context.failOn)

      const shouldFail = found.some(
        s => severities.indexOf(s) >= failIndex
      )

      process.exit(shouldFail ? 2 : 0)
    } catch (err) {
      console.error(pc.red("Analysis failed"))
      console.error(pc.dim(err instanceof Error ? err.message : String(err)))
      process.exit(99)
    }
  })

program
  .command("doctor")
  .description("Run environment diagnostics and sanity checks")
  .action(() => {
    const checks = [
      { name: "Node.js version", ok: process.versions.node.split(".")[0] >= 18 },
      { name: "Working directory", ok: fs.existsSync(process.cwd()) },
      { name: "Filesystem access", ok: (() => { try { fs.accessSync(process.cwd()); return true } catch { return false } })() }
    ]

    console.log(pc.bold("System diagnostics\n"))

    checks.forEach(check => {
      const symbol = check.ok ? pc.green("✓") : pc.red("✗")
      console.log(`${symbol} ${check.name}`)
    })

    const failed = checks.some(c => !c.ok)
    process.exit(failed ? 1 : 0)
  })

program
  .command("rules")
  .description("List all available security rules")
  .action(() => {
    const rules = [
      { name: "hardcodedSecrets", severity: "critical" },
      { name: "sqlInjection", severity: "critical" },
      { name: "emptyCatch", severity: "medium" },
      { name: "longFunctions", severity: "low" }
    ]

    console.log(pc.bold("Available rules\n"))

    rules.forEach(rule => {
      const color =
        rule.severity === "critical" ? pc.red :
        rule.severity === "high" ? pc.yellow :
        rule.severity === "medium" ? pc.blue :
        pc.dim

      console.log(`${pc.bold(rule.name)} ${color(rule.severity)}`)
    })
  })

program
  .command("init")
  .description("Create a default configuration file")
  .action(() => {
    const configPath = path.resolve(process.cwd(), "police-of-code.config.json")

    if (fs.existsSync(configPath)) {
      console.error(pc.red("Configuration file already exists"))
      process.exit(1)
    }

    const config = {
      mode: "serious",
      format: "console",
      severity: "low",
      failOn: "critical"
    }

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    console.log(pc.green("Configuration file created"))
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
