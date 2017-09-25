const R = 'R'
const B = 'B'
const MAX_TRIES = 1000000

/**
 * Algorithms:
 * - BFS
 */
function run(grid) {
  return path(solve(new Tree(grid)))
}

function path(solution) {
  let result = []
  while (solution.parent) {
    result.unshift(solution)
    solution = solution.parent
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

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        queue.push(new Tree(mutate(node.value, c, r), node, c, r))
      }
    }

    n++
  }
}

function mutate(grid, x, y) {
  let newGrid = []
  for (let r = 0; r < 3; r++) {
    newGrid[r] = []
    for (let c = 0; c < 3; c++) {
      newGrid[r][c] = shouldInvert(x, y, c, r)
        ? invert(grid[r][c])
        : grid[r][c]
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
    if (x === this.x && y === this.y) {
      return `[${this.value[y][x]}]`
    }
    return ` ${this.value[y][x]} `
  }
}

// test

function main() {
  console.log('Solving...')
  let input = [
    [R, R, R],
    [R, B, B],
    [R, R, B]
  ]
  run(input).forEach((_, n) =>
    console.log(`${n + 1}.`, _.toString())
  )
}

main()