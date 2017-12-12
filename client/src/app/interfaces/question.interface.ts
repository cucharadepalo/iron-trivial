export interface Question {
  creator: string,
  question: string,
  questionImg: string,
  questionIsImg: boolean,
  questionCode: string,
  questionIsCode: boolean,
  category: string,
  correctAnswer: string,
  answers: Array<string>,
  id: string,
}
