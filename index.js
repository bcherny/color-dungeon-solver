const chalk = require('chalk')

const R = 'R'
const B = 'B'
const MAX_TRIES = 1000000

module.exports.run = run
module.exports.R = R
module.exports.B = B

/**
 * Algorithms:
 * - BFS
 */
function run(grid) {
  return path(solve(new Tree(grid)))
}

function path(solution) {
  let result = []

  // build path
  while (solution.parent) {
    result.unshift(solution)
    solution = solution.parent
  }

  // add inital state
  result.unshift(solution)

  // add children
  // TODO: add children upstream?
  for (let i = 0; i < result.length - 1; i++) {
    result[i].child = result[i + 1]
  }

  return result
}

function solve(tree) {

  let queue = [tree]
  let n = 0

  while (queue.length && n < MAX_TRIES) {
    let node = queue.shift()

    if (isSolved(node.value)) {
      console.log(`Found solution after ${n} probes!`)
      return node
    }

    map(node.value, (_, c, r) =>
      queue.push(new Tree(mutate(node.value, c, r), node, c, r))
    )

    n++
  }
}

function mutate(grid, x, y) {
  return map(grid, (value, c, r) =>
    shouldInvert(x, y, c, r) ? invert(value) : value
  )
}

function map(grid, fn) {
  let newGrid = []
  for (let r = 0; r < grid.length; r++) {
    newGrid[r] = []
    for (let c = 0; c < grid[r].length; c++) {
      newGrid[r][c] = fn(grid[r][c], c, r)
    }
  }
  return newGrid
}

function invert(value) {
  return value === R ? B : R
}

function shouldInvert(x0, y0, x1, y1) {
  return (x0 === x1 && y0 === y1) || isNeighbor(x0, y0, x1, y1)
}

function isNeighbor(x0, y0, x1, y1) {
  let xIsNeighbor = Math.abs(x0 - x1) === 1 && y0 - y1 === 0
  let yIsNeighbor = Math.abs(y0 - y1) === 1 && x0 - x1 === 0
  return xIsNeighbor || yIsNeighbor
}

function isSolved(grid) {
  return grid.every(_ => _.every(_ => _ === B))
}

class Tree {
  constructor(value, parent, x, y) {
    this.value = value
    this.parent = parent
    this.x = x
    this.y = y
  }

  toString() {
    return `
      ${this.toStringValue(0, 0)} ${this.toStringValue(0, 1)} ${this.toStringValue(0, 2)}
      ${this.toStringValue(1, 0)} ${this.toStringValue(1, 1)} ${this.toStringValue(1, 2)}
      ${this.toStringValue(2, 0)} ${this.toStringValue(2, 1)} ${this.toStringValue(2, 2)}
`
  }
  toStringValue(x, y) {
    let value = this.value[y][x]
    return value === R
      ? chalk`{red R}`
      : chalk`{blue B}`
  }

  toDiffString() {
    return `
    ${this.toDiffStringValue(0, 0)} ${this.toDiffStringValue(0, 1)} ${this.toDiffStringValue(0, 2)}
    ${this.toDiffStringValue(1, 0)} ${this.toDiffStringValue(1, 1)} ${this.toDiffStringValue(1, 2)}
    ${this.toDiffStringValue(2, 0)} ${this.toDiffStringValue(2, 1)} ${this.toDiffStringValue(2, 2)}
    `
  }
  toDiffStringValue(x, y) {
    let value = this.value[y][x]
    if (this.child && x === this.child.x && y === this.child.y) {
      return value === R
        ? chalk`{bold.underline.red R}`
        : chalk`{bold.underline.blue B}`
    }
    return value === R
      ? chalk`{red R}`
      : chalk`{blue B}`
  }
}
