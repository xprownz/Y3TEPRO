import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ErrorInterceptor } from './error-interceptor';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRouterModule } from './app-router.module';
import { CarouselComponent } from './carousel/carousel.component';
import { AuthIntercept } from './authorization/auth-intercept';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './angular-material.module';
import { PostsModule } from './posts/posts.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CarouselComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    AngularMaterialModule,
    PostsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthIntercept, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
