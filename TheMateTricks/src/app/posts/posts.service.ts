import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Post } from './post.model';
import { stringify } from '@angular/compiler/src/util';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsTattooUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient){}

  getTattooPosts() {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postsTattooUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsTattooUpdated.asObservable();
  }

  addTattooPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http.post<{message: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);
      });
    this.posts.push(post);
    this.postsTattooUpdated.next([...this.posts]);
  }
}
