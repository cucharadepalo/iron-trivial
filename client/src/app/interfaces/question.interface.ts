export interface Question {
  creator: string,
  question: string,
  questionImg: string,
  questionIsImg: boolean,
  questionCode: string,
  questionIsCode: boolean,
  category: string,
  correctAnswer: object,
  fakeAnswers: Array<object>,
  approved: boolean,
}
