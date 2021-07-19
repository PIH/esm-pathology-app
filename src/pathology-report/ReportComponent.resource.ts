import { openmrsFetch } from '@openmrs/esm-framework';

export interface EncounterResult {
  uuid: string;
  encounterDatetime: Date;
}

export async function getEncounter(encounterUUID) {
  const searchEncounters = await openmrsFetch(`/ws/rest/v1/encounter/${encounterUUID}`);
  // const data = await searchPatientEncounters.json();
  // console.log("------------------" + data);
  return searchEncounters;
}

export async function getPatientEncounters(patientUuid): Promise<Array<EncounterResult>> {
  const searchPatientEncounters = await openmrsFetch(`/ws/rest/v1/encounter?patient=${patientUuid}`);
  const fullPatientEncounterData = searchPatientEncounters.data.results
    .map(async (searchEnc) => await openmrsFetch(`/ws/rest/v1/encounter/${searchEnc.uuid}`))
    .map((enc) => enc.data);
  // const data = await searchPatientEncounters.json();
  // console.log("------------------" + data);
  return fullPatientEncounterData;
}

// export async function getPatients({location}){
//     const searchPatientsResults = await openmrsFetch('/ws/rest/v1/patient?q=c604dabc-2700-102b-80cb-0017a47871b2',{
//         method: 'GET',
//     });
//     const data = await searchResults.json();
//     console.log("------------------" + data);
//     return searchPatientsResults;
// }
