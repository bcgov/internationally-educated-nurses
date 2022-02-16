import fs from 'fs';
import csv from 'csv-parser';

const alphaNumeric = str => {
  return str.replace(/([^a-zA-Z0-9])/g, '');
};

function readData(fileName) {
  return new Promise((resolve, reject) => {
    var rows = [];
    fs.createReadStream(fileName)
      .pipe(csv(['stream', 'specialty', 'subspecialty']))
      .on('data', data => rows.push(data))
      .on('end', () => {
        console.log('CSV file successfully processed');
        resolve(rows);
      })
      .on('error', reject);
  });
}

async function main() {
  const rows = await readData('./in/streams.csv');
  // remove headers
  rows.shift();

  let heirarchy = {
    streams: {
      byId: {},
      allIds: [],
    },
    specialties: {
      byId: {},
      allIds: [],
    },
    subspecialties: {
      byId: {},
      allIds: [],
    },
  };

  let currentStream = '';
  let currentStreamName = '';
  let currentSpecialty = '';
  let currentSpecialtyName = '';
  let currentSubspecialty = '';
  let currentSubspecialtyName = '';

  for (let i = 0; i < rows.length; i++) {
    const currentRow = rows[i];

    if (currentRow.stream) {
      currentStream = alphaNumeric(currentRow.stream);
      currentStreamName = currentRow.stream;
      // reset specialty and subspecialty
      currentSpecialty = '';
      currentSpecialtyName = '';
      currentSubspecialty = '';
      currentSubspecialtyName = '';
    }
    if (currentRow.specialty) {
      currentSpecialty = alphaNumeric(currentRow.specialty);
      currentSpecialtyName = currentRow.specialty;
      // reset subspecialty
      currentSubspecialty = '';
      currentSubspecialtyName = '';
    }
    if (currentRow.subspecialty) {
      currentSubspecialty = alphaNumeric(currentRow.subspecialty);
      currentSubspecialtyName = currentRow.subspecialty;
    }

    if (currentStream) {
      if (!heirarchy.streams.byId[currentStream]) {
        heirarchy.streams.byId[currentStream] = {
          id: currentStream,
          name: currentStreamName,
          specialties: [],
        };
        heirarchy.streams.allIds.push(currentStream);
      }
    }

    if (currentSpecialty) {
      if (!heirarchy.specialties.byId[currentSpecialty]) {
        heirarchy.specialties.byId[currentSpecialty] = {
          id: currentSpecialty,
          name: currentSpecialtyName,
          subspecialties: [],
        };
        heirarchy.specialties.allIds.push(currentSpecialty);
      }
      if (
        heirarchy.streams.byId[currentStream] &&
        heirarchy.streams.byId[currentStream].specialties.indexOf(currentSpecialty) === -1
      ) {
        heirarchy.streams.byId[currentStream].specialties.push(currentSpecialty);
      }
    }

    if (currentSubspecialty) {
      if (!heirarchy.subspecialties.byId[currentSubspecialty]) {
        heirarchy.subspecialties.byId[currentSubspecialty] = {
          id: currentSubspecialty,
          name: currentSubspecialtyName,
        };
        heirarchy.subspecialties.allIds.push(currentSubspecialty);
      }
      if (
        heirarchy.specialties.byId[currentSpecialty] &&
        heirarchy.specialties.byId[currentSpecialty].subspecialties.indexOf(currentSubspecialty) ===
          -1
      ) {
        heirarchy.specialties.byId[currentSpecialty].subspecialties.push(currentSubspecialty);
      }
    }
  }

  fs.writeFileSync('./out/streams.json', JSON.stringify(heirarchy), 'utf-8');
}

main();
