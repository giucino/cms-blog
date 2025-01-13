import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ICategory } from '../../../../core/interfaces/models/category.model.interface';
import { IPost } from '../../../../core/interfaces/models/post.model.interface';
import { ITag } from '../../../../core/interfaces/models/tag.model.interface';
import { CategoryService } from '../../../../core/services/category.service';
import { ModalService } from '../../../../core/services/modal.service';
import { PostService } from '../../../../core/services/post.service';
import { TagService } from '../../../../core/services/tag.service';

@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './post-editor.component.html',
  styleUrl: './post-editor.component.scss',
})
export class PostEditorComponent {
  fb = inject(FormBuilder);
  postService = inject(PostService);
  categoryService = inject(CategoryService);
  tagService = inject(TagService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  modalService = inject(ModalService);
  post: IPost | undefined;
  categories: ICategory[] = [];
  allTags: ITag[] = [];
  availableTags: ITag[] = [];

  form = this.fb.group({
    title: ['', Validators.required],
    id: [''],
    content: ['', Validators.required],
    categoryId: [null, Validators.required],
    tagIds: this.fb.array([]),
  });

  get selectedTags(): ITag[] {
    const tagIds = this.form.get('tagIds')?.value as number[];
    return this.allTags.filter((tag) => tagIds.includes(tag.id));
  }

  constructor() {
    this.loadCategories();
    this.loadTags();

    this.route.params.subscribe((data) => {
      const slug = data['slug'];
      if (slug) {
        this.postService.getPostBySlug(slug).subscribe((post) => {
          this.post = post;
          this.form.patchValue({
            id: post.id + '',
            title: post.title,
            content: post.content,
            categoryId: post.categoryId as any,
          });

          this.form.updateValueAndValidity();

          this.tagService.getPostTags(post.id).subscribe((tags) => {
            const tagIds = tags.map((tag) => tag.tagId);

            const tagIdsFormArray = this.form.get('tagIds') as FormArray;
            tagIdsFormArray.clear(); // Clear existing tags
            tagIds.forEach((tagId) => {
              tagIdsFormArray.push(this.fb.control(tagId));
            });
            this.updateAvailableTags();
          });
        });
      }
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  loadTags() {
    this.tagService.getTags().subscribe((tags) => {
      this.allTags = tags;
      this.updateAvailableTags();
    });
  }

  updateAvailableTags() {
    const selectedTagIds = this.form.get('tagIds')?.value as number[];
    this.availableTags = this.allTags.filter(
      (tag) => !selectedTagIds.includes(tag.id)
    );
  }

  create() {
    if (this.form.invalid) return;

    this.postService
      .addPost({
        title: this.form.value.title!,
        content: this.form.value.content!,
        categoryId: Number(this.form.value.categoryId),
        tagIds: this.form.value.tagIds as number[],
      })
      .subscribe({
        next: () => {
          this.modalService.showCreated('Post erfolgreich erstellt');
          this.router.navigate(['/admin/posts']);
        },
        error: (error) => {
          this.modalService.showError('Fehler beim Erstellen des Posts');
          console.error('Create error:', error);
        },
      });
  }

  update() {
    if (this.form.invalid) return;

    this.postService
      .updatePost({
        id: parseInt(this.form.value.id!),
        title: this.form.value.title!,
        content: this.form.value.content!,
        categoryId: Number(this.form.value.categoryId),
        tagIds: this.form.value.tagIds as any[],
      })
      .subscribe({
        next: () => {
          this.modalService.showUpdated('Post erfolgreich aktualisiert');
          this.router.navigate(['/admin/posts']);
        },
        error: (error) => {
          this.modalService.showError('Fehler beim Aktualisieren des Posts');
          console.error('Update error:', error);
        },
      });
  }

  //   // addTag(tagId: number) {
  //   //   const tagIdsFormArray = this.form.get('tagIds') as FormArray;
  //   //   tagIdsFormArray.push(this.fb.control(tagId));
  //   //   // alert(JSON.stringify(tagId));
  //   //   this.showTagsDropdown = false;
  //   // }

  addTag(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const tagId = Number(selectElement.value);
    if (!isNaN(tagId)) {
      const tagIdsFormArray = this.form.get('tagIds') as FormArray;
      tagIdsFormArray.push(this.fb.control(tagId));
      this.updateAvailableTags();
    }
    selectElement.value = ''; // Reset the select element
  }

  removeTag(tagId: number) {
    const tagIdsFormArray = this.form.get('tagIds') as FormArray;
    const index = tagIdsFormArray.controls.findIndex(
      (control) => control.value === tagId
    );
    if (index !== -1) {
      tagIdsFormArray.removeAt(index);
      this.updateAvailableTags();
    }
  }
}
