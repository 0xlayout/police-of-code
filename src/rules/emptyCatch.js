function isEmptyBlock(block) {
  if (!block || block.type !== "BlockStatement") {
    return true
  }

  return block.body.length === 0
}

function onlyIgnoresError(block) {
  if (!block || block.type !== "BlockStatement") {
    return false
  }

  if (block.body.length !== 1) {
    return false
  }

  const statement = block.body[0]

  if (statement.type !== "ExpressionStatement") {
    return false
  }

  if (statement.expression.type !== "Identifier") {
    return false
  }

  return statement.expression.name === "undefined"
}

function containsThrowOrReturn(block) {
  if (!block || block.type !== "BlockStatement") {
    return false
  }

  return block.body.some(
    statement =>
      statement.type === "ThrowStatement" ||
      statement.type === "ReturnStatement"
  )
}

function isLegitimateIgnore(block) {
  if (containsThrowOrReturn(block)) {
    return true
  }

  if (onlyIgnoresError(block)) {
    return true
  }

  return false
}

export default {
  id: "REL-001",
  name: "Empty Catch Block",
  severity: "high",

  create(astContext, executionContext, report) {
    return {
      CatchClause(path) {
        const body = path.node.body

        if (!isEmptyBlock(body)) {
          return
        }

        if (isLegitimateIgnore(body)) {
          return
        }

        report({
          node: body,
          message: "Empty catch block detected",
          explanation: "Silently swallowing errors makes failures invisible and significantly complicates debugging and incident response.",
          suggestion: "Handle the error explicitly, log it, or rethrow it to preserve failure visibility."
        })
      }
    }
  }
}
