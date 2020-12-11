import { IResolvers } from 'graphql-tools';
import { MemData } from "./memData/memData";
import { enumState } from "./interface/dataDefines";

const resolverMap: IResolvers = {
  Query: {
    // all forums I jioned
    // A user can see the list of forums he has joined.
    myForums(_: void, { uid }): any[] {
      return MemData.getInstance().ForumMem.myForums(uid);
    },

    // all forums I can see
    // A user can see the list of available forum and can join any
    forums(_: void, { uid }): any[]{
      console.log("forums:", uid);
      return MemData.getInstance().ForumMem.forums(uid);
    },

    // Members of one Special Forum 
    // see the name and picture of the members of the forum
    members(_: void, { uid, fid }): any[]{
      if (MemData.getInstance().ForumMem.isInsideForum(uid, fid)) {
        let forums = MemData.getInstance().ForumMem.findForum(fid);
        return MemData.getInstance().ForumMem.getUsers(forums.users);        
      } else {
        console.log("not inside forum", uid, fid);
        return [];
      }

    },

    // show messages 
    // see the list of previous messages, ordered by most recent
    messages(_: void, { uid, fid, offset=0, showCount=100 }): any[]{
      if (MemData.getInstance().ForumMem.isInsideForum(uid, fid)) {
        console.log("inside forum");
        return MemData.getInstance().MessageMem.messages(fid, offset, showCount);
      }
      return [];
    },

    // userInfo
    userInfo(_: void, { uid }): any {
      const userInfo = MemData.getInstance().ForumMem.userInfo(uid);
      console.log("userInfo:", userInfo);
      return userInfo;
    },

    myNotifies(_: void, { uid }): any[]{
      return MemData.getInstance().NotifyMem.allMyNotifies(uid);
    }

  },

  Mutation: {
    // A user can create a new forum (and join it automatically)
    createForum(_: void, { uid, forum }): any{
      let forumNew = {
        forum_id: MemData.getInstance().ForumMem.maxForumId(),
        creator: uid,
        name: forum.name,
        isPrivilage: forum.isPrivilage,
        admins: [uid],
        users: [uid]
      }

      MemData.getInstance().ForumMem.addForum(forumNew);

      return forumNew;
    },

    // He can also join a forum if he knows the forum id
    joinForum(_: void, { uid, fid }): any{
      let forum = MemData.getInstance().ForumMem.findForum(fid);
      console.log("find: ", forum);
      if (forum) {
        if (forum.isPrivilage) {
          // send request to all admins
          console.log("privilage forum send request to admins")
          MemData.getInstance().sendRequest(uid, forum);
        } else {
          return MemData.getInstance().joinToForum(uid, forum);  
        }
        
      } else {
        return { forum: null, messages: [] };
      }

    },

    // post a message in the forum
    postMessage(_: void, { uid, fid, text }): any {
      return MemData.getInstance().postMessage(uid, fid, text);
    },

    // process the request from user ask for join to forum
    processReq(_: void, { uid, nid, yes }): any {
      console.log("processReq ", uid, nid, yes);
      MemData.getInstance().NotifyMem.setStateNtf(uid, nid, yes);
      if (yes) {
        const reqInfo = MemData.getInstance().NotifyMem.getReqInfo(uid, nid);
        console.log("req:", reqInfo);
        if (reqInfo) {
          let forum = MemData.getInstance().ForumMem.findForum(reqInfo.fid);
          console.log("forum:", forum);
          if (forum) {
            let ruid = reqInfo.reqUser?.id;
            if (!forum.users.includes(ruid)) {
              console.log("add user:", ruid);
              forum.users.push(ruid);
              MemData.getInstance().ForumMem.flush();                
            }
          }
        }
      }
      
    }
  }
};
export default resolverMap;