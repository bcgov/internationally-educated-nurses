import data from '../data/applicant_stream_data.json';

export type Stream = { id: string; name: string; specialties: string[] };
export type Specialty = { id: string; name: string; subspecialties: string[] };
export type Subspecialty = { id: string; name: string };

type ApplicantStreamData = {
  streams: {
    byId: Record<string, Stream>;
    allIds: string[];
  };
  specialties: {
    byId: Record<string, Specialty>;
    allIds: string[];
  };
  subspecialties: {
    byId: Record<string, Subspecialty>;
    allIds: string[];
  };
};

const applicantStreamData: ApplicantStreamData = data;

export type StreamId = keyof typeof applicantStreamData.streams.byId;
export type SpecialtyId = keyof typeof applicantStreamData.specialties.byId;
export type SubspecialtyId = keyof typeof applicantStreamData.subspecialties.byId;

export const streamsById = applicantStreamData.streams.byId;
export const specialtiesById = applicantStreamData.specialties.byId;
export const subspecialtiesById = applicantStreamData.subspecialties.byId;

const { streams, specialties, subspecialties } = applicantStreamData;

export const validStreamIds = streams.allIds;
export const validSpecialtyIds = specialties.allIds;
export const validSubspecialtyStreamIds = subspecialties.allIds;

export const getStreamById = (id: StreamId) => streams.byId[id];
export const getSpecialtyById = (id: SpecialtyId) => specialties.byId[id];
export const getSubSpecialtyById = (id: SubspecialtyId) => subspecialties.byId[id];

export const getStreams = () => Object.values(streams.byId);

export const getSpecialtiesByStreamId = (streamId: StreamId): Specialty[] => {
  const stream = getStreamById(streamId);
  return stream.specialties.map(specialtyId => getSpecialtyById(specialtyId));
};

export const getSubSpecialtiesBySpecialtyId = (specialtyId: SpecialtyId): Subspecialty[] | null => {
  const specialty = getSpecialtyById(specialtyId);
  if (!specialty) return null;
  return specialty.subspecialties.map(subspecialtyId => getSubSpecialtyById(subspecialtyId));
};
