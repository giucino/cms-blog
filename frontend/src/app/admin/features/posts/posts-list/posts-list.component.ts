// import { SelectionModel } from '@angular/cdk/collections';
// import { Component, inject } from '@angular/core';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatIcon } from '@angular/material/icon';
// import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// import { RouterModule } from '@angular/router';
// import moment from 'moment';
// import { lastValueFrom } from 'rxjs';
// import { IPost } from '../../../../core/interfaces/models/post.model.interface';
// import { PostService } from '../../../../core/services/post.service';

// @Component({
//   selector: 'app-posts-list',
//   standalone: true,
//   imports: [
//     MatTableModule,
//     MatCheckboxModule,
//     MatButtonModule,
//     MatIcon,
//     RouterModule,
//   ],
//   templateUrl: './posts-list.component.html',
//   styleUrl: './posts-list.component.scss',
// })
// export class PostsListComponent {
//   moment = moment;
//   displayedColumns: string[] = [
//     'select',
//     'id',
//     'title',
//     'totalComments',
//     'categoryId',
//     'createdAt',
//     'updatedAt',
//     'actions',
//   ];
//   dataSource = new MatTableDataSource<IPost>([]);
//   selection = new SelectionModel<IPost>(true, []);
//   postService = inject(PostService);

//   constructor() {
//     this.loadAdminPosts();
//   }

//   /** Whether the number of selected elements matches the total number of rows. */
//   isAllSelected() {
//     const numSelected = this.selection.selected.length;
//     const numRows = this.dataSource.data.length;
//     return numSelected === numRows;
//   }

//   /** Selects all rows if they are not all selected; otherwise clear selection. */
//   toggleAllRows() {
//     if (this.isAllSelected()) {
//       this.selection.clear();
//       return;
//     }

//     this.selection.select(...this.dataSource.data);
//   }

//   /** The label for the checkbox on the passed row */
//   checkboxLabel(row?: IPost): string {
//     if (!row) {
//       return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
//     }
//     return `${this.selection.isSelected(row) ? 'deselect' : 'select'} `;
//   }

//   // loadPosts() {
//   //   this.postService.getPosts({}).subscribe((tags) => {
//   //     this.dataSource.data = tags;
//   //   });
//   // }

//   loadAdminPosts() {
//     this.postService.getAdminPosts({}).subscribe({
//       next: (posts) => {
//         this.dataSource.data = posts;
//       },
//       error: (error) => {
//         console.error('Error loading admin posts:', error);
//         // Hier Fehlerbehandlung hinzufügen
//       },
//       complete: () => {
//         // Optional: Hier kann man Aktionen definieren, die nach Abschluss des Observables ausgeführt werden sollen
//         console.log('Admin posts loading completed');
//       },
//     });
//   }

//   deleteSelectedPosts() {
//     const selectedTags = this.selection.selected;
//     const selectedCategoryIds = selectedTags.map((category) => category.id);
//     let promises = selectedCategoryIds.map((id) => {
//       let ob = this.postService.deletePost(id);
//       // convert into promise
//       return lastValueFrom(ob);
//     });

//     Promise.all(promises).then(() => {
//       this.loadAdminPosts();
//     });
//   }
// }

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

    Promise.all(promises).then(() => {
      this.modalService.showDeleted('Post erfolgreich entfernt');
      this.loadAdminPosts();
      this.selectedPosts.clear();
    });
  }
}
