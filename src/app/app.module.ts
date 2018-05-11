import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BarModule } from '@my/library/bar';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BarModule
  ],
  providers: [BarModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
