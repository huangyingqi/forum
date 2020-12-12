import {
  GraphQLObjectType, GraphQLID,
  GraphQLString, GraphQLBoolean,
  GraphQLNonNull, GraphQLList,
  GraphQLInt, GraphQLFloat, GraphQLInputObjectType
} from "graphql";

export const Forum = new GraphQLObjectType({
  name: "Forum",
  fields: () => ({
    forum_id: { type: GraphQLNonNull(GraphQLID) },
    creator: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    admins: { type: GraphQLList(GraphQLID) },
    users: { type: GraphQLList(GraphQLID) },
    isPrivilage: { type: GraphQLBoolean }
  })
});

export const SimpleForum = new GraphQLObjectType({
  name: "SimpleForum",
  fields: () => ({
    forum_id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString }
  })
});


export const User = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    img: { type: GraphQLString }
  })
});

export const Message = new GraphQLObjectType({
  name: "Message",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    text: { type: GraphQLString },
    sender: { type: User },
    time: {type: GraphQLFloat}
  })
});


export const ReqJoinForum = new GraphQLObjectType({
  name: "ReqJoinForum",
  fields: () => ({
    fid: { type: GraphQLNonNull(GraphQLID) },
    reqUser: { type: User },
    reqInfo: { type: GraphQLString }
  })
});

export const Notify = new GraphQLObjectType({
  name: "Notify",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    state: { type: GraphQLInt },
    kind: { type: GraphQLInt },
    message: { type: GraphQLString },
    time: { type: GraphQLFloat },
    reqJoin: {type: ReqJoinForum}
  })
});

export const ForumMessage = new GraphQLObjectType({
  name: "ForumMessage",
  fields: () => ({
    forum: { type: Forum },
    messages: { type: GraphQLList(Message) }
  })
});

//////////////////////////////////////////////////// 
// below is the input types 
///////////////////////////////////////////////////
export const ForumInput = new GraphQLInputObjectType({
  name: "ForumInput",
  fields: () => ({
    uid: { type: GraphQLID},
    name: { type: GraphQLString },
    isPrivilage: { type: GraphQLBoolean }
  })
});

export const JoinInput = new GraphQLInputObjectType({
  name: "JoinInput",
  fields: () => ({
    uid: { type: GraphQLNonNull(GraphQLID) },
    fid: { type: GraphQLNonNull(GraphQLID) }
  })
});


export const postMessageInput = new GraphQLInputObjectType({
  name: "postMessageInput",
  fields: () => ({
    uid: { type: GraphQLNonNull(GraphQLID) },
    fid: { type: GraphQLNonNull(GraphQLID) },
    text: { type: GraphQLString }
  })
});

export const processReqInput = new GraphQLInputObjectType({
  name: "processReqInput",
  fields: () => ({
    uid: { type: GraphQLNonNull(GraphQLID) },
    nid: { type: GraphQLNonNull(GraphQLID) },
    yes: { type: GraphQLBoolean }
  })
});