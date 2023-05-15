import {Component, OnInit, OnDestroy} from '@angular/core';
import {Task, TasksService} from "../Shared/tasks.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
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
      this.tasksService.getTasksFromBackend();
    });

  loaded: boolean = false;

  tasksLoaded: Subscription = this.tasksService.tasksLoaded.subscribe(
    (loaded: boolean) => {
      this.loaded = loaded;
    });

  constructor(private tasksService: TasksService) {
  }

  ngOnInit(): void {
    this.tasksService.getTasksFromBackend();
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
