import { Component } from '@angular/core';
import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  storedTattooPosts: Post[] = [];

  onPostAdded(post) {
    this.storedTattooPosts.push(post);
  }
}
