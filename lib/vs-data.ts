import type { Building, Citizen, GridPoint, Neighborhood, Prop } from './vs-types'

// ---------------------------------------------------------------------------
// ROADS: horizontal at gy 2/7/12, vertical at gx 2/7/12
// Citizens & cars travel along these closed routes.
// ---------------------------------------------------------------------------
export const ROUTES: GridPoint[][] = [
  // 0 — outer ring
  [
    { gx: 2, gy: 2 },
    { gx: 12, gy: 2 },
    { gx: 12, gy: 12 },
    { gx: 2, gy: 12 },
  ],
  // 1 — central vertical patrol
  [
    { gx: 7, gy: 2 },
    { gx: 7, gy: 12 },
  ],
  // 2 — central horizontal patrol
  [
    { gx: 2, gy: 7 },
    { gx: 12, gy: 7 },
  ],
  // 3 — top-left block loop
  [
    { gx: 2, gy: 2 },
    { gx: 7, gy: 2 },
    { gx: 7, gy: 7 },
    { gx: 2, gy: 7 },
  ],
  // 4 — bottom-right block loop
  [
    { gx: 7, gy: 7 },
    { gx: 12, gy: 7 },
    { gx: 12, gy: 12 },
    { gx: 7, gy: 12 },
  ],
  // 5 — top-right block loop
  [
    { gx: 7, gy: 2 },
    { gx: 12, gy: 2 },
    { gx: 12, gy: 7 },
    { gx: 7, gy: 7 },
  ],
  // 6 — bottom-left block loop
  [
    { gx: 2, gy: 7 },
    { gx: 7, gy: 7 },
    { gx: 7, gy: 12 },
    { gx: 2, gy: 12 },
  ],
]

// car routes (reuse the road ring + cross lines)
export const CAR_ROUTES = [0, 1, 2]

// ---------------------------------------------------------------------------
// BUILDINGS
// ---------------------------------------------------------------------------
export const BUILDINGS: Building[] = [
  // --- Green Park (top-left) : residential ---
  { id: 'b-gp1', type: 'apartment', label: 'Green Park Residences', neighborhood: 'Green Park', gx: 3, gy: 3, w: 2, d: 1, h: 3.2 },
  { id: 'b-gp2', type: 'house', neighborhood: 'Green Park', gx: 6, gy: 3, w: 1, d: 1, h: 1.1 },
  { id: 'b-gp3', type: 'house', neighborhood: 'Green Park', gx: 3, gy: 6, w: 1, d: 1, h: 1.1 },
  { id: 'b-gp4', type: 'house', neighborhood: 'Green Park', gx: 5, gy: 6, w: 1, d: 1, h: 1.3 },
  { id: 'b-gp-t1', type: 'tree', gx: 6, gy: 6, w: 1, d: 1, h: 1 },

  // --- Tech District (top-right) : offices + apartments ---
  { id: 'b-td1', type: 'office', label: 'Nexus Tower', neighborhood: 'Tech District', gx: 8, gy: 3, w: 2, d: 2, h: 5 },
  { id: 'b-td2', type: 'office', label: 'Orbit Labs', neighborhood: 'Tech District', gx: 11, gy: 3, w: 1, d: 2, h: 3.6 },
  { id: 'b-td3', type: 'apartment', neighborhood: 'Tech District', gx: 8, gy: 6, w: 1, d: 1, h: 2.8 },
  { id: 'b-td4', type: 'apartment', neighborhood: 'Tech District', gx: 11, gy: 6, w: 1, d: 1, h: 2.4 },

  // --- Riverside (bottom-left) : shops + homes ---
  { id: 'b-rs1', type: 'cafe', label: 'Café Aroma', neighborhood: 'Riverside', gx: 3, gy: 8, w: 1, d: 1, h: 1.2 },
  { id: 'b-rs2', type: 'supermarket', label: 'SuperFresh Market', neighborhood: 'Riverside', gx: 5, gy: 8, w: 2, d: 1, h: 1.8 },
  { id: 'b-rs3', type: 'house', neighborhood: 'Riverside', gx: 3, gy: 11, w: 1, d: 1, h: 1.1 },
  { id: 'b-rs4', type: 'house', neighborhood: 'Riverside', gx: 6, gy: 11, w: 1, d: 1, h: 1.2 },

  // --- Old Town (bottom-right) : park + homes ---
  { id: 'b-ot-park', type: 'park', label: 'Old Town Green', neighborhood: 'Old Town', gx: 8, gy: 8, w: 3, d: 3, h: 0.18 },
  { id: 'b-ot-t1', type: 'tree', gx: 9, gy: 9, w: 1, d: 1, h: 1.2 },
  { id: 'b-ot-t2', type: 'tree', gx: 10, gy: 10, w: 1, d: 1, h: 1 },
  { id: 'b-ot-t3', type: 'tree', gx: 8, gy: 10, w: 1, d: 1, h: 1.1 },
  { id: 'b-ot1', type: 'house', neighborhood: 'Old Town', gx: 11, gy: 11, w: 1, d: 1, h: 1.1 },

  // --- decorative trees on the outskirts ---
  { id: 'b-t-e1', type: 'tree', gx: 0, gy: 0, w: 1, d: 1, h: 1 },
  { id: 'b-t-e2', type: 'tree', gx: 0, gy: 4, w: 1, d: 1, h: 1.1 },
  { id: 'b-t-e3', type: 'tree', gx: 0, gy: 10, w: 1, d: 1, h: 1 },
  { id: 'b-t-e4', type: 'tree', gx: 14, gy: 1, w: 1, d: 1, h: 1.1 },
  { id: 'b-t-e5', type: 'tree', gx: 14, gy: 9, w: 1, d: 1, h: 1 },
  { id: 'b-t-e6', type: 'tree', gx: 4, gy: 0, w: 1, d: 1, h: 1 },
  { id: 'b-t-e7', type: 'tree', gx: 10, gy: 0, w: 1, d: 1, h: 1.1 },
  { id: 'b-t-e8', type: 'tree', gx: 14, gy: 14, w: 1, d: 1, h: 1 },
  { id: 'b-t-e9', type: 'tree', gx: 1, gy: 14, w: 1, d: 1, h: 1.1 },
]

// billboards sit road-side and light up during an experiment
export const BILLBOARDS: GridPoint[] = [
  { gx: 7, gy: 5 },
  { gx: 5, gy: 7 },
  { gx: 10, gy: 7 },
  { gx: 7, gy: 10 },
]

// ---------------------------------------------------------------------------
// NEIGHBORHOODS (used for results heatmap)
// ---------------------------------------------------------------------------
export const NEIGHBORHOODS: Neighborhood[] = [
  {
    id: 'green-park',
    name: 'Green Park',
    positive: 74,
    zone: 'positive',
    concerns: ['"Charging at home?"', '"Looks great for the school run"'],
    cx: 4.5,
    cy: 4.5,
  },
  {
    id: 'tech-district',
    name: 'Tech District',
    positive: 81,
    zone: 'positive',
    concerns: ['"Finally, a smart EV"', '"Love the price point"'],
    cx: 9.5,
    cy: 4.5,
  },
  {
    id: 'riverside',
    name: 'Riverside',
    positive: 57,
    zone: 'mixed',
    concerns: ['"Is the range enough?"', '"Need to see it in person"'],
    cx: 4.5,
    cy: 9.5,
  },
  {
    id: 'old-town',
    name: 'Old Town',
    positive: 38,
    zone: 'negative',
    concerns: ['"Too expensive"', '"Not relevant"', '"Prefer traditional cars"'],
    cx: 9.5,
    cy: 9.5,
  },
]

// ---------------------------------------------------------------------------
// CITIZENS (only ~26 rendered; "10,000" is conceptual)
// ---------------------------------------------------------------------------
const P = {
  skin: ['#f5cfa8', '#e8b48c', '#c68642', '#8d5524', '#ffdbac'],
  hair: ['#2b1b0e', '#5a3a1a', '#111827', '#b03a2e', '#e8b923', '#7b8794'],
  top: ['#3b6bf0', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#0ea5e9'],
  bottom: ['#374151', '#1f2937', '#4b5563', '#6d28d9', '#0f766e', '#7c2d12'],
}
function pal(a: number, b: number, c: number, d: number) {
  return { skin: P.skin[a], hair: P.hair[b], top: P.top[c], bottom: P.bottom[d] }
}

const genericActivity = (home: string) => [
  { time: '07:40', text: `Left home in ${home}` },
  { time: '08:55', text: 'Arrived at work' },
  { time: '12:30', text: 'Lunch break' },
  { time: '14:10', text: 'Saw an advertisement' },
]

export const CITIZENS: Citizen[] = [
  {
    id: 'c1',
    name: 'Maya Levi',
    age: 29,
    job: 'Graphic Designer',
    neighborhood: 'Green Park',
    segment: 'Young adults',
    personality: { openness: 84, extraversion: 72, agreeableness: 68, riskTolerance: 57 },
    interests: ['Travel', 'Fashion', 'Sustainability', 'Coffee'],
    mood: 'Happy',
    moodEmoji: '🙂',
    activity: [
      { time: '08:12', text: 'Left home' },
      { time: '09:03', text: 'Arrived at work' },
      { time: '12:24', text: 'Lunch with Sarah' },
      { time: '14:10', text: 'Saw an advertisement' },
    ],
    lifeStory:
      'Maya grew up in a small town and moved to the city for design school. She rents a bright apartment in Green Park with her cat, cycles to her studio most mornings, and dreams of a road trip along the coast. She cares deeply about sustainability but keeps a careful eye on her budget.',
    palette: pal(0, 1, 6, 4),
    initialOpinion: 'neutral',
    finalOpinion: 'positive',
    changeReason:
      'Maya was initially unsure about the price, but recommendations from people she trusts increased her interest.',
    route: 3,
    phase: 0.0,
    speed: 1.0,
  },
  { id: 'c2', name: 'Noam Katz', age: 34, job: 'Software Engineer', neighborhood: 'Tech District', segment: 'Young adults', personality: { openness: 71, extraversion: 48, agreeableness: 60, riskTolerance: 66 }, interests: ['Gaming', 'Coffee', 'Cycling'], mood: 'Curious', moodEmoji: '🤔', activity: genericActivity('Tech District'), lifeStory: 'Noam builds apps by day and tinkers with electronics by night. An early adopter who loves a good spec sheet.', palette: pal(1, 0, 0, 0), initialOpinion: 'considering', finalOpinion: 'positive', changeReason: 'The affordable price closed the gap between curiosity and intent.', route: 5, phase: 0.2, speed: 1.15 },
  { id: 'c3', name: 'Sarah Cohen', age: 31, job: 'Marketing Lead', neighborhood: 'Green Park', segment: 'Young adults', personality: { openness: 78, extraversion: 85, agreeableness: 74, riskTolerance: 52 }, interests: ['Fashion', 'Food', 'Travel'], mood: 'Excited', moodEmoji: '😃', activity: genericActivity('Green Park'), lifeStory: 'Sarah is the friend who tells everyone about the next big thing. Highly social and influential in her circle.', palette: pal(4, 4, 5, 3), initialOpinion: 'positive', finalOpinion: 'positive', changeReason: 'Already a fan — became a vocal advocate to friends.', route: 3, phase: 0.55, speed: 1.05 },
  { id: 'c4', name: 'David Mizrahi', age: 42, job: 'Architect', neighborhood: 'Riverside', segment: 'Families', personality: { openness: 63, extraversion: 40, agreeableness: 70, riskTolerance: 38 }, interests: ['Design', 'Hiking', 'Family'], mood: 'Content', moodEmoji: '🙂', activity: genericActivity('Riverside'), lifeStory: 'David balances big projects with school runs. Practical, values reliability over hype.', palette: pal(2, 2, 1, 1), initialOpinion: 'neutral', finalOpinion: 'considering', changeReason: 'Space and safety ratings moved him from skeptical to curious.', route: 6, phase: 0.1, speed: 0.9 },
  { id: 'c5', name: 'Yael Bar', age: 38, job: 'Teacher', neighborhood: 'Riverside', segment: 'Families', personality: { openness: 66, extraversion: 58, agreeableness: 82, riskTolerance: 41 }, interests: ['Reading', 'Gardening', 'Family'], mood: 'Calm', moodEmoji: '😌', activity: genericActivity('Riverside'), lifeStory: 'Yael cares about her two kids and the planet they will inherit. Thoughtful and community-minded.', palette: pal(0, 3, 7, 4), initialOpinion: 'considering', finalOpinion: 'positive', changeReason: 'The family and eco angle resonated strongly.', route: 6, phase: 0.45, speed: 0.95 },
  { id: 'c6', name: 'Omer Shani', age: 26, job: 'Barista', neighborhood: 'Riverside', segment: 'Young adults', personality: { openness: 80, extraversion: 76, agreeableness: 65, riskTolerance: 70 }, interests: ['Music', 'Coffee', 'Skating'], mood: 'Upbeat', moodEmoji: '😎', activity: genericActivity('Riverside'), lifeStory: 'Omer pulls espresso shots and plays in a band on weekends. Open to almost anything new.', palette: pal(1, 2, 3, 5), initialOpinion: 'positive', finalOpinion: 'positive', changeReason: 'Loved the design from the first billboard.', route: 2, phase: 0.3, speed: 1.2 },
  { id: 'c7', name: 'Rivka Adler', age: 67, job: 'Retired Nurse', neighborhood: 'Old Town', segment: 'Older adults', personality: { openness: 42, extraversion: 50, agreeableness: 78, riskTolerance: 24 }, interests: ['Grandkids', 'Cooking', 'Walks'], mood: 'Skeptical', moodEmoji: '😐', activity: genericActivity('Old Town'), lifeStory: 'Rivka has driven the same reliable car for 15 years. Change takes some convincing.', palette: pal(4, 5, 4, 2), initialOpinion: 'negative', finalOpinion: 'negative', changeReason: 'Still prefers a traditional car she can service locally.', route: 4, phase: 0.15, speed: 0.75 },
  { id: 'c8', name: 'Eitan Peretz', age: 71, job: 'Retired Engineer', neighborhood: 'Old Town', segment: 'Older adults', personality: { openness: 55, extraversion: 38, agreeableness: 62, riskTolerance: 30 }, interests: ['Chess', 'History', 'Radio'], mood: 'Doubtful', moodEmoji: '🤨', activity: genericActivity('Old Town'), lifeStory: 'Eitan appreciates good engineering but worries about charging on long trips.', palette: pal(4, 5, 0, 0), initialOpinion: 'negative', finalOpinion: 'considering', changeReason: 'Charging network details eased his biggest concern.', route: 4, phase: 0.6, speed: 0.7 },
  { id: 'c9', name: 'Tamar Golan', age: 24, job: 'Student', neighborhood: 'Tech District', segment: 'Young adults', personality: { openness: 88, extraversion: 69, agreeableness: 71, riskTolerance: 74 }, interests: ['Startups', 'Travel', 'Sustainability'], mood: 'Inspired', moodEmoji: '🤩', activity: genericActivity('Tech District'), lifeStory: 'Tamar studies environmental engineering and evangelizes clean tech to anyone who listens.', palette: pal(0, 4, 4, 3), initialOpinion: 'considering', finalOpinion: 'positive', changeReason: 'Affordability made an aspirational product feel attainable.', route: 5, phase: 0.75, speed: 1.1 },
  { id: 'c10', name: 'Avi Regev', age: 45, job: 'Sales Manager', neighborhood: 'Tech District', segment: 'Families', personality: { openness: 60, extraversion: 82, agreeableness: 58, riskTolerance: 55 }, interests: ['Cars', 'Sports', 'Family'], mood: 'Interested', moodEmoji: '🙂', activity: genericActivity('Tech District'), lifeStory: 'Avi loves cars and is always comparing the next upgrade for the family.', palette: pal(1, 0, 1, 2), initialOpinion: 'considering', finalOpinion: 'positive', changeReason: 'The price-to-features ratio won him over.', route: 0, phase: 0.05, speed: 1.0 },
  { id: 'c11', name: 'Dana Friedman', age: 33, job: 'Nurse', neighborhood: 'Green Park', segment: 'Families', personality: { openness: 64, extraversion: 55, agreeableness: 80, riskTolerance: 43 }, interests: ['Yoga', 'Family', 'Cooking'], mood: 'Happy', moodEmoji: '🙂', activity: genericActivity('Green Park'), lifeStory: 'Dana juggles shifts at the hospital and time with her toddler. Values calm and safety.', palette: pal(0, 1, 5, 4), initialOpinion: 'neutral', finalOpinion: 'considering', changeReason: 'Safety and quiet cabin appealed to her.', route: 3, phase: 0.85, speed: 0.95 },
  { id: 'c12', name: 'Gil Azoulay', age: 28, job: 'Photographer', neighborhood: 'Riverside', segment: 'Young adults', personality: { openness: 90, extraversion: 62, agreeableness: 66, riskTolerance: 68 }, interests: ['Photography', 'Travel', 'Coffee'], mood: 'Curious', moodEmoji: '🤔', activity: genericActivity('Riverside'), lifeStory: 'Gil travels light and shoots landscapes. Loves gear that just works.', palette: pal(2, 0, 7, 1), initialOpinion: 'considering', finalOpinion: 'positive', changeReason: 'Range for road trips sealed the deal.', route: 2, phase: 0.65, speed: 1.05 },
  { id: 'c13', name: 'Noa Shapira', age: 36, job: 'Doctor', neighborhood: 'Green Park', segment: 'Families', personality: { openness: 70, extraversion: 52, agreeableness: 75, riskTolerance: 40 }, interests: ['Running', 'Family', 'Science'], mood: 'Content', moodEmoji: '😌', activity: genericActivity('Green Park'), lifeStory: 'Noa is evidence-driven and wants proof before she commits to anything.', palette: pal(0, 2, 0, 0), initialOpinion: 'neutral', finalOpinion: 'considering', changeReason: 'Independent reviews nudged her toward interest.', route: 0, phase: 0.35, speed: 0.9 },
  { id: 'c14', name: 'Ronen Haim', age: 52, job: 'Accountant', neighborhood: 'Old Town', segment: 'Older adults', personality: { openness: 48, extraversion: 44, agreeableness: 64, riskTolerance: 33 }, interests: ['Finance', 'Fishing', 'News'], mood: 'Neutral', moodEmoji: '😐', activity: genericActivity('Old Town'), lifeStory: 'Ronen runs the numbers on everything. Total cost of ownership matters most.', palette: pal(2, 5, 2, 1), initialOpinion: 'negative', finalOpinion: 'neutral', changeReason: 'Lower running costs softened his stance.', route: 4, phase: 0.9, speed: 0.8 },
  { id: 'c15', name: 'Lior Ben-David', age: 30, job: 'Chef', neighborhood: 'Riverside', segment: 'Young adults', personality: { openness: 76, extraversion: 70, agreeableness: 60, riskTolerance: 62 }, interests: ['Food', 'Travel', 'Design'], mood: 'Upbeat', moodEmoji: '😃', activity: genericActivity('Riverside'), lifeStory: 'Lior runs a busy kitchen and values things that save time.', palette: pal(1, 0, 3, 5), initialOpinion: 'considering', finalOpinion: 'positive', changeReason: 'Convenience and style clicked with him.', route: 6, phase: 0.7, speed: 1.1 },
  { id: 'c16', name: 'Hila Segal', age: 27, job: 'UX Designer', neighborhood: 'Tech District', segment: 'Young adults', personality: { openness: 86, extraversion: 64, agreeableness: 72, riskTolerance: 58 }, interests: ['Design', 'Sustainability', 'Music'], mood: 'Excited', moodEmoji: '🤩', activity: genericActivity('Tech District'), lifeStory: 'Hila obsesses over good design and low footprints. A natural early adopter.', palette: pal(0, 3, 6, 3), initialOpinion: 'positive', finalOpinion: 'positive', changeReason: 'Design language matched her values exactly.', route: 5, phase: 0.4, speed: 1.05 },
  { id: 'c17', name: 'Moshe Klein', age: 63, job: 'Shop Owner', neighborhood: 'Old Town', segment: 'Older adults', personality: { openness: 45, extraversion: 60, agreeableness: 66, riskTolerance: 35 }, interests: ['Community', 'Football', 'Cooking'], mood: 'Skeptical', moodEmoji: '🤨', activity: genericActivity('Old Town'), lifeStory: 'Moshe knows everyone in Old Town. Loyal to what he already trusts.', palette: pal(2, 5, 1, 2), initialOpinion: 'negative', finalOpinion: 'negative', changeReason: 'Sticking with what he knows for now.', route: 4, phase: 0.25, speed: 0.75 },
  { id: 'c18', name: 'Shira Ronen', age: 22, job: 'Student', neighborhood: 'Tech District', segment: 'Young adults', personality: { openness: 89, extraversion: 78, agreeableness: 70, riskTolerance: 76 }, interests: ['Social', 'Music', 'Travel'], mood: 'Excited', moodEmoji: '😃', activity: genericActivity('Tech District'), lifeStory: 'Shira lives online and shapes trends among her friends.', palette: pal(4, 4, 5, 3), initialOpinion: 'positive', finalOpinion: 'positive', changeReason: 'Shared it widely — a social amplifier.', route: 1, phase: 0.5, speed: 1.15 },
  { id: 'c19', name: 'Amit Dror', age: 40, job: 'Electrician', neighborhood: 'Riverside', segment: 'Families', personality: { openness: 58, extraversion: 54, agreeableness: 68, riskTolerance: 50 }, interests: ['DIY', 'Family', 'Sports'], mood: 'Interested', moodEmoji: '🙂', activity: genericActivity('Riverside'), lifeStory: 'Amit understands the tech and likes the idea of home charging.', palette: pal(2, 0, 0, 1), initialOpinion: 'considering', finalOpinion: 'positive', changeReason: 'Home charging convenience made it a no-brainer.', route: 2, phase: 0.85, speed: 0.95 },
  { id: 'c20', name: 'Michal Tal', age: 48, job: 'HR Manager', neighborhood: 'Green Park', segment: 'Families', personality: { openness: 62, extraversion: 66, agreeableness: 76, riskTolerance: 42 }, interests: ['Wellness', 'Family', 'Reading'], mood: 'Content', moodEmoji: '🙂', activity: genericActivity('Green Park'), lifeStory: 'Michal makes careful, people-first decisions for her family.', palette: pal(0, 1, 4, 4), initialOpinion: 'neutral', finalOpinion: 'considering', changeReason: 'Word of mouth from other parents built trust.', route: 0, phase: 0.6, speed: 0.9 },
  { id: 'c21', name: 'Yossi Barkat', age: 58, job: 'Taxi Driver', neighborhood: 'Old Town', segment: 'Older adults', personality: { openness: 50, extraversion: 72, agreeableness: 60, riskTolerance: 46 }, interests: ['Cars', 'News', 'Football'], mood: 'Curious', moodEmoji: '🤔', activity: genericActivity('Old Town'), lifeStory: 'Yossi drives all day and cares about running costs above all.', palette: pal(2, 5, 3, 0), initialOpinion: 'neutral', finalOpinion: 'considering', changeReason: 'Fuel savings over a full day of driving intrigued him.', route: 0, phase: 0.8, speed: 1.0 },
  { id: 'c22', name: 'Efrat Alon', age: 35, job: 'Journalist', neighborhood: 'Green Park', segment: 'Families', personality: { openness: 79, extraversion: 68, agreeableness: 64, riskTolerance: 54 }, interests: ['Writing', 'Politics', 'Coffee'], mood: 'Analytical', moodEmoji: '🤔', activity: genericActivity('Green Park'), lifeStory: 'Efrat asks the hard questions before forming an opinion.', palette: pal(1, 0, 7, 1), initialOpinion: 'neutral', finalOpinion: 'positive', changeReason: 'Balanced coverage and honest pricing won her trust.', route: 3, phase: 0.3, speed: 1.0 },
  { id: 'c23', name: 'Doron Levy', age: 44, job: 'Mechanic', neighborhood: 'Old Town', segment: 'Families', personality: { openness: 52, extraversion: 58, agreeableness: 62, riskTolerance: 48 }, interests: ['Engines', 'Sports', 'Family'], mood: 'Doubtful', moodEmoji: '🤨', activity: genericActivity('Old Town'), lifeStory: 'Doron loves combustion engines and is wary of the EV shift.', palette: pal(2, 0, 1, 5), initialOpinion: 'negative', finalOpinion: 'neutral', changeReason: 'Simpler maintenance surprised him.', route: 4, phase: 0.5, speed: 0.85 },
  { id: 'c24', name: 'Keren Mor', age: 25, job: 'Nurse', neighborhood: 'Tech District', segment: 'Young adults', personality: { openness: 74, extraversion: 60, agreeableness: 78, riskTolerance: 56 }, interests: ['Health', 'Travel', 'Music'], mood: 'Happy', moodEmoji: '🙂', activity: genericActivity('Tech District'), lifeStory: 'Keren wants a first car that is clean, safe and affordable.', palette: pal(0, 3, 6, 4), initialOpinion: 'considering', finalOpinion: 'positive', changeReason: 'The entry price made ownership realistic for her.', route: 1, phase: 0.15, speed: 1.05 },
  { id: 'c25', name: 'Boaz Naveh', age: 39, job: 'Product Manager', neighborhood: 'Tech District', segment: 'Families', personality: { openness: 72, extraversion: 62, agreeableness: 66, riskTolerance: 60 }, interests: ['Tech', 'Family', 'Cycling'], mood: 'Interested', moodEmoji: '🙂', activity: genericActivity('Tech District'), lifeStory: 'Boaz weighs features against family needs with a spreadsheet at hand.', palette: pal(1, 1, 0, 2), initialOpinion: 'considering', finalOpinion: 'positive', changeReason: 'Value for a growing family made sense.', route: 5, phase: 0.9, speed: 1.0 },
  { id: 'c26', name: 'Orly Gat', age: 60, job: 'Librarian', neighborhood: 'Old Town', segment: 'Older adults', personality: { openness: 56, extraversion: 46, agreeableness: 80, riskTolerance: 28 }, interests: ['Books', 'Gardening', 'Grandkids'], mood: 'Neutral', moodEmoji: '😐', activity: genericActivity('Old Town'), lifeStory: 'Orly is gentle and cautious, guided by her close-knit community.', palette: pal(4, 5, 5, 4), initialOpinion: 'negative', finalOpinion: 'neutral', changeReason: 'A trusted friend’s good experience opened her mind a little.', route: 6, phase: 0.25, speed: 0.8 },
]

// ---------------------------------------------------------------------------
// POST-PROCESS: current activity + relationships + some sitting/standing
// ---------------------------------------------------------------------------
const CURRENT: Record<string, string> = {
  c1: 'Having coffee with Sarah', c2: 'Walking to the office', c3: 'Chatting at the café',
  c4: 'Heading home from work', c5: 'Picking up the kids', c6: 'Serving customers at the café',
  c7: 'Resting on a park bench', c8: 'Reading on a bench', c9: 'Cycling through Tech District',
  c10: 'Driving to a client meeting', c11: 'Walking through Green Park', c12: 'Heading to a photoshoot',
  c13: 'Walking to the hospital', c14: 'Strolling through Old Town', c15: 'Prepping the lunch rush',
  c16: 'Sketching at a café table', c17: 'Minding the shop', c18: 'Meeting friends downtown',
  c19: 'Walking to a job site', c20: 'Walking the dog', c21: 'Driving his taxi',
  c22: 'Heading to an interview', c23: 'Walking to the garage', c24: 'Strolling after a shift',
  c25: 'Cycling to a standup', c26: 'Reading on a park bench',
}

const RELS: Record<string, { name: string; type: 'partner' | 'friend' | 'coworker' | 'family' }[]> = {
  c1: [{ name: 'Daniel', type: 'partner' }, { name: 'Sarah Cohen', type: 'friend' }, { name: 'Adam', type: 'coworker' }],
  c2: [{ name: 'Tamar Golan', type: 'friend' }, { name: 'Boaz Naveh', type: 'coworker' }],
  c3: [{ name: 'Maya Levi', type: 'friend' }, { name: 'Efrat Alon', type: 'coworker' }],
  c4: [{ name: 'Yael Bar', type: 'family' }, { name: 'Amit Dror', type: 'friend' }],
  c5: [{ name: 'David Mizrahi', type: 'family' }, { name: 'Michal Tal', type: 'friend' }],
  c6: [{ name: 'Lior Ben-David', type: 'friend' }, { name: 'Gil Azoulay', type: 'friend' }],
  c7: [{ name: 'Eitan Peretz', type: 'friend' }, { name: 'Orly Gat', type: 'friend' }],
  c8: [{ name: 'Rivka Adler', type: 'friend' }, { name: 'Ronen Haim', type: 'friend' }],
  c9: [{ name: 'Noam Katz', type: 'friend' }, { name: 'Hila Segal', type: 'coworker' }],
  c10: [{ name: 'Boaz Naveh', type: 'coworker' }, { name: 'Yossi Barkat', type: 'friend' }],
  c11: [{ name: 'Noa Shapira', type: 'friend' }, { name: 'Keren Mor', type: 'coworker' }],
  c12: [{ name: 'Omer Shani', type: 'friend' }, { name: 'Maya Levi', type: 'coworker' }],
  c13: [{ name: 'Dana Friedman', type: 'friend' }, { name: 'Keren Mor', type: 'coworker' }],
  c14: [{ name: 'Moshe Klein', type: 'friend' }, { name: 'Doron Levy', type: 'friend' }],
  c15: [{ name: 'Omer Shani', type: 'friend' }, { name: 'Gil Azoulay', type: 'coworker' }],
  c16: [{ name: 'Tamar Golan', type: 'friend' }, { name: 'Shira Ronen', type: 'coworker' }],
  c17: [{ name: 'Ronen Haim', type: 'friend' }, { name: 'Yossi Barkat', type: 'friend' }],
  c18: [{ name: 'Shira Ronen', type: 'friend' }, { name: 'Hila Segal', type: 'friend' }],
  c19: [{ name: 'David Mizrahi', type: 'friend' }, { name: 'Doron Levy', type: 'coworker' }],
  c20: [{ name: 'Yael Bar', type: 'friend' }, { name: 'Noa Shapira', type: 'friend' }],
  c21: [{ name: 'Moshe Klein', type: 'friend' }, { name: 'Avi Regev', type: 'coworker' }],
  c22: [{ name: 'Sarah Cohen', type: 'friend' }, { name: 'Efrat Alon', type: 'coworker' }],
  c23: [{ name: 'Yossi Barkat', type: 'friend' }, { name: 'Amit Dror', type: 'coworker' }],
  c24: [{ name: 'Keren Mor', type: 'friend' }, { name: 'Dana Friedman', type: 'coworker' }],
  c25: [{ name: 'Noam Katz', type: 'coworker' }, { name: 'Avi Regev', type: 'friend' }],
  c26: [{ name: 'Rivka Adler', type: 'friend' }, { name: 'Eitan Peretz', type: 'friend' }],
}

const SITTING: Record<string, { gx: number; gy: number }> = {
  c7: { gx: 8.5, gy: 8.5 },
  c8: { gx: 10, gy: 9.2 },
  c26: { gx: 9, gy: 10.5 },
}

CITIZENS.forEach((c) => {
  c.currentActivity = CURRENT[c.id] ?? 'Walking around the city'
  c.relationships = RELS[c.id] ?? []
  if (SITTING[c.id]) {
    c.behavior = 'sit'
    c.fixedGx = SITTING[c.id].gx
    c.fixedGy = SITTING[c.id].gy
  }
})

// ---------------------------------------------------------------------------
// DECORATIVE PROPS (benches, streetlights, flowers, parked cars, bicycles)
// ---------------------------------------------------------------------------
export const PROPS: Prop[] = [
  { id: 'p-bench1', type: 'bench', gx: 8.3, gy: 8.8, rot: 0 },
  { id: 'p-bench2', type: 'bench', gx: 10.2, gy: 9.5, rot: 90 },
  { id: 'p-bench3', type: 'bench', gx: 8.8, gy: 10.6, rot: 0 },
  { id: 'p-sl1', type: 'streetlight', gx: 4, gy: 2 },
  { id: 'p-sl2', type: 'streetlight', gx: 10, gy: 2 },
  { id: 'p-sl3', type: 'streetlight', gx: 2, gy: 9 },
  { id: 'p-sl4', type: 'streetlight', gx: 12, gy: 5 },
  { id: 'p-sl5', type: 'streetlight', gx: 7, gy: 11 },
  { id: 'p-fl1', type: 'flower', gx: 2.4, gy: 7.6 },
  { id: 'p-fl2', type: 'flower', gx: 6.6, gy: 8.4 },
  { id: 'p-fl3', type: 'flower', gx: 11.6, gy: 6.4 },
  { id: 'p-pc1', type: 'parkedcar', gx: 6.4, gy: 7.8, color: '#ef4444' },
  { id: 'p-pc2', type: 'parkedcar', gx: 11.6, gy: 2.4, color: '#10b981' },
  { id: 'p-bike1', type: 'bicycle', gx: 2.6, gy: 8.2 },
  { id: 'p-bike2', type: 'bicycle', gx: 8.2, gy: 6.4 },
]

export const BICYCLE_ROUTES = [1, 2]
