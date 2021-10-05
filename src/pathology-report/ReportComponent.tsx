import React from 'react';
import { useConfig } from "@openmrs/esm-framework";
import cloneDeep from "lodash-es/cloneDeep";
import DataTable, {Table,TableHead,TableRow,TableHeader,TableBody,TableCell} from 'carbon-components-react/es/components/DataTable';

import styles from './ReportComponent.css';
// import { TableRow } from './TableRow';
import {  getUserLocation, getConceptAnswers, getLocations,getEncounters,postSampleDropoffObs,
  voidSampleDropoff,postSampleStatusChangeObs,updateSampleStatusChangeObs,postReferralStatusChangeObs,
  updateReferralStatusChangeObs } from './ReportComponent.resource';



const ReportComponent = () => {
  const config = useConfig();
  const [userLocation,setUserLocation] = React.useState();
  const [encountersList, setEncountersList] = React.useState([]);
  const [sendingHospital, setSendingHospital] = React.useState("");
  const [listOfHospitals, setListOfHospitals] = React.useState([]);
  const [sampleStatusResults, setSampleStatusResults] = React.useState([]);
  const [referralStatusResults, setReferralStatusResults] = React.useState([]);
  const [sampleStatus, setSampleStatus] = React.useState("");
  const [referralStatus, setReferralStatus] = React.useState("");
  const [patientName, setPatientName] = React.useState("");
  const headers = [
    {
      key: 'patientNames',
      header: 'Patient name',
    },
    {
      key: 'pathologyRequest',
      header: 'pathology request',
    },
    {
      key: 'sendingHospital',
      header: 'Sending Hospital',
    },
    {
      key: 'phoneNumber',
      header: 'Phone number',
    },
    {
      key: 'sampleStatus',
      header: 'Sample status',
    },
    {
      key: 'dateOfRequest',
      header: 'Date of Request',
    },
    {
      key: 'referralStatus',
      header: 'Referral status',
    },
    {
      key: 'sampleDropOff',
      header: 'Sample drop off?',
    },
    {
      key: 'resultsEncounter',
      header: 'Results',
    },
    
  ];
  



  React.useEffect(() => {
    getUserLocation(config.healthCenterAttrTypeUUID).then(setUserLocation);
    getLocations().then(setListOfHospitals);
    getConceptAnswers(config.sampleStatusConceptUUID).then(setSampleStatusResults);
    getConceptAnswers(config.referralStatusConceptUUID).then(setReferralStatusResults);
    getEncounters(config.healthCenterAttrTypeUUID,config.pathologyFullAllowedLocationName).then(setEncountersList);
  }, []);


  const filteredEncList = encountersList
    .filter(
      (encList) => !sampleStatus || (encList.sampleStatusObs && encList.sampleStatusObs.toLowerCase()==sampleStatus.toLowerCase()),
    )
    .filter(
      (encList) =>
        !referralStatus || (encList.referralStatusObs && encList.referralStatusObs.toLowerCase() == referralStatus.toLowerCase()),
    )
    .filter(
      (encList) =>
        !sendingHospital || (encList.patientHealthCenter && encList.patientHealthCenter.toLowerCase() == sendingHospital.toLowerCase()),
    )
    .filter(
      (encList) =>
      // !patientName || (encList.family_name && encList.family_name.toLowerCase().includes(patientName.toLowerCase())) || 
      //   (encList.family_name2 && encList.family_name2.toLowerCase().includes(patientName.toLowerCase())) ||
      //   (encList.middle_name && encList.middle_name.toLowerCase().includes(patientName.toLowerCase())) ||
      //   (encList.given_name && encList.given_name.toLowerCase().includes(patientName.toLowerCase())),
      !patientName || ((encList.family_name+encList.middle_name+encList.given_name) && (encList.family_name+encList.middle_name+encList.given_name).toLowerCase().includes(patientName.replace(/\s+/g, '').toLowerCase())) || 
      ((encList.family_name+encList.given_name+encList.middle_name) && (encList.family_name+encList.given_name+encList.middle_name).toLowerCase().includes(patientName.replace(/\s+/g, '').toLowerCase())) ||
      ((encList.middle_name+encList.family_name+encList.given_name) && (encList.middle_name+encList.family_name+encList.given_name).toLowerCase().includes(patientName.replace(/\s+/g, '').toLowerCase())) ||
      ((encList.middle_name+encList.given_name+encList.family_name) && (encList.middle_name+encList.given_name+encList.family_name).toLowerCase().includes(patientName.replace(/\s+/g, '').toLowerCase())) ||
      ((encList.given_name+encList.family_name+encList.middle_name) && (encList.given_name+encList.family_name+encList.middle_name).toLowerCase().includes(patientName.replace(/\s+/g, '').toLowerCase())) ||
      ((encList.given_name+encList.middle_name+encList.family_name) && (encList.given_name+encList.middle_name+encList.family_name).toLowerCase().includes(patientName.replace(/\s+/g, '').toLowerCase())),




        // (encList.given_name && (encList.given_name+encList.family_name+encList.given_name).toLowerCase().includes(patientName.toLowerCase())),
    )
    ;
    //replace(/\s+/g, ''); 
    // const rows = filteredEncList.map(
    //   (encounterInfo) => {
    //       return {
    //           // patientLink: <a href={`/openmrs/patientDashboard.form?patientId=${encounterInfo.personId}`} >Link</a>,
    //           ...
  

    const rows = filteredEncList.map( 
      (encounterInfo) => {
          return {

      // rows.push({
        // patientLink: <a href={`/openmrs/patientDashboard.form?patientId=${encounterInfo.personId}`} >Link</a>,
        id: encounterInfo.encounterId,
        patientNames: <a href={`/openmrs/patientDashboard.form?patientId=${encounterInfo.personId}`}> 
                      {encounterInfo.family_name}{"  "}
                      {encounterInfo.given_name}{"  "}
                      {encounterInfo.middle_name}
                      </a>,
        pathologyRequest: <a href={`/openmrs/module/htmlformentry/htmlFormEntry.form?encounterId=${encounterInfo.encounterId}&mode=VIEW`}> Link </a>,
        sendingHospital: encounterInfo.patientHealthCenter,
        phoneNumber: `${encounterInfo.patientPhoneNumber ? encounterInfo.patientPhoneNumber:''}`,
        sampleStatus: <select onChange={(e) => sampleStatusChange(e.target.value && JSON.parse(e.target.value),encounterInfo)}>
                        <option value="" ></option>
                        {sampleStatusResults.map((ans) => (
                          <option value={`{"uuid": "${ans.uuid}","display": "${ans.display}"}`} key={ans.uuid} selected=
                            {encounterInfo.sampleStatusObs ?  (encounterInfo.sampleStatusObs===ans.display && true ): false}>
                            {ans.display} 
                          </option>
                        ))}
                      </select>,
        dateOfRequest: encounterInfo.encounterDatetime,
        referralStatus: <select onChange={(e) => referralStatusChange(e.target.value && JSON.parse(e.target.value),encounterInfo)}>
                              <option value="" ></option>
                              {referralStatusResults.map((ans) => (
                                <option value={`{"uuid": "${ans.uuid}","display": "${ans.display}"}`} key={ans.uuid} selected=
                                  {encounterInfo.referralStatusObs && encounterInfo.referralStatusObs===ans.display }>
                                  {ans.display} 
                                </option>
                              ))}
                          </select>,
        sampleDropOff: <input type="checkbox" checked={Boolean(encounterInfo.sampleDropoffObs)}
                          onChange={(e) => sampleDropOffChange(encounterInfo)}/>,
        resultsEncounter: encounterInfo.resultsEncounterId 
                            ? <a href={`/openmrs/module/htmlformentry/htmlFormEntry.form?encounterId=${encounterInfo.resultsEncounterId}&mode=VIEW`}> Results </a>
                            : !userLocation && <a href={`/openmrs/module/htmlformentry/htmlFormEntry.form?personId=${encounterInfo.personId}&patientId=${encounterInfo.personId}&returnUrl=&formId=${config.pathologyResultsFromID}&uuid=${encounterInfo.encounterUuid}`}> Fill in results </a>
                            
      }}
    )

    const sampleDropOffChange = (encounterInfo) =>{
      const tempEncList = cloneDeep( encountersList); 
      if(!encounterInfo.sampleDropoffObs){
        postSampleDropoffObs(encounterInfo,config.sampleDropOffconceptUUID,config.healthCenterAttrTypeUUID,config.yesConceptUUID).then( (response) =>{
          if(response.ok){     
            const encIndex =  tempEncList.findIndex((enc => enc.encounterUuid==encounterInfo.encounterUuid));
            tempEncList[encIndex].sampleDropoffObs = config.yesConceptName;
            tempEncList[encIndex].sampleDropoffObsUuid = response.data.uuid;
            setEncountersList(tempEncList);
          }
        })
      }
      else {
        voidSampleDropoff(encounterInfo.sampleDropoffObsUuid).then((response) => {
          if(response.ok){   
            const encIndex = tempEncList.findIndex((enc => enc.encounterUuid==encounterInfo.encounterUuid));
            tempEncList[ encIndex].sampleDropoffObs = "";
            tempEncList[ encIndex].sampleDropoffObsUuid = "";

            setEncountersList(tempEncList);
          }
        })
      }
      

    }

    const sampleStatusChange = (targetedElem,encounterInfo) =>{
      const tempEncList = cloneDeep( encountersList); 
      if(!encounterInfo.sampleStatusObs){
        postSampleStatusChangeObs(targetedElem.uuid,encounterInfo,config.sampleStatusConceptUUID,config.healthCenterAttrTypeUUID).then((response) => {
          if(response.ok){  
            const encIndex = tempEncList.findIndex((enc => enc.encounterUuid==encounterInfo.encounterUuid));   
            tempEncList[encIndex].sampleStatusObs = targetedElem.display;
            tempEncList[encIndex].sampleStatusObsUuid = response.data.uuid;

            setEncountersList(tempEncList);
          }
          else{
            setEncountersList(tempEncList);
            //Need error message
          }
        })
      }
      else {
        updateSampleStatusChangeObs(targetedElem,encounterInfo,config.sampleStatusConceptUUID,config.healthCenterAttrTypeUUID).then((response) => {
          if(response.ok){ 
            const encIndex = tempEncList.findIndex((enc => enc.encounterUuid==encounterInfo.encounterUuid));  
            tempEncList[encIndex].sampleStatusObs = targetedElem.display;
            tempEncList[encIndex].sampleStatusObsUuid = response.data.uuid;
            setEncountersList(tempEncList);
          }
          else{
            setEncountersList(tempEncList);
            //Need error message
          }
        })
        
      }
      

    }

    const referralStatusChange = (targetedElem,encounterInfo) =>{
      const tempEncList = cloneDeep( encountersList); 
      if(!encounterInfo.referralStatusObs){
        postReferralStatusChangeObs(targetedElem,encounterInfo,config.referralStatusConceptUUID,config.healthCenterAttrTypeUUID).then((response) =>{
          if(response.ok){     
            const encIndex = tempEncList.findIndex((enc => enc.encounterUuid==encounterInfo.encounterUuid));
            tempEncList[encIndex].referralStatusObs = targetedElem.display;
            tempEncList[encIndex].referralStatusObsUuid = response.data.uuid;
            setEncountersList(tempEncList);
          }
          else{
            setEncountersList(tempEncList);
            //Need error message
          }
        })
      }
      else {
        updateReferralStatusChangeObs(targetedElem,encounterInfo,config.referralStatusConceptUUID,config.healthCenterAttrTypeUUID).then((response) =>{
          if(response.ok){   
            const encIndex = tempEncList.findIndex((enc => enc.encounterUuid==encounterInfo.encounterUuid));
            tempEncList[encIndex].referralStatusObs = targetedElem.display;
            tempEncList[encIndex].referralStatusObsUuid = response.data.uuid;
            setEncountersList(tempEncList);
          }
          else{
            setEncountersList(tempEncList);
            //Need error message
          }
        })
      }
      

    }

  return (
    <div>
      <div className={styles.filtersContainer}>
        <label htmlFor="sending-hospital">Sending Hospital </label>
        <select id="sending-hospital" className={styles.dropdown} value={sendingHospital} onChange={(e) => setSendingHospital(e.target.value)}>
          <option value="" ></option>
          {listOfHospitals.map((loc) => (
            (userLocation && userLocation!== config.pathologyFullAllowedLocationName) ?  ( loc.uuid===userLocation ? 
            <option value={loc.display} key={loc.uuid}>{loc.display}</option>:null ) :
            <option value={loc.display} key={loc.uuid}>{loc.display}</option>

          ))}
        </select>
        <label htmlFor="sample-status">Sample Status </label>
        <select id="sample-status" className={styles.dropdown} value={sampleStatus} onChange={(e) => setSampleStatus(e.target.value)}>
          <option value="" ></option>
          {sampleStatusResults.map((ans) => (
            <option value={ans.display} key={ans.uuid}>{ans.display}</option>
          ))}
        </select>
        <label htmlFor="referral-status">Referral Status </label>
        <select id="referral-status" className={styles.dropdown} value={referralStatus} onChange={(e) => setReferralStatus(e.target.value)}>
          <option value="" ></option>
          {referralStatusResults.map((ans) => (
            <option value={ans.display} key={ans.uuid}>{ans.display}</option>
          ))}
        </select>
        
        <label htmlFor="patient-name">Patient Name </label>
        <input id="patient-name" className={styles.textBox} type='text'  onChange={(e) => setPatientName(e.target.value)}/>
      </div>
      <div className={styles.tableContainer}>
        <DataTable rows={rows} headers={headers}>
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DataTable>
      </div>
    </div>
  );
};

export default ReportComponent;
