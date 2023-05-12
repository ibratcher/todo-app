import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {Task, TasksService} from "../Shared/tasks.service";
import {AuthService} from "@auth0/auth0-angular";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit, OnDestroy {
  taskForm = this.fb.group({
    taskTitle: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    isComplete: new FormControl('false', Validators.required)
  });

  authSub: Subscription = new Subscription();
  email: string = '';
  constructor(private fb: FormBuilder, private tasksService: TasksService, private auth: AuthService) {}
  ngOnInit(): void {
        this.authSub = this.auth.user$.subscribe( (profile) => {
          this.email = profile!.email!;
        })
    }

  onSubmit(): void {
    const title = <string>this.taskForm.value.taskTitle;
    const description = <string>this.taskForm.value.description;
    const isComplete = (this.taskForm.value.isComplete === 'true'); // convert string to boolean
    const task: Task = new Task(title, description, isComplete, this.email);
    this.tasksService.addTask(task);
    this.taskForm.reset();

    // Clears form errors after submission, which .reset() does not do
    Object.keys(this.taskForm.controls).forEach(key => {
      this.taskForm.get(key)!.setErrors(null) ;
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
