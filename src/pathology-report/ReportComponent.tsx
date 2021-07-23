import React from 'react';
import styles from './ReportComponent.css';
import { TableRow } from './TableRow';
import { getPatientEncounters, iPatient, getConcept, getLocation } from './ReportComponent.resource';

const encounterTypeUuid = '4d911f5c-26fe-102b-80cb-0017a47871b2';
const formName = 'CURRENT PROGRAMME ADULTE VIH - RENDEZ-VOUS - Rwanda 2.1';
const sampleStatusUuid = '3ce163d8-26fe-102b-80cb-0017a47871b2';
const referralStatusUuuid = '3cd93302-26fe-102b-80cb-0017a47871b2';
const sampleDropOffUuid = '13662f27-9be5-4595-8bab-07b0e859d9f4';
const phoneNumberAttrUuid = 'd6bcc287-4576-4264-961b-6bf1c08fbf68';
const rwinkwavuHospitalName = 'Rwinkwavu Hospital';
const rwinkwavuHealthcenterName = 'Rwinkwavu Health Center';

const ReportComponent = () => {
  const [encountersList, setEncountersList] = React.useState([]);
  const [sendingHospital, setSendingHospital] = React.useState();
  const [listOfHospitals, setListOfHospitals] = React.useState([]);
  const [sampleStatusResults, setSampleStatusResults] = React.useState([]);
  const [referralStatusResults, setReferralStatusResults] = React.useState([]);
  const [sampleStatus, setSampleStatus] = React.useState();
  const [referralStatus, setReferralStatus] = React.useState();

  React.useEffect(() => {
    getPatientEncounters('c604dabc-2700-102b-80cb-0017a47871b2').then(setEncountersList);
    getLocation(rwinkwavuHealthcenterName).then(setListOfHospitals);
    getConcept(sampleStatusUuid).then(setSampleStatusResults);
    getConcept(referralStatusUuuid).then(setReferralStatusResults);
  }, []);

  const handleSampleStatus = (value) => {
    setSampleStatus(value);
  };
  const handleReferralStatus = (value) => {
    setReferralStatus(value);
  };
  const handleSendingHospital = (value) => {
    setSendingHospital(value);
  };

  const filteredEncList = encountersList
    .filter(
      (encList) => !sampleStatus || (encList.sampleStatusObs && encList.sampleStatusObs.value.uuid == sampleStatus),
    )
    .filter(
      (encList) =>
        !referralStatus || (encList.referralStatusObs && encList.referralStatusObs.value.uuid == referralStatus),
    )
    .filter(
      (encList) =>
        !sendingHospital || (encList.patientHealthCenter && encList.patientHealthCenter.value.uuid == sendingHospital),
    );

  return (
    <div>
      <div></div>
      <div>
        {console.log(filteredEncList)}

        <select value={sendingHospital} onChange={(e) => handleSendingHospital(e.target.value)}>
          <option value=""></option>
          {listOfHospitals.map((loc) => (
            <option value={loc.uuid}>{loc.name}</option>
          ))}
        </select>
        <select value={sampleStatus} onChange={(e) => handleSampleStatus(e.target.value)}>
          <option value=""></option>
          {sampleStatusResults.map((ans) => (
            <option value={ans.uuid}>{ans.display}</option>
          ))}
        </select>
        <select value={referralStatus} onChange={(e) => handleReferralStatus(e.target.value)}>
          <option value=""></option>
          {referralStatusResults.map((ans) => (
            <option value={ans.uuid}>{ans.display}</option>
          ))}
        </select>
      </div>
      <div>
        <table className={styles.table}>
          <thead>
            <tr className={`omrs-bold ${styles.tr}`}>
              <td>Link to patient</td>
              <td>Patient name</td>
              <td>pathology request</td>
              <td>Phone number</td>
              <td>Sample status</td>
              <td>Date of Request</td>
              <td>Referral status</td>
              <td>Sample drop off?</td>
            </tr>
          </thead>
          <tbody>
            {filteredEncList.map((enc) => (
              <tr className={styles.tr} key={enc.uuid}>
                <TableRow encounterInfo={enc} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportComponent;
