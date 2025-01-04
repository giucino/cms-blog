import { AfterContentInit, Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostService } from '../../../../core/services/post.service';
import { IPost } from '../../../../core/interfaces/models/post.model.interface';
import moment from 'moment';
import 'moment/locale/de';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [
    RouterLink, TruncatePipe
  ],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss'
})
export class PostsListComponent implements AfterContentInit {
  moment: any = moment;
  
  @Input() categoryId?: number;
  @Input() tagId?: number;
  posts: IPost[] = [];
  postService = inject(PostService);

  constructor() {
    moment.locale('de');
  }

  ngAfterContentInit(){
    this.postService.getPosts({
      categoryId: this.categoryId,
      tagId: this.tagId
    }).subscribe((data)=>{
      this.posts = data;
    });
  }

}