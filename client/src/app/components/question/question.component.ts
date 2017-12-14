import { Component, Input } from '@angular/core';
import { Question } from '../../interfaces/question.interface';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'game-questions',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent {
  @Input() question: Question;
  constructor(
    public gameService: GameService
  ) { }

  toggler = { active : ''};
  getToggler(e) {
    return this.toggler.active == e;
  }

  setAnswer(answer) {
    let i = this.gameService.currentQuestionIndex;
    if (answer == this.gameService.correctAnswers[i]) {
      this.gameService.answers[i].guessed = true;
      this.gameService.answers[i].score = 1;
    }
    this.toggler.active = answer;
  }

}
