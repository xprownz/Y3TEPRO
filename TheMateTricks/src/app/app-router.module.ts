import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { CarouselComponent } from './carousel/carousel.component';
import { AuthGuard } from './authorization/auth.guard';

const routes: Routes = [
    // the path is what appears after the domain, empty is the home/index page
    // the componemt parameter defines what component is loaded for the path specified
    { path: '', component: PostListComponent },
    { path: 'browse', component: CarouselComponent },
    { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]},
    { path: 'edit/:tattooId', component: PostCreateComponent, canActivate: [AuthGuard]},
    { path: 'auth', loadChildren: './authorization/auth.module#AuthModule'}
];

@NgModule({
    // imports the RouterModule inte the Angular Module
    // the export allows you to use the RouterModule with the Anguar route configuration outside of the Angular Module
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})

export class AppRouterModule {  }
