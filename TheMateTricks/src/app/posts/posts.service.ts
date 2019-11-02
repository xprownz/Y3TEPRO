import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsTattooUpdated = new Subject<Post[]>();

  getTattooPosts() {
    return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postsTattooUpdated.asObservable();
  }

  addTattooPost(title: string, content: string) {
    const post: Post = {title: title, content: content};
    this.posts.push(post);
    this.postsTattooUpdated.next([...this.posts]);
  }
}
