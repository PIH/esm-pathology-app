import React from 'react';
import { EncounterResult } from './ReportComponent.resource';

export interface TableRowProps {
  encounterInfo: EncounterResult;
}

export const TableRow = (props: TableRowProps) => {
  return (
    <>
      <td>Link</td>
      <td>
        {props.encounterInfo.patientName.familyName && props.encounterInfo.patientName.familyName}{' '}
        {props.encounterInfo.patientName.familyName2 && props.encounterInfo.patientName.familyName2}{' '}
        {props.encounterInfo.patientName.givenName && props.encounterInfo.patientName.givenName}{' '}
      </td>
      <td>Link</td>
      <td>{props.encounterInfo.patientPhoneNumber && props.encounterInfo.patientPhoneNumber.value}</td>
      <td>{props.encounterInfo.sampleStatusObs ? props.encounterInfo.sampleStatusObs.value.display : '--'} </td>
      <td>{props.encounterInfo.encounterDatetime}</td>
      <td>{props.encounterInfo.referralStatusObs ? props.encounterInfo.referralStatusObs.value.display : '--'}</td>
      <td>
        <input type="checkbox" />
      </td>
    </>
  );
};
