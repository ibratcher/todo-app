import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import {TasksService} from "../Shared/tasks.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  /** Based on the screen size, switch from standard to one column per row */
  tasks = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(() => {
      return this.tasksService.getTasks();
    })
  );

  constructor(private breakpointObserver: BreakpointObserver, private tasksService: TasksService) {}
}
