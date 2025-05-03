export type Prospect = {
  name: string
  role: string
  company: string
  location: string
  linkedinUrl: string
  email: string
}

export type MagicColumnGenerated = {
  answer: string
  reasoning: string
}

export type MagicColumn = {
  question: string
  generated: MagicColumnGenerated
}

export type Account = {
  name: string
  domain: string
  linkedinUrl: string
  signalDescription: string
  signalLink: string
  employees: number
  fundingStage: string
  magicColumns?: MagicColumn[]
}
