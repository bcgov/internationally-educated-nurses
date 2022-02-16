# Scripts

This package is meant to hold simple and smaller one-off scripts for various tasks

## Structure

Our scripts up to this point have been used to transform a data source into another format.
The package structure supports this workflow with an input folder: `in` and an output folder: `out`.

```
📦scripts
 ┣ 📂in <- Input data files
 ┣ 📂out <- Output directory
 ┣ 📂src <- Scripts go here
 ┣ 📜README.md
 ┗ 📜package.json
```

## Scripts

### Export

Reads a database extract and exports in a usable Excel-friendly format

#### How-to

- Use your favourite Postgres helper tool to export the `submission` table to CSV
- Place the exported data into the `in` folder named as `submission_export.csv`
- Run the script with `yarn transform-submission_export` from the scripts directory or with `yarn workspace @ien/scripts transform-submission_export` from the root directory
- The transformed excel-friendly data will be output to the `out` folder

#### Locations

Reads a CSV file and produces a normalized JSON structure for easy parsing.
Manages the relationships between Health Authorities, Health Service Delivery Areas and Local Health Areas.

##### How-To

- Grab the updated specialties data CSV from the team drive
- Place the input data file in the `in` directory, make sure the file is named `streams.csv`
- Run the script with `yarn transform-streams` from the scripts directory or with `yarn workspace @ien/scripts transform-streams` from the root directory
- The transformed data will be output to the `out` folder

#### Specialization

Reads a CSV file and produces a normalized JSON structure for easy parsing.
Manages the relationships between Streams, Specialties and Subspecialties.

#### How-to

- Grab the updated location data CSV from the team drive
- Place the input data file in the `in` directory, make sure the file is named `locations.csv`
- Run the script with `yarn transform-locations` from the scripts directory or with `yarn workspace @ien/scripts transform-locations` from the root directory
- The transformed data will be output to the `out` folder
