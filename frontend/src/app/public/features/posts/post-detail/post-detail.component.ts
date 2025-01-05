import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  HostListener,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import moment from 'moment';
import { IComment } from '../../../../core/interfaces/models/comment.model.interface';
import { IPostTag } from '../../../../core/interfaces/models/post-tag.model.interface';
import { IPost } from '../../../../core/interfaces/models/post.model.interface';
import { AuthService } from '../../../../core/services/auth.service';
import { CommentService } from '../../../../core/services/comment.service';
import { FlowbiteService } from '../../../../core/services/flowbite.service';
import { PostService } from '../../../../core/services/post.service';
import { TagService } from '../../../../core/services/tag.service';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    RouterModule,
    TruncatePipe,
  ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent implements OnInit, AfterContentInit {
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

  @Input() categoryId?: number;
  @Input() tagId?: number;

  post?: IPost;
  postTags: IPostTag[] = [];
  comments: IComment[] = [];
  posts: IPost[] = [];

  currentSlug?: string; // Variable to store the current slug
  filteredPosts: any[] = []; // Array to store filtered posts
  dropdownStates: { [key: number]: boolean } = {};

  constructor() {
    this.route.params.subscribe((params) => {
      this.currentSlug = params['slug']; // store the current slug
      this.loadPost(params['slug']);
      this.updateFilteredPosts();
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

  toggleDropdown(commentId: number) {
    this.dropdownStates[commentId] = !this.dropdownStates[commentId];
  }

  deleteComment(id: number) {
    this.commentService.deleteComment(id).subscribe({
      next: () => {
        this.loadComments();
        this.dropdownStates[id] = false;
      },
      error: (err) => {
        if (err && err.error && err.error.message) {
          alert(err.error.message);
        }
        console.error(err);
      },
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;

    // Check if the clicked element is not inside any dropdown
    Object.keys(this.dropdownStates).forEach((id) => {
      const dropdownButton = document.getElementById(
        `dropdownComment${id}Button`
      );
      const dropdownMenu = document.getElementById(`dropdownComment${id}`);

      if (
        dropdownButton &&
        dropdownMenu &&
        !dropdownButton.contains(clickedElement) &&
        !dropdownMenu.contains(clickedElement)
      ) {
        this.dropdownStates[+id] = false; // Close the dropdown
      }
    });
  }

  ngAfterContentInit() {
    this.postService.getPublicPosts({
      categoryId: this.categoryId,
      tagId: this.tagId,
    }).subscribe({
      next: (data) => {
        this.posts = data;
        this.updateFilteredPosts();
      },
      error: (error) => {
        console.error('Error loading public post details:', error);
        // Here you can handle the error
      },
      complete: () => {
        console.log('Public post details loading completed');
      }
    });
  }

  private updateFilteredPosts(): void {
    if (this.posts) {
      this.filteredPosts = this.posts.filter(
        (p) => p.slug !== this.currentSlug
      );
    }
  }
}
