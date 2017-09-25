# Color-dungeon-solver [![npm]](https://www.npmjs.com/package/color-dungeon-solver) [![mit]](https://opensource.org/licenses/MIT)

> A solver for the [Color Dungeon Puzzle](https://strategywiki.org/wiki/The_Legend_of_Zelda:_Link%27s_Awakening/Color_Dungeon) in Zelda: Link's Awakening DX for Gameboy

[npm]: https://img.shields.io/npm/v/color-dungeon-solver.svg?style=flat-square
[mit]: https://img.shields.io/npm/l/color-dungeon-solver.svg?style=flat-square

![](screenie.png)

## What is this?

In Zelda: Link's Awakening DX for Gameboy Color, there are several puzzle mini-games within the main game. Your character encounters one of these puzzles inside of the Color Dungeon.

The game works as follows:

1. There are 9 lanterns arranged in a 3x3 grid.
2. Each lantern can be one of two colors: Red or Blue.
3. Your character has a sword, which he can use to hit a lantern.
4. When a lantern is hit, it will flip its color (from Red to Blue, or from Blue to Red). Additionally, any immediately neighboring lanterns will flip their colors as well. An immediate neighbor is any lantern that is exactly one row/column over horizontally/vertically (but not diagonally) from a given lantern.
5. The goal is to find a sequence of lantern hits so that all lanterns flip to blue.

The solution is not trivial to intuit. This package uses a Depth First Search strategy to find the winning sequence of lantern hits.

If anyone has an improvement over this solution, or has a closed-form solution, please file an issue or PR!

## Installation

```sh
# Using Yarn:
yarn add color-dungeon-solver

# Or, using NPM:
npm install color-dungeon-solver
```

## Usage

```js
import { B, R, run } from 'color-dungeon-solver'

// B means Blue, R means Red
let input = [
  [B, B, B],
  [B, B, B],
  [B, B, R]
]

run(input).forEach((step, n) =>
  console.log(`${n + 1}.`, step.toDiffString())
)
```

This will give the following output (the bold block is the one to hit at each step):

![](solution.png)

## License

MIT
