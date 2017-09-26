const chalk = require('chalk')

const R = 'R'
const B = 'B'

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

/** Compute shortest power set via BFS */
function solve(tree) {

  let numberOfColumns = tree.value[0].length
  let max = numberOfColumns * tree.value.length + 1
  let queue = [[tree, 1]]
  let DEBUG = { n: 0 }

  while (queue.length) {

    let [tree, min] = queue.shift()

    if (isSolved(tree.value)) {
      console.log(`Solved after ${DEBUG.n} probes!`)
      return tree
    }

    if (min === max) {
      return
    }

    for (let index = min; index < max; index++) {
      let [x, y] = indexToCoords(index, numberOfColumns)
      let newValue = mutate(tree.value, x, y)
      let newTree = new Tree(newValue, tree, x, y)
      queue.push([newTree, min + 1])
    }

    DEBUG.n++

  }
}

function indexToCoords(index, numberOfColumns) {
  return [
    Math.floor((index - 1) / numberOfColumns),
    Math.floor((index - 1) % numberOfColumns)
  ]
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
    let s = '\n'
    for (let r = 0; r < this.value.length; r++) {
      for (let c = 0; c < this.value[r].length; c++) {
        s += `${this.toStringValue(r, c)} `
      }
      s += '\n'
    }
    return s
  }
  toStringValue(x, y) {
    let value = this.value[y][x]
    return value === R
      ? chalk`{red R}`
      : chalk`{blue B}`
  }

  toDiffString() {
    let s = '\n'
    for (let r = 0; r < this.value.length; r++) {
      for (let c = 0; c < this.value[r].length; c++) {
        s += `${this.toDiffStringValue(r, c)} `
      }
      s += '\n'
    }
    return s
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
