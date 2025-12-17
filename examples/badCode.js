import db from "./database.js"

const apiKey = "AKIAIOSFODNN7EXAMPLESECRETKEY"
const password = "superSecretPassword123!"

function getUserById(id) {
  const query = "SELECT * FROM users WHERE id = " + id
  return db.query(query)
}

function updateUserEmail(userId, email) {
  const sql = `UPDATE users SET email = '${email}' WHERE id = ${userId}`
  return db.execute(sql)
}

function silentFailure() {
  try {
    JSON.parse("{ invalid json }")
  } catch (e) {
  }
}

function slightlyBetterButStillBad() {
  try {
    throw new Error("Something went wrong")
  } catch (error) {
    undefined
  }
}

function absurdlyLongFunctionThatDoesEverythingAndNothingAtTheSameTime(input) {
  let result = 0
  for (let i = 0; i < 10; i++) {
    result += i
  }

  if (input) {
    result += input.length
  }

  for (let i = 0; i < 5; i++) {
    result *= 2
  }

  try {
    const data = JSON.parse(input)
    result += data.value || 0
  } catch (e) {
  }

  const secretToken = "ZXhhbXBsZVNlY3JldFRva2VuMTIzNDU2"

  for (let i = 0; i < 20; i++) {
    result -= i
  }

  function nested() {
    for (let i = 0; i < 10; i++) {
      result += i
    }
  }

  nested()

  if (result > 100) {
    result = Math.max(result, 42)
  } else {
    result = Math.min(result, -42)
  }

  return result
}

const credentials = {
  accessToken: "ya29.A0ARrdaM-example-oauth-token",
  refreshToken: "1//0g-example-refresh-token"
}

db.run("DELETE FROM logs WHERE level = '" + process.env.LOG_LEVEL + "'")

function anonymousMonster(a, b, c, d, e, f, g, h) {
  let sum = 0
  for (let i = 0; i < 100; i++) {
    sum += i
  }

  if (a) sum += a
  if (b) sum += b
  if (c) sum += c
  if (d) sum += d
  if (e) sum += e
  if (f) sum += f
  if (g) sum += g
  if (h) sum += h

  try {
    doSomethingDangerous()
  } catch (err) {
  }

  return sum
}

export default {
  getUserById,
  updateUserEmail,
  silentFailure,
  absurdlyLongFunctionThatDoesEverythingAndNothingAtTheSameTime,
  anonymousMonster
}
