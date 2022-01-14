import { Type, validator } from "@openmrs/esm-framework";

/**
 *
 * In OpenMRS Microfrontends, all config parameters are optional. Thus,
 * all elements must have a reasonable default. A good default is one
 * that works well with the reference application.
 *
 * To understand the schema below, please read the configuration system
 * documentation:
 *   https://openmrs.github.io/openmrs-esm-core/#/main/config
 * Note especially the section "How do I make my module configurable?"
 *   https://openmrs.github.io/openmrs-esm-core/#/main/config?id=im-developing-an-esm-module-how-do-i-make-it-configurable
 * and the Schema Reference
 *   https://openmrs.github.io/openmrs-esm-core/#/main/config?id=schema-reference
 */
export const configSchema = {
  pathologyEncTypeUUID: {
    _type: Type.String,
    _default: "70f18a24-92ec-4de5-acdc-7cae77414e32",
    _description:
      "This is to determine the UUID of the Pathology encounterType in the instance",
  },
  healthCenterAttrTypeUUID: {
    _type: Type.String,
    _default: "8d87236c-c2cc-11de-8d13-0010c6dffd0f",
    _description:
      "This is to determine the UUID of the Health center attribute type in the instance",
  },
  pathologyFullAllowedLocationUUID: {
    _type: Type.String,
    _default: "a62fd59a-6577-43e0-b39c-ba42ac8cfbc9",
    _description:
      "This is to determine the location allowed to view all other location data",
  },
  sampleStatusConceptUUID: {
    _type: Type.String,
    _default: "3adca58e-9334-4be5-9bd3-74f7bbf82776",
    _description:
      "This is to determine the UUID of the sample status concept in the instance",
  },
  referralStatusConceptUUID: {
    _type: Type.String,
    _default: "5a7a931f-97b8-4d59-b0de-3a83603aaad9",
    _description:
      "This is to determine the UUID of the referral status concept in the instance",
  },
  sampleDropOffconceptUUID: {
    _type: Type.String,
    _default: "dc288e6c-84a4-4fd3-9136-ef9e13961b1e",
    _description:
      "This is to determine the UUID of the sample drop off concept in the instance",
  },
  yesConceptUUID: {
    _type: Type.String,
    _default: "3cd6f600-26fe-102b-80cb-0017a47871b2",
    _description:
      "This is to determine the UUID of the Yes concept in the instance",
  },
  yesConceptName: {
    _type: Type.String,
    _default: "YES",
    _description:
      "This is to determine the Name of the Yes concept in the instance",
  },

  pathologyResultsFromID: {
    _type: Type.Number,
    _default: 5613,
    _description:
      "This is to determine the ID of the pathology results form in the instance",
  },
  pathologyResultsApprovedconceptUUID: {
    _type: Type.String,
    _default: "1f7742f0-4571-44d8-a88b-8bc60dc11e29",
    _description:
      "This is to determine the pathology results approved concept uuid",
  },
};

export type Config = {
  pathologyEncTypeUUID: string;
  healthCenterAttrTypeUUID: string;
  pathologyFullAllowedLocationUUID: string;
  sampleStatusConceptUUID: string;
  referralStatusConceptUUID: string;
  sampleDropOffconceptUUID: string;
  yesConceptUUID: string;
  yesConceptName: string;
  pathologyResultsFromID: number;
  pathologyResultsApprovedconceptUUID: string;
};
