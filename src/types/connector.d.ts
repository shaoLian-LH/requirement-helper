import type { Position } from 'vscode'
export interface UserInfo { 
  account: string
  pwd: string
}

export interface PlatformSetting { 
  name: string
  address: string
}

export type RequirementType = 'story' | 'bug' | 'case'

export interface Requirement { 
  type: RequirementType
  id: string
  position: {
    commendCharStart: Position
    commendCharEnd: Position
    typeCharStart: Position
    typeCharEnd: Position
    codeCharStart: Position
    codeCharEnd: Position
    start: Position
    end: Position
  }
}

export interface PressedRequirementInfo { 
  id: string
  title: string
  desc: string
  ref: Requirement
}