/**
 * @file dummyData.ts
 * @description This file provides fallback data and logic for generating dummy medical cases.
 * Its primary purpose is to ensure the application can run and be tested even when the Gemini API key
 * is not available or if the API service fails. This is a critical part of the app's robustness,
 * allowing for offline development, UI testing, and providing a seamless demo experience.
 */

import { Specialty, CaseRarity, MedicalCase, RaritySelection } from '../types';
import { getDiseasesForSubject } from '../data/mbbsSubjects';
import { getTopicsForMbbsSubject } from '../data/firstYearExamBank';

// Predefined pools of patient profiles to add variety to dummy cases.
export const DUMMY_PROFILES_MALE = [
    { name: 'Rohan Joshi', occupation: 'Architect', background: 'Rohan is an architect who works long hours and reports high levels of work-related stress. He has a family history of hypertension on his father\'s side. He drinks alcohol socially on weekends and has a 5-pack-year smoking history, having quit 2 years ago.' },
    { name: 'Vikram Singh', occupation: 'Taxi Driver', background: 'Vikram works 12-hour shifts to support his family. His diet consists mainly of street food, and his sleep is often disturbed. He reports that financial constraints sometimes delay his decision to seek medical care for non-urgent issues.' },
    { name: 'Amit Patel', occupation: 'University Student', background: 'Amit is a 20-year-old engineering student living in a crowded dorm. He has a history of childhood asthma that he states he "outgrew". He has a persistent, non-productive cough which he attributes to city pollution.' }
];
export const DUMMY_PROFILES_FEMALE = [
    { name: 'Meena Verma', occupation: 'Primary School Teacher', background: 'Meena is a teacher who lives in a joint family household. She reports significant fatigue for the past several months but has been minimizing her symptoms, attributing them to her demanding job and home life. She has no significant past medical history.' },
    { name: 'Sunita Gupta', occupation: 'Homemaker', background: 'Sunita is a 65-year-old widow. She reports feeling unusually tired and short of breath on exertion. She has not had a routine medical check-up in over five years. Her medical history includes well-controlled hypertension for which she takes amlodipine.' },
    { name: 'Anjali Reddy', occupation: 'Marketing Executive', background: 'Anjali is a high-achieving marketing executive whose job involves frequent travel. She presents as impatient with her illness and provides a very direct, factual history of her symptoms. She denies any smoking history but drinks 1-2 glasses of wine most evenings to "unwind".' }
];

// A small, representative database of diagnoses for a few key specialties.
const DUMMY_DIAGNOSES = {
    [Specialty.Cardiology]: [
        { diagnosis: 'Stable Angina', rarity: 'Common', complaint: 'Chest Pain', history: 'Experiences sharp pain in the chest, especially after exertion.' },
        { diagnosis: 'Atrial Fibrillation', rarity: 'Common', complaint: 'Palpitations', history: 'Feels like their heart is racing or skipping beats, sometimes feels dizzy.' },
        { diagnosis: 'Hypertensive Emergency', rarity: 'Uncommon', complaint: 'Severe Headache and Dizziness', history: 'Woke up with a pounding headache and feels very unsteady.' }
    ],
    [Specialty.Neurology]: [
        { diagnosis: 'Migraine with Aura', rarity: 'Common', complaint: 'Severe Headache', history: 'Recurring headaches for the past month, often preceded by seeing flashing lights.' },
        { diagnosis: 'Bell\'s Palsy', rarity: 'Uncommon', complaint: 'Facial Drooping', history: 'Woke up this morning and the left side of my face felt weak, I can\'t smile properly.' },
        { diagnosis: 'Carpal Tunnel Syndrome', rarity: 'Common', complaint: 'Hand Numbness', history: 'Has numbness and tingling in the thumb and index finger, especially at night.' }
    ],
    [Specialty.Pulmonology]: [
        { diagnosis: 'Community-Acquired Pneumonia', rarity: 'Common', complaint: 'Shortness of Breath and Cough', history: 'Has had a productive cough and difficulty breathing for three weeks, with a recent fever.' },
        { diagnosis: 'Asthma Exacerbation', rarity: 'Common', complaint: 'Wheezing and difficulty breathing', history: 'Known asthmatic, has been using their inhaler more often but it is not helping.' },
        { diagnosis: 'Pulmonary Embolism', rarity: 'Uncommon', complaint: 'Sudden Sharp Chest Pain', history: 'Experienced a sudden, sharp chest pain and extreme shortness of breath after a long flight.' }
    ],
    [Specialty.Gastroenterology]: [
        { diagnosis: 'Gastroesophageal Reflux Disease (GERD)', rarity: 'Very Common', complaint: 'Abdominal Pain', history: 'Complains of a burning sensation in the stomach and chest, which worsens after meals and when lying down.' },
        { diagnosis: 'Irritable Bowel Syndrome (IBS)', rarity: 'Common', complaint: 'Cramping and Bloating', history: 'Experiences intermittent abdominal cramps, bloating, and alternating constipation and diarrhea for months.' },
        { diagnosis: 'Gallstones (Cholelithiasis)', rarity: 'Common', complaint: 'Severe Right Upper Quadrant Pain', history: 'Reports severe, cramping pain in the upper right abdomen, especially after eating fatty foods.' }
    ]
};

// MBBS Case Database with high-yield clinical scenarios
export const MBBS_CASES: Record<string, Array<{
  diagnosis: string;
  complaint: string;
  history: string;
  rarity: CaseRarity;
  personality: string;
  literacy: number;
  gender?: 'Male' | 'Female';
  age?: number;
  occupation?: string;
  background?: string;
  causativeAgent?: string;
}>> = {
  psm: [
    {
      diagnosis: 'Pulmonary Tuberculosis',
      complaint: 'Chronic cough for 4 weeks with evening fever and night sweats',
      history: 'A 38-year-old factory worker presents with persistent cough producing yellowish sputum with occasional streaks of blood. He reports a 5 kg unintended weight loss over the past 2 months and profound fatigue.',
      rarity: 'Common',
      personality: 'Stoic and anxious about work absence',
      literacy: 4,
      gender: 'Male',
      age: 38,
      occupation: 'Textile Mill Worker',
      background: 'Lives in a poorly ventilated single-room tenement with his family. Smokes bidi (10 pack-years). No prior history of antitubercular therapy.',
      causativeAgent: 'Mycobacterium tuberculosis'
    },
    {
      diagnosis: 'Vivax Malaria',
      complaint: 'High fever with chills and severe shivering occurring on alternate days',
      history: 'A 26-year-old student developed abrupt-onset high-grade fever 5 days ago. The fever peaks every 48 hours, accompanied by violent rigors lasting 30 minutes, followed by profuse drenching sweats and headache.',
      rarity: 'Common',
      personality: 'Distressed and shivering during febrile spikes',
      literacy: 7,
      gender: 'Male',
      age: 26,
      occupation: 'Civil Engineering Student',
      background: 'Recently returned from a 10-day field survey in a forested area. Did not take chemoprophylaxis. Reports noticing stagnant water pools near his campsite.',
      causativeAgent: 'Plasmodium vivax'
    },
    {
      diagnosis: 'Dengue Hemorrhagic Fever',
      complaint: 'Severe headache, retro-orbital pain, high fever, and bleeding gums',
      history: 'A 31-year-old woman presents on day 5 of illness with continuous high fever, severe breakbone body aches, flushing, and sudden bleeding from her gums when brushing this morning. She feels faint on standing.',
      rarity: 'Common',
      personality: 'Very anxious and weak',
      literacy: 6,
      gender: 'Female',
      age: 31,
      occupation: 'Primary School Teacher',
      background: 'Multiple neighbors in her residential colony have reported febrile illnesses over the past week following monsoon rains. Daytime mosquito bites reported.',
      causativeAgent: 'Dengue Virus (DENV)'
    },
    {
      diagnosis: 'Typhoid Fever (Enteric Fever)',
      complaint: 'Step-ladder pattern fever, headache, and dull abdominal pain for 9 days',
      history: 'A 22-year-old man presents with progressive fever that has climbed daily for over a week. He notes constipation initially, now loose greenish pea-soup stools, marked lethargy, and a dry coated tongue.',
      rarity: 'Common',
      personality: 'Lethargic and quiet',
      literacy: 5,
      gender: 'Male',
      age: 22,
      occupation: 'College Student',
      background: 'Frequently eats street food from vendors outside his hostel. Did not receive typhoid vaccination.',
      causativeAgent: 'Salmonella enterica serovar Typhi'
    }
  ],
  fmt: [
    {
      diagnosis: 'Organophosphorus Poisoning',
      complaint: 'Excessive salivation, pinpoint pupils, vomiting, and breathlessness',
      history: 'A 42-year-old agricultural laborer was brought to casualty by family members 2 hours after spraying crops. He has garlic odor on his breath, profuse sweating, wheezing, and muscle fasciculations.',
      rarity: 'Common',
      personality: 'Confused, restless, and gasping',
      literacy: 3,
      gender: 'Male',
      age: 42,
      occupation: 'Farmer',
      background: 'Was spraying chlorpyrifos/malathion without personal protective equipment in hot weather. Ingested water without washing hands.',
      causativeAgent: 'Organophosphate compound'
    },
    {
      diagnosis: 'Acute Alcohol Intoxication with Subdural Hematoma',
      complaint: 'Altered sensorium and vomiting following a fall while intoxicated',
      history: 'A 48-year-old man was found drowsy with unsteady gait and slurred speech after an apparent fall on a curb. His companion noted he had consumed illicit liquor. A contusion is visible on his right parietal scalp.',
      rarity: 'Uncommon',
      personality: 'Disoriented and combative',
      literacy: 4,
      gender: 'Male',
      age: 48,
      occupation: 'Construction Foreman',
      background: 'Chronic history of alcohol consumption. Friends state he tripped and struck his head 4 hours ago.',
      causativeAgent: 'Ethanol & Traumatic Brain Injury'
    }
  ],
  anatomy: [
    {
      diagnosis: 'Carpal Tunnel Syndrome',
      complaint: 'Numbness, tingling, and burning pain in the thumb, index, and middle fingers',
      history: 'A 45-year-old female typist complains of nocturnal numbness and tingling in the radial 3.5 digits of her dominant right hand. Shaking the hand gives temporary relief. Noticeable thenar wasting.',
      rarity: 'Common',
      personality: 'Worried about losing her job due to hand weakness',
      literacy: 6,
      gender: 'Female',
      age: 45,
      occupation: 'Typist / Office Assistant',
      background: 'Typing 8 hours daily for 15 years. Phalen test and Tinel sign are strongly positive at the wrist.',
      causativeAgent: 'Median nerve compression under flexor retinaculum'
    }
  ],
  physiology: [
    {
      diagnosis: 'Myasthenia Gravis',
      complaint: 'Drooping eyelids and double vision that worsen towards the evening',
      history: 'A 28-year-old woman notes fluctuating bilateral ptosis and diplopia. In the morning symptoms are minimal, but by late afternoon she struggles to keep her eyelids open and experiences mild swallowing difficulty with solids.',
      rarity: 'Uncommon',
      personality: 'Fatigued and anxious',
      literacy: 7,
      gender: 'Female',
      age: 28,
      occupation: 'Software Engineer',
      background: 'No prior history of autoimmune disease. Symptoms temporarily improve with rest and ice pack application.',
      causativeAgent: 'Autoantibodies against post-synaptic nicotinic ACh receptors'
    }
  ],
  biochemistry: [
    {
      diagnosis: 'Diabetic Ketoacidosis (DKA)',
      complaint: 'Rapid deep breathing, vomiting, severe abdominal pain, and fruity odor on breath',
      history: 'A 19-year-old known Type 1 diabetic presents with 2 days of nausea, persistent vomiting, and diffuse abdominal pain after missing his insulin doses during a viral gastroenteritis episode. He is noticeably dehydrated with Kussmaul respirations.',
      rarity: 'Common',
      personality: 'Drowsy and dehydrated',
      literacy: 5,
      gender: 'Male',
      age: 19,
      occupation: 'Student',
      background: 'Diagnosed with T1DM at age 12. Stopped insulin injections 48 hours ago assuming he did not need them while not eating.',
      causativeAgent: 'Absolute insulin deficiency with severe ketoacidosis'
    }
  ],
  pathology: [
    {
      diagnosis: 'Chronic Myeloid Leukemia (CML)',
      complaint: 'Massive dragging sensation in left abdomen, early satiety, and night sweats',
      history: 'A 50-year-old male presents with gradual abdominal distension and left upper quadrant heaviness for 3 months. Physical examination reveals massive splenopathy crossing the midline. Routine blood work showed marked leukocytosis.',
      rarity: 'Uncommon',
      personality: 'Concerned about spleen enlargement',
      literacy: 6,
      gender: 'Male',
      age: 50,
      occupation: 'Bank Manager',
      background: 'No prior constitutional illnesses. Reports unquantified weight loss and low-grade evening fever.',
      causativeAgent: 't(9;22) BCR-ABL1 translocation (Philadelphia chromosome)'
    }
  ],
  pharmacology: [
    {
      diagnosis: 'Paracetamol (Acetaminophen) Toxicity',
      complaint: 'Right upper quadrant pain, nausea, and jaundice following deliberate ingestion',
      history: 'A 21-year-old presents 36 hours after ingesting approximately 25 paracetamol tablets (12.5 grams). She initially experienced mild nausea, but now has tender hepatomegaly, jaundice, and elevated transaminases (>3000 U/L).',
      rarity: 'Common',
      personality: 'Withdrawn and tearful',
      literacy: 5,
      gender: 'Female',
      age: 21,
      occupation: 'Undergraduate Student',
      background: 'Impulsive overdose following acute academic stress. Family brought empty blister packs.',
      causativeAgent: 'Toxic metabolite NAPQI accumulation with glutathione depletion'
    }
  ],
  microbiology: [
    {
      diagnosis: 'Plasmodium Falciparum Malaria',
      complaint: 'Continuous high fever, severe headache, confusion, and dark cola-colored urine',
      history: 'A 34-year-old traveler returned 8 days ago from an endemic area. Presents with high continuous fever, jaundice, mild disorientation, and passing dark red-black urine (blackwater fever). Peripheral smear demonstrates ring forms with double chromatin dots.',
      rarity: 'Uncommon',
      personality: 'Confused and delirious',
      literacy: 6,
      gender: 'Male',
      age: 34,
      occupation: 'Geologist',
      background: 'Did not use insecticide-treated mosquito nets or chemoprophylaxis during fieldwork.',
      causativeAgent: 'Plasmodium falciparum (complicated severe malaria)'
    }
  ],
  ophthalmology: [
    {
      diagnosis: 'Acute Angle-Closure Glaucoma',
      complaint: 'Excruciating unilateral right eye pain, headache, colored halos around lights, and nausea',
      history: 'A 60-year-old hyperopic female presents with sudden severe right periorbital pain and blurred vision that started while sitting in a dark cinema hall. Right eye is injected, cornea is steamy, and the pupil is mid-dilated and vertically oval.',
      rarity: 'Common',
      personality: 'Distressed and holding eye with intense pain',
      literacy: 6,
      gender: 'Female',
      age: 60,
      occupation: 'Retired Teacher',
      background: 'Hyperopic (+3.5D spectacles). IOP in right eye measures 55 mmHg on applanation tonometry.',
      causativeAgent: 'Pupillary block with acute obstruction of trabecular meshwork'
    }
  ],
  ent: [
    {
      diagnosis: 'Chronic Suppurative Otitis Media (CSOM) - Atticoantral Type',
      complaint: 'Scanty foul-smelling ear discharge and progressive hearing loss in right ear',
      history: 'A 35-year-old male presents with persistent foul-smelling purulent discharge from his right ear for 8 months. Otoscopy reveals an attic perforation with visible pearly white flakes and granulation tissue.',
      rarity: 'Common',
      personality: 'Calm but bothered by offensive ear odor',
      literacy: 5,
      gender: 'Male',
      age: 35,
      occupation: 'Shopkeeper',
      background: 'Childhood history of recurrent ear infections. Pure tone audiometry shows conductive hearing loss of 40 dB.',
      causativeAgent: 'Cholesteatoma with bone-eroding enzymatic activity'
    }
  ],
  medicine: [
    {
      diagnosis: 'Acute ST-Elevation Myocardial Infarction (STEMI)',
      complaint: 'Crushing substernal retrosternal chest pain radiating to left arm and jaw with profuse sweating',
      history: 'A 54-year-old chronic smoker presents with severe crushing retrosternal pain that started 1 hour ago while climbing stairs. He is pale, diaphoretic, clutching his chest (Levine sign), with BP 100/60 mmHg and pulse 108 bpm. ECG shows ST elevation in leads II, III, and aVF.',
      rarity: 'Common',
      personality: 'Agitated and experiencing severe sense of impending doom',
      literacy: 5,
      gender: 'Male',
      age: 54,
      occupation: 'Bus Driver',
      background: '30-pack-year smoking history, untreated hypertension for 5 years.',
      causativeAgent: 'Acute thrombosis over ruptured coronary atherosclerotic plaque'
    }
  ],
  surgery: [
    {
      diagnosis: 'Acute Appendicitis',
      complaint: 'Severe right lower abdominal pain, low-grade fever, anorexia, and vomiting',
      history: 'A 24-year-old male woke up with periumbilical colicky pain that shifted after 6 hours to the right iliac fossa. He refuses food (Hamburger sign positive) and winces when coughing. Point tenderness at McBurney point with Rovsing sign positive.',
      rarity: 'Common',
      personality: 'Lying still with knees flexed to minimize peritoneal irritation',
      literacy: 6,
      gender: 'Male',
      age: 24,
      occupation: 'Accountant',
      background: 'No past abdominal surgeries. Ultrasound demonstrates non-compressible tubular structure measuring 8 mm in RIF.',
      causativeAgent: 'Luminal obstruction of appendix by appendicolith'
    }
  ],
  obg: [
    {
      diagnosis: 'Severe Preeclampsia',
      complaint: 'Throbbing headache, blurring of vision, epigastric pain, and swelling of face and feet',
      history: 'A 26-year-old primigravida at 34 weeks gestation presents with persistent frontal headache and bilateral pedal edema extending to the shins. BP recorded at 164/110 mmHg on two occasions. Urine dipstick shows 3+ proteinuria.',
      rarity: 'Common',
      personality: 'Anxious and photophobic',
      literacy: 7,
      gender: 'Female',
      age: 26,
      occupation: 'IT Consultant',
      background: 'Regular antenatal visits until 28 weeks; BP previously normal. Brisk deep tendon reflexes (grade 3+) with 3 beats of ankle clonus.',
      causativeAgent: 'Abnormal placentation with systemic endothelial dysfunction'
    }
  ],
  pediatrics: [
    {
      diagnosis: 'Acute Viral Bronchiolitis',
      complaint: 'Rapid breathing, chest indrawing, wheezing, and poor feeding in a 7-month-old infant',
      history: 'A 7-month-old infant is brought with 3 days of rhinorrhea and low-grade fever, followed by tachypnea and paroxysmal coughing. On examination, RR is 64/min with intercostal retractions, nasal flaring, and widespread expiratory wheeze with bilateral fine crepitations.',
      rarity: 'Common',
      personality: 'Irritable infant, parent very distressed',
      literacy: 5,
      gender: 'Male',
      age: 1,
      occupation: 'Infant',
      background: 'Born at 36 weeks gestation. Elder sibling attends playschool and had an upper respiratory tract infection last week.',
      causativeAgent: 'Respiratory Syncytial Virus (RSV)'
    }
  ],
  orthopedics: [
    {
      diagnosis: 'Colles Fracture of Distal Radius',
      complaint: 'Severe wrist pain, swelling, and dinner-fork deformity following fall on outstretched hand',
      history: 'A 62-year-old post-menopausal female tripped over a carpet edge and fell on her dorsiflexed outstretched hand. She presents with immediate pain, marked dorsal tilt and radial displacement of the wrist, and inability to grip objects.',
      rarity: 'Common',
      personality: 'Supporting injured wrist with opposite hand, tearful',
      literacy: 6,
      gender: 'Female',
      age: 62,
      occupation: 'Homemaker',
      background: 'Known history of post-menopausal osteopenia. Distal neurovascular examination of median nerve intact.',
      causativeAgent: 'High compressive force transmitted through carpus to osteopenic distal radial metaphysis'
    }
  ]
};

/**
 * Generates an MBBS-specific dummy MedicalCase object.
 */
export const getMbbsCase = (subjectId: string, subjectName: string): MedicalCase => {
  const normalizedId = subjectId.toLowerCase();

  // Check if this subject exists in the comprehensive MBBS question bank (Year 1, Year 2, Year 3)
  const mbbsTopics = getTopicsForMbbsSubject(normalizedId);
  if (mbbsTopics && mbbsTopics.length > 0) {
    const chosen = mbbsTopics[Math.floor(Math.random() * mbbsTopics.length)];
    const isMale = chosen.gender === 'Male';
    const profilePool = isMale ? DUMMY_PROFILES_MALE : DUMMY_PROFILES_FEMALE;
    const fallbackProfile = profilePool[Math.floor(Math.random() * profilePool.length)];

    const hasAttendant = !!chosen.unconscious || !!chosen.cannotSpeak || (chosen.age && chosen.age <= 10);

    return {
      id: `mbbs-case-${Date.now()}`,
      rarity: chosen.importance >= 2 ? 'Common' : 'Uncommon',
      specialty: Specialty['General Medicine'],
      patient: {
        name: isMale ? 'Rahul Sharma' : 'Ananya Sen',
        age: chosen.age || (Math.floor(Math.random() * 30) + 20),
        gender: chosen.gender,
        occupation: chosen.occupation || fallbackProfile.occupation,
        background: chosen.background || fallbackProfile.background,
        initialEmotionalState: ['Concerned', 'Anxious', 'In Pain'][Math.floor(Math.random() * 3)],
        personalityTrait: 'Cooperative patient presenting with clinical complaints',
        healthLiteracy: 6,
        unconscious: chosen.unconscious,
        cannotSpeak: chosen.cannotSpeak,
        attendant: hasAttendant ? {
          name: isMale ? 'Ramesh Sharma' : 'Pooja Sen',
          relationship: (chosen.age && chosen.age <= 12) ? 'Parent' : 'Spouse / Attendant'
        } : undefined
      },
      presentingComplaint: {
        chiefComplaint: chosen.complaint,
        historyOfPresentingIllness: chosen.history,
      },
      underlyingDiagnosis: chosen.clinicalDiagnosis,
      causativeAgent: `${chosen.subdivision} — ${chosen.topic}`,
      status: 'active',
      mbbsMode: {
        enabled: true,
        subjectId,
        subjectName,
        topicId: chosen.id,
        topicName: chosen.topic,
        universityQuestion: chosen.universityQuestion,
        modelAnswer: chosen.modelAnswer
      }
    };
  }

  const casesForSubject = MBBS_CASES[normalizedId];
  let picked: (typeof MBBS_CASES)['psm'][0];

  if (casesForSubject && casesForSubject.length > 0) {
    picked = casesForSubject[Math.floor(Math.random() * casesForSubject.length)];
  } else {
    // Dynamic fallback using diseases for this subject
    const diseases = getDiseasesForSubject(normalizedId);
    const diseaseName = diseases.length > 0 
      ? diseases[Math.floor(Math.random() * diseases.length)]
      : `${subjectName} Clinical Presentation`;
    
    picked = {
      diagnosis: diseaseName.charAt(0).toUpperCase() + diseaseName.slice(1),
      complaint: `Presents with characteristic symptoms of ${diseaseName}`,
      history: `A patient presents with acute onset of symptoms suggestive of ${diseaseName}. Diagnostic evaluation confirms the underlying condition requiring clinical decision making and management.`,
      rarity: 'Common',
      personality: 'Concerned about clinical condition',
      literacy: 6,
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      age: Math.floor(Math.random() * 35) + 20,
      occupation: 'Office Worker',
      background: `Classic textbook clinical presentation of ${diseaseName} as per standard MBBS curriculum.`,
      causativeAgent: subjectName
    };
  }

  const isMale = picked.gender ? picked.gender === 'Male' : Math.random() > 0.5;
  const profilePool = isMale ? DUMMY_PROFILES_MALE : DUMMY_PROFILES_FEMALE;
  const fallbackProfile = profilePool[Math.floor(Math.random() * profilePool.length)];

  return {
    id: `mbbs-case-${Date.now()}`,
    rarity: picked.rarity,
    specialty: Specialty['General Medicine'],
    patient: {
      name: picked.gender ? (isMale ? 'Rahul Sharma' : 'Pooja Nair') : fallbackProfile.name,
      age: picked.age || (Math.floor(Math.random() * 30) + 25),
      gender: (picked.gender || (isMale ? 'Male' : 'Female')) as 'Male' | 'Female',
      occupation: picked.occupation || fallbackProfile.occupation,
      background: picked.background || fallbackProfile.background,
      initialEmotionalState: ['Anxious', 'Distressed', 'Concerned', 'Lethargic'][Math.floor(Math.random() * 4)],
      personalityTrait: picked.personality,
      healthLiteracy: picked.literacy,
    },
    presentingComplaint: {
      chiefComplaint: picked.complaint,
      historyOfPresentingIllness: picked.history,
    },
    underlyingDiagnosis: picked.diagnosis,
    causativeAgent: picked.causativeAgent,
    status: 'active',
    mbbsMode: {
      enabled: true,
      subjectId,
      subjectName,
    }
  };
};

/**
 * Generates a complete, structured dummy `MedicalCase` object.
 * @param specialty - The medical specialty requested by the user.
 * @param rarity - The case rarity requested by the user.
 * @returns A `MedicalCase` object with randomized but plausible dummy data.
 */
export const getDummyCase = (specialty: Specialty, rarity: RaritySelection = 'Any'): MedicalCase => {
    const isMale = Math.random() > 0.5;
    const profilePool = isMale ? DUMMY_PROFILES_MALE : DUMMY_PROFILES_FEMALE;
    const selectedProfile = profilePool[Math.floor(Math.random() * profilePool.length)];

    let chiefComplaint = 'General Weakness';
    let history = 'Patient feels unwell.';
    let underlyingDiagnosis = 'Undetermined';
    let caseRarity: CaseRarity = 'Common';
    
    const availableDummySpecialties = Object.keys(DUMMY_DIAGNOSES);
    let specialtyKey = specialty;
    
    if (specialty === Specialty['General Medicine'] || !(specialty in DUMMY_DIAGNOSES)) {
        specialtyKey = availableDummySpecialties[Math.floor(Math.random() * availableDummySpecialties.length)] as Specialty;
    }

    const allPossibleCases = DUMMY_DIAGNOSES[specialtyKey as keyof typeof DUMMY_DIAGNOSES];
    let possibleCases = allPossibleCases;

    if (rarity !== 'Any') {
        const filteredCases = allPossibleCases.filter(c => c.rarity === rarity);
        if (filteredCases.length > 0) {
            possibleCases = filteredCases;
        } else {
            console.warn(`No dummy cases of rarity "${rarity}" for specialty "${specialtyKey}". Using any rarity.`);
        }
    }

    const selectedCase = possibleCases[Math.floor(Math.random() * possibleCases.length)];

    chiefComplaint = selectedCase.complaint;
    history = selectedCase.history;
    underlyingDiagnosis = selectedCase.diagnosis;
    caseRarity = selectedCase.rarity as CaseRarity;

    return {
        id: `dummy-${Date.now()}`,
        rarity: caseRarity,
        specialty,
        patient: {
            name: selectedProfile.name,
            age: Math.floor(Math.random() * 40) + 25,
            gender: isMale ? 'Male' : 'Female',
            occupation: selectedProfile.occupation,
            background: selectedProfile.background,
            initialEmotionalState: ['Anxious', 'Concerned', 'Calm'][Math.floor(Math.random() * 3)] as string,
            personalityTrait: 'Standard Patient',
            healthLiteracy: 5,
        },
        presentingComplaint: {
            chiefComplaint,
            historyOfPresentingIllness: history,
        },
        underlyingDiagnosis,
        status: 'active'
    };
};