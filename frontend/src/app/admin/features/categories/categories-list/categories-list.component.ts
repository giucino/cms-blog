import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { ICategory } from '../../../../core/interfaces/models/category.model.interface';
import { CategoryService } from '../../../../core/services/category.service';
import { ModalService } from '../../../../core/services/modal.service';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss',
})
export class CategoriesListComponent {
  moment = moment;
  categories: ICategory[] = [];
  selectedCategories: Set<number> = new Set();
  categoryService = inject(CategoryService);
  modalService = inject(ModalService);

  constructor() {
    this.loadCategories();
  }

  isAllSelected(): boolean {
    return (
      this.selectedCategories.size === this.categories.length &&
      this.categories.length > 0
    );
  }

  toggleAllRows(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.categories.forEach((category) =>
        this.selectedCategories.add(category.id)
      );
    } else {
      this.selectedCategories.clear();
    }
  }

  toggleRowSelection(categoryId: number): void {
    if (this.selectedCategories.has(categoryId)) {
      this.selectedCategories.delete(categoryId);
    } else {
      this.selectedCategories.add(categoryId);
    }
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
      complete: () => {
        console.log('Categories loading completed');
      },
    });
  }

  deleteSelectedCategories() {
    const selectedCategories = Array.from(this.selectedCategories);
    const selectedCategoryIds = selectedCategories.map(
      (categoryId) => categoryId
    );

    let promises = selectedCategoryIds.map((id) => {
      let ob = this.categoryService.deleteCategory(id);
      // convert into promise
      return lastValueFrom(ob);
    });

    Promise.all(promises)
      .then(() => {
        this.modalService.showDeleted('Kategorie erfolgreich entfernt');
        this.loadCategories();
        this.selectedCategories.clear();
      })
      .catch((error) => {
        this.modalService.showError('Fehler beim Löschen der Kategorie');
        console.error('Delete error:', error);
      });
  }
}
