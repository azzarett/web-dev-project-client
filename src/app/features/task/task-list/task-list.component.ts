import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Task, TagService, TaskService } from '../task.service';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    NzSpinModule,
    NzAvatarModule,
    NzMenuModule,
    NzIconModule,
    NzButtonModule,
    HeaderComponent,
    NzSelectModule,
    FormsModule
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  loading = false;

  viewMode: 'all' | 'filtered' = 'all';
  selectedTag = 0; // —1 не нужен, 0=Без тега, >0=по тегу

  constructor(
    private taskService: TaskService,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks().subscribe({
      next: tasks => {
        this.tasks = tasks;
        this.applyFilter();
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.message.error('Не удалось загрузить задачи');
        if (err.status === 401) this.router.navigate(['/login']);
      }
    });
  }

  applyFilter(): void {
    if (this.viewMode === 'all') {
      this.filteredTasks = [...this.tasks];
    } else {
      // filtered
      if (this.selectedTag === 0) {
        // без тегов
        this.filteredTasks = this.tasks.filter(t => !t.tags || t.tags.length === 0);
      } else {
        // по конкретному тегу
        this.filteredTasks = this.tasks.filter(t =>
          t.tags?.some(tag => tag.id === this.selectedTag)
        );
      }
    }
  }

  onViewChange(view: 'all' | 'filtered'): void {
    this.viewMode = view;
    this.applyFilter();
  }

  onTagSelected(tagId: number): void {
    this.selectedTag = tagId;
    this.applyFilter();
  }

  addTask(): void {
    this.router.navigate(['/tasks/new']);
  }

  getTagNames(tags: { id: number; name: string }[] = []): string {
    return tags.length ? tags.map(t => t.name).join(', ') : 'Без тега';
  }
}
