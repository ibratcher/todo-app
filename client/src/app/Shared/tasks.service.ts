import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

export class Task {
  constructor(public title: string, public content: string, public is_complete: boolean, public id?: number) {
  }
}

@Injectable({
  providedIn: 'root'
})

export class TasksService {
  tasksChanged = new Subject<Task[]>();
  rootURL = '/api/';

  private tasks: Task[] = [];

  constructor(private http: HttpClient) {
  }

  addTask(task: Task) {
    this.tasks.push(task);
    this.postTasksToBackend();
  }

  getTask(id: number) {
    return this.http.get<Task[]>(this.rootURL + 'task/' + id);
  }

  //Create a new put request to update the task
  completeTask(id: number) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.is_complete = true;
      this.http.patch<Task>(this.rootURL + 'task/' + id, task).subscribe(() => {
          this.tasksChanged.next(this.tasks.slice());
        }
      );
    }
  }

  deleteTask(id: number) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      this.tasks.splice(this.tasks.indexOf(task), 1);
    }
    this.http.delete<Task>(this.rootURL + 'task/' + id).subscribe(() => {
      this.tasksChanged.next(this.tasks.slice());
    });
  }

  getTasksFromBackend() {
    this.http.get<Task[]>(this.rootURL + 'task').subscribe((tasks: Task[]) => {
      this.tasks = tasks;
      this.tasksChanged.next(this.tasks.slice());
    });
  }

  getCompletedTasksFromBackend() {
    this.http.get<Task[]>(this.rootURL + 'task/complete').subscribe((tasks: Task[]) => {
      this.tasks = tasks;
      this.tasksChanged.next(this.tasks.slice());
    });
  }

  postTasksToBackend() {
    this.http.post<Task[]>(this.rootURL + 'task', this.tasks).subscribe(() => {
        this.tasksChanged.next(this.tasks.slice());
      }
    );
  }

  getTasks() {
    return this.tasks.slice();
  }
}
