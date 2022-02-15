import fs from 'fs';

const alphaNumeric = str => {
  return str.replace(/([^a-zA-Z0-9])/g, '');
};

function main() {
  const file = fs.readFileSync('./in/locations.csv').toString();
  // Remove col names;
  let rows = file.split('\n').slice(1);
  let heirarchy = {
    has: {
      byId: {},
      allIds: [],
    },
    hsdas: {
      byId: {},
      allIds: [],
    },
    lhas: {
      byId: {},
      allIds: [],
    },
  };

  let currentHA = '';
  let currentHAName = '';
  let currentHSDA = '';
  let currentHSDAName = '';
  let currentLHA = '';
  let currentLHAName = '';

  while (rows.length) {
    const currentRow = rows[0].split(',');
    const col0 = currentRow[0].trim();
    const col1 = currentRow[1].trim();
    const col2 = currentRow[2].trim();

    if (col0) {
      currentHA = alphaNumeric(col0);
      currentHAName = col0;
    }
    if (col1) {
      currentHSDA = alphaNumeric(col1);
      currentHSDAName = col1;
    }
    if (col2) {
      currentLHA = alphaNumeric(col2);
      currentLHAName = col2;
    }

    if (currentHA) {
      if (!heirarchy.has.byId[currentHA]) {
        heirarchy.has.byId[currentHA] = {
          id: currentHA,
          name: currentHAName,
          hsdas: [],
        };
        heirarchy.has.allIds.push(currentHA);
      }
    }

    if (currentHSDA) {
      if (!heirarchy.hsdas.byId[currentHSDA]) {
        heirarchy.hsdas.byId[currentHSDA] = {
          id: currentHSDA,
          name: currentHSDAName,
          lhas: [],
        };
        heirarchy.hsdas.allIds.push(currentHSDA);
      }
      if (
        heirarchy.has.byId[currentHA] &&
        heirarchy.has.byId[currentHA].hsdas.indexOf(currentHSDA) === -1
      ) {
        heirarchy.has.byId[currentHA].hsdas.push(currentHSDA);
      }
    }

    if (currentLHA) {
      if (!heirarchy.lhas.byId[currentLHA]) {
        heirarchy.lhas.byId[currentLHA] = {
          id: currentLHA,
          name: currentLHAName,
        };
        heirarchy.lhas.allIds.push(currentLHA);
      }
      if (
        heirarchy.hsdas.byId[currentHSDA] &&
        heirarchy.hsdas.byId[currentHSDA].lhas.indexOf(currentLHA) === -1
      ) {
        heirarchy.hsdas.byId[currentHSDA].lhas.push(currentLHA);
      }
    }

    rows = rows.splice(1);
  }
  fs.writeFileSync('./out/locations.json', JSON.stringify(heirarchy), 'utf-8');
}

main();
