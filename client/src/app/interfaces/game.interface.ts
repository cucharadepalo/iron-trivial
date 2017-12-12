export interface Game {
  id: string,
  creator: string,
  name: string,
  status: string,
  participants: Array<any>,
  questions: Array<any>,
  ranking: Array<any>,
  createdAt: Date,
  updatedAt: Date,
}
