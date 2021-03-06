import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Post } from './post.model';

const BACKEND_URL = environment.apiUrl + '/posts/';

// client side

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsTattooUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getTattooPosts() {
    this.http.get<{message: string, posts: any }>(
      BACKEND_URL
      )
      // using the map function from rxjs to remove the underscore from the id attribute in the Post model returned
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            artistName: post.artistName,
            location: post.location,
            phoneNo: post.phoneNo,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          };
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

  // returning a clone of the object using spread operator
  getTattooPost(id: string) {
    return this.http.get<{ _id: string, title: string, artistName: string, location: string, phoneNo: string, content: string, imagePath: string, creator: string}>(
      BACKEND_URL + id
      );
  }

  addTattooPost(title: string, artistName: string, location: string, phoneNo: string, content: string, image: File) {
    // JSON can't include a file
    const postData = new FormData();
    postData.append('title', title);
    postData.append('artistName', artistName);
    postData.append('location', location);
    postData.append('phoneNo', phoneNo);
    postData.append('content', content);
    // Add image
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(
        BACKEND_URL,
        postData
      )
      .subscribe(responseData => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          artistName: artistName,
          location: location,
          phoneNo: phoneNo,
          content: content,
          imagePath: responseData.post.imagePath,
          creator: null
        };
        this.posts.push(post);
        this.postsTattooUpdated.next([...this.posts]);
        this.router.navigate(['/']); // navigates back to main page
      });
  }

  updateTattooPost(id: string, title: string, artistName: string, location: string, phoneNo: string, content: string, image: File | string) {
    let postData: Post | FormData;
    // Do we have a string image or not
    // If we have a file
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('artistName', artistName);
      postData.append('location', location);
      postData.append('phoneNo', phoneNo);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      // Send JSON data
      postData = {
        id: id,
        title: title,
        artistName: artistName,
        location: location,
        phoneNo: phoneNo,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put(BACKEND_URL + id, postData)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          artistName: artistName,
          location: location,
          phoneNo: phoneNo,
          content: content,
          imagePath: '',
          creator: null
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsTattooUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deleteTattooPost(postId: string) {
    this.http.delete(BACKEND_URL + postId)
    .subscribe(() => {
      // using filter method to return a subset of posts that does not include the post id parameter
      // this allows Angular to update the list of posts instantly without reloading
      const updatedTattooPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedTattooPosts;
      this.postsTattooUpdated.next([...this.posts]);
    });
  }
}
