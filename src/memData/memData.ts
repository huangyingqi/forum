import { ForumMem } from "./forumData";
import { MessageMem } from "./messageData";
import { NotifyMem } from "./notifyData";
import { Message, Forum } from "../interface/dataDefines";


export class MemData{
  private _forum: ForumMem;
  private _message: MessageMem;
  private _notify: NotifyMem;

  static _memData: MemData;
  private constructor() {
    this._forum = new ForumMem();
    this._message = new MessageMem();
    this._notify = new NotifyMem();

    console.log("init MemData! ================ OK!");
  }

  static getInstance() {
    if (!this._memData)
      this._memData = new MemData();
    return this._memData;
  }

  get ForumMem() {
    return this._forum;
  }

  get MessageMem() {
    return this._message;
  }

  get NotifyMem() {
    return this._notify;
  }

  joinToForum(uid: string, obForum: Forum) {
    if (obForum) {
      if (obForum.users.includes(uid)) {
        // been inside
        let messages = this.MessageMem.messages(obForum.forum_id);
        return {
          forum: obForum,
          messages
        };        
        
      } else {
        obForum.users.push(uid);
        this._forum.flush();
        let messages = this.MessageMem.messages(obForum.forum_id);
        return {
          forum: obForum,
          messages
        };
      }
      
    }
  }

  // post message
  postMessage(uid: string, fid: string, text: string): Message{
    if (this._forum.isInsideForum(uid, fid)) {
      const userInfo = this._forum.userInfo(uid);
      return this._message.postMessage(fid, userInfo, text);
    } else {
      console.log("postMessage:", uid, "not in forum!");
      return null;
    }

  }

  sendRequest(uid: string, objForum: Forum) {
    let UserInfo = this._forum.userInfo(uid);
    objForum.admins.forEach(admin => {
      console.log('sendRequest to', admin, "user:", UserInfo, "reqJoinForum:", objForum);
      this._notify.RequestJoin(admin,
        {
          fid: objForum.forum_id,
          reqInfo: "May I join to your forum?",
          reqUser: UserInfo
        }, this._forum.maxNtfId());
    })
  }

}