import { openmrsFetch } from '@openmrs/esm-framework';

const encounterTypeUuid = '4d911f5c-26fe-102b-80cb-0017a47871b2';
const formName = 'CURRENT PROGRAMME ADULTE VIH - RENDEZ-VOUS - Rwanda 2.1';
const sampleStatusUuid = '3ce163d8-26fe-102b-80cb-0017a47871b2';
const referralStatusUuuid = '3cd93302-26fe-102b-80cb-0017a47871b2';
const sampleDropOffUuid = '13662f27-9be5-4595-8bab-07b0e859d9f4';
const phoneNumberAttrUuid = 'd6bcc287-4576-4264-961b-6bf1c08fbf68';
const healthCenterAttrTypeUuid = '8d87236c-c2cc-11de-8d13-0010c6dffd0f';
const rwinkwavuHospitalUuid = '38c4b94b-97a6-4f2c-bca6-c28a37cf60ed';
const rwinkwavuHospitalName = 'Rwinkwavu Hospital';
const rwinkwavuHealthcenterName = 'Rwinkwavu Health Center';

export interface EncounterResult {
  patientName: { familyName: string; familyName2: string; givenName: string };
  patientPhoneNumber: { value: string };
  patientUuid: string;
  uuid: string;
  encounterDatetime: Date;
  sampleStatusObs: { value: { display: string } };
  referralStatusObs: { value: { display: string } };
  sampleDropoffObs: { value: { display: string } };
}
export interface iPatient {
  uuid: string;
}
export interface iConcept {
  uuid: string;
  name: string;
}

export async function getPatientEncounters(patientUuid): Promise<Array<EncounterResult>> {
  const searchPatientEncounters = await openmrsFetch(
    `/ws/rest/v1/encounter?encounterType=${encounterTypeUuid}&patient=${patientUuid}`,
  );
  const fullPatientEncounterData = searchPatientEncounters.data.results.map(async (searchEnc) => {
    const enc = await openmrsFetch(`/ws/rest/v1/encounter/${searchEnc.uuid}?v=full`);
    const searchPatient = await openmrsFetch(`/ws/rest/v1/patient/${patientUuid}?v=full`);

    const retrievedObject = {
      patientName: searchPatient.data.person.names[0],
      patientPhoneNumber: searchPatient.data.person.attributes.filter(
        (attribute) => attribute.attributeType.uuid == phoneNumberAttrUuid,
      )[0],
      patientHealthCenter: searchPatient.data.person.attributes.filter(
        (attribute) => attribute.attributeType.uuid == healthCenterAttrTypeUuid,
      )[0],
      patientUuid: searchPatient.data.uuid,
      encUuid: enc.data.uuid,
      encounterDatetime: enc.data.encounterDatetime,
      sampleStatusObs: enc.data.obs.filter((obs) => obs.concept.uuid === sampleStatusUuid)[0],
      referralStatusObs: enc.data.obs.filter((obs) => obs.concept.uuid === referralStatusUuuid)[0],
      sampleDropoffObs: enc.data.obs.filter((obs) => obs.concept.uuid === sampleDropOffUuid)[0],
    };

    return retrievedObject;
  });
  return Promise.all(fullPatientEncounterData);
}

export async function getConcept(conceptUuid) {
  const concept = await openmrsFetch(`/ws/rest/v1/concept/${conceptUuid}?v=full`);
  return concept.data.answers;
}

export async function getLocation(locationName) {
  const location = await openmrsFetch(`/ws/rest/v1/location?q=${locationName}&v=default`);

  return location.data.results;
}

export async function getPatient(patientUuid): Promise<iPatient> {
  const searchPatient = await openmrsFetch(`/ws/rest/v1/patient/c604dabc-2700-102b-80cb-0017a47871b2?v=full`);
  return searchPatient.data;
}
