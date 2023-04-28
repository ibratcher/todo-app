import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

export class Task {
  constructor(public title: string, public content: string, public taskComplete: boolean, public cols: number, public rows: number) {
  }
}

@Injectable({
  providedIn: 'root'
})

export class TasksService {
  tasksChanged = new Subject<Task[]>();
  rootURL = 'https://localhost:3080/api/';

  private tasks: Task[] = [
    new Task('Task 1', "This is task 1", false, 1, 1),
    new Task('Task 2', 'This is task 2', false, 1, 1),
    new Task('Task 3', 'This is task 3', false, 1, 1),
    new Task('Task 4', 'This is task 4', false, 1, 1),
  ];

  constructor(private http: HttpClient) {
  }

  //Grab all tasks from the backend
  getTasksFromBackend() {
    this.http.get<Task[]>(this.rootURL + 'tasks').subscribe((tasks: Task[]) => {
      this.tasks = tasks;
      this.tasksChanged.next(this.tasks.slice());
    });
  }
  getTasks() {
    return this.tasks.slice();
  }
}
