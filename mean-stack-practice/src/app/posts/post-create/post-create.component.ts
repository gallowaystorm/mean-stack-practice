import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Post } from '../post.model'
import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';


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

  constructor(public postsService: PostsService, public route: ActivatedRoute){}

  ngOnInit() {
    //pulls the path that you are at to determine between /create and /edit/:postID
    this.route.paramMap
    //subscribes to observable
    .subscribe( (paramMap: ParamMap) => {
      //check if path exists
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        //sets postId in the path equal to postId variable
        this.postId = paramMap.get('postId');
        //call overloaded getPost function that finds post in database that matches id
        this.post = this.postsService.getPost(this.postId);
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm){
    if (form.invalid){
      return
    }

    if (this.mode === 'create'){
      this.postsService.addPosts(form.value.title, form.value.content);
    } else {
      var confirmUpdate = confirm("Are you sure you want to update this post?");
      if (confirmUpdate == true){
        var postUpdated = this.postsService.updatePost(this.postId, form.value.title, form.value.content);
        if (postUpdated == true) {
          alert("Post has been updated!");
        }
      } else {
        return;
      }
    }
    form.resetForm();
  }
}
