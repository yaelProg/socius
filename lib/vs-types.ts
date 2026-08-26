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
  lifeStory: string
  palette: CitizenPalette
  // experiment reaction
  initialOpinion: Opinion
  finalOpinion: Opinion
  changeReason?: string
  // placement on the map: which route + phase offset (0..1) + speed
  route: number
  phase: number
  speed: number
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

export type GridPoint = { gx: number; gy: number }
