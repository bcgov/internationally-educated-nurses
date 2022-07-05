export enum Organizations {
  MINISTRY_OF_HEALTH = 'Ministry of Health',
  HEALTH_MATCH = 'Health Match BC',
  FIRST_NATIONS_HEALTH_AUTHORITY = 'First Nations Health Authority',
  PROVIDENCE_HEALTH_CARE = 'Providence Health Care',
  PROVINCIAL_HEALTH_SERVICES_AUTHORITY = 'Provincial Health Services Authority',
  FRASER_HEALTH = 'Fraser Health Authority',
  INTERIOR_HEALTH = 'Interior Health Authority',
  ISLAND_HEALTH = 'Vancouver Island Health Authority',
  NORTHERN_HEALTH = 'Northern Health Authority',
  VANCOUVER_COASTAL_HEALTH = 'Vancouver Coastal Health Authority',
}

export const EmailDomains = {
  'gov.bc.ca': Organizations.MINISTRY_OF_HEALTH,
  'healthmatchbc.org': Organizations.HEALTH_MATCH,
  'heabc.bc.ca': Organizations.HEALTH_MATCH,
  'fnha.ca': Organizations.FIRST_NATIONS_HEALTH_AUTHORITY,
  'providencehealth.bc.ca': Organizations.PROVIDENCE_HEALTH_CARE,
  'phsa.ca': Organizations.PROVINCIAL_HEALTH_SERVICES_AUTHORITY,
  'fraserhealth.org': Organizations.FRASER_HEALTH,
  'interiorhealth.ca': Organizations.INTERIOR_HEALTH,
  'islandhealth.ca': Organizations.ISLAND_HEALTH,
  'northernhealth.ca': Organizations.NORTHERN_HEALTH,
  'vch.ca': Organizations.VANCOUVER_COASTAL_HEALTH,
};
