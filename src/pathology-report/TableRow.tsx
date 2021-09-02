import React from "react";
import { EncounterResult } from "./ReportComponent.resource";
import styles from "./ReportComponent.css";

export interface TableRowProps {
  encounterInfo: EncounterResult;
}

export const TableRow = (props) => {
  return (
    <>
      <td>
        <a
          href={`/openmrs/patientDashboard.form?patientId=${props.encounterInfo.personId} `}
        >
          Link
        </a>{" "}
      </td>
      <td>
        {props.encounterInfo.family_name && props.encounterInfo.family_name}{" "}
        {props.encounterInfo.given_name && props.encounterInfo.given_name}{" "}
        {props.encounterInfo.middle__name && props.encounterInfo.middle__name}{" "}
      </td>
      <td>
        <a
          href={`/openmrs/module/htmlformentry/htmlFormEntry.form?encounterId=${props.encounterInfo.encounterId}&mode=EDIT`}
        >
          {" "}
          Link{" "}
        </a>
      </td>
      <td> {props.encounterInfo.patientHealthCenter}</td>
      <td>
        {props.encounterInfo.patientPhoneNumber &&
          props.encounterInfo.patientPhoneNumber}
      </td>
      <td>
        <select
          onChange={(e) =>
            props.sampleStatusChange(
              e.target.value && JSON.parse(e.target.value),
              props.encounterInfo
            )
          }
        >
          <option value=""></option>
          {props.sampleStatusResults.map((ans) => (
            <option
              value={`{"uuid": "${ans.uuid}","display": "${ans.display}"}`}
              key={ans.uuid}
              selected={
                props.encounterInfo.sampleStatusObs
                  ? props.encounterInfo.sampleStatusObs === ans.display && true
                  : false
              }
            >
              {ans.display}
            </option>
          ))}
        </select>
      </td>
      <td>{props.encounterInfo.encounterDatetime}</td>
      <td>
        <select
          onChange={(e) =>
            props.referralStatusChange(
              e.target.value && JSON.parse(e.target.value),
              props.encounterInfo
            )
          }
        >
          <option value=""></option>
          {props.referralStatusResults.map((ans) => (
            <option
              value={`{"uuid": "${ans.uuid}","display": "${ans.display}"}`}
              key={ans.uuid}
              selected={
                props.encounterInfo.referralStatusObs
                  ? props.encounterInfo.referralStatusObs === ans.display &&
                    true
                  : false
              }
            >
              {ans.display}
            </option>
          ))}
        </select>
      </td>
      <td>
        <input
          type="checkbox"
          checked={props.encounterInfo.sampleDropoffObs ? true : false}
          onChange={(e) => props.sampleDropOffChange(props.encounterInfo)}
        />
      </td>
    </>
  );
};
