import { fstat, writeFile, writeFileSync } from 'fs';
import path from "path";
import * as fix from "./fixtures/fixtures.json";
import * as msg from "./fixtures/message.json";
interface Forum{
  forum_id: string;
  creator: string;
  admins: string[];
  users: string[];
  name: string;
  isPrivilage: Boolean;
}

interface ForumData{
  maxForumId: number;
  maxUserId: number;
  forums: any[];
  users: any[];
}
interface User{
  uid: number,
  name: string,
  img: string
}
interface Messages{
  text: string,
  sender: User,
  time: number
}
interface MessageData{
  [key: number]: Messages[]
}

export class MemData{
  private _fixture: ForumData;
  private _message: MessageData;
  static _memData: MemData;
  private constructor() {
    this._fixture = {
      forums: [...fix.forums],
      users: [...fix.users],
      maxForumId: fix.maxForumId,
      maxUserId: fix.maxUserId
    };

    this._message = {};
    for (let key of Object.keys(msg)) {
      if(key != "default")
        this._message[key] = msg[key];
    }
    // console.log("constructor:", this._fixture);
    console.log("message:", this._message);
    console.log("init MemData! ================");
  }

  static getInstance() {
    if (!this._memData)
      this._memData = new MemData();
    return this._memData;
  }

  get fix() : ForumData{
    return this._fixture;
  }

  reqMaxForumId(): string{
    console.log(this._fixture.maxForumId);
    this._fixture.maxForumId +=1;
    return this._fixture.maxForumId.toString();
  }

  reqMaxUserId(): number{
    this._fixture.maxUserId++;
    return this._fixture.maxUserId;
  }

  addNewForum(forum: Forum) {
    this._fixture.forums.push(forum);
    // console.log("new Forum:", forum);
    this.saveToFile();
  }

  findForum(fid: string): Forum{
    let obForum = this._fixture.forums.find((forum) => {
      if (forum.forum_id == fid)
        return forum;
    });

    return obForum;
  }

  joinToForum(uid: number, fid: number) {
    let obForum = this._fixture.forums.find((forum) => {
      if (forum.forum_id == fid)
        return forum;
    });

    if (obForum) {
      obForum.users.push(uid);
    }
  }

  private saveToFile() {
    writeFileSync(path.join(__dirname,'./fixtures/fixtures.json'), JSON.stringify(this._fixture), 'utf-8');
  }

  isInsideForum(uid: string, fid: string): boolean {
    let users = this.findForum(fid).users;
    return users.includes(uid);
    // for (let i = 0; i < users.length; i++){
    //   if (uid == users[i])
    //     return true;
    // }
    return false;
  }

  getUsers(users: string[]): User[]{
    // console.log("this.getUsers all", this._fixture.users);
    let userInfos = this._fixture.users.filter(user => users.includes(user.id));
    console.log('getUsers:', userInfos);
    return userInfos;
  }

  // Once inside a forum, he can:see the list of previous messages
  messages(fid: number, offset: number = 0, showCount:number = 100): Messages[]{
    return this._message[fid].sort((a, b) => {
      return b.time - a.time;
    }).slice(offset, offset + showCount);
    
    let message = [];
  }

  // post message
  postMessage(uid: number, fid: number, text: string) {
    // this._message[fid].push({

    // })
  }

  userInfo(uid: string): User{
    return this._fixture.users.find(user => {
      if (user.id == uid)
        return user;
    });
  }
}