import { Component, OnInit } from '@angular/core';
import { TrainigService } from './training.service';

import { Store } from '@ngrx/store';
import * as fromTraining from './training.reducer';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {

  ongoingTraining$: Observable<boolean>;

  constructor(private trainingService: TrainigService, private store: Store<fromTraining.State>) {
    console.log('trainig comp')
  }

  ngOnInit() {
    this.ongoingTraining$ = this.store.select(fromTraining.getIsTrainig)
  }

}
