import { RouterModule, Routes } from '@angular/router';
import { routes } from './app.routes';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CredentialsInterceptor } from './services/credentials.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Services
import { AuthService } from './services/auth.service';
import { GameService } from './services/game.service';
import { GameManagerService } from './services/game-manager.service';
import { IsAuthenticatedGuard } from './guards/is-authenticated.guard';
import { GameResolverGuard } from './guards/game-resolver.guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';
import { QuestionComponent } from './components/question/question.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { ResultsComponent } from './components/results/results.component';
import { RankingComponent } from './components/ranking/ranking.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    GameComponent,
    QuestionComponent,
    ProgressBarComponent,
    ResultsComponent,
    RankingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CredentialsInterceptor,
      multi: true
    },
    AuthService,
    GameService,
    GameManagerService,
    IsAuthenticatedGuard,
    GameResolverGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
