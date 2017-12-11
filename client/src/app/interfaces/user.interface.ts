export interface User {
  username: string,
  id: string,
  // This keys aren't present in the JSON file
  // isAdmin: boolean,
  // githubId: string,
  // facebookId: string,
  questions: Array<object>,
  stats: object,
  gamesPlayed: number,
  createdAt: Date,
  updatedAt: Date,
}
