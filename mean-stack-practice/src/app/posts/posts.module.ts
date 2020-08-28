import { NgModule } from '@angular/core';

import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { AngularMaterialModule } from '../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [
    PostListComponent,
    PostCreateComponent
  ],
  imports: [
    //fixes ngIf and other defauly angular issues that come with app.module
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    AppRoutingModule
  ]
})

export class PostsModule {

}
