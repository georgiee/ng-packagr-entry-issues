import { STATIC_MAIN_ENTRY_VALUE } from '@my/library';
import { STATIC_FOO_VALUE, FooClass } from '@my/library/foo';
import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'lib-bar',
  template: 'This is bar with message from foo: {{message}}'
})
export class BarComponent {
  message = 'non';
  constructor(private foo: FooClass) {
    this.message = `${foo.hello()} + ${STATIC_FOO_VALUE} + ${STATIC_MAIN_ENTRY_VALUE}`;
  }
}


@NgModule({
  declarations: [
    BarComponent
  ],
  exports: [
    BarComponent
  ],
  providers: [
    FooClass
  ]
})
export class BarModule { }
