import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import moment from 'moment';
import { IComment } from '../../../../core/interfaces/models/comment.model.interface';
import { IPostTag } from '../../../../core/interfaces/models/post-tag.model.interface';
import { IPost } from '../../../../core/interfaces/models/post.model.interface';
import { AuthService } from '../../../../core/services/auth.service';
import { CommentService } from '../../../../core/services/comment.service';
import { FlowbiteService } from '../../../../core/services/flowbite.service';
import { PostService } from '../../../../core/services/post.service';
import { TagService } from '../../../../core/services/tag.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent implements OnInit {
  moment: any = moment;

  route = inject(ActivatedRoute);
  tagsService = inject(TagService);
  postService = inject(PostService);
  commentService = inject(CommentService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  flowbiteService = inject(FlowbiteService);

  form = this.fb.group({
    content: [
      '',
      [Validators.required, Validators.minLength(1), Validators.pattern(/\S/)],
    ],
  });

  post?: IPost;
  postTags: IPostTag[] = [];
  comments: IComment[] = [];

  constructor() {
    this.route.params.subscribe((params) => {
      this.loadPost(params['slug']);
    });
  }

  ngOnInit(): void {
    this.flowbiteService.init();
  }

  loadPost(slug: string) {
    this.postService.getPostBySlug(slug).subscribe((data) => {
      this.post = data;

      this.loadTags();
      this.loadComments();
    });
  }

  loadTags() {
    if (this.post)
      this.tagsService.getPostTags(this.post.id).subscribe((data) => {
        this.postTags = data;
      });
  }

  loadComments() {
    if (this.post)
      this.commentService.getComments(this.post.id).subscribe((data) => {
        this.comments = data;
      });
  }

  submitComment() {
    this.commentService
      .createComment(this.form.value.content!, this.post!.id)
      .subscribe({
        next: () => {
          this.loadComments();
          this.form.reset();
        },
        error: (err) => {
          if (err && err.error && err.error.message) {
            alert(err.error.message);
          }
          console.error(err);
        },
      });
  }

  dropdownStates: { [key: number]: boolean } = {};

  toggleDropdown(commentId: number) {
    this.dropdownStates[commentId] = !this.dropdownStates[commentId];
  }

  deleteComment(id: number) {
    this.commentService.deleteComment(id).subscribe({
      next: () => {
        this.loadComments();
      },
      error: (err) => {
        if (err && err.error && err.error.message) {
          alert(err.error.message);
        }
        console.error(err);
      },
    });
  }

  isRemoveVisible(commentId: number): boolean {
    return this.dropdownStates[commentId];
  }
}
