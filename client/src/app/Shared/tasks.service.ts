import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

export class Task {
  constructor(public title: string, public content: string, public taskComplete: boolean) {
  }
}

@Injectable({
  providedIn: 'root'
})

export class TasksService {
  tasksChanged = new Subject<Task[]>();
  rootURL = '/api/';

  private tasks: Task[] = [
    new Task('Task 1', "This is task 1", false),
    new Task('Task 2', 'This is task 2', false),
    new Task('Task 3', 'This is task 3', false),
    new Task('Task 4', 'This is task 4', false),
  ];

  constructor(private http: HttpClient) {
  }

  //Grab all tasks from the backend
  getTasksFromBackend() {
    this.http.get<Task[]>(this.rootURL + 'task').subscribe((tasks: Task[]) => {
      this.tasks = tasks;
      this.tasksChanged.next(this.tasks.slice());
    });
  }

  getTasks() {
    this.http.post<Task[]>(this.rootURL + 'task', this.tasks).subscribe((tasks: Task[]) => {
        this.tasks = tasks;
        this.tasksChanged.next(this.tasks.slice());
      }
    );
    return this.tasks.slice();
  }
}
