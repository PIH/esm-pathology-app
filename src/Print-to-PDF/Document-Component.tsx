import React from "react";
import { Document, Page, Text,Image, View, StyleSheet } from "@react-pdf/renderer";
import ButaroLogo from '../images/ButaroHospitalLogo.gif';


// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 20,
    flexGrow: 1,
  },
  textLabels: {
    padding: 7,
    fontSize: 16,
    fontWeight: 'heavy',
    paddingBottom:30,
  },
  textAnswers: {
    margin: 10,
    padding: 20,
    fontSize: 14,
  },
  image: {
    width: 61,
  }
});

// Create Document Component
const MyDocument = (props) => (
  
  <Document title={`Pathology report 
  ${props.encounterInfo.family_name} 
  ${props.encounterInfo.given_name}  
  ${props.encounterInfo.middle_name} `}
  >
    <Page size="A4" style={styles.page}>
      
      <View style={styles.section}>
        <Image style={styles.image} src={ButaroLogo}/>
        <Text style={{fontSize: 8}}>Butaro Cancer Center</Text>
        <Text style={{ borderBottom:'1px', textAlign: 'center',fontWeight: 1500, margin: 30 }}> 
          Pathology Report 
        </Text>
        <Text style={{ paddingBottom: 10 }} > 
          <Text style={styles.textLabels}>
            Patient:
          </Text> 
          <Text style={styles.textAnswers}>
          {" "}{" "}
            {props.encounterInfo.family_name} {" "} 
            {props.encounterInfo.given_name} {" "} 
            {props.encounterInfo.middle_name}  
          </Text>
          
        </Text>
        <Text style={{ paddingBottom: 10 }}>  
          <Text style={styles.textLabels}>
            Date:
          </Text> 
          <Text style={styles.textAnswers}>
          {" "}{" "}
            {
              new Date(props.encounterInfo.resultsEncounter.encounterDatetime)
              .toLocaleString(["en-GB","en-US","en","fr-RW"],{day: 'numeric',month: 'numeric',year: 'numeric'})
            } 
          </Text>
        </Text>
        <Text style={{ paddingBottom: 10 }}>
          <Text style={styles.textLabels}>
            Accession Number:
          </Text> 
          <Text style={styles.textAnswers}>
          {" "}{" "}
          {props.encounterInfo.resultsEncounter.obs.map((obser) => obser.concept.uuid==props.config.AccessionNumberconceptUUID && obser.value)}
          </Text>
        </Text>
        <Text style={{ paddingBottom: 10 }}>
          <Text style={styles.textLabels}>
            Specimen Date:
          </Text> 
          <Text style={styles.textAnswers}>
          {" "}{" "}
          {props.encounterInfo.resultsEncounter.obs.map((obser) => obser.concept.uuid==props.config.DateBiopsySpecimenTakenconceptUUID && 
            new Date(obser.value)
            .toLocaleString(["en-GB","en-US","en","fr-RW"],{day: 'numeric',month: 'numeric',year: 'numeric'})
          )}
          </Text>
        
        </Text>
        <Text style={{ paddingBottom: 10 }}> 
          <Text style={styles.textLabels}>
            Specimen Submission Date:
          </Text> 
          <Text style={styles.textAnswers}>
          {" "}{" "}
          {props.encounterInfo.resultsEncounter.obs.map((obser) => obser.concept.uuid==props.config.SpecimenSubmissionDateconceptUUID && 
            new Date(obser.value)
            .toLocaleString(["en-GB","en-US","en","fr-RW"],{day: 'numeric',month: 'numeric',year: 'numeric'})
          )}
          </Text>
        </Text>
        <Text style={{ paddingBottom: 10 }}> 
          <Text style={styles.textLabels}>
            Sending Physician:
          </Text> 
          <Text style={styles.textAnswers}>
          {" "}{" "}
          {props.encounterInfo.resultsEncounter.obs.map((obser) => obser.concept.uuid==props.config.SendingPhysicianconceptUUID && obser.value)}
          </Text>
        </Text>
        <Text style={{ paddingBottom: 10 }}>
          <Text style={styles.textLabels}>
            Sending Facility: 
          </Text> 
          <Text style={styles.textAnswers}>
          {" "}{" "}
          {props.encounterInfo.resultsEncounter.obs.map((obser) => obser.concept.uuid==props.config.OtherBiopsyLocationconceptUUID && obser.value)}
          </Text>
        </Text>
        <Text style={{paddingBottom: 10}}>Anatomical location:</Text>
        <Text style={{ paddingBottom: 10,paddingLeft:10 }}> 
          <Text style={styles.textLabels}>
            i.System:
          </Text> 
          <Text style={styles.textAnswers}>
          {" "}{" "}
          {props.encounterInfo.resultsEncounter.obs.map((obser) => obser.concept.uuid==props.config.OrganSystemconceptUUID && (obser.value.name.display+ ",  "))}
          </Text>
        </Text>
        <Text style={{ paddingBottom: 10,paddingLeft:10 }}>
          <Text style={styles.textLabels}>
            ii.Organ:
          </Text> 
          <Text style={styles.textAnswers}>
          {" "}{" "}
          {props.encounterInfo.resultsEncounter.obs.map((obser) => obser.concept.uuid==props.config.OrganconceptUUID && (obser.value.name.display+ ",  "))} 
          </Text>
        </Text>
        <Text style={{ paddingBottom: 10,paddingLeft:10 }}>
          <Text style={styles.textLabels}>
            iii.Detail:
          </Text> 
          <Text style={styles.textAnswers}>
          {" "}{" "}
          {props.encounterInfo.resultsEncounter.obs.map((obser) => obser.concept.uuid==props.config.SpecimenDetailconceptUUID && obser.value)}
          </Text>
        </Text>
        <Text style={{ paddingBottom: 10 }}>
          <Text style={styles.textLabels}>
            Procedure type:
          </Text> 
          <Text style={styles.textAnswers}>
          {" "}{" "}
          {props.encounterInfo.resultsEncounter.obs.map((obser) => obser.concept.uuid==props.config.OtherTestsOrProceduresconceptUUID && obser.value)}
          </Text>
        </Text>
        <Text style={{ paddingBottom: 10 }}>
          <Text style={styles.textLabels}>
            Gross Description:
          </Text> 
          <Text style={styles.textAnswers}>
          {" "}{" "}
            {props.encounterInfo.resultsEncounter.obs.map((obser) => obser.concept.uuid==props.config.GrossDescriptionconceptUUID && obser.value)}

          </Text>
        </Text>
        <Text style={{ paddingBottom: 10 }}> 
          <Text style={styles.textLabels}>
            Microscopic Examination:
          </Text> 
          <Text style={styles.textAnswers}>
          {" "}{" "}
            {props.encounterInfo.resultsEncounter.obs.map((obser) => obser.concept.uuid==props.config.MacroscopicExaminationconceptUUID && obser.value)}
          </Text>
        </Text>
        <Text style={{ paddingBottom: 10 }}>
          <Text style={styles.textLabels}>
            Conclusion:
          </Text> 
          <Text style={styles.textAnswers}>
          {" "}{" "}
            {props.encounterInfo.resultsEncounter.obs.map((obser) => obser.concept.uuid==props.config.COMMENTSATCONCLUSIONOFEXAMINATIONconceptUUID && obser.value)}
          </Text>
        </Text>
        <Text style={{ paddingBottom: 10 }}>
          <Text style={styles.textLabels}>
            Canreg Code:
          </Text> 
          <Text style={styles.textAnswers}>
          {" "}{" "}
            {props.encounterInfo.resultsEncounter.obs.map((obser) => obser.concept.display=="Canreg Code" && obser.value)}
          </Text>
        </Text>
        <Text style={{ paddingBottom: 10 }}>  
          <Text style={styles.textLabels}>
            Validated by pathologist:
          </Text> 
          <Text style= {[styles.textAnswers, { fontWeight: 'bold' }]}>
          {" "}{" "}
            {props.encounterInfo.approvedBy}
          </Text>
        </Text>
      </View>
    </Page>
  </Document>
);

export default MyDocument;

