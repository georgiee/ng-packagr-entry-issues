import { Injectable } from '@angular/core';

export const STATIC_FOO_VALUE = 'static-foo-value';

@Injectable()
export class FooClass {
  hello() {
    return 'dynamic-foo-value';
  }
}
