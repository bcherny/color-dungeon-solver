const { B, R, run } = require('./')

// test

function test() {
  console.log('Solving...')
  let input = [
    [B, B, B],
    [B, B, B],
    [B, B, R]
  ]
  run(input).forEach((_, n) =>
    console.log(`${n + 1}.`, _.toDiffString())
  )
}

test()
