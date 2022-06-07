export interface ResponseObject {
  [key: string]: ResponseItem;
}
export interface ResponseItem {
  isNew: boolean;
  response: string;
  class: string;
  status: boolean;
  close: boolean;
  type: string;
}
