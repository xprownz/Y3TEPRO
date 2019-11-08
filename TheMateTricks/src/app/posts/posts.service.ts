import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { stringify } from '@angular/compiler/src/util';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsTattooUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient){}

  getTattooPosts() {
    this.http.get<{message: string, posts: any }>(
      'http://localhost:3000/api/posts'
      )
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          }
        });
      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
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
