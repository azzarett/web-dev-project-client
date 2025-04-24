import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
  ],
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss'],
})
export class TaskCreateComponent {
  form;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private message: NzMessageService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      details: [''],
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;

    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      this.message.error('Пожалуйста, войдите в систему');
      this.router.navigate(['/login']);
      return;
    }

    const taskData = { 
      ...this.form.value, 
      title: this.form.value.title || '', 
      details: this.form.value.details || undefined 
    };
    this.taskService.createTask(taskData).subscribe({
      next: () => {
        this.message.success('Задача создана');
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        if (err.status === 401) {
          this.message.error('Ошибка авторизации');
          this.router.navigate(['/login']);
        } else {
          this.message.error('Ошибка при создании');
        }
        this.loading = false;
      },
    });
  }
}
