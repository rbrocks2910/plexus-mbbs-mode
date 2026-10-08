/**
 * MBBS Subject-wise Disease Database
 * Organized by year and subject across all 4 MBBS years
 */

import { getAllFMTConditions } from './fmtTopics';
import { FIRST_YEAR_ANATOMY_TOPICS } from './firstYearAnatomy';
import { FIRST_YEAR_PHYSIOLOGY_TOPICS } from './firstYearPhysiology';
import { FIRST_YEAR_BIOCHEMISTRY_TOPICS } from './firstYearBiochemistry';

import { SECOND_YEAR_PATHOLOGY_TOPICS } from './secondYearPathology';
import { SECOND_YEAR_PHARMACOLOGY_TOPICS } from './secondYearPharmacology';
import { SECOND_YEAR_MICROBIOLOGY_TOPICS } from './secondYearMicrobiology';
import { THIRD_YEAR_PSM_TOPICS } from './thirdYearPSM';
import { THIRD_YEAR_OPHTHALMOLOGY_TOPICS } from './thirdYearOphthalmology';
import { THIRD_YEAR_ENT_TOPICS } from './thirdYearENT';

export interface MBBSSubject {
  id: string;
  name: string;
  fullName: string;
  year: 1 | 2 | 3 | 4;
  diseases: string[];
}

// ----------------------------------------------------
// YEAR 1 SUBJECTS (Pre-clinical - Authentic Clinical Diseases from 1st year.pdf)
// ----------------------------------------------------

export const ANATOMY_DISEASES: string[] = Array.from(new Set(
  FIRST_YEAR_ANATOMY_TOPICS.map(t => t.clinicalDiagnosis.toLowerCase())
));

export const PHYSIOLOGY_DISEASES: string[] = Array.from(new Set(
  FIRST_YEAR_PHYSIOLOGY_TOPICS.map(t => t.clinicalDiagnosis.toLowerCase())
));

export const BIOCHEMISTRY_DISEASES: string[] = Array.from(new Set(
  FIRST_YEAR_BIOCHEMISTRY_TOPICS.map(t => t.clinicalDiagnosis.toLowerCase())
));

// ----------------------------------------------------
// YEAR 2 SUBJECTS (Para-clinical - VIP 2ND YEAR.pdf)
// ----------------------------------------------------

export const PATHOLOGY_DISEASES: string[] = Array.from(new Set(
  SECOND_YEAR_PATHOLOGY_TOPICS.map(t => t.clinicalDiagnosis.toLowerCase())
));

export const PHARMACOLOGY_DISEASES: string[] = Array.from(new Set(
  SECOND_YEAR_PHARMACOLOGY_TOPICS.map(t => t.clinicalDiagnosis.toLowerCase())
));

export const MICROBIOLOGY_DISEASES: string[] = Array.from(new Set(
  SECOND_YEAR_MICROBIOLOGY_TOPICS.map(t => t.clinicalDiagnosis.toLowerCase())
));

// ----------------------------------------------------
// YEAR 3 SUBJECTS (Pre-final - VIP 3rd year (2)-1.pdf)
// ----------------------------------------------------

export const PSM_DISEASES: string[] = Array.from(new Set(
  THIRD_YEAR_PSM_TOPICS.map(t => t.clinicalDiagnosis.toLowerCase())
));

export const OPHTHALMOLOGY_DISEASES: string[] = Array.from(new Set(
  THIRD_YEAR_OPHTHALMOLOGY_TOPICS.map(t => t.clinicalDiagnosis.toLowerCase())
));

export const ENT_DISEASES: string[] = Array.from(new Set(
  THIRD_YEAR_ENT_TOPICS.map(t => t.clinicalDiagnosis.toLowerCase())
));

// ----------------------------------------------------
// YEAR 4 SUBJECTS (Final Year / Clinical)
// ----------------------------------------------------

export const MEDICINE_DISEASES: string[] = [
  "acute st-elevation myocardial infarction (stemi)",
  "non-st elevation acute coronary syndrome",
  "acute decompensated heart failure",
  "community-acquired pneumonia",
  "acute exacerbation of copd",
  "status asthmaticus",
  "acute ischemic stroke (middle cerebral artery)",
  "hypertensive encephalopathy",
  "diabetic ketoacidosis (dka)",
  "hyperosmolar hyperglycemic state (hhs)",
  "decompensated chronic liver disease with ascites",
  "acute variceal upper gi bleed",
  "acute kidney injury (prerenal vs intrinsic)",
  "acute bacterial meningitis",
  "septic shock",
  "severe falciparum malaria",
  "systemic lupus erythematosus (sle)",
  "rheumatoid arthritis with joint deformity"
];

export const SURGERY_DISEASES: string[] = [
  "acute appendicitis",
  "acute calculous cholecystitis",
  "acute mechanical intestinal obstruction",
  "perforated peptic ulcer with peritonitis",
  "obstructed indirect inguinal hernia",
  "strangulated femoral hernia",
  "acute necrotizing pancreatitis",
  "infiltrating ductal carcinoma of breast",
  "fibroadenoma breast",
  "benign prostatic hyperplasia (bph) with urinary retention",
  "ureteric calculus causing acute renal colic",
  "varicose veins with stasis ulcer",
  "deep vein thrombosis (dvt)",
  "diabetic foot ulcer with necrotizing cellulitis",
  "second-degree thermal burns",
  "multinodular toxic goiter",
  "acute anal fissure / grade 3 hemorrhoids"
];

export const OBG_DISEASES: string[] = [
  "severe preeclampsia",
  "eclampsia with generalized seizures",
  "postpartum hemorrhage (atonic pph)",
  "placenta previa with painless vaginal bleeding",
  "abruptio placentae with painful bleeding",
  "ruptured tubal ectopic pregnancy",
  "hyperemesis gravidarum",
  "gestational diabetes mellitus",
  "oligohydramnios with intrauterine growth restriction",
  "uterine leiomyoma (fibroid uterus)",
  "endometriosis with chronic pelvic pain",
  "acute pelvic inflammatory disease (pid)",
  "polycystic ovary syndrome (pcos)",
  "cervical intraepithelial neoplasia / carcinoma cervix",
  "acute torsion of ovarian dermoid cyst"
];

export const PEDIATRICS_DISEASES: string[] = [
  "acute viral bronchiolitis (rsv)",
  "croup (acute laryngotracheobronchitis)",
  "simple febrile seizure",
  "acute gastroenteritis with severe dehydration",
  "neonatal hyperbilirubinemia (phototherapy candidate)",
  "ventricular septal defect (vsd) with congestive failure",
  "tetralogy of fallot cyanotic spell",
  "minimal change nephrotic syndrome",
  "severe acute malnutrition (kwashiorkor)",
  "severe acute malnutrition (marasmus)",
  "measles with bronchopneumonia complication",
  "rickets with wrist widening and bow legs",
  "severe nutritional iron deficiency anemia",
  "neonatal early-onset sepsis"
];

export const ORTHOPEDICS_DISEASES: string[] = [
  "colles fracture of distal radius",
  "intracapsular fracture neck of femur",
  "closed fracture shaft of femur",
  "supracondylar fracture of humerus in child",
  "anterior dislocation of shoulder joint",
  "posterior dislocation of hip joint",
  "tuberculous spondylitis (pott's spine)",
  "acute hematogenous osteomyelitis of tibia",
  "chronic osteomyelitis with sequestrum",
  "acute septic arthritis of knee",
  "osteoarthritis of knee (grade 3/4 kellegren)",
  "acute gouty arthritis of first mtp joint",
  "ankylosing spondylitis with bamboo spine",
  "anterior cruciate ligament (acl) tear",
  "medial meniscal tear"
];

// ----------------------------------------------------
// All MBBS Subjects Configuration
// ----------------------------------------------------

export const MBBS_SUBJECTS: MBBSSubject[] = [
  // YEAR 1
  {
    id: "anatomy",
    name: "Anatomy",
    fullName: "Human Anatomy & Embryology",
    year: 1,
    diseases: ANATOMY_DISEASES
  },
  {
    id: "physiology",
    name: "Physiology",
    fullName: "Human Physiology & Biophysics",
    year: 1,
    diseases: PHYSIOLOGY_DISEASES
  },
  {
    id: "biochemistry",
    name: "Biochemistry",
    fullName: "Medical Biochemistry & Genetics",
    year: 1,
    diseases: BIOCHEMISTRY_DISEASES
  },

  // YEAR 2
  {
    id: "pathology",
    name: "Pathology",
    fullName: "Systemic & Clinical Pathology",
    year: 2,
    diseases: PATHOLOGY_DISEASES
  },
  {
    id: "pharmacology",
    name: "Pharmacology",
    fullName: "Medical Pharmacology & Therapeutics",
    year: 2,
    diseases: PHARMACOLOGY_DISEASES
  },
  {
    id: "microbiology",
    name: "Microbiology",
    fullName: "Medical Microbiology & Immunology",
    year: 2,
    diseases: MICROBIOLOGY_DISEASES
  },

  // YEAR 3
  {
    id: "psm",
    name: "PSM",
    fullName: "Community Medicine (PSM)",
    year: 3,
    diseases: PSM_DISEASES
  },
  {
    id: "fmt",
    name: "FMT",
    fullName: "Forensic Medicine & Toxicology",
    year: 3,
    diseases: getAllFMTConditions()
  },
  {
    id: "ophthalmology",
    name: "Ophthalmology",
    fullName: "Ophthalmology (Eye Diseases)",
    year: 3,
    diseases: OPHTHALMOLOGY_DISEASES
  },
  {
    id: "ent",
    name: "ENT",
    fullName: "Otorhinolaryngology (ENT)",
    year: 3,
    diseases: ENT_DISEASES
  },

  // YEAR 4
  {
    id: "medicine",
    name: "General Medicine",
    fullName: "Internal & General Medicine",
    year: 4,
    diseases: MEDICINE_DISEASES
  },
  {
    id: "surgery",
    name: "General Surgery",
    fullName: "General Surgery & Traumatology",
    year: 4,
    diseases: SURGERY_DISEASES
  },
  {
    id: "obg",
    name: "OBG",
    fullName: "Obstetrics & Gynecology",
    year: 4,
    diseases: OBG_DISEASES
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    fullName: "Pediatrics & Child Health",
    year: 4,
    diseases: PEDIATRICS_DISEASES
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    fullName: "Orthopedic Surgery & Traumatology",
    year: 4,
    diseases: ORTHOPEDICS_DISEASES
  }
];

/**
 * Get subjects for a specific MBBS year
 */
export function getSubjectsForYear(year: 1 | 2 | 3 | 4): MBBSSubject[] {
  return MBBS_SUBJECTS.filter(subject => subject.year === year);
}

/**
 * Get all diseases for a subject
 */
export function getDiseasesForSubject(subjectId: string): string[] {
  const subject = MBBS_SUBJECTS.find(s => s.id.toLowerCase() === subjectId.toLowerCase());
  return subject ? subject.diseases : [];
}

/**
 * Get all diseases for MBBS mode (across all subjects)
 */
export function getAllMBBSDiseases(): string[] {
  return Array.from(new Set(MBBS_SUBJECTS.flatMap(s => s.diseases)));
}
