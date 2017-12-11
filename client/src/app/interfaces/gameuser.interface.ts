export interface GameUser{
  _gameId: string,
  _userId: string,
  status: string,
  userAnswers: [object],
  userPosition: number,
  createdAt: Date,
  updatedAt: Date,
}
