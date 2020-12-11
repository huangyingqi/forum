# Changs

1. add querys myNotifies for all users can read the notification(include notification of request to join forum)
2. add mutations processReq for administrator to accept or refuse the request of join.
3. modify joinForum sending request to admins if the forum is privilaged.
4. add ack for all returned types include tips for client easy to know the condition.

## Types

    type Notify {
      id: ID!
      state: Int!
      kind: Int!
      message: String!
      time: Float!
      reqJoin: ReqJoinForum
    }

    type Ack {
      code: Int
      tips: String
    }

    type AckForums {
      ack: Ack
      data: [Forum]
    }

    type AckSimpleForums {
      ack: Ack
      data: [SimpleForum]
    }

    type AckUsers {
      ack: Ack
      data: [User]
    }

    type AckMessages {
      ack: Ack
      data: [Message]
    }

    type AckUser {
      ack: Ack
      data: User
    }

    type AckNotifies {
      ack: Ack
      data: [Notify]
    }

    type AckForum {
      ack: Ack
      data: Forum
    }

    type AckForumMessage {
      ack: Ack
      data: ForumMessage
    }

    type AckMessage {
      ack: Ack
      data: Message
    }

## Querys

1. myForums(uid: ID!): AckForums
2. forums(uid: ID!): AckSimpleForums
3. members(uid: ID!, fid: ID!): AckUsers
4. messages(uid: ID, fid: ID, offset: Int, showCount: Int): AckMessages
5. userInfo(uid: ID!): AckUser
6. myNotifies(uid: ID!): AckNotifies

## Mutations

1. createForum(uid: ID!, forum: ForumInput): AckForum
2. joinForum(uid: ID!, fid: ID!): AckForumMessage
3. postMessage(uid: ID!, fid: ID!, text: String): AckMessage
4. processReq(uid: ID!, nid: ID!, yes: Boolean): Ack

# Test data

> ## myForums:

    query{
      myForums(uid: 1001){
        ack{
          code
          tips
        }
        data{
          forum_id
          name
          users
        }
      }
    }

> ## forums:

    query{
      forums(uid: 1003){
        ack{
          tips
        }
        data{
          forum_id
          name
        }
      }
    }

> ## members:

    query{
      members(uid: 1001, fid:100100011){
        ack{tips}
        data{
          id
          name
          img
        }
      }
    }

> ## messages:

    query{
      messages(uid: 1001, fid: 100100012){
        ack{tips}
        data{
          text
          sender{
            name
            img
          }
          time
        }
      }
    }

> ## userInfo:

    query{
      userInfo(uid: 1005){
        ack{tips}
        data{
          id
          name
          img
        }
      }
    }

> ## myNotifies:

    query{
      myNotifies(uid:1001){
        ack{tips}
        data{
          id
          state
          kind
          time
          message
          reqJoin{
            reqInfo
            reqUser{
              name
              img
            }
          }
        }
      }
    }

> ## createForum:

    mutation{
      createForum(
        uid: 1001,
        forum:{
        name:"priForum",
        isPrivilage:true})
      {
        ack{tips}
        data{
          forum_id
          name
          creator
          users
        }
      }
    }

> ## joinForum:

    mutation{
      joinForum(uid: 1007, fid:100100011){
        ack{tips}
        data{
          forum{
            forum_id
            users
            name
            creator
          }
          messages{
            text
            time
            sender{
              name
              img
            }
          }
        }
      }
    }

> ## postMessage:

    mutation{
      postMessage(
        uid: 1005,
        fid: 100100012,
        text: "I'm here!")
      {
        ack{tips}
        data{
          time
          text
          sender{
            name
            img
          }
        }
      }
    }

> ## processReq:

    mutation{
      processReq(
        uid: 1001,
        nid:10004,
        yes: true)
      {
        tips
      }
    }
