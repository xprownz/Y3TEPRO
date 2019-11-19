import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// Top level object for a form.
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

// Create form programmatically
// FormGroup: Groups all controls of a form
export class PostCreateComponent implements OnInit {
  enterTitle = '';
  enterContent = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private tattooId: string;

  constructor(public postsTattooService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('tattooId')) { // postId
        this.mode = 'edit';
        this.tattooId = paramMap.get('tattooId'); // postId
        this.isLoading = true;
        this.postsTattooService.getTattooPost(this.tattooId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.tattooId = null;
      }
    });
  }

  // Event object and extract file that was added
  // HTMLInputElement solves this problem
  onImagePicked(event: Event) {
    // ts doesnt know event target is a file input
    const file = (event.target as HTMLInputElement).files[0];
    // patchValue = Target a single control
    this.form.patchValue({ image: file });
    // Informs Angular value has been changed and should revaluate
    this.form.get('image').updateValueAndValidity();
    // Create URL
    const reader = new FileReader();
    reader.onload = () => {
      // Load file
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // newTattooPost = '';
  // initialTextArea = 'Please enter details into the text area';

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsTattooService.addTattooPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsTattooService.updateTattooPost(
        this.tattooId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }
}
