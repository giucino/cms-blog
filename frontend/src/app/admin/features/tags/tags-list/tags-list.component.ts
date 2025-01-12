import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { ITag } from '../../../../core/interfaces/models/tag.model.interface';
import { ModalService } from '../../../../core/services/modal.service';
import { TagService } from '../../../../core/services/tag.service';

@Component({
  selector: 'app-tags-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './tags-list.component.html',
  styleUrl: './tags-list.component.scss',
})
export class TagsListComponent {
  moment = moment;
  tags: ITag[] = [];
  selectedTags: Set<number> = new Set();
  tagService = inject(TagService);
  modalService = inject(ModalService);

  constructor() {
    this.loadTags();
  }

  isAllSelected(): boolean {
    return this.selectedTags.size === this.tags.length && this.tags.length > 0;
  }

  toggleAllRows(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.tags.forEach((tag) => this.selectedTags.add(tag.id));
    } else {
      this.selectedTags.clear();
    }
  }

  toggleRowSelection(tagId: number): void {
    if (this.selectedTags.has(tagId)) {
      this.selectedTags.delete(tagId);
    } else {
      this.selectedTags.add(tagId);
    }
  }

  loadTags() {
    this.tagService.getTags().subscribe({
      next: (tags) => {
        this.tags = tags;
      },
      error: (error) => {
        console.error('Error fetching tags:', error);
      },
      complete: () => {
        console.log('Tags loading completed');
      },
    });
  }

  deleteSelectedTags() {
    const selectedTags = Array.from(this.selectedTags);
    const selectedTagIds = selectedTags.map((tagId) => tagId);

    let promises = selectedTagIds.map((id) => {
      let ob = this.tagService.deleteTag(id);
      // convert into promise
      return lastValueFrom(ob);
    });

    Promise.all(promises)
      .then(() => {
        this.modalService.showDeleted('Tag erfolgreich entfernt');
        this.loadTags();
        this.selectedTags.clear();
      })
      .catch((error) => {
        this.modalService.showError('Fehler beim Löschen des Tags');
        console.error('Delete error:', error);
      });
  }
}
