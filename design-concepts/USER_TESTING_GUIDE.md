# User Testing Guide for Design Concepts

This guide helps you conduct structured user testing sessions to evaluate all 4 design concepts and make an informed decision.

---

## Overview

**Goal**: Determine which design philosophy best solves the core problems:
1. Users feel stressed/stupid when they can't diagnose
2. Users don't focus on AI guider reasoning (the core learning mechanism)
3. Users don't realize they need to do 1000 cases to build clinical reasoning

**Method**: Observe real users interacting with each concept, then collect structured feedback.

**Time**: 45-60 minutes per participant (10 mins per concept + discussion)

---

## Participant Selection

### Ideal Participants

- **3rd year MBBS students** (target demographic for PSM/FMT mode)
- **2nd year students** who haven't started clinical rotations
- **Mix of personality types**:
  - Confident vs anxious students
  - Competitive vs collaborative learners
  - Those struggling with clinical reasoning

### How Many?

- **Minimum**: 5 participants
- **Ideal**: 8-10 participants
- **Why**: You'll see patterns emerge after 5 users; 10 gives you confidence

---

## Testing Setup

### Technical Preparation

1. **Run all 4 concepts on different ports**:
```bash
# Terminal 1
cd design-concepts/01-mentor-journey
npm install && npm run dev
# Opens on http://localhost:5173

# Terminal 2
cd design-concepts/02-training-montage
npm install && npm run dev
# Opens on http://localhost:5174

# Terminal 3
cd design-concepts/03-detective-story
npm install && npm run dev
# Opens on http://localhost:5175

# Terminal 4
cd design-concepts/04-learning-mirror
npm install && npm run dev
# Opens on http://localhost:5176
```

2. **Prepare your laptop/screen**:
   - Bookmarks with all 4 concept URLs
   - Screen recording software (optional but recommended)
   - Notepad/device for observations

3. **Test environment**:
   - Quiet space, 1-on-1 if possible
   - Participant uses the laptop/mouse (not you)
   - You observe silently during interaction

---

## Testing Protocol

### Introduction (2 minutes)

**What to say**:

> "I'm designing a medical education app and exploring different approaches. I have 4 prototypes—they all do the same thing but feel very different. I want to understand which one resonates with you most.
>
> I'll show you each prototype for about 10 minutes. Please interact naturally—think out loud if you can. There are no wrong answers. I'm testing the designs, not you.
>
> After seeing all 4, I'll ask you some questions. Sound good?"

**Key points**:
- Set expectation: 4 concepts, ~10 mins each
- Emphasize: Testing the design, not the user
- Encourage: Think aloud (but don't force it)
- No guidance: Let them explore naturally

---

### Per-Concept Testing (10 minutes each)

#### Randomize Order

Test concepts in different orders for different participants to avoid bias:
- Participant 1: Mentor → Training → Detective → Mirror
- Participant 2: Training → Detective → Mirror → Mentor
- Participant 3: Detective → Mirror → Mentor → Training
- Etc.

#### For Each Concept

1. **Open the concept** (don't explain anything)
2. **Let them explore for 8-10 minutes**
3. **Observe silently**:
   - Where do they click first?
   - What do they read carefully vs skim?
   - Do they hesitate or dive in?
   - Do they read the mentor/Watson/mirror commentary?
   - Do they seem stressed or relaxed?
   - Do they smile, nod, or show frustration?

4. **Take notes** using the observation checklist below

---

## Observation Checklist

For each concept, mark Yes/No/Partial and note specific behaviors:

### Concept: _______________

**Attention & Focus**
- [ ] Did they read the hero/subtitle on homescreen?
- [ ] Did they read the guider/mentor/Watson/mirror commentary?
- [ ] Did they focus more on the patient or the guidance?
- [ ] Did they re-read any commentary (sign of engagement)?

**Emotional Response**
- [ ] Did they seem relaxed vs stressed?
- [ ] Did they smile or show positive emotions?
- [ ] Did they hesitate before starting?
- [ ] Did they show confidence in their actions?

**Understanding**
- [ ] Did they understand what to do without asking?
- [ ] Did they mention or understand the 1000-case goal?
- [ ] Did they grasp the concept's metaphor (mentor/training/detective/learning)?

**Engagement**
- [ ] Did they spend the full 10 minutes engaged?
- [ ] Did they want to continue or finish quickly?
- [ ] Did they explore multiple phases (history → exam → investigations)?
- [ ] Did they read the feedback/summary at the end?

**Specific Behaviors**

_Note anything interesting they said or did:_

---

## Post-Testing Interview (15 minutes)

After they've seen all 4 concepts, ask these questions in order:

### Comparative Questions

**1. Stress & Confidence**

> "Which concept made you feel least stressed or most confident?"

_Look for_: Do they immediately name one, or struggle to decide?

**Follow-up**: "Why? What about it felt different?"

---

**2. Learning Focus**

> "In which concept did you pay the most attention to the guidance/feedback (the mentor, Watson, mirror, or coaching)?"

_Look for_: Do they mention the specific sidebar or commentary?

**Follow-up**: "Why did you pay attention there vs the others?"

---

**3. 1000-Case Journey**

> "One of the goals is to get users to solve 1000 cases to build clinical reasoning. Which concept made you most want to do many cases?"

_Look for_: Do they connect with the metaphor (rounds, reps, mysteries, neural paths)?

**Follow-up**: "What about it made you want to continue?"

---

**4. Personal Preference**

> "If you had to use one of these daily for the next 3 months, which would you choose?"

_Look for_: This is the ultimate preference test.

**Follow-up**: "What's the main reason?"

---

**5. Emotional Resonance**

> "Which one made you *feel* something—like motivated, curious, or understood?"

_Look for_: Emotional connection drives retention.

---

**6. Missing Elements**

> "Was there anything you wished one of them had, or anything that felt unnecessary?"

_Look for_: Ideas for improvement or features that don't land.

---

### Specific Design Questions

**7. Mentor Journey**

> "The first/second/third/fourth concept (Mentor Journey) had a mentor guiding you. Did that feel helpful or hand-holdy?"

---

**8. Training Montage**

> "The training/gym concept used reps and streaks. Did that motivate you or feel gimmicky?"

---

**9. Detective Story**

> "The detective/mystery concept had Watson as your partner. Did that make it feel collaborative or silly?"

---

**10. Learning Mirror**

> "The split-screen concept showed what you were learning in real-time. Was that helpful or distracting?"

---

### Closing Question

**11. Overall Reaction**

> "If you could describe each concept in one word, what would it be?"

_Look for_: Quick emotional labels (e.g., "calming", "energizing", "fun", "smart")

---

## Quantitative Scoring (Optional)

If you want numerical data, ask participants to rate each concept 1-10 on:

| Criterion | Mentor | Training | Detective | Mirror |
|-----------|--------|----------|-----------|--------|
| Reduces my stress | | | | |
| Makes me focus on learning | | | | |
| Makes me want to do 1000 cases | | | | |
| Overall preference | | | | |

---

## Analysis Framework

After testing 5-10 users, compile your notes:

### Look for Patterns

1. **Which concept scored highest on stress reduction?**
   - Count how many users said it reduced stress
   - Note specific quotes

2. **Which concept got users to read the guider commentary?**
   - Did you see their eyes go to the sidebar/mirror?
   - Did they mention it unprompted?

3. **Which concept made the 1000-case goal feel achievable?**
   - Did they connect with the metaphor (rounds/reps/mysteries)?
   - Did they say they'd want to continue?

4. **Which concept got the most "I'd use this daily" votes?**
   - This is your north star metric

### Segment by User Type

- **Anxious students**: Did they prefer Mentor Journey?
- **Competitive students**: Did they prefer Training Montage?
- **Curious students**: Did they prefer Detective Story?
- **Analytical students**: Did they prefer Learning Mirror?

---

## Decision Framework

### Clear Winner Scenario

If one concept scores highest on all 3 core metrics (stress, attention to guider, 1000-case desire) **and** gets most "daily use" votes → Build that one.

### Split Decision Scenario

If different concepts excel at different things:

**Option A: Hybrid Approach**
- Use Mentor Journey for onboarding (first 10 cases)
- Let users switch to their preferred mode after

**Option B: Pick the Safest**
- If no clear winner, go with the concept that:
  1. Reduces stress most (priority #1)
  2. Gets users to read guider commentary (priority #2)
  3. Has fewest "I dislike this" reactions

**Option C: Build Two Modes**
- If you see clear segment preferences (e.g., anxious users → Mentor, competitive → Training), consider allowing mode switching in the final product

---

## Red Flags to Watch For

During testing, these are warning signs a concept isn't working:

- **User asks "What do I do?"** repeatedly → Unclear UX
- **User skips/ignores the guider commentary** → Core mechanism failing
- **User seems bored or rushes through** → Not engaging
- **User says "This feels like another test"** → Not solving stress problem
- **User doesn't understand the 1000-case goal** → Metaphor not landing

---

## Sample Size Guidelines

- **After 3 users**: You'll have initial hunches
- **After 5 users**: Patterns will emerge
- **After 8 users**: You'll have confidence
- **After 10 users**: Diminishing returns (you'll hear the same feedback)

**Don't over-test**: 5-8 users is enough to make a decision.

---

## Documentation Template

Create a simple doc to track results:

```
USER TESTING RESULTS

Date: [Date range]
Participants: [Count and brief demographics]

RESULTS:

Stress Reduction Winner: [Concept name]
- [Count] users said it reduced stress
- Key quotes: "[Quote 1]", "[Quote 2]"

Guider Attention Winner: [Concept name]
- [Count] users focused on commentary
- Observed: [Behavior notes]

1000-Case Motivation Winner: [Concept name]
- [Count] users wanted to continue
- Key quotes: "[Quote 1]", "[Quote 2]"

Daily Use Preference: [Concept name]
- [Count] users chose it for daily use

DECISION: [Concept name]
RATIONALE: [2-3 sentences on why]

NEXT STEPS:
1. [Action item]
2. [Action item]
```

---

## Tips for Great Testing

### Do's

✅ **Let users struggle** - Don't jump in to help
✅ **Observe body language** - Smiles, nods, frowns tell a story
✅ **Ask "why" follow-ups** - Dig deeper into their answers
✅ **Test in realistic setting** - Their laptop, their environment if possible
✅ **Record sessions** (with permission) - You'll catch things you missed

### Don'ts

❌ **Don't explain the concepts** - Let the design speak
❌ **Don't lead with questions** - "Did you like X?" vs "What did you think of X?"
❌ **Don't defend your design** - You're learning, not convincing
❌ **Don't test friends/family** - They're too biased
❌ **Don't skip the observation phase** - Watching > Asking

---

## After Testing: Implementation

Once you've chosen a concept:

1. **Build it properly** in your main codebase
2. **Test it again** with the same users (validate it feels right)
3. **Iterate** based on remaining feedback
4. **Consider** keeping other concepts as "modes" users can switch to

---

## Questions During Testing?

If you're stuck during testing, here's what to do:

**User asks what to do**: "Explore however feels natural. There's no wrong way."

**User asks which you prefer**: "I'm trying to learn from you—what do *you* think?"

**User asks what the app is for**: "It's for building clinical reasoning through patient cases. But I want to know which approach feels right to you."

---

## Good Luck! 🎯

Remember: You're not testing to validate your favorite concept. You're testing to discover what actually works for your users. Be open to surprises—sometimes the one you least expect wins.
