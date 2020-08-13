import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Post } from '../post.model'
import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']

})
export class PostCreateComponent implements OnInit {
  enteredContent = '';
  enteredTitle = '';
  //to determine mode
  private mode = 'create';
  private postId: string;
  public post: Post;
  isLoading = false;
  //for reactive form of forms (lol)
  form: FormGroup;
  //for image preview convert
  imagePreview: string;

  constructor(public postsService: PostsService, public route: ActivatedRoute){}

  ngOnInit() {
    //form mappping
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'content': new FormControl(null, {validators: [Validators.required]}),
      //add mimeType as AsyncValidator
      'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
    //pulls the path that you are at to determine between /create and /edit/:postID
    this.route.paramMap
    //subscribes to observable
    .subscribe( (paramMap: ParamMap) => {
      //check if path exists
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        //sets postId in the path equal to postId variable
        this.postId = paramMap.get('postId');
        //spinner on load
        this.isLoading = true;
        //call overloaded getPost function that finds post in database that matches id
        this.postsService.getPost(this.postId)
          //subscribe to observable
          .subscribe(postData => {
            //stop spinner
            this.isLoading = false;
            this.post = {id: postData._id, title: postData.title, content: postData.content};
            //overite default form value on init
            this.form.setValue({'title': this.post.title, 'content': this.post.content});
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event){
    //access file passed in
    const file = (event.target as HTMLInputElement).files[0];
    //target single control on form
    this.form.patchValue({image: file});
    //get access to image and update value and validate it
    this.form.get('image').updateValueAndValidity();
    //convert image to data url
    const reader = new FileReader();
    //executes when done loading
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost(){
    if (this.form.invalid){
      return
    }
    this.isLoading = true;
    if (this.mode === 'create'){
      this.postsService.addPosts(this.form.value.title, this.form.value.content);
    } else {
      var confirmUpdate = confirm("Are you sure you want to update this post?");
      if (confirmUpdate == true){
        var postUpdated = this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
        if (postUpdated == true) {
          alert("Post has been updated!");
        }
      } else {
        return;
      }
    }
    this.form.reset();
  }
}
