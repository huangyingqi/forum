import { IResolvers } from 'graphql-tools';
import { MemData } from "./memData";

const resolverMap: IResolvers = {
  Query: {
    // all forums I jioned
    // A user can see the list of forums he has joined.
    myForums(_: void, { uid }): any[] {
      let forums = [];
      MemData.getInstance().fix.forums.forEach(forum => {
        for (let i = 0; i < forum.users.length; i++){
          if (forum.users[i] == uid) {
            forums.push(forum);
            break;
          }
        }
      })
      return forums;
    },

    // all forums I can see
    // A user can see the list of available forum and can join any
    forums(_: void, { uid }): any[]{
      let forums = MemData.getInstance().fix.forums.filter((forum) => {
        if ((!forum.isPrivilage) || (forum.creator == uid))
          return forum;
      });
      
      return forums;
    },

    // Members of one Special Forum 
    // see the name and picture of the members of the forum
    members(_: void, { uid, fid }): any[]{
      if (MemData.getInstance().isInsideForum(uid, fid)) {
        let forums = MemData.getInstance().findForum(fid);
        return MemData.getInstance().getUsers(forums.users);        
      } else {
        console.log("not inside forum", uid, fid);
        return [];
      }

    },

    // show messages 
    // see the list of previous messages, ordered by most recent
    messages(_: void, { uid, fid, offset=0, showCount=100 }): any[]{
      if (MemData.getInstance().isInsideForum(uid, fid)) {
        console.log("inside forum");
        return MemData.getInstance().messages(fid, offset, showCount);
      }
      return [];
    },

    // userInfo
    userInfo(_: void, { uid }): any {
      const userInfo = MemData.getInstance().userInfo(uid);
      console.log("userInfo:", userInfo);
      return userInfo;
    }

  },

  Mutation: {
    // A user can create a new forum (and join it automatically)
    createForum(_: void, { uid, forum }): any{
      let forumNew = {
        forum_id: MemData.getInstance().reqMaxForumId(),
        creator: uid,
        name: forum.name,
        isPrivilage: forum.isPrivilage,
        admins: [uid],
        users: [uid]
      }

      MemData.getInstance().addNewForum(forumNew);

      return forumNew;
    },

    // He can also join a forum if he knows the forum id
    joinForum(_: void, { uid, fid }): any{
      let forum = MemData.getInstance().findForum(fid);
      console.log("find: ", forum);
      if (forum) {
        return MemData.getInstance().joinToForum(uid, forum);
      }

    },

    // post a message in the forum
    postMessage(_: void, { uid, fid, text }): any {
      // uid: ID, fid: Int, text: String)
      console.log("postMessage:u:", uid, "f:", fid, "m:", text);
      if (MemData.getInstance().isInsideForum(uid, fid)) {
        console.log("user inside");
        return MemData.getInstance().postMessage(uid, fid, text);
      }
    }
  }
};
export default resolverMap;