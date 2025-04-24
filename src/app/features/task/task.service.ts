import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  tagId: number | null;
  id: number;
  title: string;
  details: string;
  is_done: boolean;
  tags: Tag[];
  created: string;
  updated: string;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = 'http://127.0.0.1:8000/api/tasks/';

  constructor(private http: HttpClient) {}
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}${id}/`);
  }

  createTask(task: Partial<Task>): Observable<Task> {
    const accessToken = localStorage.getItem('access');

    if (!accessToken) {
      throw new Error('Access token not found');
    }

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${accessToken}`
    );

    return this.http.post<Task>(this.apiUrl, task, { headers });
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}${id}/`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  getAuthHeaders() {
    const token = localStorage.getItem('access');
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl, this.getAuthHeaders());
  }
}

export interface Tag {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class TagService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://127.0.0.1:8000/api/tags/';

  getAuthHeaders() {
    const token = localStorage.getItem('access');
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  }

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}`, this.getAuthHeaders());
  }
}
