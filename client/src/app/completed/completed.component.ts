import {Component, OnInit, OnDestroy} from '@angular/core';
import {Task, TasksService} from "../Shared/tasks.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.css']
})
export class CompletedComponent implements OnInit, OnDestroy {
  /** Based on the screen size, switch from standard to one column per row */
  tasksList: Task[] = [];
  tasks: Subscription = this.tasksService.tasksChanged.subscribe(
    (tasks: Task[]) => {
      console.log(tasks)
      this.tasksList = tasks;
    }
  );
  email: Subscription = this.tasksService.emailChanged.subscribe(
    (email: string) => {
      console.log(email)
      this.tasksService.getCompletedTasksFromBackend();
    });

  loaded: boolean = false;

  tasksLoaded: Subscription = this.tasksService.tasksLoaded.subscribe(
    (loaded: boolean) => {
      this.loaded = loaded;
    });

  constructor(private tasksService: TasksService) {
  }


  ngOnInit(): void {
    this.tasksService.getCompletedTasksFromBackend();
  }

  markTaskComplete(id: number | undefined) {
    if (id) {
      this.tasksService.completeTask(id);
    }
  }

  onDelete(id: number | undefined) {
    if (id) {
      this.tasksService.deleteTask(id);
    }
  }

  ngOnDestroy(): void {
    this.tasks.unsubscribe();
    this.email.unsubscribe();
    this.tasksLoaded.unsubscribe();
  }

}
