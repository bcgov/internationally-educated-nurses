import data from '../data/location_data.json';

export type Ha = { id: string; name: string; hsdas: string[] };
export type Hsda = { id: string; name: string; lhas: string[] };
export type Lha = { id: string; name: string };

type LocationData = {
  has: {
    byId: Record<string, Ha>;
    allIds: string[];
  };
  hsdas: {
    byId: Record<string, Hsda>;
    allIds: string[];
  };
  lhas: {
    byId: Record<string, Lha>;
    allIds: string[];
  };
};

const locationData: LocationData = data;

export type HaId = keyof typeof locationData.has.byId;
export type HsdaId = keyof typeof locationData.hsdas.byId;
export type LhaId = keyof typeof locationData.lhas.byId;

const { has, hsdas, lhas } = locationData;

export const validHaIds = has.allIds;
export const validHsdaIds = hsdas.allIds;
export const validLhaIds = lhas.allIds;

export const getHaById = (id: HaId) => has.byId[id];
export const getHsdaById = (id: HsdaId) => hsdas.byId[id];
export const getLhaById = (id: LhaId) => lhas.byId[id];

export const getHas = () => Object.values(has.byId);

export const getHsdasByHaId = (haId: HaId): Hsda[] => {
  const ha = getHaById(haId);
  return ha.hsdas.map(hsdaId => getHsdaById(hsdaId));
};

export const getLhasByHsdaId = (hsdaId: HsdaId): Lha[] => {
  const hsda = getHsdaById(hsdaId);
  return hsda.lhas.map(LhaId => getLhaById(LhaId));
};

export const getLhasbyHaId = (haId: HaId): Lha[] => {
  const ha = getHaById(haId);
  const lhas: Lha[] = [];
  ha.hsdas.forEach(hsdaId => {
    const hsda = getHsdaById(hsdaId);
    lhas.push(...hsda.lhas.map(LhaId => getLhaById(LhaId)));
  });
  return lhas;
};

const getHsdabyLhaId = (lhaId: LhaId) => {
  const allHsdas: Hsda[] = Object.values(JSON.parse(JSON.stringify(hsdas.byId)));

  return allHsdas.find(hsda => hsda.lhas.includes(lhaId));
};

const getHaByHsdaId = (hsdaId: HsdaId) => {
  const allHas: Ha[] = Object.values(JSON.parse(JSON.stringify(has.byId)));

  return allHas.find(ha => ha.hsdas.includes(hsdaId));
};

const getHaByLhaId = (lhaId: LhaId) => {
  const hsda = getHsdabyLhaId(lhaId);
  if (!hsda) return;
  const ha = getHaByHsdaId(hsda.id);
  return ha;
};

type FullHsdaType = { id: string; name: string; lhas: Lha[] };
type FullHaType = { id: string; name: string; hsdas: FullHsdaType[] };

/**
 * Splits a list of Lhas into separate lists according to their HA
 *
 * @param lhas list of LHA ids
 * @returns Structure of HAs with LHAs assigned to them
 */
export const splitLhasByHa = (lhas: LhaId[]): Record<HaId, { ha: HaId; lhas: LhaId[] }> => {
  const healthAuthorities: Record<HaId, { ha: HaId; lhas: LhaId[] }> = {};
  validHaIds.forEach(haId => {
    healthAuthorities[haId] = { ha: haId, lhas: [] };
  });

  lhas.forEach(lha => {
    const ha = getHaByLhaId(lha);
    if (!ha) return;
    healthAuthorities[ha.id].lhas.push(lha);
  });

  return healthAuthorities;
};

/**
 * Takes a list of LHA ids and reconstructs the HSDAs and HAS as a single object
 *
 * @param lhaIds list of lha ids
 * @returns full object structure with Ha, Hsda, Lha relations
 */
export const rebuildHaStructure = (lhaIds: LhaId[]): Record<HaId, FullHaType> => {
  const selectedHsdas: Record<HsdaId, FullHsdaType> = {};

  lhaIds.forEach((lhaId: LhaId) => {
    const relatedHsda = getHsdabyLhaId(lhaId);
    const fullLha = getLhaById(lhaId);
    if (!relatedHsda) return;
    const selectedHsda = selectedHsdas[relatedHsda.id];

    if (!selectedHsda) {
      selectedHsdas[relatedHsda.id] = { ...relatedHsda, lhas: [fullLha] };
    } else {
      selectedHsda.lhas.push(fullLha);
    }
  });

  const selectedHas: Record<HaId, FullHaType> = {};

  Object.values(selectedHsdas).forEach(hsda => {
    const relatedHa = getHaByHsdaId(hsda.id);

    if (!relatedHa) return;
    const selectedHa = selectedHas[relatedHa.id];

    if (!selectedHa) {
      selectedHas[relatedHa.id] = { ...relatedHa, hsdas: [hsda] };
    } else {
      selectedHa.hsdas.push(hsda);
    }
  });

  return selectedHas;
};
