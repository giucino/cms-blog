import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPost } from '../interfaces/models/post.model.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  baseUrl = environment.BACKEND_API_URL + '/api/posts';
  httpClient = inject(HttpClient);

  constructor() {}

  getPosts(filters: { categoryId?: number; tagId?: number }): Observable<IPost[]> {
    // Diese Methode für Abwärtskompatibilität beibehalten
    return this.httpClient.get<IPost[]>(this.baseUrl, { params: this.createParams(filters) });
  }

  getPublicPosts(filters: { categoryId?: number; tagId?: number }): Observable<IPost[]> {
    return this.httpClient.get<IPost[]>(`${this.baseUrl}/public`, { params: this.createParams(filters) });
  }

  getAdminPosts(filters: { categoryId?: number; tagId?: number }): Observable<IPost[]> {
    return this.httpClient.get<IPost[]>(`${this.baseUrl}/admin`, { params: this.createParams(filters) });
  }

  private createParams(filters: { categoryId?: number; tagId?: number }): HttpParams {
    let params = new HttpParams();
    if (filters.categoryId) {
      params = params.set('categoryId', filters.categoryId.toString());
    }
    if (filters.tagId) {
      params = params.set('tagId', filters.tagId.toString());
    }
    return params;
  }

  getPostBySlug(slug: string) {
    return this.httpClient.get<IPost>(`${this.baseUrl}/slug/${slug}`);
  }

  deletePost(id: number) {
    return this.httpClient.delete(`${this.baseUrl}`, {
      body: {
        id,
      },
    });
  }

  addPost({
    title,
    content,
    categoryId,
    tagIds,
  }: {
    title: string;
    content: string;
    categoryId: number;
    tagIds: number[];
  }) {
    return this.httpClient.post<IPost>(this.baseUrl, {
      title,
      content,
      categoryId,
      tagIds,
    });
  }

  updatePost({
    id,
    title,
    content,
    categoryId,
    tagIds,
  }: {
    id: number;
    title: string;
    content: string;
    categoryId: number;
    tagIds: number[];
  }) {
    return this.httpClient.put<IPost>(this.baseUrl, {
      id,
      title,
      content,
      categoryId,
      tagIds,
    });
  }
}
