import {
  AfterContentInit,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import moment from 'moment';
import 'moment/locale/de';
import { IPost } from '../../../../core/interfaces/models/post.model.interface';
import { PostService } from '../../../../core/services/post.service';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [RouterLink, TruncatePipe],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
})
export class PostsListComponent implements  OnInit {
  moment: any = moment;

  @Input() categoryId?: number;
  @Input() tagId?: number;
  posts: IPost[] = [];
  postService = inject(PostService);

  constructor() {
    moment.locale('de');
  }

  ngOnInit() {
    // this.loadPublicPosts();
  }

  ngAfterContentInit() {
    this.postService.getPublicPosts({
      categoryId: this.categoryId,
      tagId: this.tagId,
    }).subscribe({
      next: (data) => {
        this.posts = data;
      },
      error: (error) => {
        console.error('Error loading public posts:', error);
        // Hier können Sie eine Fehlerbehandlung hinzufügen
      },
      complete: () => {
        console.log('Public posts loading completed');
      }
    });
  }

  // ngAfterContentInit() {
  //   this.postService
  //     .getPosts({
  //       categoryId: this.categoryId,
  //       tagId: this.tagId,
  //     })
  //     .subscribe((data) => {
  //       this.posts = data;
  //     });
  // }
}
