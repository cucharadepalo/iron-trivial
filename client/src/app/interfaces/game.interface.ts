export interface Game {
  creator: string,
  name: string,
  isFinished: boolean,
  participants: Array<object>,
  questions: Array<object>,
  ranking: Array<object>,
  createdAt: Date,
  updatedAt: Date,
}
