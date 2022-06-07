import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  ResponseDialogItem,
  ResponseItem,
  ResponseObject,
} from '../response-item';

@Component({
  selector: 'app-response-modal',
  templateUrl: './response-modal.component.html',
  styleUrls: ['./response-modal.component.css'],
})
export class ResponseModalComponent implements OnInit {
  @Input() incomingResponse: BehaviorSubject<ResponseDialogItem | null> =
    new BehaviorSubject<ResponseDialogItem | null>(null);
  public responses: BehaviorSubject<ResponseObject[]> = new BehaviorSubject<
    ResponseObject[]
  >([]);

  private responseQueue: ResponseObject[] = [];

  private key: number = 0;
  private animateLock = false;
  private qStack = 0;

  constructor() {}

  ngOnInit() {
    this.incomingResponse.subscribe((val) => {
      if (val != null) {
        let key = 'resp' + this.key;
        let newResponse = {
          [key]: {
            isNew: true,
            response: val.message,
            class: '',
            statusClass: val.stateClass,
            close: false,
            type: 'open',
          },
        } as ResponseObject;
        this.key++;
        this.responses.value.push(newResponse);
        this.responses.next(this.responses.value);
        this.triggerResponse(newResponse);
      }
    });
  }

  public triggerResponse(newResponse: ResponseObject) {
    if (
      !this.responseQueue.some((val) => {
        return this.getKey(val) === this.getKey(newResponse);
      })
    ) {
      this.responseQueue.push(newResponse);
    }
    this.queueNewResponses();
  }

  private queueNewResponses() {
    if (this.responseQueue.length > this.qStack) {
      this.qStack++;
      setTimeout(() => {
        let respObj = this.responseQueue[0];
        this.animateResponse(this.getKey(respObj));
        this.qStack--;
        this.responseQueue.splice(0, 1);
        this.queueNewResponses();
      }, 350 * this.qStack);
    }
  }

  private animateResponse(key: string) {
    if (!this.animateLock) {
      this.animateLock = true;
      this.responses.value.forEach((response) => {
        if (key === this.getKey(response)) {
          if (response[key].type === 'open') {
            setTimeout(() => {
              response[key].class = 'show';
            }, 100);
            setTimeout(() => {
              response[key].isNew = false;
              this.animateLock = false;
              setTimeout(() => {
                this.close(key);
              }, 5000);
            }, 250);
          } else {
            response[key].isNew = true;
            response[key].class = '';
            setTimeout(() => {
              response[key].close = true;
              this.animateLock = false;
            }, 300);
          }
        }
      });
    } else {
      setTimeout(() => {
        this.animateResponse(key);
      }, 300);
    }
  }

  public close(key: string) {
    let responseToClose;
    this.responses.value.forEach((response) => {
      if (this.getKey(response) === key) {
        response[key].type = 'close';
        responseToClose = response;
      }
    });

    if (
      !this.responseQueue.some((val) => {
        return this.getKey(val) === this.getKey(responseToClose);
      }) &&
      responseToClose
    ) {
      this.responseQueue.push(responseToClose);
    }

    this.queueNewResponses();
  }

  public returnZero() {
    return 0;
  }

  public getKey(obj: ResponseObject): string {
    return Object.keys(obj)[0];
  }

  public objectCast(obj: any) {
    return obj as ResponseObject;
  }
}
