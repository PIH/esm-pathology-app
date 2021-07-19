import React from 'react';

export interface TableRowProps {
  encounterInfo: EncounterResult;
}

export const TableRow = (props: TableRowProps) => {
  // console.log(prop.encounterInfo);
  return (
    <>
      <td>Link</td>
      <td>
        {/* {prop.patient.family_name} {' '}
                {prop.patient.middle_name} {' '}
                {prop.patient.first_name} {' '} */}
      </td>
      <td>Link</td>
      <td>{/* {prop.patient.phone_number} */}</td>
      <td>arrived at BDH</td>
      <td>{props.encounterInfo.encounterDatetime}</td>
      <td>-</td>
      <td>
        <input type="checkbox" />
      </td>
    </>
  );
};
