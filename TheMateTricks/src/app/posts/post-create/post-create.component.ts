import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']

})
export class PostCreateComponent {
  enterTitle = '';
  enterContent = '';

  constructor(public postsTattooService: PostsService) {}

  // newTattooPost = '';
  // initialTextArea = 'Please enter details into the text area';

  onAddTattoPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.postsTattooService.addTattooPost(form.value.title, form.value.content);
    form.resetForm();
  }
}

