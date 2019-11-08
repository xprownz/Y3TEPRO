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
      // using the map function from rxjs to remove the underscore from the id attribute in the Post model returned
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

  deleteTattooPost(postId: string) {
    this.http.delete("http://localhost:3000/api/posts/" + postId)
    .subscribe(() => {
      // using filter method to return a subset of posts that does not include the post id parameter
      // this allows Angular to update the list of posts instantly without reloading
      const updatedTattooPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedTattooPosts;
      this.postsTattooUpdated.next([...this.posts]);
    });
  }
}
