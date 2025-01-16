import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ITag } from '../../../../core/interfaces/models/tag.model.interface';
import { ModalService } from '../../../../core/services/modal.service';
import { TagService } from '../../../../core/services/tag.service';
import { MaxLengthDirective } from '../../../../core/directives/max-length.directive';

@Component({
  selector: 'app-tags-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MaxLengthDirective],
  templateUrl: './tag-editor.component.html',
  styleUrl: './tag-editor.component.scss',
})
export class TagEditorComponent {
  fb = inject(FormBuilder);
  tagService = inject(TagService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  modalService = inject(ModalService);
  tag: ITag | undefined;
  maxLength = 20;

  form = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.pattern(/\S/),
        Validators.maxLength(this.maxLength),
      ],
    ],
    id: [''],
  });

  constructor() {
    this.route.params.subscribe((data) => {
      const slug = data['slug'];
      if (slug) {
        this.tagService.getTag(slug).subscribe((tag) => {
          this.tag = tag;
          this.form.patchValue({
            id: tag.id + '',
            name: tag.name,
          });
          this.form.updateValueAndValidity();
        });
      }
    });
  }

  getRemainingCharacters(): number {
    const nameControl = this.form.get('name');
    return this.maxLength - (nameControl?.value?.length || 0);
  }

  create() {
    if (this.form.invalid) return;

    this.tagService.addTag({ name: this.form.value.name! }).subscribe(() => {
      this.modalService.showCreated('Tag erfolgreich erstellt');
      this.router.navigate(['/admin/tags']);
    });
  }

  update() {
    if (this.form.invalid) return;

    this.tagService
      .updateTag({
        id: parseInt(this.form.value.id!),
        name: this.form.value.name!,
      })
      .subscribe({
        next: () => {
          this.modalService.showUpdated('Tag erfolgreich aktualisiert');
          this.router.navigate(['/admin/tags']);
        },
        error: (error) => {
          this.modalService.showError('Fehler beim Aktualisieren des Tags');
          console.error('Update error:', error);
        },
      });
  }
}
