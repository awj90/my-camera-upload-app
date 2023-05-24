import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { WebcamComponent } from './components/webcam.component';
import { FormComponent } from './components/form.component';
import { PhotoService } from './photo.service';

const appRoutes: Routes = [
  { path: '', component: WebcamComponent },
  { path: 'upload', component: FormComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  declarations: [AppComponent, WebcamComponent, FormComponent],
  imports: [
    BrowserModule,
    WebcamModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [PhotoService],
  bootstrap: [AppComponent],
})
export class AppModule {}
