/**
 * Forensic Medicine & Toxicology Topics Database (Backend)
 * Organized by patient status zones for specialized simulation handling
 */

export interface FMTTopic {
  id: string;
  name: string;
  zone: 1 | 2 | 3; // 1: Alive/Conscious, 2: Alive/Unconscious, 3: Dead
  relatedConditions: string[];
}

/**
 * ZONE 1: ALIVE (Conscious) - Patient can communicate directly
 */
export const ZONE_1_TOPICS: FMTTopic[] = [
  { id: 'consent', name: 'Consent', zone: 1, relatedConditions: ['medical consent issues', 'informed consent scenarios'] },
  { id: 'medical-negligence', name: 'Medical Negligence', zone: 1, relatedConditions: ['negligence case', 'malpractice'] },
  { id: 'duties-rmp', name: 'Duties of Registered Medical Practitioner', zone: 1, relatedConditions: ['professional duty breach'] },
  { id: 'privileged-communication', name: 'Privileged Communication', zone: 1, relatedConditions: ['confidentiality breach', 'disclosure issues'] },
  { id: 'infamous-conduct', name: 'Infamous Conduct', zone: 1, relatedConditions: ['professional misconduct', 'unethical behavior'] },
  { id: 'professional-misconduct', name: 'Professional Misconduct', zone: 1, relatedConditions: ['ethical violation', 'misconduct'] },
  { id: 'vicarious-liability', name: 'Vicarious Liability', zone: 1, relatedConditions: ['liability case', 'responsibility'] },
  { id: 'res-ipsa-loquitur', name: 'Res Ipsa Loquitur', zone: 1, relatedConditions: ['legal doctrine case'] },
  { id: 'euthanasia', name: 'Euthanasia', zone: 1, relatedConditions: ['end-of-life issues', 'mercy killing'] },
  { id: 'impotence', name: 'Impotence', zone: 1, relatedConditions: ['sexual dysfunction', 'erectile dysfunction'] },
  { id: 'sterility', name: 'Sterility', zone: 1, relatedConditions: ['infertility', 'reproductive issues'] },
  { id: 'artificial-insemination', name: 'Artificial Insemination', zone: 1, relatedConditions: ['assisted reproduction', 'fertility treatment'] },
  { id: 'personality-disorders', name: 'Personality Disorders', zone: 1, relatedConditions: ['psychiatric disorder', 'behavioral issues'] },
  { id: 'delusion', name: 'Delusion', zone: 1, relatedConditions: ['psychotic symptoms', 'false beliefs'] },
  { id: 'true-vs-feigned-insanity', name: 'True vs Feigned Insanity', zone: 1, relatedConditions: ['malingering', 'psychiatric assessment'] },
  { id: 'testamentary-capacity', name: 'Testamentary Capacity', zone: 1, relatedConditions: ['will making capacity', 'mental fitness'] },
  { id: 'run-amok', name: 'Run Amok', zone: 1, relatedConditions: ['violent outburst', 'acute psychosis'] },
  { id: 'alcohol-intoxication', name: 'Alcohol Intoxication', zone: 1, relatedConditions: ['acute alcohol poisoning', 'drunkenness'] },
  { id: 'chronic-lead-poisoning', name: 'Chronic Lead Poisoning', zone: 1, relatedConditions: ['lead toxicity', 'heavy metal poisoning'] },
  { id: 'snakebite-alive', name: 'Snakebite (alive)', zone: 1, relatedConditions: ['venomous snakebite', 'cobra bite'] },
  { id: 'aluminium-phosphide-early', name: 'Aluminium Phosphide (early)', zone: 1, relatedConditions: ['pesticide poisoning', 'celphos poisoning'] },
  { id: 'organophosphorus-poisoning-early', name: 'Organophosphorus Poisoning (early)', zone: 1, relatedConditions: ['insecticide poisoning', 'pesticide toxicity'] },
  { id: 'barbiturate-poisoning-early', name: 'Barbiturate Poisoning (early)', zone: 1, relatedConditions: ['sedative overdose', 'drug poisoning'] },
  { id: 'opium-poisoning-early', name: 'Opium Poisoning (early)', zone: 1, relatedConditions: ['opioid overdose', 'narcotic poisoning'] },
  { id: 'minor-burns', name: 'Minor Burns', zone: 1, relatedConditions: ['thermal injury', 'burn injury'] },
  { id: 'simple-mechanical-injuries', name: 'Simple Mechanical Injuries', zone: 1, relatedConditions: ['blunt trauma', 'physical injury'] },
  { id: 'defence-wounds', name: 'Defence Wounds', zone: 1, relatedConditions: ['assault injuries', 'defensive injuries'] },
  { id: 'sexual-assault-alive', name: 'Sexual Assault (victim alive)', zone: 1, relatedConditions: ['rape', 'sexual violence'] }
];

/**
 * ZONE 2: ALIVE BUT UNCONSCIOUS - Attendant/family member describes
 */
export const ZONE_2_TOPICS: FMTTopic[] = [
  { id: 'suspended-animation', name: 'Suspended Animation', zone: 2, relatedConditions: ['apparent death', 'vital signs absent'] },
  { id: 'brain-stem-death-diagnosis', name: 'Brain Stem Death (diagnosis stage)', zone: 2, relatedConditions: ['brain death', 'coma'] },
  { id: 'near-hanging', name: 'Near Hanging', zone: 2, relatedConditions: ['hanging attempt', 'asphyxia'] },
  { id: 'near-drowning', name: 'Near Drowning', zone: 2, relatedConditions: ['drowning attempt', 'submersion injury'] },
  { id: 'strangulation-non-fatal', name: 'Strangulation (non-fatal)', zone: 2, relatedConditions: ['neck compression', 'choking'] },
  { id: 'suffocation-reversible', name: 'Suffocation (reversible)', zone: 2, relatedConditions: ['airway obstruction', 'asphyxia'] },
  { id: 'choking-partial', name: 'Choking (partial)', zone: 2, relatedConditions: ['foreign body airway', 'obstruction'] },
  { id: 'head-injury', name: 'Head Injury', zone: 2, relatedConditions: ['traumatic brain injury', 'skull trauma'] },
  { id: 'punch-drunk-syndrome', name: 'Punch Drunk Syndrome', zone: 2, relatedConditions: ['chronic traumatic encephalopathy', 'boxing injury'] },
  { id: 'organophosphorus-poisoning', name: 'Organophosphorus Poisoning', zone: 2, relatedConditions: ['insecticide poisoning', 'pesticide toxicity'] },
  { id: 'aluminium-phosphide-poisoning', name: 'Aluminium Phosphide Poisoning', zone: 2, relatedConditions: ['celphos poisoning', 'fumigant toxicity'] },
  { id: 'barbiturate-poisoning', name: 'Barbiturate Poisoning', zone: 2, relatedConditions: ['sedative overdose', 'drug intoxication'] },
  { id: 'opium-poisoning', name: 'Opium Poisoning', zone: 2, relatedConditions: ['opioid overdose', 'narcotic toxicity'] },
  { id: 'methyl-alcohol-poisoning', name: 'Methyl Alcohol Poisoning', zone: 2, relatedConditions: ['methanol toxicity', 'wood spirit poisoning'] },
  { id: 'ethyl-alcohol-poisoning', name: 'Ethyl Alcohol Poisoning', zone: 2, relatedConditions: ['alcohol overdose', 'ethanol toxicity'] },
  { id: 'strychnine-poisoning-pre-terminal', name: 'Strychnine Poisoning (pre-terminal)', zone: 2, relatedConditions: ['rat poison', 'convulsant poisoning'] },
  { id: 'snakebite-neurotoxic', name: 'Snakebite (neurotoxic)', zone: 2, relatedConditions: ['cobra bite', 'krait bite'] },
  { id: 'severe-burns-survivable', name: 'Severe Burns (survivable)', zone: 2, relatedConditions: ['major burn injury', 'thermal trauma'] },
  { id: 'lightning-injury-survivable', name: 'Lightning Injury (survivable)', zone: 2, relatedConditions: ['electrical injury', 'lightning strike'] }
];

/**
 * ZONE 3: DEAD - Post-mortem examination scenario
 */
export const ZONE_3_TOPICS: FMTTopic[] = [
  { id: 'hanging', name: 'Hanging', zone: 3, relatedConditions: ['suicidal hanging', 'asphyxial death'] },
  { id: 'complete-typical-hanging', name: 'Complete Typical Hanging', zone: 3, relatedConditions: ['hanging death', 'ligature marks'] },
  { id: 'ligature-mark', name: 'Ligature Mark', zone: 3, relatedConditions: ['neck compression marks', 'hanging signs'] },
  { id: 'sexual-asphyxia', name: 'Sexual Asphyxia', zone: 3, relatedConditions: ['autoerotic death', 'asphyxiation'] },
  { id: 'strangulation', name: 'Strangulation', zone: 3, relatedConditions: ['manual strangulation', 'ligature strangulation'] },
  { id: 'throttling', name: 'Throttling', zone: 3, relatedConditions: ['manual strangulation', 'neck compression'] },
  { id: 'ligature-strangulation', name: 'Ligature Strangulation', zone: 3, relatedConditions: ['strangulation death', 'ligature marks'] },
  { id: 'garroting', name: 'Garroting', zone: 3, relatedConditions: ['strangulation', 'neck compression'] },
  { id: 'drowning', name: 'Drowning', zone: 3, relatedConditions: ['drowning death', 'submersion'] },
  { id: 'choking-fatal', name: 'Choking (fatal)', zone: 3, relatedConditions: ['airway obstruction', 'cafe coronary'] },
  { id: 'suffocation-fatal', name: 'Suffocation (fatal)', zone: 3, relatedConditions: ['smothering', 'asphyxia'] },
  { id: 'brain-stem-death', name: 'Brain Stem Death', zone: 3, relatedConditions: ['brain death', 'death confirmation'] },
  { id: 'cadaveric-spasm', name: 'Cadaveric Spasm', zone: 3, relatedConditions: ['instantaneous rigor', 'death spasm'] },
  { id: 'rigor-mortis', name: 'Rigor Mortis', zone: 3, relatedConditions: ['postmortem stiffness', 'death changes'] },
  { id: 'instantaneous-rigor', name: 'Instantaneous Rigor', zone: 3, relatedConditions: ['cadaveric spasm', 'immediate rigor'] },
  { id: 'early-signs-of-death', name: 'Early Signs of Death', zone: 3, relatedConditions: ['death confirmation', 'cessation of life'] },
  { id: 'late-signs-of-death', name: 'Late Signs of Death', zone: 3, relatedConditions: ['decomposition', 'putrefaction'] },
  { id: 'adipocere', name: 'Adipocere', zone: 3, relatedConditions: ['saponification', 'body preservation'] },
  { id: 'postmortem-cooling', name: 'Postmortem Cooling', zone: 3, relatedConditions: ['algor mortis', 'body temperature'] },
  { id: 'eye-changes-after-death', name: 'Eye Changes after Death', zone: 3, relatedConditions: ['corneal clouding', 'tache noire'] },
  { id: 'firearm-injuries', name: 'Firearm Injuries', zone: 3, relatedConditions: ['gunshot wound', 'bullet injury'] },
  { id: 'shotgun-injuries', name: 'Shotgun Injuries', zone: 3, relatedConditions: ['shotgun wound', 'pellet injury'] },
  { id: 'bomb-blast-injuries', name: 'Bomb Blast Injuries', zone: 3, relatedConditions: ['blast injury', 'explosive trauma'] },
  { id: 'cut-throat-injuries', name: 'Cut Throat Injuries', zone: 3, relatedConditions: ['neck incision', 'throat cutting'] },
  { id: 'skull-fractures', name: 'Skull Fractures', zone: 3, relatedConditions: ['head trauma', 'cranial fracture'] },
  { id: 'burns-fatal', name: 'Burns (fatal)', zone: 3, relatedConditions: ['thermal death', 'burn injury'] },
  { id: 'lightning-fatalities', name: 'Lightning Fatalities', zone: 3, relatedConditions: ['lightning death', 'electrical injury'] },
  { id: 'electrical-fatal-injuries', name: 'Electrical Fatal Injuries', zone: 3, relatedConditions: ['electrocution', 'electric shock'] },
  { id: 'corrosive-acid-poisoning', name: 'Corrosive Acid Poisoning', zone: 3, relatedConditions: ['acid ingestion', 'corrosive poisoning'] },
  { id: 'oxalic-acid-poisoning', name: 'Oxalic Acid Poisoning', zone: 3, relatedConditions: ['oxalate poisoning', 'acid toxicity'] },
  { id: 'carbolic-acid-poisoning', name: 'Carbolic Acid Poisoning', zone: 3, relatedConditions: ['phenol poisoning', 'carbolic toxicity'] },
  { id: 'aluminium-phosphide-poisoning-fatal', name: 'Aluminium Phosphide Poisoning', zone: 3, relatedConditions: ['celphos death', 'fumigant poisoning'] },
  { id: 'organophosphorus-poisoning-fatal', name: 'Organophosphorus Poisoning', zone: 3, relatedConditions: ['insecticide death', 'pesticide poisoning'] },
  { id: 'opium-poisoning-fatal', name: 'Opium Poisoning', zone: 3, relatedConditions: ['opioid death', 'narcotic overdose'] },
  { id: 'barbiturate-poisoning-fatal', name: 'Barbiturate Poisoning', zone: 3, relatedConditions: ['sedative death', 'drug overdose'] },
  { id: 'strychnine-poisoning-fatal', name: 'Strychnine Poisoning', zone: 3, relatedConditions: ['convulsant death', 'rat poison'] },
  { id: 'snakebite-fatal', name: 'Snakebite (fatal)', zone: 3, relatedConditions: ['venomous snakebite death', 'snake venom'] },
  { id: 'infanticide', name: 'Infanticide', zone: 3, relatedConditions: ['newborn death', 'child killing'] },
  { id: 'hydrostatic-test', name: 'Hydrostatic Test', zone: 3, relatedConditions: ['live birth test', 'lung flotation'] },
  { id: 'sids', name: 'SIDS', zone: 3, relatedConditions: ['sudden infant death', 'cot death'] },
  { id: 'battered-baby-syndrome', name: 'Battered Baby Syndrome', zone: 3, relatedConditions: ['child abuse', 'non-accidental injury'] },
  { id: 'exhumation', name: 'Exhumation', zone: 3, relatedConditions: ['body disinterment', 'grave opening'] },
  { id: 'postmortem-artefacts', name: 'Postmortem Artefacts', zone: 3, relatedConditions: ['postmortem changes', 'artefactual injuries'] },
  { id: 'viscera-preservation', name: 'Viscera Preservation', zone: 3, relatedConditions: ['organ preservation', 'toxicology samples'] },
  { id: 'hyoid-bone', name: 'Hyoid Bone', zone: 3, relatedConditions: ['neck trauma', 'strangulation signs'] }
];

/**
 * All FMT Topics combined
 */
export const FMT_TOPICS: FMTTopic[] = [
  ...ZONE_1_TOPICS,
  ...ZONE_2_TOPICS,
  ...ZONE_3_TOPICS
];

/**
 * Get all related conditions for FMT (for case generation)
 */
export function getAllFMTConditions(): string[] {
  return Array.from(new Set(FMT_TOPICS.flatMap(t => t.relatedConditions)));
}

/**
 * Get a random FMT topic from any zone
 */
export function getRandomFMTTopic(): FMTTopic {
  return FMT_TOPICS[Math.floor(Math.random() * FMT_TOPICS.length)];
}

/**
 * Get topic by ID
 */
export function getFMTTopicById(id: string): FMTTopic | undefined {
  return FMT_TOPICS.find(t => t.id === id);
}

/**
 * Get topics by zone
 */
export function getFMTTopicsByZone(zone: 1 | 2 | 3): FMTTopic[] {
  return FMT_TOPICS.filter(t => t.zone === zone);
}



