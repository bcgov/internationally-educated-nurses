import fs from 'fs';
import csv from 'csv-parser';
import csvWriter from 'csv-writer';

import { booleanToYesNo, getSubSpecialtyById, splitLhasByHa } from '@ehpr/common';

export const formExportColumnHeaders = [
  { id: 'id', title: 'Id' },

  // Primary Information
  { id: 'firstName', title: 'First Name' },
  { id: 'lastName', title: 'Last Name' },
  { id: 'postalCode', title: 'Postal Code' },

  // Contact Information
  { id: 'primaryPhone', title: 'Primary Phone' },
  { id: 'primaryPhoneExt', title: 'Primary Phone Ext' },
  { id: 'secondaryPhone', title: 'Secondary Phone' },
  { id: 'secondaryPhoneExt', title: 'Secondary Phone Ext' },
  { id: 'email', title: 'Email' },

  // Credential Information
  { id: 'stream', title: 'Stream' },
  { id: 'specialty', title: 'Specialty' },
  { id: 'subspecialties', title: 'Subspecialties' },
  { id: 'allSpecialties', title: 'All Specialties' },
  { id: 'registrationStatus', title: 'Registration Status' },
  { id: 'registrationNumber', title: 'Registration Number' },
  { id: 'currentEmployment', title: 'Current Employment' },
  { id: 'healthAuthorities', title: 'Employment Health Authorities' },
  { id: 'employmentCircumstance', title: 'Employment Circumstance' },
  { id: 'nonClinicalJobTitle', title: 'Non-Clinical Job Title' },

  // Preferences
  { id: 'deployAnywhere', title: 'Deploy Anywhere' },
  { id: 'VancouverCoastal', title: 'Vancouver/Coastal' },
  { id: 'FraserRegion', title: 'Fraser Region' },
  { id: 'VancouverIslandRegion', title: 'Vancouver Island Region' },
  { id: 'InteriorRegion', title: 'Interior Region' },
  { id: 'NorthernRegion', title: 'Northern Region' },
  { id: 'placementOptions', title: 'Placement Options' },
  { id: 'hasImmunizationTraining', title: 'Has Immunization Training' },
  { id: 'deploymentDuration', title: 'Deployment Duration' },
];

const flattenAndTransformFormData = submissions => {
  const flatNormalizedSubmissions = [];
  submissions
    .map(({ id, payload }) => ({
      id,
      payloadObject: JSON.parse(payload),
    }))
    .forEach(({ id, payloadObject }) => {
      const {
        personalInformation,
        contactInformation,
        credentialInformation,
        preferencesInformation,
      } = payloadObject;

      const deploymentLocations = preferencesInformation.deploymentLocations;
      const healthAuthorities = splitLhasByHa(deploymentLocations);

      const payloadData = {
        id,

        firstName: personalInformation.firstName,
        lastName: personalInformation.lastName,
        postalCode: personalInformation.postalCode,

        primaryPhone: contactInformation.primaryPhone,
        primaryPhoneExt: contactInformation.primaryPhoneExt,
        secondaryPhone: contactInformation.secondaryPhone,
        secondaryPhoneExt: contactInformation.secondaryPhoneExt,
        email: contactInformation.email,

        stream: credentialInformation.stream,
        registrationStatus: credentialInformation.registrationStatus,
        registrationNumber: credentialInformation.registrationNumber,
        currentEmployment: credentialInformation.currentEmployment,
        specialty: '',
        subspecialties: '',
        healthAuthorities: credentialInformation.healthAuthorities,
        employmentCircumstance: credentialInformation.employmentCircumstance,
        nonClinicalJobTitle: credentialInformation.nonClinicalJobTitle,

        deployAnywhere: booleanToYesNo(preferencesInformation.deployAnywhere),
        VancouverRegion: healthAuthorities.VancouverRegion.lhas.join(', '),
        FraserRegion: healthAuthorities.FraserRegion.lhas.join(', '),
        VancouverIslandRegion: healthAuthorities.VancouverIslandRegion.lhas.join(', '),
        InteriorRegion: healthAuthorities.InteriorRegion.lhas.join(', '),
        NorthernRegion: healthAuthorities.NorthernRegion.lhas.join(', '),
        deploymentLocations: preferencesInformation.deploymentLocations,
        placementOptions: preferencesInformation.placementOptions,
        hasImmunizationTraining: booleanToYesNo(preferencesInformation.hasImmunizationTraining),
        deploymentDuration: preferencesInformation.deploymentDuration,
      };

      if (credentialInformation.specialties.length === 0) {
        flatNormalizedSubmissions.push({ ...payloadData });
      } else {
        credentialInformation.specialties.forEach(specialty => {
          flatNormalizedSubmissions.push({
            ...payloadData,
            specialty: specialty.id,
            subspecialties: specialty.subspecialties
              ?.map(subspecialty => getSubSpecialtyById(subspecialty.id).name)
              .join(','),
          });
        });
      }
    });

  return flatNormalizedSubmissions;
};

function readData(fileName) {
  return new Promise((resolve, reject) => {
    var rows = [];
    fs.createReadStream(fileName, { encoding: 'utf-8' })
      .pipe(
        csv([
          'id',
          'created_date',
          'updated_date',
          'payload',
          'confirmation_id',
          'ches_id',
          'version',
        ]),
      )
      .on('data', data => rows.push(data))
      .on('end', () => {
        console.log('CSV file successfully loaded');
        rows.shift();
        resolve(rows);
      })
      .on('error', reject);
  });
}

async function main() {
  const rows = await readData('./in/submission_export.csv');
  const createCsvWriter = csvWriter.createObjectCsvWriter;
  const writer = createCsvWriter({
    path: './out/submission_export.csv',
    header: formExportColumnHeaders,
    encoding: 'utf-8',
  });
  const flatSubmissions = flattenAndTransformFormData(rows);
  await writer.writeRecords(flatSubmissions);
  console.log('...Done transforming export data');
}

main();
