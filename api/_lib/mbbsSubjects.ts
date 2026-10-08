/**
 * MBBS Subject-wise Disease Database for Backend
 * Covers All 4 MBBS Years
 */

import { getAllFMTConditions } from './fmtTopics.js';

export interface MBBSSubject {
  id: string;
  name: string;
  fullName: string;
  year: 1 | 2 | 3 | 4;
  diseases: string[];
}

export const ANATOMY_DISEASES: string[] = [
  "femoral hernia",
  "carpal tunnel syndrome",
  "varicose veins (great saphenous insufficiency)",
  "facial nerve palsy (bell's palsy)",
  "trigeminal neuralgia",
  "pterion fracture with extradural hematoma",
  "cavernous sinus thrombosis",
  "submandibular sialolithiasis",
  "parotid gland pleomorphic adenoma",
  "thoracic outlet syndrome",
  "scapular winging (long thoracic nerve injury)",
  "radial nerve injury (wrist drop)",
  "ulnar claw hand",
  "median nerve injury (ape hand deformity)",
  "common peroneal nerve injury (foot drop)",
  "sciatica (l4-l5 / l5-s1 disc prolapse)",
  "congenital diaphragmatic hernia (bochdalek)",
  "patent ductus arteriosus (pda)",
  "tetralogy of fallot",
  "coarctation of aorta",
  "tracheoesophageal fistula",
  "meckel diverticulum",
  "hirschsprung disease",
  "congenital hypertrophic pyloric stenosis",
  "inguinal hernia (indirect vs direct)",
  "hydrocele of tunica vaginalis",
  "varicocele (left pampiniform plexus)",
  "cryptorchidism (undescended testis)"
];

export const PHYSIOLOGY_DISEASES: string[] = [
  "iron deficiency anemia",
  "megaloblastic anemia (vitamin b12 deficiency)",
  "sickle cell anemia with vaso-occlusive crisis",
  "immune thrombocytopenic purpura (itp)",
  "hemophilia a (factor viii deficiency)",
  "von willebrand disease",
  "disseminated intravascular coagulation (dic)",
  "hypovolemic shock (hemorrhagic shock)",
  "essential hypertension",
  "orthostatic hypotension",
  "complete heart block (third-degree av block)",
  "atrial fibrillation",
  "ventricular tachycardia",
  "bronchial asthma (reversible airway obstruction)",
  "chronic obstructive pulmonary disease (emphysema)",
  "acute respiratory distress syndrome (ards)",
  "high altitude pulmonary edema (hape)",
  "decompression sickness (caisson disease)",
  "syndrome of inappropriate adh (siadh)",
  "central diabetes insipidus",
  "nephrogenic diabetes insipidus",
  "acute tubular necrosis",
  "chronic kidney disease (stage 4)",
  "renal tubular acidosis (type 1)",
  "primary hyperaldosteronism (conn syndrome)",
  "cushing syndrome (hypercortisolemia)",
  "primary adrenal insufficiency (addison disease)",
  "graves disease (hyperthyroidism)",
  "hashimoto thyroiditis (hypothyroidism)",
  "primary hyperparathyroidism",
  "hypoparathyroidism with hypocalcemic tetany",
  "type 1 diabetes mellitus with dka",
  "type 2 diabetes mellitus",
  "myasthenia gravis (anti-achr positive)",
  "parkinson disease",
  "tabes dorsalis (neurosyphilis)"
];

export const BIOCHEMISTRY_DISEASES: string[] = [
  "phenylketonuria (pku)",
  "alkaptonuria (ochronosis)",
  "maple syrup urine disease (msud)",
  "homocystinuria (marfanoid habitus)",
  "von gierke disease (glycogen storage disease type 1a)",
  "pompe disease (gsd type 2)",
  "mcardle disease (gsd type 5)",
  "hereditary fructose intolerance",
  "classic galactosemia (galt deficiency)",
  "acute intermittent porphyria",
  "porphyria cutanea tarda",
  "gouty arthritis (hyperuricemia)",
  "lesch-nyhan syndrome (hprt deficiency)",
  "familial hypercholesterolemia (ldl-r defect)",
  "tangier disease (hypoalphalipoproteinemia)",
  "scurvy (vitamin c deficiency)",
  "pellagra (niacin deficiency)",
  "beriberi (thiamine deficiency)",
  "wernicke-korsakoff syndrome",
  "wilson disease (hepatolenticular degeneration)",
  "hemochromatosis (iron overload)",
  "glucose-6-phosphate dehydrogenase (g6pd) deficiency",
  "diabetic ketoacidosis",
  "lactic acidosis (metformin-associated)",
  "hyperammonemia type 1 & 2"
];

export const PATHOLOGY_DISEASES: string[] = [
  "acute myocardial infarction with coagulation necrosis",
  "caseous necrosis (pulmonary tuberculosis)",
  "systemic amyloidosis (congo red positive)",
  "fatty liver disease (steatohepatitis)",
  "chronic active hepatitis b/c with cirrhosis",
  "squamous cell carcinoma of oral cavity",
  "adenocarcinoma of colon (adenoma-carcinoma sequence)",
  "infiltrating ductal carcinoma of breast",
  "chronic myeloid leukemia (philadelphia chromosome)",
  "acute lymphoblastic leukemia (all)",
  "acute myeloid leukemia (aml with auer rods)",
  "hodgkin lymphoma (reed-sternberg cells)",
  "non-hodgkin lymphoma (diffuse large b-cell)",
  "multiple myeloma with lytic bone lesions",
  "atherosclerosis with complicated plaque",
  "polyarteritis nodosa (medium-vessel vasculitis)",
  "granulomatosis with polyangiitis (wegener)",
  "post-streptococcal glomerulonephritis (psgn)",
  "nephrotic syndrome (membranous nephropathy)",
  "crescentic glomerulonephritis (rpgn)",
  "peptic ulcer disease with h. pylori gastritis",
  "crohn disease (skip lesions & noncaseating granulomas)",
  "ulcerative colitis with pseudopolyps",
  "cervical intraepithelial neoplasia (hpv 16/18)",
  "osteosarcoma with codman triangle"
];

export const PHARMACOLOGY_DISEASES: string[] = [
  "organophosphate insecticide poisoning",
  "atropine toxicity (anticholinergic toxidrome)",
  "paracetamol overdose (acetaminophen hepatotoxicity)",
  "opioid overdose (heroin/morphine pin-point pupils)",
  "digoxin toxicity with ventricular ectopics",
  "lithium toxicity with ataxia and tremors",
  "warfarin-induced major hemorrhage",
  "heparin-induced thrombocytopenia (hit type 2)",
  "methotrexate toxicity (bone marrow suppression)",
  "aminoglycoside nephrotoxicity and ototoxicity",
  "anti-tubercular drug-induced hepatitis (dih)",
  "severe cutanous adverse reaction (stevens-johnson syndrome)",
  "anaphylactic shock (beta-lactam hypersensitivity)",
  "neuroleptic malignant syndrome (antipsychotic-induced)",
  "serotonin syndrome (ssri/maoi interaction)"
];

export const MICROBIOLOGY_DISEASES: string[] = [
  "pulmonary tuberculosis (mycobacterium tuberculosis)",
  "tuberculous meningitis (acid-fast bacilli in csf)",
  "bacterial meningitis (neisseria meningitidis)",
  "pneumococcal lobar pneumonia (streptococcus pneumoniae)",
  "enteric fever (salmonella typhi bacteremia)",
  "acute cholera with rice water diarrhea (vibrio cholerae)",
  "tetanus with trismus & risus sardonicus (clostridium tetani)",
  "gas gangrene (clostridium perfringens)",
  "hospital-acquired mrsa bacteremia",
  "dengue shock syndrome (flavi virus)",
  "falciparum malaria with cerebral malaria",
  "visceral leishmaniasis (kala-azar / l-d bodies)",
  "rabies encephalitis (hydrophobia & aerophobia)",
  "acute viral hepatitis e with fulminant failure in pregnancy",
  "scrub typhus (orientia tsutsugamushi with eschar)",
  "leptospirosis (weil disease with jaundice & oliguria)",
  "invasive pulmonary aspergillosis",
  "mucormycosis (rhino-orbito-cerebral zygomycosis)",
  "cryptococcal meningitis in advanced hiv"
];

export const PSM_DISEASES: string[] = [
  "tuberculosis",
  "poliomyelitis",
  "leprosy",
  "hiv",
  "influenza",
  "dengue",
  "cholera",
  "rabies",
  "lymphatic filariasis",
  "japanese encephalitis",
  "typhoid",
  "leishmaniasis (kala azar)",
  "malaria",
  "measles",
  "tetanus",
  "diphtheria",
  "hepatitis b",
  "rheumatic heart disease",
  "diabetes mellitus",
  "hypertension",
  "coronary heart disease",
  "protein energy malnutrition (pem)",
  "nutritional anemia",
  "vitamin a deficiency (xerophthalmia)",
  "iodine deficiency disorders",
  "silicosis",
  "anthracosis",
  "asbestosis",
  "fluorosis",
  "lathyrism"
];

export const OPHTHALMOLOGY_DISEASES: string[] = [
  "acute angle-closure glaucoma",
  "primary open-angle glaucoma",
  "senile mature cataract",
  "bacterial corneal ulcer (hypopyon ulcer)",
  "fungal keratitis with feathery margins",
  "acute anterior uveitis (iridocyclitis)",
  "central retinal artery occlusion (crao / cherry-red spot)",
  "central retinal vein occlusion (crvo / blood and thunder)",
  "rhegmatogenous retinal detachment",
  "proliferative diabetic retinopathy with vitreous hemorrhage",
  "hypertensive retinopathy grade 4 (with papilledema)",
  "sympathetic ophthalmitis",
  "orbital cellulitis with proptosis",
  "trachoma stage 3 (cicatricial with trichiasis)"
];

export const ENT_DISEASES: string[] = [
  "acute suppurative otitis media (asom)",
  "chronic suppurative otitis media (csom - safe/tubotympanic)",
  "chronic suppurative otitis media (csom - unsafe/cholesteatoma)",
  "acute mastoiditis with retroauricular swelling",
  "benign paroxysmal positional vertigo (bppv)",
  "meniere disease (endolymphatic hydrops)",
  "vestibular schwannoma (acoustic neuroma)",
  "deviated nasal septum (dns) with spur",
  "acute maxillary sinusitis",
  "ethmoidal nasal polyposis",
  "antral choanal polyp",
  "juvenile nasopharyngeal angiofibroma (jna)",
  "peritonsillar abscess (quinsy)",
  "retropharyngeal abscess",
  "ludwig angina (bilateral submandibular space cellulitis)",
  "vocal cord polyp (singer's nodule)",
  "carcinoma larynx (glottic vs supraglottic)",
  "foreign body bronchus with stridor"
];

export const MEDICINE_DISEASES: string[] = [
  "acute st-elevation myocardial infarction (stemi)",
  "non-st elevation acute coronary syndrome (nste-acs)",
  "acute decompensated heart failure",
  "community-acquired pneumonia (curb-65 high)",
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

export const ALL_MBBS_SUBJECTS: MBBSSubject[] = [
  // Year 1
  { id: "anatomy", name: "Anatomy", fullName: "Human Anatomy", year: 1, diseases: ANATOMY_DISEASES },
  { id: "physiology", name: "Physiology", fullName: "Human Physiology", year: 1, diseases: PHYSIOLOGY_DISEASES },
  { id: "biochemistry", name: "Biochemistry", fullName: "Medical Biochemistry", year: 1, diseases: BIOCHEMISTRY_DISEASES },
  
  // Year 2
  { id: "pathology", name: "Pathology", fullName: "Pathology", year: 2, diseases: PATHOLOGY_DISEASES },
  { id: "pharmacology", name: "Pharmacology", fullName: "Pharmacology", year: 2, diseases: PHARMACOLOGY_DISEASES },
  { id: "microbiology", name: "Microbiology", fullName: "Microbiology", year: 2, diseases: MICROBIOLOGY_DISEASES },

  // Year 3
  { id: "psm", name: "PSM", fullName: "Preventive and Social Medicine", year: 3, diseases: PSM_DISEASES },
  { id: "fmt", name: "FMT", fullName: "Forensic Medicine & Toxicology", year: 3, diseases: getAllFMTConditions() },
  { id: "ophthalmology", name: "Ophthalmology", fullName: "Ophthalmology", year: 3, diseases: OPHTHALMOLOGY_DISEASES },
  { id: "ent", name: "ENT", fullName: "ENT", year: 3, diseases: ENT_DISEASES },

  // Year 4
  { id: "medicine", name: "General Medicine", fullName: "Internal Medicine", year: 4, diseases: MEDICINE_DISEASES },
  { id: "surgery", name: "General Surgery", fullName: "General Surgery", year: 4, diseases: SURGERY_DISEASES },
  { id: "obg", name: "OBG", fullName: "Obstetrics & Gynecology", year: 4, diseases: OBG_DISEASES },
  { id: "pediatrics", name: "Pediatrics", fullName: "Pediatrics", year: 4, diseases: PEDIATRICS_DISEASES },
  { id: "orthopedics", name: "Orthopedics", fullName: "Orthopedics", year: 4, diseases: ORTHOPEDICS_DISEASES }
];

export const MBBS_SUBJECTS: Record<string, MBBSSubject> = Object.fromEntries(
  ALL_MBBS_SUBJECTS.map(s => [s.id.toLowerCase(), s])
);

/**
 * Get diseases for a specific MBBS subject
 */
export function getDiseasesForSubject(subjectId: string): string[] {
  if (!subjectId) return MEDICINE_DISEASES;
  const normalized = subjectId.toLowerCase().trim();
  const found = MBBS_SUBJECTS[normalized] || ALL_MBBS_SUBJECTS.find(
    s => s.name.toLowerCase() === normalized || s.fullName.toLowerCase() === normalized
  );
  if (found && found.diseases.length > 0) {
    return found.diseases;
  }
  // If not explicitly defined, default to medicine diseases
  return MEDICINE_DISEASES;
}

/**
 * Get all available MBBS subjects
 */
export function getAllMBBSSubjects(): MBBSSubject[] {
  return ALL_MBBS_SUBJECTS;
}
