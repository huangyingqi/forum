import { writeFileSync } from 'fs';
import path from "path";
import * as ntf from "../fixtures/notifies.json";
import { ReqInfo, enumState } from "../interface/dataDefines";

enum enumNotify{
  NOTIFY,
  MANAGE
}

interface Notify{
  id: String,
  time: number,
  message: String,
  kind: enumNotify,
  state: enumState,
  reqJoin: ReqInfo
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

  RequestJoin(admin: string, asker: ReqInfo, ntfId: string) {
    console.log("request jion ntfid:", ntfId);
    this.sendNotify(admin, {
      id: ntfId,
      time: new Date().getTime(),
      message: "Someone request to join your forum",
      kind: enumNotify.MANAGE,
      state: enumState.UNREAD,
      reqJoin: asker
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
    // console.log("allMyNotifies: ", this._notify[uid]);
    return this._notify[uid];
  }

  setStateNtf(uid: string, nid: string, yes: boolean): void {
    let ntf = this._notify[uid].find(item => {
      if (item.id == nid)
        return item;
    });



    if (ntf) {
      console.log("find ntf", ntf, "yes:", yes);
      if (!yes)
        ntf.state = enumState.DISAGREE;
      else {
        ntf.state = enumState.AGREE;
      }
    }

    this.saveToNtf();
  }

  getReqInfo(uid: string, nid: string): ReqInfo{
    let ntf = this._notify[uid].find(item => {
      if (item.id == nid)
        return item;
    });
    if (ntf) {
      return ntf.reqJoin;
    } else {
      return null;
    }
  }

}