import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TagsListComponent } from './tags-list/tags-list.component';
import { TagEditorComponent } from './tag-editor/tag-editor.component';

const routes: Routes = [
  {
    path: '', component: TagsListComponent
  },
  {
    path:'add', component: TagEditorComponent
  },
  {
    path:'edit/:slug', component: TagEditorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagsRoutingModule { }