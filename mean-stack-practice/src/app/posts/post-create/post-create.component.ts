import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Post } from '../post.model'
import { PostsService } from '../post.service';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']

})
export class PostCreateComponent{
  enteredContent = '';
  enteredTitle = '';

  constructor(public postsService: PostsService){}

  onAddPost(form: NgForm){
    if (form.invalid){
      return
    }
    this.postsService.addPosts(form.value.title, form.value.content);
    form.resetForm();
  }
}
