import { openmrsFetch } from "@openmrs/esm-framework";
import cloneDeep from "lodash-es/cloneDeep";


export interface EncounterResult {
  family_name: string;
  given_name: string;
  middle_name: string;
  patientPhoneNumber: { value: string };
  patientHealthCenter: string;
  patientUuid: string;
  encounterUuid: string;
  encounterId: number;
  personId: number;
  encounterDatetime: Date;
  sampleStatusObs: string;
  referralStatusObs: string;
  sampleDropoffObs: string;
  resultsEncounterId: string;
  resultsEncounterUuid: string;
  resultsEncounter: [];
  approvedBy: string;
  approvalObsUuid: string;
}
export interface Patient {
  uuid: string;
}
export interface Concept {
  uuid: string;
  name: string;
  display: string;
}
// export interface Encounter {

// }
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
  resultsEncounterUuid: string;
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

export async function getUserLocation(healthCenterAttrTypeUUID) {
  const session = await openmrsFetch(`/ws/rest/v1/session`);
  const personUuid = session.data.user.person.uuid;
  const person = await openmrsFetch(
    `/ws/rest/v1/person/${personUuid}/attribute`
  );
  const hcPersonAttribute = person.data.results.filter(
    (attr) => attr.attributeType.uuid === healthCenterAttrTypeUUID
  );
  return hcPersonAttribute[0] && hcPersonAttribute.value.uuid;
}

export async function getConceptAnswers(conceptUuid) {
  const concept = await openmrsFetch(
    `/ws/rest/v1/concept/${conceptUuid}?v=full`
  );
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

export async function getEncounters(
  healthCenterAttrTypeUUID: string,
  pathologyFullAllowedLocationUUID: string
): Promise<Array<EncounterResult>> {
  const userLocationUUID = await getUserLocation(healthCenterAttrTypeUUID);

  let searchEncounter = null;
  if (
    userLocationUUID &&
    userLocationUUID != pathologyFullAllowedLocationUUID
  ) {
    searchEncounter = await openmrsFetch(
      `/ws/rest/v1/reportingrest/reportdata/996cf192-ff54-11eb-a63a-080027ce9ca0?location=${userLocationUUID}`
    );
  } else {
    searchEncounter = await openmrsFetch(
      `/ws/rest/v1/reportingrest/reportdata/996cf192-ff54-11eb-a63a-080027ce9ca0`
    );
  }
// return searchEncounter.data.dataSets[0].rows;
  // let EncListClone = searchEncounter;
  const EncListClone = searchEncounter.data.dataSets[0].rows.map(async (encObject)=>{
    if(encObject.resultsEncounterUuid){
      const encIndex = searchEncounter.data.dataSets[0].rows.findIndex(
         (enc) => enc.encounterUuid == encObject.encounterUuid
      );
      const resultsEnc =await getEncounter(encObject.resultsEncounterUuid);
      encObject.resultsEncounter = resultsEnc;
      
    }
    return encObject; 
  });
  
  return Promise.all(EncListClone);
}

export async function postSampleDropoffObs(
  obsObject: Obs,
  sampleDropOffconceptUUID: string,
  healthCenterAttrTypeUUID: string,
  yesConceptName: string
) {
  const ObsObjectTocreate = {
    person: obsObject.patientUuid,
    obsDatetime: new Date().toISOString(),
    concept: sampleDropOffconceptUUID,
    location: await getUserLocation(healthCenterAttrTypeUUID),
    encounter: obsObject.encounterUuid,
    value: yesConceptName,
    voided: false,
  };

  const response = await openmrsFetch("/ws/rest/v1/obs", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: ObsObjectTocreate,
  });
  return response;
}

export async function voidSampleDropoff(sampleDropoffObsUuid: string) {
  const ObsObjectTocreate = {
    voided: true,
  };

  const response = await openmrsFetch(
    `/ws/rest/v1/obs/${sampleDropoffObsUuid}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: ObsObjectTocreate,
    }
  );

  return response;
}

export async function postSampleStatusChangeObs(
  newStatusUuid: string,
  obs: Obs,
  sampleStatusConceptUUID: string,
  healthCenterAttrTypeUUID: string
) {
  const postBody = {
    person: obs.patientUuid,
    obsDatetime: new Date().toISOString(),
    concept: sampleStatusConceptUUID,
    location: await getUserLocation(healthCenterAttrTypeUUID),
    encounter: obs.encounterUuid,
    value: newStatusUuid,
    voided: false,
  };

  const response = await openmrsFetch("/ws/rest/v1/obs", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: postBody,
  });

  return response;
}

export async function updateSampleStatusChangeObs(
  newStatus: null | { uuid: string; display: string },
  obsObject: Obs,
  sampleStatusConceptUUID: string,
  healthCenterAttrTypeUUID: string
) {
  const ObsObjectTocreate = {
    person: obsObject.patientUuid,
    obsDatetime: new Date().toISOString(),
    concept: sampleStatusConceptUUID,
    location: await getUserLocation(healthCenterAttrTypeUUID),
    encounter: obsObject.encounterUuid,
    value: newStatus.uuid,
    voided: newStatus ? false : true,
  };

  const response = await openmrsFetch(
    `/ws/rest/v1/obs/${obsObject.sampleStatusObsUuid}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: ObsObjectTocreate,
    }
  );

  return response;
}

export async function postReferralStatusChangeObs(
  targetValueUuid: string,
  obsObject: Obs,
  referralStatusConceptUUID: string,
  healthCenterAttrTypeUUID: string
) {
  const ObsObjectTocreate = {
    person: obsObject.patientUuid,
    obsDatetime: new Date().toISOString(),
    concept: referralStatusConceptUUID,
    location: await getUserLocation(healthCenterAttrTypeUUID),
    encounter: obsObject.encounterUuid,
    value: targetValueUuid,
    voided: false,
  };

  const response = await openmrsFetch("/ws/rest/v1/obs", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: ObsObjectTocreate,
  });

  return response;
}

export async function updateReferralStatusChangeObs(
  targetValue,
  obsObject: Obs,
  referralStatusConceptUUID,
  healthCenterAttrTypeUUID
) {
  const ObsObjectTocreate = {
    person: obsObject.patientUuid,
    obsDatetime: new Date().toISOString(),
    concept: referralStatusConceptUUID,
    location: await getUserLocation(healthCenterAttrTypeUUID),
    encounter: obsObject.encounterUuid,
    value: targetValue.uuid,
    voided: targetValue ? false : true,
  };

  const response = await openmrsFetch(
    `/ws/rest/v1/obs/${obsObject.referralStatusObsUuid}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: ObsObjectTocreate,
    }
  );

  return response;
}

// export async function postApproval(
//   obsObject: Obs,
//   pathologyResultsApprovedconceptUUID: string,
//   healthCenterAttrTypeUUID: string,
//   yesConceptUUID: string
// ) {
//   const ObsObjectTocreate = {
//     person: obsObject.patientUuid,
//     obsDatetime: new Date().toISOString(),
//     concept: pathologyResultsApprovedconceptUUID,
//     location: await getUserLocation(healthCenterAttrTypeUUID),
//     encounter: obsObject.resultsEncounterUuid,
//     value: yesConceptUUID,
//     voided: false,
//   };

//   const response = await openmrsFetch("/ws/rest/v1/obs?v=full", {
//     method: "POST",
//     headers: {
//       "content-type": "application/json",
//     },
//     body: ObsObjectTocreate,
//   });
//   return response;
// }
// export async function voidApprovalObs(approvalObsUuid: string) {
//   const ObsObjectTocreate = {
//     voided: true,
//   };

//   const response = await openmrsFetch(
//     `/ws/rest/v1/obs/${approvalObsUuid}`,
//     {
//       method: "POST",
//       headers: {
//         "content-type": "application/json",
//       },
//       body: ObsObjectTocreate,
//     }
//   );
//   console.log("voidedddddddddddddd");

//   return response;
// }

export async function getUser(userUuid: string) {
  const user = await openmrsFetch(`/ws/rest/v1/user/${userUuid}`);

  return user.data;
}
export async function getEncounter(encounterUuid) {
  const encResult = await openmrsFetch(`/ws/rest/v1/encounter/${encounterUuid}?v=full`);
  
  return encResult.data;
}