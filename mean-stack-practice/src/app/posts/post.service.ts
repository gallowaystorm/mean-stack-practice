import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { Router } from '@angular/router';
// import { networkInterfaces } from 'os';

@Injectable({providedIn: 'root'})
export class PostsService{
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {};

  getPosts(postsPerPage: number, currentPage: number){
    //for paginator
      //using backticks for query params
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`
    this.http.get<{message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
    //to change id to _id
    .pipe(map((postData => {
      //replace every post with...
      return { posts: postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        };
      }), maxPosts: postData.maxPosts
    };
    })))
    //subscribe to observable with remapped posts
    .subscribe( (transformedPostData) => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next( { posts: [...this.posts], postCount:  transformedPostData.maxPosts } );
    });
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  //to get one post in the case that we are in edit mode for a post
  getPost(id: string){
    //returned this way because it is asynchronous
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>('http://localhost:3000/api/posts/' + id);
  }

    //adds post
  addPosts(title: string, content: string, image: File){
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    //pass in title as well to help name the image
    postData.append('image', image, title);
    this.http
    .post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
    .subscribe( (responseData) => {
      this.navigateToHomePage();
    });
  }

  //deletes post
  deletePost(postId: string){
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }

  //update post
  updatePost(id: string, title: string, content: string, image: File | string){
    //check what imgage type is object for new post or string for image path if editing
    let postData: Post | FormData;
    if(typeof(image) === 'object') {
      //create new form data object
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      //pass in title as well to help name the image
      postData.append('image', image, title);
    } else {
      //create new post data
      const postData: Post = {id: id, title: title, content: content, imagePath: image}
    }
    this.http.put('http://localhost:3000/api/posts/' + id, postData)
    //subscribe to obervable
    .subscribe( response => {
      this.navigateToHomePage();
    });
    return true;
  }

  navigateToHomePage(){
    this.router.navigate(["/"]);
  }
}
