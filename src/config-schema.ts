import { Type, validator } from "@openmrs/esm-framework";

/**
 * This is the config schema. It expects a configuration object which
 * looks like this:
 *
 * ```json
 * { "casualGreeting": true, "whoToGreet": ["Mom"] }
 * ```
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
    _default: "4d911f5c-26fe-102b-80cb-0017a47871b2",
    _description:
      "This is to determine the UUID of the Pathology encounterType in the instance",
  },
  healthCenterAttrTypeUUID: {
    _type: Type.String,
    _default: "8d87236c-c2cc-11de-8d13-0010c6dffd0f",
    _description:
      "This is to determine the UUID of the Health center attribute type in the instance",
  },
  pathologyFullAllowedLocationUuid: {
    _type: Type.String,
    _default: "38c4b94b-97a6-4f2c-bca6-c28a37cf60ed",
    _description:
      "This is to determine the location allowed to view all other location data",
  },
  sampleStatusConceptUUID: {
    _type: Type.String,
    _default: "3ce163d8-26fe-102b-80cb-0017a47871b2",
    _description:
      "This is to determine the UUID of the sample status concept in the instance",
  },
  referralStatusConceptUUID: {
    _type: Type.String,
    _default: "3cd93302-26fe-102b-80cb-0017a47871b2",
    _description:
      "This is to determine the UUID of the referral status concept in the instance",
  },
  sampleDropOffconceptUUID: {
    _type: Type.String,
    _default: "13662f27-9be5-4595-8bab-07b0e859d9f4",
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
    _default: 131,
    _description:
      "This is to determine the ID of the pathology results form in the instance",
  },
};

export type Config = {
  pathologyEncTypeUUID: string;
  healthCenterAttrTypeUUID: string;
  pathologyFullAllowedLocationName: string;
  sampleStatusConceptUUID: string;
  referralStatusConceptUUID: string;
  sampleDropOffconceptUUID: string;
  yesConceptUUID: string;
  yesConceptName: string;
  pathologyResultsFromID: number;
};
