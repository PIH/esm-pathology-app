import React from 'react';
import cloneDeep from "lodash-es/cloneDeep";
import {DataTable,Table,TableHead,TableRow,TableHeader,TableBody,TableCell,} from 'carbon-components-react';

import styles from './ReportComponent.css';
// import { TableRow } from './TableRow';
import {  getUserLocation, getConceptAnswers, getLocations,getEncounters,postSampleDropoffObs,
  voidSampleDropoff,postSampleStatusChangeObs,updateSampleStatusChangeObs,postReferralStatusChangeObs,
  updateReferralStatusChangeObs } from './ReportComponent.resource';
import {RWINKWAVUHEALTHCENTERNAME,SAMPLESTATUSUUID,REFERRALSTATUSUUID,SAMPLEDROPOFFUUID,YESCONCEPTNAME} from '../constants.js'


const ReportComponent = () => {
  const [userLocation,setUserLocation] = React.useState();
  const [encountersList, setEncountersList] = React.useState([]);
  const  tempEncList= React.useRef([]);
  const [sendingHospital, setSendingHospital] = React.useState("");
  const [listOfHospitals, setListOfHospitals] = React.useState([]);
  const [sampleStatusResults, setSampleStatusResults] = React.useState([]);
  const [referralStatusResults, setReferralStatusResults] = React.useState([]);
  const [sampleStatus, setSampleStatus] = React.useState("");
  const [referralStatus, setReferralStatus] = React.useState("");
  const [patientName, setpatientName] = React.useState("");
  // var rows =[];
  const headers = [
    // {
    //   key: 'patientLink',
    //   header: 'Link to patient',
    // },
    {
      key: 'patientNames',
      header: 'Patient name',
    },
    {
      key: 'pathologyRequest',
      header: 'pathology request',
    },
    {
      key: 'SendingHospital',
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
  ];
  



  React.useEffect(() => {
    getUserLocation().then(setUserLocation);
    getLocations().then(setListOfHospitals);
    getConceptAnswers(SAMPLESTATUSUUID).then(setSampleStatusResults);
    getConceptAnswers(REFERRALSTATUSUUID).then(setReferralStatusResults);
    getEncounters().then(setEncountersList);
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
  const handlePatientName = (value) =>{
    setpatientName(value);
  }

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
      !patientName || (encList.family_name && encList.family_name.toLowerCase().includes(patientName.toLowerCase())) || 
        (encList.family_name2 && encList.family_name2.toLowerCase().includes(patientName.toLowerCase())) ||
        (encList.middle_name && encList.middle_name.toLowerCase().includes(patientName.toLowerCase())) ||
        (encList.given_name && encList.given_name.toLowerCase().includes(patientName.toLowerCase())),
    )
    ;
    // const rows = filteredEncList.map(
    //   (encounterInfo) => {
    //       return {
    //           // patientLink: <a href={`/openmrs/patientDashboard.form?patientId=${encounterInfo.personId}`} >Link</a>,
    //           ...
  

    var rows = filteredEncList.map( 
      (encounterInfo) => {
          return {

      // rows.push({
        // patientLink: <a href={`/openmrs/patientDashboard.form?patientId=${encounterInfo.personId}`} >Link</a>,
        id: `${encounterInfo.encounterId}`,
        patientNames: <a href={`/openmrs/patientDashboard.form?patientId=${encounterInfo.personId}`} > 
                      {encounterInfo.family_name ? encounterInfo.family_name:''}{' '} 
                      {encounterInfo.given_name ? encounterInfo.given_name:'' }{' '}
                      {encounterInfo.middle_name ? encounterInfo.middle_name:''}{' '}
                      </a>,
        pathologyRequest: <a href={`/openmrs/module/htmlformentry/htmlFormEntry.form?encounterId=${encounterInfo.encounterId}&mode=EDIT`}> Link </a>,
        SendingHospital: `${encounterInfo.patientHealthCenter}`,
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
        dateOfRequest: `${encounterInfo.encounterDatetime}`,
        referralStatus: <select onChange={(e) => referralStatusChange(e.target.value && JSON.parse(e.target.value),encounterInfo)}>
                              <option value="" ></option>
                              {referralStatusResults.map((ans) => (
                                <option value={`{"uuid": "${ans.uuid}","display": "${ans.display}"}`} key={ans.uuid} selected=
                                  {encounterInfo.referralStatusObs ?  (encounterInfo.referralStatusObs===ans.display && true ): false}>
                                  {ans.display} 
                                </option>
                              ))}
                          </select>,
        sampleDropOff: <input type="checkbox" checked={encounterInfo.sampleDropoffObs ? true : false}
                          onChange={(e) => sampleDropOffChange(encounterInfo)}/>

      // })
      }}
    )

    const sampleDropOffChange = (encounterInfo) =>{
      tempEncList.current = cloneDeep( encountersList); 
      if(!encounterInfo.sampleDropoffObs){
        postSampleDropoffObs(encounterInfo).then( (Response) =>{
          if(Response.ok){     
            const encIndex =  tempEncList.current.findIndex((enc => enc.encounterUuid==encounterInfo.encounterUuid));
            tempEncList.current[encIndex].sampleDropoffObs = YESCONCEPTNAME;
            tempEncList.current[encIndex].sampleDropoffObsUuid = Response.data.uuid;
            setEncountersList(tempEncList.current);
          }
        })
      }
      else if(encounterInfo.sampleDropoffObs){
        voidSampleDropoff(encounterInfo).then((response) => {
          if(response.ok){   
            const encIndex = tempEncList.current.findIndex((enc => enc.encounterUuid==encounterInfo.encounterUuid));
            tempEncList.current[ encIndex].sampleDropoffObs = "";
            tempEncList.current[ encIndex].sampleDropoffObsUuid = "";

            setEncountersList(tempEncList.current);
          }
        })
      }
      

    }

    const sampleStatusChange = (targetedElem,encounterInfo) =>{
      tempEncList.current = cloneDeep( encountersList); 
      if(!encounterInfo.sampleStatusObs){
        postSampleStatusChangeObs(targetedElem,encounterInfo).then((response) => {
          if(response.ok){  
            const encIndex = tempEncList.current.findIndex((enc => enc.encounterUuid==encounterInfo.encounterUuid));   
            tempEncList.current[encIndex].sampleStatusObs = targetedElem.display;
            tempEncList.current[encIndex].sampleStatusObsUuid = response.data.uuid;

            setEncountersList(tempEncList.current);
          }
          else{
            setEncountersList(tempEncList.current);
            //Need error message
          }
        })
      }
      else if(encounterInfo.sampleStatusObs){
        updateSampleStatusChangeObs(targetedElem,encounterInfo).then((response) => {
          if(response.ok){ 
            const encIndex = tempEncList.current.findIndex((enc => enc.encounterUuid==encounterInfo.encounterUuid));  
            tempEncList.current[encIndex].sampleStatusObs = (targetedElem?targetedElem.display:'');
            tempEncList.current[encIndex].sampleStatusObsUuid = (targetedElem?response.data.uuid:'');
            setEncountersList(tempEncList.current);
          }
          else{
            setEncountersList(tempEncList.current);
            //Need error message
          }
        })
        
      }
      

    }

    const referralStatusChange = (targetedElem,encounterInfo) =>{
      tempEncList.current = cloneDeep( encountersList); 
      if(!encounterInfo.referralStatusObs){
        postReferralStatusChangeObs(targetedElem,encounterInfo).then((response) =>{
          if(response.ok){     
            const encIndex = tempEncList.current.findIndex((enc => enc.encounterUuid==encounterInfo.encounterUuid));
            tempEncList.current[encIndex].referralStatusObs = targetedElem.display;
            tempEncList.current[encIndex].referralStatusObsUuid = response.data.uuid;
            setEncountersList(tempEncList.current);
          }
          else{
            setEncountersList(tempEncList.current);
            //Need error message
          }
        })
      }
      else if(encounterInfo.referralStatusObs){
        updateReferralStatusChangeObs(targetedElem,encounterInfo).then((response) =>{
          if(response.ok){   
            const encIndex = tempEncList.current.findIndex((enc => enc.encounterUuid==encounterInfo.encounterUuid));
            tempEncList.current[encIndex].referralStatusObs = (targetedElem?targetedElem.display:'');
            tempEncList.current[encIndex].referralStatusObsUuid = (targetedElem?response.data.uuid:'');
            setEncountersList(tempEncList.current);
          }
          else{
            setEncountersList(tempEncList.current);
            //Need error message
          }
        })
      }
      

    }

  return (
    <div>
      <div className={styles.filtersContainer}>
        <select className={styles.dropdown} value={sendingHospital} onChange={(e) => handleSendingHospital(e.target.value)}>
          <option value="" selected disabled hidden>Sending Hospital</option>
          <option value="" ></option>
          {listOfHospitals.map((loc) => (
            userLocation ?  ( loc.uuid===userLocation ? 
            <option value={loc.display} key={loc.uuid}>{loc.display}</option>:"" ) :
            <option value={loc.display} key={loc.uuid}>{loc.display}</option>

          ))}
        </select>
        <select className={styles.dropdown} value={sampleStatus} onChange={(e) => handleSampleStatus(e.target.value)}>
          <option value="" selected disabled hidden>Sample Status</option>
          <option value="" ></option>
          {sampleStatusResults.map((ans) => (
            <option value={ans.display} key={ans.uuid}>{ans.display}</option>
          ))}
        </select>
        <select className={styles.dropdown} value={referralStatus} onChange={(e) => handleReferralStatus(e.target.value)}>
          <option value="" selected disabled hidden>Referral Status</option>
          <option value="" ></option>
          {referralStatusResults.map((ans) => (
            <option value={ans.display} key={ans.uuid}>{ans.display}</option>
          ))}
        </select>
        <input className={styles.textBox} type='text' placeholder='Patient Name' onChange={(e) => handlePatientName(e.target.value)}/>
      </div>
      <div className={styles.tableContainer}>
        
        {/* <table className={styles.table}>
          <thead>
            <tr className={`omrs-bold ${styles.tr}`}>
              <td>Link to patient</td>
              <td>Patient name</td>
              <td>pathology request</td>
              <td>Sending Hospital</td>
              <td>Phone number</td>
              <td>Sample status</td>
              <td>Date of Request</td>
              <td>Referral status</td>
              <td>Sample drop off?</td>
            </tr>
          </thead>
          <tbody>
            {filteredEncList.map((enc) => (
              <tr className={styles.tr} key={enc.encounterUuid}>
                <TableRow encounterInfo={enc} sampleStatusResults={sampleStatusResults} 
                referralStatusResults={referralStatusResults} sampleDropOffChange={sampleDropOffChange}
                sampleStatusChange={sampleStatusChange} referralStatusChange={referralStatusChange}
                />
              </tr>
            ))}
          </tbody>
        </table> */}
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
