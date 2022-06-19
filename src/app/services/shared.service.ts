import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  data_: any = null;
  constructor() { }
  setData(data: any) {
    this.data_ = data;
  }
  getData() {
    return this.data_;
  }
}
