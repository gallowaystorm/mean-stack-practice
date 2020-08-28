import { Component, OnInit, OnDestroy } from '@angular/core';
import { sharedStylesheetJitUrl } from '@angular/compiler';
import { Subscription } from 'rxjs';
import { Post } from '../post.model'
import { PostsService } from '../post.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

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

  //for authentication status
  userIsAuthenticated = false;
  //for user id authnetication on posts
  userId: string;
  //to subscribe to observable made in auth-service.ts
  private authListenerSubscription: Subscription

  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    //using 1 so that we start on page one on init
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((postData: { posts: Post[]; postCount: number }) => {
      this.isLoading = false;
      //to set total posts on paginator
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
    //set status of athentication to update after login
    this.userIsAuthenticated = this.authService.getIsAuth();
    //subscribe to listener for status of auth
    this.authListenerSubscription = this.authService.getAuthStatusListener()
      .subscribe( isAuthenticated  => {
        //set based off result of above call to authService
        this.userIsAuthenticated = isAuthenticated;
        //in case update happens
        this.userId = this.authService.getUserId();
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
      }, () => {
        //this method helps handle erros
        this.isLoading = false;
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
    this.postsSub.unsubscribe();
    //unsubscribe to listener
    this.authListenerSubscription.unsubscribe();
  }
}
