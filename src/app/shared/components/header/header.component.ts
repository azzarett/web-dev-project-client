import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Tag, TagService } from '../../../features/task/task.service';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ CommonModule, NzAvatarModule, NzSelectModule, FormsModule ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() viewChange = new EventEmitter<'all' | 'filtered'>();
  @Output() tagChange  = new EventEmitter<number>();

  viewOptions = [
    { value: 'all'      as const, label: 'Все задачи' },
    { value: 'filtered' as const, label: 'Отфильтрованные задачи' },
  ];
  selectedView: 'all' | 'filtered' = 'all';

  tags: Tag[] = [];
  selectedTag = 0;       // 0 = «Без тега», >0 = конкретный тег

  showMenu = false;
  username = 'User';

  constructor(
    private tagService: TagService,
    private message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tagService.getTags().subscribe({
      next: tags => {
        this.tags = [{ id: 0, name: 'Без тега' }, ...tags];
        this.tags = [{id: 1, name: 'Тег 1'}, {id: 2, name: 'Тег 2'}, ...tags];
        this.selectedTag = 0; // сбросим тег
      },
      error: () => {
        this.message.error('Не удалось загрузить теги');
      }
    });
  }

  onViewChange(view: 'all' | 'filtered'): void {
    this.selectedView = view;
    this.viewChange.emit(view);
    // если вернулись в «all» — сбросим тег
    if (view === 'all') {
      this.onTagChange(0);
    }
  }

  onTagChange(tagId: number): void {
    this.selectedTag = tagId;
    this.tagChange.emit(tagId);
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
