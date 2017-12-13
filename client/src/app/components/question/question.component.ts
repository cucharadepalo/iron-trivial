import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Question } from '../../interfaces/question.interface';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  @Input() question: Question;
  constructor() { }

  ngOnInit() {
  }

}
