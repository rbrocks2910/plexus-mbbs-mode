import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SRSCard {
  id: string; // Unique ID
  caseId: string;
  topic: string;
  question: string;
  answer: string;
  nextReviewDate: number; // Unix timestamp
  interval: number; // Current interval in days
}

interface SRSState {
  cards: SRSCard[];
  addCards: (newCards: Omit<SRSCard, 'id' | 'nextReviewDate' | 'interval'>[]) => void;
  gradeCard: (id: string, grade: 'NEED_PRACTICE' | 'GOT_IT') => void;
  getDueCards: () => SRSCard[];
  getAllCards: () => SRSCard[];
  seedSampleDeck: () => void;
  clearDeck: () => void;
}

// Simple simplified SM-2 inspired interval generator
const getNextInterval = (currentInterval: number, grade: 'NEED_PRACTICE' | 'GOT_IT'): number => {
  if (grade === 'NEED_PRACTICE') {
    return 0; // Due immediately or same day
  }
  // If Got It:
  if (currentInterval === 0) return 1;
  if (currentInterval === 1) return 3;
  if (currentInterval === 3) return 7;
  if (currentInterval === 7) return 14;
  if (currentInterval === 14) return 30;
  return currentInterval * 2; // Keep scaling
};

const SAMPLE_CARDS: Omit<SRSCard, 'id' | 'nextReviewDate' | 'interval'>[] = [
  {
    caseId: "sample-anat-1",
    topic: "Digastric Triangle (Head, Neck & Face)",
    question: "MBBS University Exam Question: Describe Digastric Triangle under: (1) Anatomical features, boundaries & relations, (2) Blood supply & nerve supply, and (3) Applied clinical anatomy.",
    answer: "### Digastric Triangle Model Answer:\n1. Boundaries: Anteroinferiorly by anterior belly of digastric; posteroinferiorly by posterior belly of digastric & stylohyoid; superiorly by base of mandible.\n2. Floor: Formed by mylohyoid and hyoglossus muscles.\n3. Contents: Submandibular salivary gland, facial artery, facial vein, submandibular lymph nodes, and hypoglossal nerve (CN XII).\n4. Applied: Submandibular sialolithiasis, Ludwig's angina, and neck dissections."
  },
  {
    caseId: "sample-phys-1",
    topic: "Circulatory Shock (Cardiovascular System)",
    question: "MBBS University Exam Question: Define Circulatory Shock, classify its stages, and discuss the physiological principles of management.",
    answer: "### Circulatory Shock Model Answer:\n1. Definition: Life-threatening acute circulatory failure with inadequate tissue perfusion leading to cellular hypoxia.\n2. Stages: (a) Compensated (baroreceptor activation, vasoconstriction), (b) Progressive (tissue ischemia, lactic acidosis, capillary leakage), (c) Irreversible (cellular necrosis, organ failure).\n3. Classification: Hypovolemic, Cardiogenic, Distributive (Septic/Anaphylactic), Obstructive.\n4. Management: Airway & O2, aggressive IV fluid resuscitation (crystalloids/colloids), inotropes/vasopressors, and treating underlying etiology."
  },
  {
    caseId: "sample-bioc-1",
    topic: "Significance of HMP Shunt & G6PD Deficiency (Carbohydrate Metabolism)",
    question: "MBBS University Exam Question: Describe the Pentose Phosphate Pathway (HMP Shunt): functions of NADPH, generation of Ribose-5-Phosphate, and biochemical basis of G6PD deficiency with favism.",
    answer: "### HMP Shunt & G6PD Deficiency Model Answer:\n1. Location: Cytosol of liver, lactating mammary gland, adipose tissue, and erythrocytes.\n2. Key Products: (a) NADPH for reductive biosyntheses (fatty acids, steroids) and maintaining reduced glutathione (GSH); (b) Ribose-5-phosphate for nucleotide synthesis.\n3. G6PD Deficiency: Rate-limiting enzyme G6PD is defective; erythrocytes cannot regenerate NADPH -> decreased GSH -> lipid peroxidation & Heinz body formation -> acute hemolytic anemia upon oxidative stress (e.g., antimalarials, infections, fava beans)."
  }
];

export const useSRSStore = create<SRSState>()(
  persist(
    (set, get) => ({
      cards: [],

      addCards: (newCards) => {
        const now = Date.now();
        // Set nextReviewDate to now so newly completed cases can be revised immediately!
        const cardsToAdd: SRSCard[] = newCards.map((c) => ({
          ...c,
          id: `${now}-${Math.random().toString(36).substring(2, 9)}`,
          nextReviewDate: now,
          interval: 0,
        }));

        set((state) => {
          const existingQuestions = new Set(state.cards.map((c) => c.question.trim().toLowerCase()));
          const uniqueCardsToAdd = cardsToAdd.filter((c) => !existingQuestions.has(c.question.trim().toLowerCase()));
          return { cards: [...state.cards, ...uniqueCardsToAdd] };
        });
      },

      gradeCard: (id, grade) => {
        set((state) => ({
          cards: state.cards.map((card) => {
            if (card.id === id) {
              const newInterval = getNextInterval(card.interval, grade);
              // If Need Practice, schedule for same day / 1 hour later. If Got It, schedule by interval days.
              const nextReviewDate = grade === 'NEED_PRACTICE'
                ? Date.now() + 60 * 60 * 1000 // 1 hour
                : Date.now() + newInterval * 24 * 60 * 60 * 1000;
              return { ...card, interval: newInterval, nextReviewDate };
            }
            return card;
          }),
        }));
      },

      getDueCards: () => {
        const now = Date.now();
        return get().cards.filter((c) => c.nextReviewDate <= now);
      },

      getAllCards: () => {
        return get().cards;
      },

      seedSampleDeck: () => {
        const now = Date.now();
        const sampleToAdd: SRSCard[] = SAMPLE_CARDS.map((c) => ({
          ...c,
          id: `${now}-${Math.random().toString(36).substring(2, 9)}`,
          nextReviewDate: now,
          interval: 0,
        }));

        set((state) => {
          const existingQuestions = new Set(state.cards.map((c) => c.question.trim().toLowerCase()));
          const uniqueToAdd = sampleToAdd.filter((c) => !existingQuestions.has(c.question.trim().toLowerCase()));
          return { cards: [...state.cards, ...uniqueToAdd] };
        });
      },

      clearDeck: () => {
        set({ cards: [] });
      }
    }),
    {
      name: 'plexus-srs-storage',
    }
  )
);
