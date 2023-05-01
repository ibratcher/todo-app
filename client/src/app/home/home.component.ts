import {Component, OnInit, OnDestroy} from '@angular/core';
import {Task, TasksService} from "../Shared/tasks.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy{
  /** Based on the screen size, switch from standard to one column per row */
  tasksList: Task[] = [];
  tasks: Subscription = this.tasksService.tasksChanged.subscribe(
    (tasks: Task[]) => {
      console.log(tasks)
      this.tasksList = tasks;
    }
  );

  constructor(private tasksService: TasksService) {}


  ngOnInit(): void {
    this.tasksService.getTasksFromBackend();
  }

  markTaskComplete(id: number | undefined) {
  if(id)
  {
    this.tasksService.completeTask(id);
  }
  }
  ngOnDestroy(): void {
    this.tasks.unsubscribe();
  }

}
