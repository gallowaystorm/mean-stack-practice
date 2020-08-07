import { Component, OnInit, OnDestroy } from '@angular/core';
import { sharedStylesheetJitUrl } from '@angular/compiler';
import { Subscription } from 'rxjs';
import { Post } from '../post.model'
import { PostsService } from '../post.service';

@Component ({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
  // posts = [
  //   {title: 'First Post', content: 'This is the first post\'s content.'},
  //   {title: 'Second Post', content: 'This is the second post\'s content.'},
  //   {title: 'Third Post', content: 'This is the third post\'s content.'},
  // ]
  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }
  //delets posts based off id
  onDelete(postId: string){
    var confirmDelete = confirm("Are you sure you want to delete this post? This cannot be undone.");
    if (confirmDelete == true){
      var postDeleted = this.postsService.deletePost(postId);
      if (postDeleted == true) {
        alert("Post has been deleted!");
      }
    } else {
      return;
    }
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe;
  }
}
