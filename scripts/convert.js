const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path')
const predict = require('jspredict');

const tles = readFileSync(join(__dirname, 'amateur.txt'))
  .toString()
  .split('\n')
  .reduce(
  (agg, line) => {
    if (agg.__current.length < 2) {
      agg.__current.push(line);
    } else {
      agg[agg.__current[0]] = agg.__current.concat(line).join('\n');
      agg.__current = [];
    }
    return agg;
  },
  { __current: [] }
);

delete tles.__current;

writeFileSync(join(__dirname, '../src/data/tles.json'), JSON.stringify(tles))
