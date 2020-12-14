import {promises as fs} from 'fs';
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

  private async saveToMessage() {
    try {
      await fs.writeFile(path.join(__dirname,'../fixtures/message.json'), JSON.stringify(this._message), 'utf-8');
    } catch (err) {
      console.log("writeFile to message error!", err);
    }
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