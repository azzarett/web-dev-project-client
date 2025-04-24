import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { Task, TaskService } from '../task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports: [
    CommonModule,
    NzSpinModule,
    NzAvatarModule,
    NzMenuModule,
    NzIconModule,
    NzButtonModule,
    HeaderComponent,
  ],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks().subscribe({
      next: (res: Task[]) => {
        this.tasks = res;
        this.loading = false;
      },
      error: (err: { status: number; }) => {
        console.error('Ошибка загрузки задач', err);
        this.message.error('Не удалось загрузить задачи');
        this.loading = false;

        // можно здесь делать проверку на 401 и попытку refresh
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  addTask(): void {
    this.router.navigate(['/tasks/new']);
  }
}
