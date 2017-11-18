import { Directive } from '@angular/core';

/**
 * Generated class for the FocuserDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[focuser]' // Attribute selector
})
export class FocuserDirective {

  constructor() {
    console.log('Hello FocuserDirective Directive');
  }

}
