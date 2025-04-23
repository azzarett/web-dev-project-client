import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
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
    private http: HttpClient,
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

    // Получаем токены из localStorage
    const accessToken = localStorage.getItem('access');
    const refreshToken = localStorage.getItem('refresh');

    if (!accessToken || !refreshToken) {
      this.message.error('Пожалуйста, войдите в систему');
      this.router.navigate(['/login']);
      return;
    }

    // Если токен истек, пытаемся обновить его
    if (this.isTokenExpired(accessToken)) {
      this.refreshToken(refreshToken);
      return;
    }

    // Добавляем токен в заголовки запроса
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);

    // Отправляем запрос на создание задачи
    this.http
      .post('http://127.0.0.1:8000/api/tasks/', this.form.value, { headers })
      .subscribe({
        next: () => {
          this.message.success('Задача создана');
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          if (err.status === 401) {
            // Обработка ошибки авторизации (например, если токен истек)
            this.message.error('Ошибка авторизации');
            this.router.navigate(['/login']);
          } else {
            this.message.error('Ошибка при создании');
          }
          this.loading = false;
        },
      });
  }

  // Проверка на истечение срока действия токена
  isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1])); // Декодируем JWT
    const expirationDate = new Date(payload.exp * 1000); // Время истечения токена
    return expirationDate < new Date();
  }

  // Обновление токена с помощью refresh token
  refreshToken(refreshToken: string): void {
    this.http
      .post<{ access: string; refresh: string }>(
        'http://127.0.0.1:8000/api/token/refresh/',
        { refresh: refreshToken }
      )
      .subscribe({
        next: (res) => {
          // Сохраняем новые токены в localStorage
          localStorage.setItem('access', res.access);
          localStorage.setItem('refresh', res.refresh);
          // Повторяем запрос с новым токеном
          this.submit();
        },
        error: (err) => {
          this.message.error('Ошибка обновления токена');
          this.router.navigate(['/login']);
          this.loading = false;
        },
      });
  }
}
