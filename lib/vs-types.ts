export type Opinion = 'positive' | 'considering' | 'neutral' | 'negative'

export type CitizenPalette = {
  skin: string
  hair: string
  top: string
  bottom: string
}

export type ActivityItem = {
  time: string
  text: string
}

export type RelationshipType = 'partner' | 'friend' | 'coworker' | 'family'

export type Relationship = {
  name: string
  type: RelationshipType
}

export type CitizenBehavior = 'walk' | 'sit' | 'stand'

export type Citizen = {
  id: string
  name: string
  age: number
  job: string
  neighborhood: string
  segment: 'Young adults' | 'Families' | 'Older adults'
  personality: {
    openness: number
    extraversion: number
    agreeableness: number
    riskTolerance: number
  }
  interests: string[]
  mood: string
  moodEmoji: string
  activity: ActivityItem[]
  currentActivity: string
  lifeStory: string
  palette: CitizenPalette
  relationships: Relationship[]
  // experiment reaction
  initialOpinion: Opinion
  finalOpinion: Opinion
  changeReason?: string
  // placement on the map: which route + phase offset (0..1) + speed
  route: number
  phase: number
  speed: number
  // visual behavior on the map
  behavior?: CitizenBehavior
  // fixed grid position for non-walking citizens (sit/stand)
  fixedGx?: number
  fixedGy?: number
}

export type BuildingType =
  | 'house'
  | 'apartment'
  | 'office'
  | 'cafe'
  | 'supermarket'
  | 'park'
  | 'tree'

export type Building = {
  id: string
  type: BuildingType
  label?: string
  neighborhood?: string
  gx: number
  gy: number
  w: number // footprint tiles along x
  d: number // footprint tiles along y
  h: number // height in tiles
  billboard?: boolean
}

export type Neighborhood = {
  id: string
  name: string
  positive: number
  zone: 'positive' | 'mixed' | 'negative'
  concerns: string[]
  // approximate center on grid for the heatmap glow
  cx: number
  cy: number
}

export type PropType =
  | 'bench'
  | 'streetlight'
  | 'flower'
  | 'parkedcar'
  | 'bicycle'

export type Prop = {
  id: string
  type: PropType
  gx: number
  gy: number
  rot?: number
  color?: string
}

export type GridPoint = { gx: number; gy: number }
