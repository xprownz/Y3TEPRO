import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']

})
export class PostCreateComponent implements OnInit {
  enterTitle = '';
  enterContent = '';
  private mode = 'createTattoo';
  private tattooId: string;
  post: Post;
  isLoading = false;

  constructor(public postsTattooService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('tattooId')) {
        this.mode = 'edit';
        this.tattooId = paramMap.get('tattooId');
        this.isLoading = true;
        this.postsTattooService.getTattooPost(this.tattooId)
        .subscribe(postData => {
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content};
        });
      } else {
        this.mode = 'create';
        this.tattooId = null;
      }
    });
  }

  // newTattooPost = '';
  // initialTextArea = 'Please enter details into the text area';

  onAddTattoPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsTattooService.addTattooPost(form.value.title, form.value.content);
    } else {
      this.postsTattooService.updateTattooPost(
        this.tattooId,
        form.value.title,
        form.value.content
        );
    }
    form.resetForm();
  }
}

