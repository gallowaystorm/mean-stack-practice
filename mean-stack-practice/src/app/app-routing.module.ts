import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { AuthGuard } from './auth/auth-guard';

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
  //for lazy loading
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule) }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
  //for protecting routes
  providers: [AuthGuard]
})

export class AppRoutingModule{}
