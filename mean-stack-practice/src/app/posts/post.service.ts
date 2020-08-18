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
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {};

  getPosts(){
    this.http.get<{message: string, posts: any }>('http://localhost:3000/api/posts')
    //to change id to _id
    .pipe(map((postData => {
      //replace every post with...
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        }
      });
    })))
    //subscribe to observable with remapped posts
    .subscribe( (transformedPosts) => {
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
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
      //store post
      const post: Post = {id: responseData.post.id, title: title, content: content, imagePath: responseData.post.imagePath};
      //push post to posts array
      this.posts.push(post);
      //informs whole app of update
      this.postsUpdated.next([...this.posts]);
      this.navigateToHomePage();
    });
  }

  //deletes post
  deletePost(postId: string){
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe( () => {
        //update post array on frontend by keeping ones where it is not equal and deleteing if it is equal
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        //makes the array posts equal to what has been filtered
        this.posts = updatedPosts;
        //informs whole app of update
        this.postsUpdated.next([...this.posts]);
      });
      //return boolean to confirm
      return true;
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
      //create updated post constant
      const updatedPosts = [...this.posts];
      //search for old post version by id and match to passed in id
      const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
      //replace index of found post to the updated post
      const post: Post = {id: id, title: title, content: content, imagePath: ""};
      updatedPosts[oldPostIndex] = post;
      //set array of posts equal to the updated posts array
      this.posts = updatedPosts;
      //tell app about updated posts array
      this.postsUpdated.next([...this.posts]);
      this.navigateToHomePage();
    });
    return true;
  }

  navigateToHomePage(){
    this.router.navigate(["/"]);
  }
}
