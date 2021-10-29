const fs = require('fs');
const csv = require('fast-csv');
const path = require('path');

const inputFile = require('path').join(getDir() + '/sample-data/input.csv');
const outputFile = require('path').join(getDir() + '/sample-data/output.csv');


function getDir() {
  if (process.pkg) {
      return path.resolve(process.execPath + "/..");
  } else {
      return path.join(require.main ? require.main.path : process.cwd());
  }
}

(async function () {

  const writeStream = fs.createWriteStream(outputFile);

  const parse = csv.parse(
    { 
      ignoreEmpty: true,
      discardUnmappedColumns: true,
      headers: ['beta','alpha','redundant','charlie'],
    });

  const transform = csv.format({ headers: true })
    .transform((row) => (
      {
        NewAlpha: row.alpha, // reordered
        NewBeta: row.beta,
        NewCharlie: row.charlie,
        // redundant is dropped
        // delta is not loaded by parse() above
      }
    ));

  const stream = fs.createReadStream(inputFile)
    .pipe(parse)
    .pipe(transform)
    .pipe(writeStream);
})();