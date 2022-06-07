import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ResponseDialogItem } from './response-item';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular';
  public response: BehaviorSubject<ResponseDialogItem | null> = new BehaviorSubject<ResponseDialogItem | null>(null)

  public sendResponse(){
    this.response.next({message: "Some Test", stateClass: "success"} as ResponseDialogItem)
  }
}
