export interface Game {
  id: string,
  creator: string,
  name: string,
  status: string,
  participants: Array<object>,
  questions: Array<object>,
  ranking: Array<object>,
  createdAt: Date,
  updatedAt: Date,
}
