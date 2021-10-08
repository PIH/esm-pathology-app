import React from 'react';
import { render, fireEvent, screen, within, waitFor } from '@testing-library/react';
import { getUserLocation, getConceptAnswers, getLocations, getEncounters } from './ReportComponent.resource';
import ReportComponent from './ReportComponent';
import { configSchema } from '../config-schema';

jest.mock('./ReportComponent.resource');
const mockedGetUserLocation = getUserLocation as jest.Mock;
const mockedGetConceptAnswers = getConceptAnswers as jest.Mock;
const mockedGetLocations = getLocations as jest.Mock;
const mockedGetEncounters = getEncounters as jest.Mock;

const encountersList = [
  {
    encounterDatetime: '2008-06-10T00:00:00.000+0200',
    resultsEncounterId: 2256122,
    middle_name: '',
    given_name: 'Emille',
    encounterId: 75924,
    sampleDropoffObs: 'YES',
    patientHealthCenter: 'Rwinkwavu Health Center',
    referralStatusObs: 'START DRUGS',
    patientPhoneNumber: null,
    patientUuid: 'c610c8cc-2700-102b-80cb-0017a47871b2',
    personId: 13375,
    sampleStatusObs: 'NO',
    encounterUuid: 'f72c4cbb-8ae3-41e7-8011-2a41db1f4a69',
    family_name: 'REBERO',
    referralStatusObsUuid: 'd6c16e76-d7b3-41bc-add9-f24f3726d5f9',
    sampleStatusObsUuid: '40d10177-7de0-48b0-b414-51678e71a3de',
    sampleDropoffObsUuid: '0dd98a8f-f751-4bc6-a6bc-aaa605b411b1',
  },
  {
    encounterDatetime: '2008-06-20T00:00:00.000+0200',
    resultsEncounterId: null,
    middle_name: '',
    given_name: 'Jacqueline',
    encounterId: 76624,
    sampleDropoffObs: null,
    patientHealthCenter: 'Bukora Health Center',
    referralStatusObs: 'CONTINUE REGIMEN',
    patientPhoneNumber: null,
    patientUuid: 'b14bfa25-2b65-447c-9f0d-8fbb4aa3bf74',
    personId: 18292,
    sampleStatusObs: 'UNKNOWN',
    encounterUuid: '36a25060-9c02-4d60-b1a1-53bd6ede1c7b',
    family_name: 'MUKAMUSONERA',
    referralStatusObsUuid: '07012f07-c36d-4ae9-8468-f8d1f98b920c',
    sampleStatusObsUuid: '14487368-b57a-4829-ba7e-880b5c0bb8e0',
    sampleDropoffObsUuid: null,
  },
  {
    encounterDatetime: '2008-06-20T00:00:00.000+0200',
    resultsEncounterId: null,
    middle_name: '',
    given_name: 'Evariste',
    encounterId: 76645,
    sampleDropoffObs: 'YES',
    patientHealthCenter: 'Bukora Health Center',
    referralStatusObs: 'CONTINUE REGIMEN',
    patientPhoneNumber: null,
    patientUuid: 'c610d1f0-2700-102b-80cb-0017a47871b2',
    personId: 13382,
    sampleStatusObs: 'UNKNOWN',
    encounterUuid: 'e26c7330-f5ce-40ae-83f9-8afe4d7f46fa',
    family_name: 'NKOMEJE',
    referralStatusObsUuid: '840f0787-0b3b-4e9d-af31-fb68de4d61df',
    sampleStatusObsUuid: '2a86931b-6c9d-4138-9012-7dce39f7da43',
    sampleDropoffObsUuid: 'a4b4fd30-abb9-41a7-8aff-d95ad2ead45f',
  },
];

const locationList = [
  { uuid: '777984f1-fbee-4de7-aadf-39ac36a89680', display: 'Bukora Health Center' },
  {
    uuid: 'a62fd59a-6577-43e0-b39c-ba42ac8cfbc9',
    display: 'Butaro Hospital',
  },
  {
    uuid: '885f137a-7ca4-4996-b111-4c76fe1ccb38',
    display: 'Cyarubare Health Center',
  },
];

const conceptList = [
  {
    uuid: '3ce163d8-26fe-102b-80cb-0017a47871b2',
    display: 'UNKNOWN',
  },
  {
    uuid: '3ce163d8-26fe-102b-80cb-0017a47880cb',
    display: 'NO',
  },
  {
    uuid: '3ce163d8-26fe-102b-80cb-0017a47880ce',
    display: 'CONTINUE REGIMEN',
  },
  {
    uuid: '3ce163d8-26fe-102b-80cb-0017a47880cv',
    display: 'START DRUGS',
  },
];
describe('pathology request list', () => {
  beforeEach(() => {
    mockedGetEncounters.mockReset();
    mockedGetEncounters.mockReset();
    mockedGetUserLocation.mockReset();
    mockedGetEncounters.mockResolvedValue(encountersList);
    mockedGetLocations.mockResolvedValue(locationList);
    mockedGetConceptAnswers.mockResolvedValue(conceptList);
    mockedGetUserLocation.mockResolvedValue('777984f1-fbee-4de7-aadf-39ac36a89680');

    render(<ReportComponent />);
  });
  afterEach(() => {});

  it('renders without failing', () => {
    // in beforEach
  });

  it('renders the expected fields', async () => {
    const row = await screen
      .getByText(
        new RegExp(
          encountersList[0].family_name +
            '\\s*' +
            encountersList[0].given_name +
            '\\s*' +
            encountersList[0].middle_name,
        ),
      )
      .closest('tr');
    within(row).getByText(encountersList[0].patientHealthCenter);
    within(row).getByText(encountersList[0].encounterDatetime);
    within(row).getByText(encountersList[0].resultsEncounterId ? 'Results' : 'Fill in results');
    if (encountersList[0].sampleStatusObs) {
      within(row).getByDisplayValue(encountersList[0].sampleStatusObs);
    }
    if (encountersList[0].referralStatusObs) {
      within(row).getByDisplayValue(encountersList[0].referralStatusObs);
    }
    // if(encountersList[0].sampleDropoffObs){
    //    expect( within(row).getByTestId("sampleDropOff")).toHaveAttribute('checked',true);
    // }
  });
  it('navigates to the links', async () => {
    const table = await screen.getByRole('table');
    const patientDashLink = within(table).getByText(
      new RegExp(
        encountersList[0].family_name + '\\s*' + encountersList[0].given_name + '\\s*' + encountersList[0].middle_name,
      ),
    );
    fireEvent.click(patientDashLink);
    await waitFor(() => {
      expect(patientDashLink.closest('a')).toHaveAttribute(
        'href',
        '/openmrs/patientDashboard.form?patientId=' + encountersList[0].personId,
      );
    });
    const resultsFormLink = within(table).getByTestId('resultsEncounter');
    fireEvent.click(resultsFormLink);
    await waitFor(() => {
      expect(resultsFormLink.closest('a')).toHaveAttribute(
        'href',
        encountersList[0].resultsEncounterId
          ? `/openmrs/module/htmlformentry/htmlFormEntry.form?encounterId=${encountersList[0].resultsEncounterId}&mode=VIEW`
          : `/openmrs/module/htmlformentry/htmlFormEntry.form?personId=${encountersList[0].personId}&patientId=${encountersList[0].personId}&returnUrl=&formId=${configSchema.pathologyResultsFromID._default}&uuid=${encountersList[0].encounterUuid}`,
      );
    });
  });

  it('filters by sending hospital', () => {
    const dropdown = screen.getByLabelText('Sending Hospital', { selector: 'select' });
    fireEvent.change(dropdown, { target: { value: 'Bukora Health Center' } });
    expect(screen.queryByText('REBERO Emille')).toBeNull();
    expect(screen.queryByText('MUKAMUSONERA Jacqueline')).not.toBeNull();
    expect(screen.queryByText('NKOMEJE Evariste')).not.toBeNull();
  });

  it('filters by sample status', () => {
    const dropdown = screen.getByLabelText('Sample Status', { selector: 'select' });
    fireEvent.change(dropdown, { target: { value: 'UNKNOWN' } });
    expect(screen.queryByText('REBERO Emille')).toBeNull();
    expect(screen.queryByText('MUKAMUSONERA Jacqueline')).not.toBeNull();
    expect(screen.queryByText('NKOMEJE Evariste')).not.toBeNull();
  });

  it('filters by referral status', () => {
    const dropdown = screen.getByLabelText('Referral Status', { selector: 'select' });
    fireEvent.change(dropdown, { target: { value: 'CONTINUE REGIMEN' } });
    expect(screen.queryByText('REBERO Emille')).toBeNull();
    expect(screen.queryByText('MUKAMUSONERA Jacqueline')).not.toBeNull();
    expect(screen.queryByText('NKOMEJE Evariste')).not.toBeNull();
  });

  it('filters by patient name', () => {
    const textBox = screen.getByLabelText('Patient Name');
    fireEvent.change(textBox, { target: { value: 'NKOMEJE' } });
    expect(screen.queryByText('REBERO Emille')).toBeNull();
    expect(screen.queryByText('MUKAMUSONERA Jacqueline')).toBeNull();
    expect(screen.queryByText('NKOMEJE Evariste')).not.toBeNull();
  });

  it('infers list of sending hospital', async () => {
    const dropdown = screen.getByLabelText('Sending Hospital', { selector: 'select' });
    fireEvent.change(dropdown, { target: { value: 'Bukora Health Center' } });
    await waitFor(() => {
      expect(dropdown).toHaveDisplayValue('Bukora Health Center');
    });
  });

  it('infers list of sample status', () => {
    const dropdown = screen.getByLabelText('Sample Status', { selector: 'select' });
    fireEvent.change(dropdown, { target: { value: 'UNKNOWN' } });
    expect(dropdown).toHaveDisplayValue('UNKNOWN');
  });

  it('infers list of Referral status', () => {
    const dropdown = screen.getByLabelText('Referral Status', { selector: 'select' });
    fireEvent.change(dropdown, { target: { value: 'CONTINUE REGIMEN' } });
    expect(dropdown).toHaveDisplayValue('CONTINUE REGIMEN');
  });
});
