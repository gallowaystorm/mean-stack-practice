import { Component, OnInit, OnDestroy } from '@angular/core';
import { sharedStylesheetJitUrl } from '@angular/compiler';
import { Subscription } from 'rxjs';
import { Post } from '../post.model'
import { PostsService } from '../post.service';
import { PageEvent } from '@angular/material/paginator';

@Component ({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
  posts: Post[] = [];
  isLoading = false;
  private postsSub: Subscription;
  //for paginator
  totalPosts = 0;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    //using 1 so that we start on page one on init
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((postData: { posts: Post[]; postCount: number }) => {
      this.isLoading = false;
      //to set total posts on paginator
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
  }
  //delets posts based off id
  onDelete(postId: string){
    var confirmDelete = confirm("Are you sure you want to delete this post? This cannot be undone.");
    if (confirmDelete == true){
      this.isLoading = true;
      this.postsService.deletePost(postId).subscribe( () => {
        //to update post list on frontend on delete
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      });
    } else {
      return;
    }
  }

  //for paginator
  onChangedPage(pageData: PageEvent){
    //for spinner
    this.isLoading = true;
    //values from page data
      //adding 1 becuase this index starts at zero
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe;
  }
}
