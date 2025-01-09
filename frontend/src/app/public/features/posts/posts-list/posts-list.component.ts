import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import moment from 'moment';
import 'moment/locale/de';
import { IPost } from '../../../../core/interfaces/models/post.model.interface';
import { PostService } from '../../../../core/services/post.service';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TruncatePipe],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
})
export class PostsListComponent implements AfterContentInit {
  moment: any = moment;

  @Input() categoryId?: number;
  @Input() tagId?: number;
  @Input() showWelcome: boolean = true;
  posts: IPost[] = [];
  postService = inject(PostService);

  constructor() {
    moment.locale('de');
  }

  ngAfterContentInit() {
    this.postService
      .getPublicPosts({
        categoryId: this.categoryId,
        tagId: this.tagId,
      })
      .subscribe({
        next: (data) => {
          this.posts = data;
        },
        error: (error) => {
          console.error('Error loading public posts:', error);
          // Hier können Sie eine Fehlerbehandlung hinzufügen
        },
        complete: () => {
          console.log('Public posts loading completed');
        },
      });
  }
}
