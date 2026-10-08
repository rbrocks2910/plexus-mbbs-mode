/**
 * Shared dummy patient case data for all design concepts
 * Each case includes complete patient information for realistic testing
 */

export const dummyCases = [
  {
    id: 1,
    patientName: "Rajesh Kumar",
    age: 45,
    gender: "Male",
    chiefComplaint: "Chest pain for 2 hours",
    
    // History responses (what patient says when asked)
    history: {
      onset: "The pain started suddenly about 2 hours ago while I was at work. I was just sitting at my desk.",
      character: "It feels like heavy pressure, like someone is sitting on my chest. It's crushing.",
      radiation: "Yes, the pain goes to my left arm and up to my jaw.",
      severity: "It's very bad, maybe 8 out of 10. I've never felt anything like this before.",
      aggravating: "Nothing makes it worse, it's just constant.",
      relieving: "Nothing helps. I tried resting but it's still there.",
      associated: "I'm feeling sweaty and a bit breathless. Also feeling nauseous.",
      pastHistory: "I have high blood pressure and diabetes for the past 5 years. I take medication for both.",
      smoking: "Yes, I smoke about 10 cigarettes a day for the past 20 years.",
      family: "My father had a heart attack at age 50."
    },
    
    // Physical examination findings
    examination: {
      general: "Patient looks uncomfortable, sweating profusely, holding his chest",
      vitals: "BP: 160/95 mmHg, HR: 110 bpm, RR: 24/min, Temp: 37.2°C, SpO2: 94% on room air",
      cardiovascular: "S1 S2 heard, no murmurs. Mild tachycardia. Peripheral pulses palpable.",
      respiratory: "Bilateral air entry present, no added sounds",
      abdomen: "Soft, non-tender, no organomegaly"
    },
    
    // Investigation results
    investigations: {
      ecg: "ST elevation in leads II, III, aVF suggestive of inferior wall MI",
      troponin: "Elevated at 2.5 ng/mL (Normal: <0.04)",
      cbc: "WBC: 12,000/μL, Hb: 13.5 g/dL, Platelets: 250,000/μL",
      rbs: "180 mg/dL",
      lipidProfile: "Total cholesterol: 240 mg/dL, LDL: 160 mg/dL, HDL: 35 mg/dL, Triglycerides: 200 mg/dL"
    },
    
    // Correct diagnosis
    diagnosis: "Acute Inferior Wall Myocardial Infarction (STEMI)",
    
    // Mentor/Watson/Mirror commentary for each action
    mentorComments: {
      askingOnset: "Good instinct! Onset timing is crucial in chest pain - sudden onset with cardiovascular risk factors raises red flags for acute coronary syndrome.",
      askingCharacter: "Excellent. The character of pain helps differentiate cardiac from non-cardiac causes. 'Crushing' or 'pressure' is classic for MI.",
      askingRadiation: "Smart move. Radiation to the left arm and jaw strongly suggests cardiac origin. You're building a pattern.",
      orderingECG: "Perfect! ECG is the first-line investigation for chest pain. This should be done within 10 minutes of arrival. You're thinking like an emergency physician.",
      orderingTroponin: "Great choice. Troponin confirms myocardial damage. Elevated levels clinch the diagnosis of MI.",
      finalDiagnosis: "You've shown excellent clinical reasoning! You gathered the classic presentation (risk factors + crushing chest pain + radiation + sweating), ordered appropriate tests, and reached the correct diagnosis. After 100 more cases, this pattern recognition will be instantaneous."
    },
    
    // Learning points for feedback
    learningPoints: {
      strengths: [
        "You systematically asked about pain characteristics (SOCRATES approach)",
        "You identified key risk factors (smoking, HTN, diabetes, family history)",
        "You ordered appropriate first-line investigations (ECG, Troponin)"
      ],
      improvements: [
        "Could have asked about similar episodes in the past (to assess for unstable angina)",
        "Could have explored medication compliance for HTN and diabetes",
        "In real scenarios, remember to give aspirin immediately while waiting for ECG"
      ],
      keyTakeaway: "Classic MI presentation: middle-aged male, risk factors, crushing retrosternal chest pain with radiation, autonomic symptoms (sweating, nausea). This pattern will appear in 1 out of every 20 cases you see. Recognize it instantly → Save lives."
    },
    
    // MBBS exam questions
    examQuestions: [
      {
        question: "A 45-year-old male presents with crushing chest pain radiating to the left arm and jaw for 2 hours. ECG shows ST elevation in leads II, III, aVF. What is the most likely diagnosis and which coronary artery is involved?",
        answer: "Diagnosis: Acute Inferior Wall Myocardial Infarction (STEMI). Artery involved: Right Coronary Artery (RCA) in most cases, or Left Circumflex (LCx) in some cases. The ECG leads II, III, aVF correspond to the inferior wall of the heart, which is supplied by the RCA in 80% of individuals."
      },
      {
        question: "What is the immediate management protocol for a patient with STEMI presenting within 2 hours of symptom onset?",
        answer: "Immediate management: (1) MONA - Morphine for pain, Oxygen if SpO2 <94%, Nitrates (sublingual GTN), Aspirin 300mg stat. (2) ECG within 10 minutes. (3) Reperfusion therapy: Primary PCI (preferred if available within 120 minutes) or thrombolysis with streptokinase/tenecteplase if PCI not available. (4) Dual antiplatelet therapy (Aspirin + Ticagrelor/Clopidogrel). (5) Anticoagulation (Heparin/Enoxaparin). Time is muscle!"
      }
    ]
  },
  
  {
    id: 2,
    patientName: "Priya Sharma",
    age: 28,
    gender: "Female",
    chiefComplaint: "High fever and headache for 3 days",
    
    history: {
      onset: "I started feeling unwell 3 days ago with sudden high fever and severe headache.",
      character: "The fever is very high, with chills. The headache is all over my head, throbbing.",
      severity: "Fever goes up to 103-104°F. Headache is 7/10, constant.",
      aggravating: "Headache gets worse with bright light and loud sounds.",
      relieving: "Paracetamol brings fever down temporarily, but it comes back.",
      associated: "I'm also having body aches, pain behind my eyes, and feeling very weak. I noticed a rash on my arms today.",
      pastHistory: "No major illnesses. I'm generally healthy.",
      travel: "I live in Delhi. There's been dengue in our area recently.",
      mosquito: "Yes, there are many mosquitoes around our house."
    },
    
    examination: {
      general: "Patient looks ill, flushed face, lying in bed, avoiding bright light",
      vitals: "BP: 100/70 mmHg, HR: 102 bpm, RR: 20/min, Temp: 103.2°F, SpO2: 98%",
      skin: "Maculopapular rash on arms and trunk, petechiae on lower limbs",
      abdomen: "Soft, mild right upper quadrant tenderness, no hepatomegaly initially",
      other: "Tourniquet test positive"
    },
    
    investigations: {
      cbc: "WBC: 3,500/μL (low), Hb: 13.0 g/dL, Platelets: 80,000/μL (thrombocytopenia)",
      hematocrit: "42% (rising on serial monitoring)",
      denguensI: "Positive",
      dengueIgM: "Positive",
      lft: "AST: 120 U/L (elevated), ALT: 110 U/L (elevated)",
      peripheral: "Atypical lymphocytes present"
    },
    
    diagnosis: "Dengue Fever (Dengue Hemorrhagic Fever - DHF Grade I)",
    
    mentorComments: {
      askingOnset: "Good start! Acute febrile illness needs a systematic approach. Duration and pattern of fever matter.",
      askingTravel: "Excellent! In India, travel history and local epidemiology are crucial. Dengue, malaria, typhoid - all common in endemic areas.",
      checkingRash: "Sharp observation! Dengue rash typically appears on days 3-5. The rash + fever + body ache triad is classic.",
      orderingCBC: "Perfect! CBC in acute fever shows the pattern - leukopenia + thrombocytopenia + rising hematocrit screams dengue. You're thinking systematically.",
      orderingDengue: "Great! NS1 antigen (early) and IgM (later) confirm dengue. You've clinched it.",
      finalDiagnosis: "Excellent work! You picked up the dengue triad (fever + rash + thrombocytopenia), ordered right tests, and diagnosed correctly. Watch for warning signs: bleeding, abdominal pain, vomiting - that's when dengue becomes dangerous."
    },
    
    learningPoints: {
      strengths: [
        "You asked about epidemiology and mosquito exposure - crucial for vector-borne diseases",
        "You looked for the characteristic rash and bleeding manifestations",
        "You ordered appropriate investigations (CBC, dengue serology)"
      ],
      improvements: [
        "Could have explicitly asked about warning signs (persistent vomiting, abdominal pain, bleeding)",
        "Could have inquired about urine output (decreased output is a danger sign)",
        "Remember to do serial hematocrit monitoring - rising HCT indicates plasma leakage"
      ],
      keyTakeaway: "Dengue in India: Think of it in any acute febrile illness during monsoon/post-monsoon. Triad: Fever + Thrombocytopenia + Leukopenia. Warning signs = danger! Most cases need only supportive care, but vigilance prevents deaths."
    },
    
    examQuestions: [
      {
        question: "A 28-year-old female presents with high fever, headache, and rash for 3 days. CBC shows WBC 3,500/μL, Platelets 80,000/μL. Dengue NS1 is positive. What are the WHO criteria for Dengue Hemorrhagic Fever (DHF)?",
        answer: "WHO criteria for DHF: (1) Fever lasting 2-7 days. (2) Hemorrhagic manifestations (positive tourniquet test, petechiae, purpura, or bleeding). (3) Thrombocytopenia (platelets <100,000/μL). (4) Evidence of plasma leakage (rising hematocrit ≥20%, pleural effusion, ascites, or hypoproteinemia). All 4 criteria must be present. DHF is graded I-IV based on severity, with grades III & IV being Dengue Shock Syndrome (DSS)."
      },
      {
        question: "What are the warning signs in dengue that indicate progression to severe disease, and what is the management approach?",
        answer: "Warning signs: (1) Abdominal pain/tenderness. (2) Persistent vomiting. (3) Clinical fluid accumulation (ascites, pleural effusion). (4) Mucosal bleeding. (5) Lethargy/restlessness. (6) Liver enlargement >2cm. (7) Rising HCT with rapid platelet drop. Management: Admit patient, monitor vitals 4-hourly, serial HCT monitoring, IV fluid resuscitation (crystalloids - Normal Saline/Ringer Lactate), avoid NSAIDs/aspirin, platelet transfusion only if active bleeding + count <10,000, watch for shock."
      }
    ]
  },
  
  {
    id: 3,
    patientName: "Amit Verma",
    age: 60,
    gender: "Male",
    chiefComplaint: "Shortness of breath and swelling of feet for 2 weeks",
    
    history: {
      onset: "I've been feeling breathless for the past 2 weeks, getting worse gradually.",
      character: "I get breathless even while walking short distances now. Can't lie flat at night.",
      orthopnea: "Yes, I need 3 pillows to sleep. Sometimes I wake up at night gasping for air.",
      swelling: "Both my feet and ankles are swollen, worse by evening. Shoes don't fit anymore.",
      associated: "I feel very tired all the time. Sometimes my heart beats very fast.",
      pastHistory: "I had a heart attack 2 years ago. Also have high BP and diabetes.",
      medications: "I take aspirin, atenolol, and diabetes medicines. But I sometimes forget.",
      smoking: "I used to smoke but quit after my heart attack.",
      diet: "I eat regular food, nothing special. Maybe a bit salty."
    },
    
    examination: {
      general: "Patient appears dyspneic at rest, sitting up, mild pallor",
      vitals: "BP: 140/90 mmHg, HR: 110 bpm (irregular), RR: 26/min, Temp: 37°C, SpO2: 92% on room air",
      cardiovascular: "Apex beat displaced laterally, S3 gallop present, bilateral basal crepitations on chest auscultation. Raised JVP (8cm). Bilateral pitting pedal edema up to mid-shin.",
      respiratory: "Bilateral basal crepitations, reduced air entry at bases",
      abdomen: "Soft, mild hepatomegaly (liver 2cm below costal margin, tender)"
    },
    
    investigations: {
      ecg: "Atrial fibrillation with rapid ventricular response. Old Q waves in anterior leads (previous MI).",
      chestXray: "Cardiomegaly, bilateral pleural effusion, Kerley B lines, upper lobe blood diversion",
      echo: "Ejection fraction 30% (severe LV dysfunction), global hypokinesia, dilated left ventricle",
      bnp: "Elevated at 850 pg/mL (Normal: <100)",
      rft: "Creatinine: 1.8 mg/dL (slightly elevated)",
      electrolytes: "Na: 132 mEq/L (hyponatremia), K: 4.2 mEq/L"
    },
    
    diagnosis: "Congestive Cardiac Failure (Heart Failure with Reduced Ejection Fraction - HFrEF) with Atrial Fibrillation",
    
    mentorComments: {
      askingOrthopnea: "Brilliant! Orthopnea and PND (paroxysmal nocturnal dyspnea) are classic for heart failure. Fluid redistributes when lying flat, worsening pulmonary congestion.",
      checkingPedalEdema: "Excellent observation! Bilateral pedal edema + raised JVP + hepatomegaly = right heart failure. You're seeing the complete picture.",
      orderingEcho: "Perfect choice! Echo tells you everything - EF, wall motion, valve function. It's the gold standard for diagnosing and assessing heart failure severity.",
      orderingBNP: "Smart! BNP is a biomarker for heart failure. Elevated levels confirm volume overload and cardiac strain. You're using evidence-based tools.",
      finalDiagnosis: "Outstanding clinical reasoning! You identified the triad (breathlessness + orthopnea + pedal edema), found signs of biventricular failure, and confirmed with appropriate tests. You also picked up the AF - important for management. After seeing 50 more heart failure cases, you'll recognize this pattern immediately."
    },
    
    learningPoints: {
      strengths: [
        "You systematically assessed NYHA class by asking about breathlessness and activity limitation",
        "You identified signs of both left (pulmonary congestion) and right (pedal edema, raised JVP) heart failure",
        "You ordered key investigations (Echo for diagnosis, BNP for confirmation, ECG for rhythm)"
      ],
      improvements: [
        "Could have explored medication compliance more deeply - common cause of decompensation",
        "Could have asked about dietary salt intake - triggers fluid retention",
        "Remember to assess for precipitating factors: infection, anemia, ischemia, arrhythmia, medication non-compliance"
      ],
      keyTakeaway: "Heart failure is a clinical diagnosis supported by investigations. Remember the framework: Symptoms (breathlessness, orthopnea, PND, fatigue) + Signs (pedal edema, JVP↑, S3 gallop, displaced apex) + Investigations (Echo shows low EF, BNP elevated, CXR shows congestion). Treat the cause, manage fluid overload, optimize medications (RAAS inhibitors, beta-blockers, diuretics)."
    },
    
    examQuestions: [
      {
        question: "A 60-year-old male with previous MI presents with orthopnea, bilateral pedal edema, and displaced apex beat. Echo shows EF 30%. What is the diagnosis, classification, and first-line pharmacological management?",
        answer: "Diagnosis: Heart Failure with Reduced Ejection Fraction (HFrEF). Classification: NYHA Class III-IV based on symptoms. First-line pharmacological management: (1) ACE inhibitors (e.g., Ramipril) or ARBs if ACE-I not tolerated - reduce mortality. (2) Beta-blockers (e.g., Carvedilol, Metoprolol) - reduce mortality, start low go slow. (3) Loop diuretics (e.g., Furosemide) - for symptom relief and decongestion. (4) Mineralocorticoid receptor antagonists/MRAs (e.g., Spironolactone) - reduce mortality. (5) SGLT2 inhibitors (e.g., Dapagliflozin) - newer, reduce hospitalization. Also: Treat AF with rate control + anticoagulation."
      },
      {
        question: "What are the common precipitating factors for acute decompensation in chronic heart failure? (Remember the mnemonic)",
        answer: "Mnemonic: FAILURES. (F) Forgot medications/non-compliance. (A) Arrhythmia (AF, VT). (I) Ischemia/Infarction (new MI). (L) Lifestyle (dietary indiscretion - high salt intake). (U) Upregulation (increased demand - pregnancy, hyperthyroidism). (R) Renal failure. (E) Embolism (pulmonary embolism). (S) Stenosis (worsening valvular disease) or Substances (alcohol, NSAIDs, CCBs). Identifying and treating the precipitant is crucial for management."
      }
    ]
  },
  
  {
    id: 4,
    patientName: "Sunita Devi",
    age: 35,
    gender: "Female",
    chiefComplaint: "Frequent urination and excessive thirst for 1 month",
    
    history: {
      onset: "For the past month, I'm drinking a lot of water and urinating very frequently, even at night.",
      polyuria: "I'm going to the bathroom 10-12 times a day, and 3-4 times at night. Large amounts each time.",
      polydipsia: "I'm constantly thirsty. I drink 4-5 liters of water a day but still feel thirsty.",
      weightLoss: "I've lost about 5 kg in the past month, even though I'm eating well.",
      appetite: "Actually, I'm eating more than usual but still losing weight.",
      fatigue: "I feel very tired and weak all the time. No energy to do housework.",
      vision: "My vision has become a bit blurry recently.",
      pastHistory: "No major illnesses. Mother has diabetes.",
      symptoms: "No fever, no pain anywhere."
    },
    
    examination: {
      general: "Patient appears thin, dehydrated, dry mucous membranes",
      vitals: "BP: 110/70 mmHg, HR: 88 bpm, RR: 18/min, Temp: 37°C, BMI: 21 kg/m²",
      systemic: "No significant findings on cardiovascular, respiratory, or abdominal examination",
      fundoscopy: "Mild changes suggestive of early diabetic retinopathy"
    },
    
    investigations: {
      fbs: "240 mg/dL (Normal: 70-100 mg/dL)",
      ppbs: "320 mg/dL (Normal: <140 mg/dL)",
      hba1c: "10.5% (Normal: <5.7%, Diabetes: ≥6.5%)",
      urineRoutine: "Glucose +++, Ketones: Trace, No protein, No WBCs",
      rft: "Creatinine: 0.9 mg/dL (normal)",
      lipidProfile: "Total cholesterol: 220 mg/dL, LDL: 140 mg/dL, HDL: 42 mg/dL, TG: 180 mg/dL"
    },
    
    diagnosis: "Type 2 Diabetes Mellitus (newly diagnosed)",
    
    mentorComments: {
      askingClassicTriad: "Perfect! You've identified the classic triad of diabetes - polyuria, polydipsia, and polyphagia (increased appetite). This is textbook presentation.",
      askingWeightLoss: "Excellent! Unexplained weight loss despite increased appetite is a red flag for diabetes. The body can't use glucose, so it breaks down fat and muscle.",
      checkingFamilyHistory: "Smart! Type 2 diabetes has strong genetic component. Family history of diabetes increases risk significantly.",
      orderingFBS: "Good choice! Fasting blood sugar is the first-line test. Values ≥126 mg/dL on two occasions confirm diabetes.",
      orderingHbA1c: "Excellent! HbA1c gives you the average glucose over 3 months. It's diagnostic (≥6.5%) and helps assess control. You're thinking comprehensively.",
      finalDiagnosis: "Brilliant work! You recognized the classic symptoms, asked about risk factors, and confirmed with appropriate tests. You even checked for complications (retinopathy). Now the key is management: lifestyle + medications + monitoring for complications. This pattern will help you catch diabetes early in 1 out of 10 patients you see."
    },
    
    learningPoints: {
      strengths: [
        "You systematically asked about all three cardinal symptoms (polyuria, polydipsia, polyphagia)",
        "You inquired about weight loss and family history - important risk factors",
        "You ordered both fasting glucose and HbA1c for diagnosis and assessment of control"
      ],
      improvements: [
        "Could have asked about symptoms of complications (numbness/tingling for neuropathy, wounds for diabetic foot)",
        "Could have screened for other cardiovascular risk factors (BP, smoking, exercise)",
        "Remember to check urine microalbumin for early nephropathy screening"
      ],
      keyTakeaway: "Diabetes diagnosis: Classic symptoms (polyuria + polydipsia + weight loss) + Random glucose ≥200 OR Fasting glucose ≥126 (on 2 occasions) OR HbA1c ≥6.5% OR OGTT 2-hr glucose ≥200. Don't forget: Diabetes is not just about sugar - it's about preventing complications (retinopathy, nephropathy, neuropathy, CVD). Screen, diagnose early, control aggressively, monitor regularly."
    },
    
    examQuestions: [
      {
        question: "A 35-year-old female presents with polyuria, polydipsia, and weight loss. FBS: 240 mg/dL, HbA1c: 10.5%. What is the diagnosis, and what is the comprehensive initial management approach?",
        answer: "Diagnosis: Type 2 Diabetes Mellitus (newly diagnosed, poor control). Comprehensive management: (1) Lifestyle: Medical nutrition therapy (carbohydrate counting, low GI foods), exercise (150 min/week), weight reduction if overweight. (2) Pharmacotherapy: Start Metformin 500mg BD (first-line), titrate to 2000mg/day. Given HbA1c >9%, may need dual therapy + consider insulin if symptomatic/ketotic. (3) Monitoring: Self-monitoring blood glucose, HbA1c every 3 months till controlled. (4) Complication screening: Fundoscopy yearly, urine microalbumin, foot exam, lipid profile. (5) CVD risk reduction: Statin, ACE-I if microalbuminuria, aspirin if >40 years with CVD risk. (6) Patient education: Diabetes is manageable; compliance is key."
      },
      {
        question: "What are the diagnostic criteria for Diabetes Mellitus according to ADA/WHO guidelines?",
        answer: "Diagnostic criteria (any ONE of the following): (1) HbA1c ≥6.5% (on 2 occasions). (2) Fasting Plasma Glucose (FPG) ≥126 mg/dL (7.0 mmol/L) on 2 occasions (fasting = no caloric intake for ≥8 hours). (3) 2-hour Plasma Glucose ≥200 mg/dL (11.1 mmol/L) during OGTT (75g glucose load). (4) Random Plasma Glucose ≥200 mg/dL (11.1 mmol/L) in a patient with classic symptoms (polyuria, polydipsia, weight loss). Pre-diabetes: FPG 100-125 mg/dL (IFG) or 2-hr OGTT 140-199 mg/dL (IGT) or HbA1c 5.7-6.4%."
      }
    ]
  }
];

// Helper function to get a random case
export const getRandomCase = () => {
  const randomIndex = Math.floor(Math.random() * dummyCases.length);
  return dummyCases[randomIndex];
};

// Helper function to get case by ID
export const getCaseById = (id) => {
  return dummyCases.find(c => c.id === id) || dummyCases[0];
};
