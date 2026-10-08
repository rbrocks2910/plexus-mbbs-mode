import { FIRST_YEAR_ANATOMY_TOPICS } from './firstYearAnatomy';
import { FIRST_YEAR_PHYSIOLOGY_TOPICS } from './firstYearPhysiology';
import { FIRST_YEAR_BIOCHEMISTRY_TOPICS } from './firstYearBiochemistry';
import { SECOND_YEAR_PHARMACOLOGY_TOPICS } from './secondYearPharmacology';
import { SECOND_YEAR_PATHOLOGY_TOPICS } from './secondYearPathology';
import { SECOND_YEAR_MICROBIOLOGY_TOPICS } from './secondYearMicrobiology';
import { THIRD_YEAR_PSM_TOPICS } from './thirdYearPSM';
import { THIRD_YEAR_OPHTHALMOLOGY_TOPICS } from './thirdYearOphthalmology';
import { THIRD_YEAR_ENT_TOPICS } from './thirdYearENT';

export interface MbbsTopicItem {
  id: string;
  subject: string;
  subdivision: string;
  type: string;
  topic: string;
  importance: number;
  clinicalDiagnosis: string;
  complaint: string;
  history: string;
  gender: 'Male' | 'Female';
  age: number;
  occupation: string;
  background: string;
  universityQuestion: string;
  modelAnswer: string;
  unconscious?: boolean;
  cannotSpeak?: boolean;
}

export type FirstYearTopic = MbbsTopicItem;

export const ALL_FIRST_YEAR_TOPICS: MbbsTopicItem[] = [
  ...FIRST_YEAR_ANATOMY_TOPICS as MbbsTopicItem[],
  ...FIRST_YEAR_PHYSIOLOGY_TOPICS as MbbsTopicItem[],
  ...FIRST_YEAR_BIOCHEMISTRY_TOPICS as MbbsTopicItem[]
];

export const ALL_SECOND_YEAR_TOPICS: MbbsTopicItem[] = [
  ...SECOND_YEAR_PHARMACOLOGY_TOPICS as MbbsTopicItem[],
  ...SECOND_YEAR_PATHOLOGY_TOPICS as MbbsTopicItem[],
  ...SECOND_YEAR_MICROBIOLOGY_TOPICS as MbbsTopicItem[]
];

export const ALL_THIRD_YEAR_TOPICS: MbbsTopicItem[] = [
  ...THIRD_YEAR_PSM_TOPICS as MbbsTopicItem[],
  ...THIRD_YEAR_OPHTHALMOLOGY_TOPICS as MbbsTopicItem[],
  ...THIRD_YEAR_ENT_TOPICS as MbbsTopicItem[]
];

export const ALL_MBBS_TOPICS: MbbsTopicItem[] = [
  ...ALL_FIRST_YEAR_TOPICS,
  ...ALL_SECOND_YEAR_TOPICS,
  ...ALL_THIRD_YEAR_TOPICS
];

export function getTopicsForMbbsSubject(subjectId: string): MbbsTopicItem[] {
  const norm = subjectId.toLowerCase().trim();
  // Year 1
  if (norm.includes('anat')) return FIRST_YEAR_ANATOMY_TOPICS as MbbsTopicItem[];
  if (norm.includes('phys')) return FIRST_YEAR_PHYSIOLOGY_TOPICS as MbbsTopicItem[];
  if (norm.includes('bio')) return FIRST_YEAR_BIOCHEMISTRY_TOPICS as MbbsTopicItem[];

  // Year 2
  if (norm.includes('pharm')) return SECOND_YEAR_PHARMACOLOGY_TOPICS as MbbsTopicItem[];
  if (norm.includes('path')) return SECOND_YEAR_PATHOLOGY_TOPICS as MbbsTopicItem[];
  if (norm.includes('micro')) return SECOND_YEAR_MICROBIOLOGY_TOPICS as MbbsTopicItem[];

  // Year 3
  if (norm.includes('psm') || norm.includes('community')) return THIRD_YEAR_PSM_TOPICS as MbbsTopicItem[];
  if (norm.includes('opht') || norm.includes('eye')) return THIRD_YEAR_OPHTHALMOLOGY_TOPICS as MbbsTopicItem[];
  if (norm.includes('ent') || norm.includes('oto')) return THIRD_YEAR_ENT_TOPICS as MbbsTopicItem[];

  return ALL_MBBS_TOPICS;
}

export function getTopicsForFirstYearSubject(subjectId: string): MbbsTopicItem[] {
  return getTopicsForMbbsSubject(subjectId);
}

export function findMbbsTopic(query: string): MbbsTopicItem | undefined {
  const q = query.toLowerCase().trim();
  return ALL_MBBS_TOPICS.find(t => 
    t.topic.toLowerCase().includes(q) ||
    t.clinicalDiagnosis.toLowerCase().includes(q) ||
    t.subdivision.toLowerCase().includes(q)
  );
}

export const findFirstYearTopic = findMbbsTopic;
