import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../shared/data.service';
import quizData from '../shared/quiz-data.json';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  loggedInUser: any = {};

  catergoryList: any;

  constructor(private router: Router, private data: DataService) {
    this.data.setCurrentView(this.router.routerState.snapshot.url);
    console.log(this.router.routerState.snapshot.url);
    console.log('-------------------------------');
    console.log(quizData);
    this.catergoryList = quizData;
   }

  ngOnInit() {
    
  }

  openQuiz(name) {
    console.log(name + ' clicked!');
  }

}
