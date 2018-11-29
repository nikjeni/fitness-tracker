import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Exercise } from '../exercise.model';
import { TrainigService } from '../training.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit,OnDestroy {
 
  displayedColumns =['date','name','duration','calories','state']
  dataSource = new MatTableDataSource<Exercise>();
  private exCHangesSubscription:Subscription;

  @ViewChild(MatSort) sort : MatSort;
  @ViewChild(MatPaginator) paginator : MatPaginator;

  constructor(private trainingService:TrainigService) { }

  ngOnInit() {
this.exCHangesSubscription = this.trainingService.finishedExerciseChanged.subscribe((exercises:Exercise[]) =>{
      this.dataSource.data = exercises;
    })
   this.trainingService.fetchCompletedOrCancelledExercises()
  }

  ngAfterViewInit(){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue:string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(){
    if(this.exCHangesSubscription){
      this.exCHangesSubscription.unsubscribe()
    }
  }

}
