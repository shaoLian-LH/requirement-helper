export interface OpenedBy {
  id: number;
  account: string;
  avatar: string;
  realname: string;
}

export interface AssignedTo {
  id: number;
  account: string;
  avatar: string;
  realname: string;
}

export interface Team {
  id: number;
  root: number;
  type: string;
  account: string;
  role: string;
  limited: string;
  join: string;
  days: number;
  hours: number;
  estimate: number;
  consumed: number;
  left: number;
  order: number;
  realname: string;
  avatar: string;
  progress: number;
}

export interface Action {
  id: number;
  objectType: string;
  objectID: number;
  product: string;
  project: number;
  execution: number;
  actor: string;
  action: string;
  date: string;
  comment: string;
  extra: string;
  read: string;
  history: any[];
  desc: string;
}

export interface PreAndNext {
  pre: string;
  next: string;
}

export interface TaskDetail {
  id: number;
  project: number;
  parent: number;
  execution: number;
  module: number;
  design: number;
  story: number;
  storyVersion: number;
  designVersion: number;
  fromBug: number;
  name: string;
  type: string;
  pri: number;
  estimate: number;
  consumed: number;
  left: number;
  deadline: string;
  status: string;
  subStatus: string;
  color: string;
  mailto: any[];
  desc: string;
  version: number;
  openedBy: OpenedBy;
  openedDate: Date;
  assignedTo: AssignedTo;
  assignedDate: Date;
  estStarted: string;
  realStarted?: any;
  finishedBy?: any;
  finishedDate?: any;
  finishedList: string;
  canceledBy?: any;
  canceledDate?: any;
  closedBy?: any;
  closedDate?: any;
  planDuration: number;
  realDuration: number;
  closedReason: string;
  lastEditedBy?: any;
  lastEditedDate?: any;
  activatedDate: string;
  deleted: boolean;
  storyID?: any;
  storyTitle?: any;
  latestStoryVersion?: any;
  storyStatus?: any;
  assignedToRealName: string;
  children: any[];
  team: Team[];
  files: any[];
  needConfirm: boolean;
  progress: number;
  storySpec: string;
  storyVerify: string;
  storyFiles: any[];
  executionName: string;
  moduleTitle: string;
  actions: Action[];
  preAndNext: PreAndNext;
}