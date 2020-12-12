import {
  GraphQLObjectType, GraphQLID, GraphQLInt,
  GraphQLString, GraphQLNonNull, GraphQLList,
} from "graphql";

import {
  Forum, SimpleForum, User, Message, Notify,
  ForumInput, ForumMessage, JoinInput, postMessageInput,
  processReqInput,
} from "./types/types";

import { MemData } from "./memData/memData";

//  querys
export let queryType = new GraphQLObjectType({
  name: "queryType",
  fields: () => ({
    forum: {
      type: Forum,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve: (_, { id }) => MemData.getInstance().ForumMem.findForum(id)
    },
    forums: {
      type: GraphQLList(SimpleForum),
      args: {
        uid: {
          type: GraphQLNonNull(GraphQLID)
        }
      },
      resolve: (_, { uid }) => {
        return MemData.getInstance().ForumMem.forums(uid);
      }
    },
    myForums: {
      type: GraphQLList(Forum),
      args: {
        uid: {
          type: GraphQLNonNull(GraphQLID)
        }
      },
      resolve: (_, { uid }) => MemData.getInstance().ForumMem.myForums(uid)
    },

    members: {
      type: GraphQLList(User),
      args: {
        uid: { type: GraphQLNonNull(GraphQLID) },
        fid: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve: (_, { uid, fid }) => {
        if (MemData.getInstance().ForumMem.isInsideForum(uid, fid)) {
          let forums = MemData.getInstance().ForumMem.findForum(fid);
          return MemData.getInstance().ForumMem.getUsers(forums.users)
        }
      }
    },

    messages: {
      type: GraphQLList(Message),
      args: {
        uid: { type: GraphQLNonNull(GraphQLID) },
        fid: { type: GraphQLNonNull(GraphQLID) },
        offset: { type: GraphQLInt },
        showCount: { type: GraphQLInt }
      },
      resolve: (_, { uid, fid, offset = 0, showCount = 100 }) => {
        if (MemData.getInstance().ForumMem.isInsideForum(uid, fid)) {
          return MemData.getInstance().MessageMem.messages(fid, offset, showCount)
        }
      }
    },

    userInfo: {
      type: User,
      args: {
        uid: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve: (_, { uid }) => MemData.getInstance().ForumMem.userInfo(uid)
    },

    myNotifies: {
      type: GraphQLList(Notify),
      args: {
        uid: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve: (_, { uid }) => MemData.getInstance().NotifyMem.allMyNotifies(uid)
    }
  })
});


// mutations
export let mutationType = new GraphQLObjectType({
  name: "mutationType",
  fields: {
    createForum: {
      type: Forum,
      args: {
        input: { 
          type: ForumInput 
        }
        
      },
      resolve: (_, args) => {
        // console.log("createForum:", args.input);
        const { uid, name, isPrivilage } = args.input;
        let userInfo = MemData.getInstance().ForumMem.userInfo(uid);
        if (userInfo) {      
          let forumNew = {
            forum_id: MemData.getInstance().ForumMem.maxForumId(),
            creator: uid,
            name: name,
            isPrivilage: isPrivilage,
            admins: [uid],
            users: [uid]
          }
          MemData.getInstance().ForumMem.addForum(forumNew);
          return forumNew;
        }
        // (uid: ID!, forum: ForumInput): AckForum
      }
    },

    joinForum: {
      type: ForumMessage,
      args: {
        input: { 
          type: JoinInput 
        }
        
      },
      resolve: (_, args) => {
        const { uid, fid } = args.input;
        let userInfo = MemData.getInstance().ForumMem.userInfo(uid);
        if (!userInfo) {
          return ;
        }

        let forum = MemData.getInstance().ForumMem.findForum(fid);
        if (forum) {
          if (forum.isPrivilage) {
            MemData.getInstance().sendRequest(uid, forum);
            return ;
          } else {
            return MemData.getInstance().joinToForum(uid, forum);  
          }  
        }
      }
    },

    postMessage: {
      type: Message,
      args: {
        input: {
          type: postMessageInput
        }
        
      },
      resolve: (_, args) => {
        const { uid, fid, text } = args.input;
        return MemData.getInstance().postMessage(uid, fid, text);
       }
    },

    processReq: {
      type: GraphQLString,
      args: {
        input: {
          type: processReqInput
        }
      },
      resolve: (_, args) => {
        const { uid, nid, yes } = args.input;
        MemData.getInstance().NotifyMem.setStateNtf(uid, nid, yes);
        let tips = '';
        if (yes) {
          const reqInfo = MemData.getInstance().NotifyMem.getReqInfo(uid, nid);
          // console.log("req:", reqInfo);
          if (reqInfo) {
            let forum = MemData.getInstance().ForumMem.findForum(reqInfo.fid);
            if (forum) {
              let ruid = reqInfo.reqUser?.id;
              if (!forum.users.includes(ruid)) {
                console.log("add user:", ruid);
                forum.users.push(ruid);
                MemData.getInstance().ForumMem.flush();
              }
              return 'ok';
            } else {
              return 'forum not exist!';
            }
          } else {
            return 'something wrong with the request infomation!';
          }
        } else {
          return 'ok';
        }
      }

    }


    
  }
})
