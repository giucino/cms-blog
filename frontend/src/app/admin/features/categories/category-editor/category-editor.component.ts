import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { ICategory } from '../../../../core/interfaces/models/category.model.interface';
import { CategoryService } from '../../../../core/services/category.service';
import { FlowbiteService } from '../../../../core/services/flowbite.service';
import { ModalService } from '../../../../core/services/modal.service';

@Component({
  selector: 'app-category-editor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
  ],
  templateUrl: './category-editor.component.html',
  styleUrl: './category-editor.component.scss',
})
export class CategoryEditorComponent implements OnInit {
  fb = inject(FormBuilder);
  categoryService = inject(CategoryService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  category: ICategory | undefined;
  flowbite = inject(FlowbiteService);
  modalService = inject(ModalService)

  form = this.fb.group({
    name: ['', Validators.required],
    id: [''],
  });

  constructor() {
    this.route.params.subscribe((data) => {
      const slug = data['slug'];
      if (slug) {
        this.categoryService.getCategoryBySlug(slug).subscribe((category) => {
          this.category = category;
          this.form.patchValue({
            id: category.id + '',
            name: category.name,
          });
          this.form.updateValueAndValidity();
        });
      }
    });
  }

  ngOnInit() {
    this.flowbite.init();
  }

  create() {
    if (this.form.invalid) return;

    this.categoryService
      .addCategory({ name: this.form.value.name! })
      .subscribe(() => {
        this.modalService.show('Kategorie erfolgreich erstellt')
        this.router.navigate(['/admin/categories']);
      });
  }

  update() {
    if (this.form.invalid) return;

    this.categoryService
      .updateCategory({
        id: parseInt(this.form.value.id!),
        name: this.form.value.name!,
      })
      .subscribe(() => {
        this.modalService.show('Kategorie erfolgreich aktualisiert')
        this.router.navigate(['/admin/categories']);
      });
  }
}
