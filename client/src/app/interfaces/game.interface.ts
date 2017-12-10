export interface Game {
  creator: string,
  name: string,
  isOpen: boolean,
  isInPlay: boolean,
  isFinished: boolean,
  participants: Array<object>,
  questions: Array<object>,
  ranking: Array<object>,
  createdAt: Date,
  updatedAt: Date,
}
