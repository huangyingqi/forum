import { writeFileSync } from 'fs';
import path from "path";
import * as ntf from "../fixtures/notifies.json";
import { ReqInfo } from "../interface/dataDefines";

enum enumNotify{
  NOTIFY,
  MANAGE
}

enum enumState{
  UNREAD,
  DISCARD,
  AGREE
}

interface Notify{
  time: number,
  message: String,
  kind: enumNotify,
  state: enumState,
  reqInfo: ReqInfo
}

interface NotifyData{
  [key: string]: Notify[]
}

export class NotifyMem{
  private _notify: NotifyData;
  constructor() {
    this._notify = {};
    for (let key of Object.keys(ntf)) {
      if (key != "default")
        this._notify[key] = ntf[key];
    }

    console.log("ntf:", this._notify);
  }

  private saveToNtf() {
    writeFileSync(path.join(__dirname,'../fixtures/notifies.json'), JSON.stringify(this._notify), 'utf-8');
  }

  RequestJoin(admin: string, asker: ReqInfo) {
    this.sendNotify(admin, {
      time: new Date().getTime(),
      message: "Someone request to join your forum",
      kind: enumNotify.MANAGE,
      state: enumState.UNREAD,
      reqInfo: asker
    })
    
  }

  private sendNotify(uid: string, notify: Notify) {
    if (!this._notify[uid]) {
      this._notify[uid] = [];
      this._notify[uid].push(notify);
    } else {
      this._notify[uid] = [notify, ...this._notify[uid]];
    }

    this.saveToNtf();
  }

  allMyNotifies(uid: string): Notify[]{
    console.log("allMyNotifies: ", uid);
    console.log(this._notify[uid]);
    return this._notify[uid];
  }

}