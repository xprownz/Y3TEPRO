import { Component } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html'

})
export class PostCreateComponent {
  enterValue = '';
  newTattooPost = '';
  initialTextArea = 'Please enter details into the text area';

  onAddTattoPost(){
    this.newTattooPost = this.enterValue;


    //alert('Image added!');
  }
}
