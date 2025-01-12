import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { IComment } from '../../../../core/interfaces/models/comment.model.interface';
import { CommentService } from '../../../../core/services/comment.service';
import { ModalService } from '../../../../core/services/modal.service';

@Component({
  selector: 'app-comments-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './comments-list.component.html',
  styleUrl: './comments-list.component.scss',
})
export class CommentsListComponent {
  moment = moment;
  comments: IComment[] = [];
  selectedComments: Set<number> = new Set();
  commentService = inject(CommentService);
  route = inject(ActivatedRoute);
  postId?: number;
  modalService = inject(ModalService);

  constructor() {
    this.route.params.subscribe((params) => {
      this.postId = params['postId'];

      this.loadComments();
    });
  }

  isAllSelected(): boolean {
    return (
      this.selectedComments.size === this.comments.length &&
      this.comments.length > 0
    );
  }

  toggleAllRows(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.comments.forEach((comment) =>
        this.selectedComments.add(comment.id)
      );
    } else {
      this.selectedComments.clear();
    }
  }

  toggleRowSelection(commentId: number): void {
    if (this.selectedComments.has(commentId)) {
      this.selectedComments.delete(commentId);
    } else {
      this.selectedComments.add(commentId);
    }
  }

  loadComments() {
    this.commentService.getComments(this.postId!).subscribe({
      next: (comments) => {
        this.comments = comments;
      },
      error: (error) => {
        console.error('Error fetching comments:', error);
      },
      complete: () => {
        console.log('Comments loading completed');
      },
    });
  }

  deleteSelectedComments() {
    const selectedComments = Array.from(this.selectedComments);
    const selectedCommentIds = selectedComments.map((commentId) => commentId);

    let promises = selectedCommentIds.map((id) => {
      let ob = this.commentService.deleteComment(id);
      // convert into promise
      return lastValueFrom(ob);
    });

    Promise.all(promises).then(() => {
      this.modalService.showDeleted('Kommentar erfolgreich entfernt');
      this.loadComments();
      this.selectedComments.clear();
    })
    .catch((error) => {
      this.modalService.showError('Fehler beim Löschen des Kommentars');
      console.error('Delete error:', error);
    });
  }
}