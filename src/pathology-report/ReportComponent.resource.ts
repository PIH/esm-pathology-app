import { openmrsFetch } from '@openmrs/esm-framework';
import {ENCOUNTERTYPEUUID,PHONENUMBERATTRUUID,HEALTHCENTERATTRTYPEUUID,SAMPLESTATUSUUID,REFERRALSTATUSUUID,SAMPLEDROPOFFUUID,RWINKWAVUHOSPITALUUID,YESCONCEPTUUID} 
from '../constants.js'


export interface EncounterResult {
  family_name: string;
  given_name: string;
  middle__name:string;
  patientPhoneNumber: { value: string };
  patientHealthCenter: string;
  patientUuid: string;
  uuid: string;
  encounterId: number;
  personId: number;
  encounterDatetime: Date;
  sampleStatusObs: { value: { display: string } };
  referralStatusObs: { value: { display: string } };
  sampleDropoffObs: { value: { display: string } };
}
export interface Patient {
  uuid: string;
}
export interface Concept {
  uuid: string;
  name: string;
}
export interface Obs {
  patientUuid: string;
  obsDateTime: string;
  sampleDropoffObsUuid: string;
  referralStatusObsUuid: string;
  sampleStatusObsUuid: string;
  location: string;
  encounterUuid: string;
  valueCodedName: string;
  voided: boolean; 
}

// export async function getPatientEncounters(patientUuid): Promise<Array<EncounterResult>> {
//   const searchPatientEncounters = await openmrsFetch(
//     `/ws/rest/v1/encounter?encounterType=${ENCOUNTERTYPEUUID}&patient=${patientUuid}`,
//   );
//   const fullPatientEncounterData = searchPatientEncounters.data.results.map(async (searchEnc) => {
//     const enc = await openmrsFetch(`/ws/rest/v1/encounter/${searchEnc.uuid}?v=full`);
//     const searchPatient = await openmrsFetch(`/ws/rest/v1/patient/${patientUuid}?v=full`);
//     const retrievedObject = {
//       patientName: searchPatient.data.person.names[0],
//       patientPhoneNumber: searchPatient.data.person.attributes.filter(
//         (attribute) => attribute.attributeType.uuid == PHONENUMBERATTRUUID,
//       )[0],
//       patientHealthCenter: searchPatient.data.person.attributes.filter(
//         (attribute) => attribute.attributeType.uuid == HEALTHCENTERATTRTYPEUUID,
//       )[0],
//       patientUuid: searchPatient.data.uuid,
//       encUuid: enc.data.uuid,
//       encounterDatetime: enc.data.encounterDatetime,
//       sampleStatusObs: enc.data.obs.filter((obs) => obs.concept.uuid === SAMPLESTATUSUUID)[0],
//       referralStatusObs: enc.data.obs.filter((obs) => obs.concept.uuid === REFERRALSTATUSUUID)[0],
//       sampleDropoffObs: enc.data.obs.filter((obs) => obs.concept.uuid === SAMPLEDROPOFFUUID)[0],
//     };

//     return retrievedObject;
//   });
//   return Promise.all(fullPatientEncounterData);
// }

export async function getUserLocation(healthCenterAttrTypeUUID){
  const session = await openmrsFetch(`/ws/rest/v1/session`);
  const personUuid=session.data.user.person.uuid;
  const person = await openmrsFetch(`/ws/rest/v1/person/${personUuid}/attribute`);
  const hcPersonAttribute = person.data.results.filter((attr) => attr.attributeType.uuid === healthCenterAttrTypeUUID); 
  return hcPersonAttribute[0] ? hcPersonAttribute[0].value.uuid : null;
}

export async function getConceptAnswers(conceptUuid) {
  const concept = await openmrsFetch(`/ws/rest/v1/concept/${conceptUuid}?v=full`);
  return concept.data.answers;
}

export async function getLocations() {
 
  const location = await openmrsFetch(`/ws/rest/v1/location`);

  return location.data.results;
}

// export async function getPatient(patientUuid): Promise<Patient> {
//   const searchPatient = await openmrsFetch(`/ws/rest/v1/patient/c604dabc-2700-102b-80cb-0017a47871b2?v=full`);
//   return searchPatient.data;
// }

export async function getEncounters(healthCenterAttrTypeUUID): Promise<Array<EncounterResult>>{
  const userLocationUUID = await getUserLocation(healthCenterAttrTypeUUID);
  
  let searchEncounter=null;
  if(userLocationUUID){
     searchEncounter = await openmrsFetch(`/ws/rest/v1/reportingrest/reportdata/996cf192-ff54-11eb-a63a-080027ce9ca0?location=${userLocationUUID}`);
  }
  else{
     searchEncounter = await openmrsFetch(`/ws/rest/v1/reportingrest/reportdata/996cf192-ff54-11eb-a63a-080027ce9ca0`);

  }
  return searchEncounter.data.dataSets[0].rows;
}

export async function postSampleDropoffObs(obsObject: Obs, sampleDropOffconceptUUID,healthCenterAttrTypeUUID,yesConceptName){
  const ObsObjectTocreate = 
  {
    'person': obsObject.patientUuid,
    'obsDatetime': (new Date()).toISOString(),
    'concept': sampleDropOffconceptUUID,
    'location': await getUserLocation(healthCenterAttrTypeUUID),
    'encounter': obsObject.encounterUuid,
    'value': yesConceptName,
    'voided': false
  }
  
  const response = await openmrsFetch('/ws/rest/v1/obs',{
  method: 'POST',
  headers:{ 
    'content-type': 'application/json'
    },
  body: ObsObjectTocreate
  
  })
  return response;
}

export async function voidSampleDropoff(sampleDropoffObsUuid: string){
  const ObsObjectTocreate = 
  {
    'voided': true
  }
  
  const response = await openmrsFetch(`/ws/rest/v1/obs/${sampleDropoffObsUuid}`,{
  method: 'POST',
  headers:{ 
    'content-type': 'application/json'
    },
  body: ObsObjectTocreate
  
  })

  return response;
}

export async function postSampleStatusChangeObs(AnsUuid,obsObject: Obs,sampleStatusConceptUUID,healthCenterAttrTypeUUID){
  const ObsObjectTocreate = 
  {
    'person': obsObject.patientUuid,
    'obsDatetime': (new Date()).toISOString(),
    'concept': sampleStatusConceptUUID,
    'location': await getUserLocation(healthCenterAttrTypeUUID),
    'encounter': obsObject.encounterUuid,
    'value': AnsUuid,
    'voided': false
  }
  
  const response = await openmrsFetch('/ws/rest/v1/obs',{
  method: 'POST',
  headers:{ 
    'content-type': 'application/json'
    },
  body: ObsObjectTocreate
  
  })

  return response;
}



export async function updateSampleStatusChangeObs(targetValue,obsObject: Obs,sampleStatusConceptUUID,healthCenterAttrTypeUUID){
  const ObsObjectTocreate = 
  {
    'person': obsObject.patientUuid,
    'obsDatetime': (new Date()).toISOString(),
    'concept': sampleStatusConceptUUID,
    'location': await getUserLocation(healthCenterAttrTypeUUID),
    'encounter': obsObject.encounterUuid,
    'value': targetValue.uuid,
    'voided': targetValue ? false: true
  }
  
  const response = await openmrsFetch(`/ws/rest/v1/obs/${obsObject.sampleStatusObsUuid}`,{
  method: 'POST',
  headers:{ 
    'content-type': 'application/json'
    },
  body: ObsObjectTocreate
  
  })

  return response;
}

export async function postReferralStatusChangeObs(targetValue, obsObject: Obs, referralStatusConceptUUID,healthCenterAttrTypeUUID){
  const ObsObjectTocreate = 
  {
    'person': obsObject.patientUuid,
    'obsDatetime': (new Date()).toISOString(),
    'concept': referralStatusConceptUUID,
    'location': await getUserLocation(healthCenterAttrTypeUUID),
    'encounter': obsObject.encounterUuid,
    'value': targetValue.uuid,
    'voided': false
  }
  
  const response = await openmrsFetch('/ws/rest/v1/obs',{
  method: 'POST',
  headers:{ 
    'content-type': 'application/json'
    },
  body: ObsObjectTocreate
  
  })

  return response;
}



export async function updateReferralStatusChangeObs(targetValue,obsObject: Obs, referralStatusConceptUUID,healthCenterAttrTypeUUID){
  const ObsObjectTocreate = 
  {
    'person': obsObject.patientUuid,
    'obsDatetime': (new Date()).toISOString(),
    'concept': referralStatusConceptUUID,
    'location': await getUserLocation(healthCenterAttrTypeUUID),
    'encounter': obsObject.encounterUuid,
    'value': targetValue.uuid,
    'voided': targetValue ? false: true
  }
  
  const response = await openmrsFetch(`/ws/rest/v1/obs/${obsObject.referralStatusObsUuid}`,{
  method: 'POST',
  headers:{ 
    'content-type': 'application/json'
    },
  body: ObsObjectTocreate
  
  })

  return response;
}