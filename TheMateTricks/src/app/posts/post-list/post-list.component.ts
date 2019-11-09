import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'First Post', content: 'This is the first post\'s content'},
  //   {title: 'Second Post', content: 'This is the second post\'s content'},
  //   {title: 'Third Post', content: 'This is the third post\'s content'}
  // ];
  posts: Post[] = [];
  isLoading = false;
  private postsTattooSub: Subscription;

  constructor(public postsTattooService: PostsService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.postsTattooService.getTattooPosts();
    this.postsTattooSub = this.postsTattooService.getPostUpdateListener()
    .subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    });
  }

  onDelete(postId: string) {
    this.postsTattooService.deleteTattooPost(postId);
  }

  ngOnDestroy() {
    this.postsTattooSub.unsubscribe();
  }
}
