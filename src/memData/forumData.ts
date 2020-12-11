import { writeFileSync } from 'fs';
import path from "path";
import * as fix from "../fixtures/fixtures.json";
import { Forum, User } from "../interface/dataDefines";

interface ForumData{
  maxForumId: number;
  maxUserId: number;
  maxNtfId: number;
  forums: any[];
  users: any[];
}

export class ForumMem{
  private _fixture: ForumData;
  constructor() {
    this._fixture = {
      forums: [...fix.forums],
      users: [...fix.users],
      maxForumId: fix.maxForumId,
      maxUserId: fix.maxUserId,
      maxNtfId: fix.maxNtfId
    };
  }

  maxForumId(): string{
    console.log(this._fixture.maxForumId);
    this._fixture.maxForumId +=1;
    return this._fixture.maxForumId.toString();
  }

  addForum(forum: Forum) {
    this._fixture.forums.push(forum);
    this.saveToForum();
  }

  findForum(fid: string): Forum{
    let obForum = this._fixture.forums.find((forum) => {
      if (forum.forum_id == fid)
        return forum;
    });

    return obForum;
  }

  private saveToForum() {
    writeFileSync(path.join(__dirname,'../fixtures/fixtures.json'), JSON.stringify(this._fixture), 'utf-8');
  }

  getUsers(users: string[]): User[]{
    // console.log("this.getUsers all", this._fixture.users);
    let userInfos = this._fixture.users.filter(user => users.includes(user.id));
    console.log('getUsers:', userInfos);
    return userInfos;
  }

  userInfo(uid: string): User{
    return this._fixture.users.find(user => {
      if (user.id == uid)
        return user;
    });
  }

  flush() {
    this.saveToForum();
  }
  
  myForums(uid: string): Forum[]{
    let forums = [];
    this._fixture.forums.forEach(forum => {
      for (let i = 0; i < forum.users.length; i++){
        if (forum.users[i] == uid) {
          forums.push(forum);
          break;
        }
      }
    })
    
    return forums;
  }

  forums(uid: string): any[]{
    let forums = this._fixture.forums.filter((forum) => {
      if ((!forum.isPrivilage) || (forum.creator == uid))
        return forum;
    });

    console.log("forums:", forums);

    return forums;
  }

  isInsideForum(uid: string, fid: string): boolean {
    let users = this.findForum(fid).users;
    return users.includes(uid);
  }

  maxNtfId() : string{
    this._fixture.maxNtfId += 1;
    this.saveToForum();
    return this._fixture.maxNtfId.toString();
  }
}