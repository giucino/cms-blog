import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IPost } from '../interfaces/models/post.model.interface';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  baseUrl = environment.BACKEND_API_URL + '/api/posts';
  httpClient = inject(HttpClient);

  constructor() {}

  getPosts(filters: { categoryId?: number; tagId?: number }) {
    // convert every filter to a query parameter and append to the url
    let url = this.baseUrl;

    const params = new URLSearchParams();
    if (filters.categoryId) {
      params.set('categoryId', filters.categoryId.toString());
    }
    if (filters.tagId) {
      params.set('tagId', filters.tagId.toString());
    }

    url += '?' + params.toString();

    return this.httpClient.get<IPost[]>(url);
  }

  getPostBySlug(slug: string) {
    return this.httpClient.get<IPost>(`${this.baseUrl}/slug/${slug}`);
  }
}