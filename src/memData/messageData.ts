import { writeFileSync } from 'fs';
import path from "path";
import * as msg from "../fixtures/message.json";
import { Message, User } from "../interface/dataDefines";


interface MsgData{
  [key: string]: Message[]
}

export class MessageMem{
  private _message: MsgData;
  constructor() {
    this._message = {};
    for (let key of Object.keys(msg)) {
      if(key != "default")
        this._message[key] = msg[key];
    }
  }

  private saveToMessage() {
    writeFileSync(path.join(__dirname,'../fixtures/message.json'), JSON.stringify(this._message), 'utf-8');
  }

  postMessage(fid: string, userInfo: User, text: string): Message {
    let newMessage = {
      text,
      time: new Date().getTime(),
      sender: userInfo
    };
    if(this._message[fid])
      this._message[fid] = [newMessage, ...this._message[fid]];
    else {
      this._message[fid] = [newMessage];
    }
    console.log(this._message);
    this.saveToMessage();
    return newMessage; 
  }

  messages(fid: string, offset: number = 0, showCount:number = 100): Message[]{
    return this._message[fid]?.sort((a, b) => {
      return b.time - a.time;
    }).slice(offset, offset + showCount);

  }
}