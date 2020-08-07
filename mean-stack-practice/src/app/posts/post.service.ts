import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators';

import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService{
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {};

  getPosts(){
    this.http.get<{message: string, posts: any }>('http://localhost:3000/api/posts')
    //to change id to _id
    .pipe(map((postData => {
      //replace every post with...
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
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

    //adds post
  addPosts(title: string, content: string){
    const post: Post = {id: null, title: title, content: content};
    this.http
    .post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
    .subscribe( (responseData) => {
      //store postId from the result of saving to database
      const id = responseData.postId;
      //update const post above with id
      post.id = id;
      //push post to posts array
      this.posts.push(post);
      //informs whole app of update
      this.postsUpdated.next([...this.posts]);
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
}
