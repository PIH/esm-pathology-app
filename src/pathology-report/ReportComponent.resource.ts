import { openmrsFetch } from '@openmrs/esm-framework';

export interface EncounterResult {
  uuid: string;
  encounterDatetime: Date;
}

export async function getPatientEncounters(patientUuid): Promise<Array<EncounterResult>> {
  const searchPatientEncounters = await openmrsFetch(
    `/ws/rest/v1/encounter?patient=c604dabc-2700-102b-80cb-0017a47871b2`,
  );
  const fullPatientEncounterData = searchPatientEncounters.data.results.map(async (searchEnc) => {
    const enc = await openmrsFetch(`/ws/rest/v1/encounter/${searchEnc.uuid}`);
    return enc.data;
  });
  // const data = await searchPatientEncounters.json();
  // console.log("------------------" + data);
  return Promise.all(fullPatientEncounterData);
}

// export async function getPatients({location}){
//     const searchPatientsResults = await openmrsFetch('/ws/rest/v1/patient?q=c604dabc-2700-102b-80cb-0017a47871b2',{
//         method: 'GET',
//     });
//     const data = await searchResults.json();
//     console.log("------------------" + data);
//     return searchPatientsResults;
// }
