import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;

    const { username, email, password } = this.form.value;

    this.http
      .post('http://127.0.0.1:8000/api/register/', { username, email, password })
      .subscribe({
        next: () => {
          this.message.success('Регистрация успешна!');
          this.login(username!, password!);
        },
        error: (err) => {
          this.message.error('Ошибка регистрации');
          console.error(err);
          this.loading = false;
        }
      });
  }

  login(username: string, password: string) {
    this.http
      .post<{ access: string; refresh: string }>(
        'http://127.0.0.1:8000/api/token/',
        { username, password }
      )
      .subscribe({
        next: (res) => {
          localStorage.setItem('access', res.access);
          localStorage.setItem('refresh', res.refresh);
          this.message.success('Вы вошли в систему!');
          this.router.navigate(['/tasks']);
          this.loading = false;
        },
        error: (err) => {
          this.message.error('Ошибка входа после регистрации');
          console.error(err);
          this.loading = false;
        }
      });
  }
}
