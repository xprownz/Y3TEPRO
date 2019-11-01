import { Component, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']

})
export class PostCreateComponent {
  enterTitle = '';
  enterContent = '';
  @Output() postCreated = new EventEmitter<Post>();


  //newTattooPost = '';
  //initialTextArea = 'Please enter details into the text area';

  onAddTattoPost(){
    const post: Post = {
      title: this.enterTitle,
      content: this.enterContent
    };
    this.postCreated.emit(post);
  }
}

