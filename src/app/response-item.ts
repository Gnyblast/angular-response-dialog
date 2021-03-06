export interface ResponseObject {
  [key: string]: ResponseItem;
}
export interface ResponseItem {
  isNew: boolean;
  response: string;
  class: string;
  statusClass: string;
  close: boolean;
  type: string;
}

export interface ResponseDialogItem {
  message: string;
  stateClass: string;
}
