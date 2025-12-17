    import fs from "fs"
    import path from "path"
    import { analyzeFiles } from "../src/analyzer.js"
    import rules from "../src/rules/index.js"

    const FIXTURES_DIR = path.resolve(process.cwd(), "examples")

    function loadFixture(name) {
    return fs.readFileSync(path.join(FIXTURES_DIR, name), "utf-8")
    }

    describe("Police of Code Analyzer", () => {
    test("detects violations in bad code example", async () => {
        const source = loadFixture("badCode.js")

        const results = await analyzeFiles(
        [
            {
            filePath: "examples/badCode.js",
            content: source
            }
        ],
        {
            rules,
            mode: "strict"
        }
        )

        expect(results).toBeDefined()
        expect(results.violations.length).toBeGreaterThan(0)
    })

    test("detects hardcoded secrets", async () => {
        const source = `
        const password = "veryStrongPassword123!"
        export default password
        `

        const results = await analyzeFiles(
        [
            {
            filePath: "test.js",
            content: source
            }
        ],
        {
            rules,
            mode: "strict"
        }
        )

        const secretViolations = results.violations.filter(
        v => v.ruleId === "SEC-001"
        )

        expect(secretViolations.length).toBeGreaterThan(0)
    })

    test("detects empty catch blocks", async () => {
        const source = `
        try {
            doSomething()
        } catch (e) {
        }
        `

        const results = await analyzeFiles(
        [
            {
            filePath: "emptyCatch.js",
            content: source
            }
        ],
        {
            rules,
            mode: "strict"
        }
        )

        const emptyCatchViolations = results.violations.filter(
        v => v.ruleId === "REL-001"
        )

        expect(emptyCatchViolations.length).toBe(1)
    })

    test("detects potential sql injection", async () => {
        const source = `
        function findUser(id) {
            return db.query("SELECT * FROM users WHERE id = " + id)
        }
        `

        const results = await analyzeFiles(
        [
            {
            filePath: "sql.js",
            content: source
            }
        ],
        {
            rules,
            mode: "strict"
        }
        )

        const sqlViolations = results.violations.filter(
        v => v.ruleId === "SEC-002"
        )

        expect(sqlViolations.length).toBeGreaterThan(0)
    })

    test("detects long functions", async () => {
        const lines = Array.from({ length: 100 }).map(
        (_, i) => `console.log(${i})`
        )

        const source = `
        function huge() {
            ${lines.join("\n")}
        }
        `

        const results = await analyzeFiles(
        [
            {
            filePath: "long.js",
            content: source
            }
        ],
        {
            rules,
            mode: "strict",
            maxFunctionLines: 30
        }
        )

        const longFunctionViolations = results.violations.filter(
        v => v.ruleId === "MAINT-001"
        )

        expect(longFunctionViolations.length).toBe(1)
    })

    test("supports sarcastic mode without changing rule detection", async () => {
        const source = `
        const token = "thisIsDefinitelyASecretToken12345"
        export default token
        `

        const strictResults = await analyzeFiles(
        [
            {
            filePath: "token.js",
            content: source
            }
        ],
        {
            rules,
            mode: "strict"
        }
        )

        const sarcasticResults = await analyzeFiles(
        [
            {
            filePath: "token.js",
            content: source
            }
        ],
        {
            rules,
            mode: "sarcastic"
        }
        )

        expect(strictResults.violations.length).toBe(
        sarcasticResults.violations.length
        )
    })
    })