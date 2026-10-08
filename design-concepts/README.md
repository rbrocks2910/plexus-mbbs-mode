# Design Concept Prototypes

## Purpose

This folder contains 4 interactive design concept prototypes exploring different design philosophies for Plexus. These are **NOT production code** - they are design exploration tools to test different approaches with users and develop design intuition.

## The Problem We're Solving

Users feel stressed when starting cases (lack confidence), don't focus on the AI guider's reasoning lessons (the core learning mechanism), and don't realize they need clinical reasoning training through repetitive practice.

## The 4 Concepts

### 1. Mentor Journey (`01-mentor-journey/`)
**Philosophy**: Remove pressure by reframing as guided observation with a mentor.
- You're not diagnosing alone; you're learning to see with Dr. Plexus
- Mentor sidebar provides instant commentary after every action
- No judgment, just guidance
- **Best for**: Students who want gentle guidance and feel intimidated

### 2. Training Montage (`02-training-montage/`)
**Philosophy**: Clinical reasoning is a muscle. You're in the gym doing reps.
- Dark, motivational aesthetic
- Every case is a "rep" toward mastery
- Progress tracking, streaks, levels
- **Best for**: Competitive, goal-oriented students

### 3. Detective Story (`03-detective-story/`)
**Philosophy**: You're Sherlock Holmes solving mysteries with Watson (AI partner).
- Mystery-solving framework removes test anxiety
- Watson interjects with clues
- Case file aesthetic
- **Best for**: Curious, story-driven learners

### 4. Learning Mirror (`04-learning-mirror/`)
**Philosophy**: Make learning visible in real-time.
- Split-screen shows what you're learning as you act
- Every action has immediate learning annotation
- Visual skill network grows
- **Best for**: Analytical, meta-learners who want to see their growth

## How to Run Each Concept

Each concept is a standalone Vite + React app:

```bash
# Mentor Journey
cd 01-mentor-journey
npm install
npm run dev
# Opens on http://localhost:5173

# Training Montage
cd 02-training-montage
npm install
npm run dev
# Opens on http://localhost:5174

# Detective Story
cd 03-detective-story
npm install
npm run dev
# Opens on http://localhost:5175

# Learning Mirror
cd 04-learning-mirror
npm install
npm run dev
# Opens on http://localhost:5176
```

## User Testing Goals

1. **Which concept reduces stress?** Watch users as they interact. Do they hesitate less?
2. **Which makes them focus on the guider/mentor/Watson?** Do they read the commentary?
3. **Which makes them want to do 1000 cases?** Do they understand the progression?
4. **Which feels right emotionally?** Do they smile? Do they feel engaged?

## What to Observe

- Where do they click first?
- What do they read vs skip?
- Do they understand the purpose immediately?
- Do they ask "what do I do?" or do they just start?
- Do they feel judged or guided?
- Do they mention wanting to try more cases?

## Next Steps

After testing, see `COMPARISON.md` for side-by-side analysis and `USER_TESTING_GUIDE.md` for structured testing protocol.
