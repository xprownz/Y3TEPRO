import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './authorization/login/login.component';
import { SignUpComponent } from './authorization/signup/signup.component';
import { CarouselComponent } from './carousel/carousel.component';

const routes: Routes = [
    // the path is what appears after the domain, empty is the home/index page
    // the componemt parameter defines what component is loaded for the path specified
    { path: '', component: CarouselComponent },
    { path: 'browse', component: PostListComponent },
    { path: 'create', component: PostCreateComponent},
    { path: 'edit/:tattooId', component: PostCreateComponent},
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignUpComponent}
];

@NgModule({
    // imports the RouterModule inte the Angular Module
    // the export allows you to use the RouterModule with the Anguar route configuration outside of the Angular Module
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRouterModule {  }
