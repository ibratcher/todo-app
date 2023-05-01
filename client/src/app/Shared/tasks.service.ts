import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

export class Task {
  constructor(public title: string, public content: string, public iscomplete: boolean, public id?: number) {
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
      task.iscomplete = true;
      this.http.put<Task>(this.rootURL + 'task/' + id, task).subscribe(() => {
          this.tasksChanged.next(this.tasks.slice());
        }
      );
    }
  }

  deleteTask(index: number) {
    this.tasks.splice(index, 1);
    this.postTasksToBackend();
  }

  getTasksFromBackend() {
    this.http.get<Task[]>(this.rootURL + 'task').subscribe((tasks: Task[]) => {
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
