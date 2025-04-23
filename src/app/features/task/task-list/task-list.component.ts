import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports: [
    CommonModule,
    NzSpinModule,
  ],
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  loading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;

    const accessToken = localStorage.getItem('access');
    
    if (!accessToken) {
      this.message.error('Пожалуйста, войдите в систему');
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);

    this.http.get<any[]>('http://127.0.0.1:8000/api/tasks/', { headers }).subscribe({
      next: (res) => {
        this.tasks = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Ошибка загрузки задач', err);
        this.message.error('Не удалось загрузить задачи');
        this.loading = false;
      }
    });
  }

  addTask(): void {
    this.router.navigate(['/tasks/new']);
  }
}
