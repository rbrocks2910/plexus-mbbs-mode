# Design Concept Comparison

This document provides a side-by-side comparison of all 4 design concepts to help you evaluate and choose the direction for Plexus.

## Quick Decision Matrix

| **If the user is...** | **Best Concept** |
|----------------------|------------------|
| Stressed, lacks confidence, feels stupid | **Mentor Journey** |
| Competitive, goal-oriented, likes gamification | **Training Montage** |
| Curious, story-driven, responds to narrative | **Detective Story** |
| Analytical, wants to see explicit growth | **Learning Mirror** |

---

## Philosophy Comparison

| Concept | Core Metaphor | Emotional Driver | Key Message |
|---------|--------------|------------------|-------------|
| **Mentor Journey** | Hospital rounds with a guide | Guidance & safety | "You're not alone. Learn to see with an expert." |
| **Training Montage** | Gym/athletic training | Motivation & momentum | "Every rep builds your diagnostic muscle." |
| **Detective Story** | Mystery-solving with Watson | Curiosity & collaboration | "Every patient is a puzzle to solve together." |
| **Learning Mirror** | Neural network growth | Explicit growth visibility | "Watch your clinical reasoning network grow." |

---

## How Each Solves Core Problems

### Problem 1: Users Feel Stressed/Stupid

| Concept | Solution Approach |
|---------|------------------|
| **Mentor** | Removes judgment entirely—you're *supposed* to not know yet |
| **Training** | Reframes as training, not testing—mistakes are part of reps |
| **Detective** | Makes it a mystery, not a test—exploration without pressure |
| **Mirror** | Shows skills building—even "wrong" actions teach something |

### Problem 2: Users Don't Focus on Guider Reasoning

| Concept | Solution Approach |
|---------|------------------|
| **Mentor** | Mentor speaks constantly in sidebar, always visible |
| **Training** | Micro-feedback after every action keeps attention |
| **Detective** | Watson interjects with clues to guide thinking |
| **Mirror** | Learning annotations appear in real-time, can't be ignored |

### Problem 3: Users Don't Want to Do 1000 Cases

| Concept | Solution Approach |
|---------|------------------|
| **Mentor** | "Rounds walked" feels like accumulating experience |
| **Training** | Reps/levels/streaks make 1000 feel like a fitness goal |
| **Detective** | "Mysteries solved" feels like a detective's career |
| **Mirror** | "Neural network growing" shows tangible brain development |

---

## User Testing Script

### Test Protocol

1. **Show each concept for 5-10 minutes**
2. **Let user interact freely** (don't guide them)
3. **Observe without interrupting**:
   - Where do they click first?
   - What do they read vs skip?
   - Do they hesitate or dive in?
   - Do they smile or look stressed?

4. **After all 4 concepts, ask**:
   - "Which one made you feel least stressed?"
   - "Which one made you want to do 1000 cases?"
   - "Which one taught you the most?"
   - "If you had to choose one to use daily, which would it be?"

### Observation Checklist

For each concept, note:

- [ ] Did they read the guider/mentor/Watson/mirror commentary?
- [ ] Did they mention feeling guided/trained/curious/smart?
- [ ] Did they understand the 1000-case journey?
- [ ] Did they ask "What do I do?" or just start?
- [ ] Did they seem engaged or confused?
- [ ] Did they want to continue after one case?

---

## Design Element Comparison

| Element | Mentor | Training | Detective | Mirror |
|---------|--------|----------|-----------|--------|
| **Color Palette** | Professional blue | Dark + orange/gold | Moody brown/gold | Clean blue/purple |
| **Sidebar** | Mentor (always visible) | Stats (reps/streaks) | Watson (clues) | Learning mirror (real-time) |
| **Progress Metric** | "Rounds walked" | "Reps completed" | "Cases solved" | "Neural pathways" |
| **Feedback Style** | "What you learned" | "Form check" | "Deductions" | "Learning summary" |
| **Tone** | Warm, encouraging | Energetic, motivational | Intriguing, collaborative | Educational, transparent |

---

## Technical Implementation Notes

All 4 concepts are:
- **Standalone Vite + React apps** (no shared dependencies)
- **Using dummy data** from `shared/dummyPatientData.js`
- **Fully interactive** (can click, type, navigate)
- **Responsive** (work on mobile and desktop)
- **No backend** (perfect for user testing without infrastructure)

---

## Strengths & Weaknesses

### Mentor Journey

**Strengths**:
- Removes anxiety most effectively
- Gentle, accessible to all skill levels
- Mentor sidebar provides continuous guidance

**Weaknesses**:
- May feel hand-holdy for confident users
- Less gamification appeal
- Not as visually striking

### Training Montage

**Strengths**:
- Highly motivational for competitive users
- Gamification elements drive engagement
- Makes 1000 cases feel achievable through reps

**Weaknesses**:
- May feel too intense for stressed users
- Dark theme might not appeal to all
- Less educational tone

### Detective Story

**Strengths**:
- Unique narrative hook
- Makes diagnosis feel playful
- Watson adds collaborative element

**Weaknesses**:
- Theme might feel gimmicky to serious users
- Sherlock aesthetic may not resonate with all cultures
- Less explicit about learning outcomes

### Learning Mirror

**Strengths**:
- Most explicit about learning process
- Appeals to meta-learners
- Real-time feedback is powerful

**Weaknesses**:
- Split-screen may feel busy
- Requires more screen real estate
- Less emotional/narrative appeal

---

## Recommendation Framework

### For Early Adoption (First 100 Users)

Start with **Mentor Journey** if your early users are:
- Medical students feeling overwhelmed
- Lacking confidence in clinical skills
- Need gentle onboarding

Start with **Training Montage** if your early users are:
- Self-motivated competitive learners
- Already using Duolingo, fitness apps
- Respond to challenges and metrics

### For Broad Market

**Learning Mirror** or **Mentor Journey** are most universally appealing because they:
- Clearly communicate educational value
- Reduce anxiety without being gimmicky
- Work across different personality types

### For Viral/Differentiation

**Detective Story** is the most unique and memorable:
- Stands out in screenshots/demos
- Easiest to explain in marketing ("Sherlock Holmes for medicine")
- Most likely to generate word-of-mouth

---

## Next Steps

1. **Run user tests** with 5-10 students (ideally 3rd year MBBS)
2. **Measure** which concept:
   - Reduces stress most (ask explicitly + observe body language)
   - Gets most attention on guider/mentor/Watson/mirror
   - Makes users want to continue (ask "Would you do 10 more cases?")
3. **Choose one concept** to develop fully
4. **Iterate** based on feedback
5. **Consider** allowing users to switch between modes in final product

---

## Files Structure Reference

```
design-concepts/
├── 01-mentor-journey/      # Calm, professional, guided
├── 02-training-montage/    # Dark, motivational, gamified
├── 03-detective-story/     # Moody, narrative, collaborative
└── 04-learning-mirror/     # Clean, educational, transparent
```

Each concept is fully functional and can be tested independently.
