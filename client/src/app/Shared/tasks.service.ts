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
    new Task('Task 1', 'This is the first task', false),
    new Task('Task 2', 'This is the second task', false),
    new Task('Task 3', 'This is the third task', false),
    new Task('Task 4', 'This is the fourth task', false),
  ];

  constructor(private http: HttpClient) {
    this.getTasksFromBackend()
    console.log(this.tasks);
  }

  getTasksFromBackend() {
    this.http.get<Task[]>(this.rootURL + 'task').subscribe((tasks: Task[]) => {
      console.log(tasks);
      this.tasksChanged.next(this.tasks.slice());
      return tasks;
    });
  }

  postTaskToBackend(task: Task) {
    this.http.post<Task[]>(this.rootURL + 'task', this.tasks).subscribe((tasks: Task[]) => {
        console.log(tasks);
      }
    );
  }

  getTasks() {
    return this.tasks.slice();
  }
}
