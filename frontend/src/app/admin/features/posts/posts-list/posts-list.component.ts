import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { IPost } from '../../../../core/interfaces/models/post.model.interface';
import { PostService } from '../../../../core/services/post.service';
import { ModalService } from '../../../../core/services/modal.service';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent {
  moment = moment;
  posts: IPost[] = [];
  selectedPosts: Set<number> = new Set();
  postService = inject(PostService);
  modalService = inject(ModalService);

  constructor() {
    this.loadAdminPosts();
  }

  isAllSelected(): boolean {
    return (
      this.selectedPosts.size === this.posts.length && this.posts.length > 0
    );
  }

  toggleAllRows(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.posts.forEach((post) => this.selectedPosts.add(post.id));
    } else {
      this.selectedPosts.clear();
    }
  }

  toggleRowSelection(postId: number): void {
    if (this.selectedPosts.has(postId)) {
      this.selectedPosts.delete(postId);
    } else {
      this.selectedPosts.add(postId);
    }
  }

  loadAdminPosts() {
    this.postService.getAdminPosts({}).subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (error) => {
        console.error('Error loading admin posts:', error);
        // Add error handling here
      },
      complete: () => {
        console.log('Admin posts loading completed');
      },
    });
  }

  deleteSelectedPosts() {
    const selectedPostIds = Array.from(this.selectedPosts);
    let promises = selectedPostIds.map((id) => {
      let ob = this.postService.deletePost(id);
      return lastValueFrom(ob);
    });

    Promise.all(promises)
      .then(() => {
        this.modalService.showDeleted('Post erfolgreich entfernt');
        this.loadAdminPosts();
        this.selectedPosts.clear();
      })
      .catch((error) => {
        this.modalService.showError('Fehler beim Löschen des Posts');
        console.error('Error deleting posts:', error);
      });
  }
}
