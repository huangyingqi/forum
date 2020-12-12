# Changs

1. add querys myNotifies for all users can read the notification(include notification of request to join forum)
2. add mutations processReq for administrator to accept or refuse the request of join.
3. modify joinForum sending request to admins if the forum is privilaged.
4. add ack for all returned types include tips for client easy to know the condition.

5. change all define of types with GraphQLObjectType and GraphQLInputObjectType

## change all type's define

> ### GraphQLObjectType

- Forum
- SimpleForum
- User
- Message
- Notify
- ForumMessage

> ### GraphQLInputObjectType

- ForumInput
- JoinInput
- postMessageInput
- processReqInput

## Querys(queryType)

1. myForums(uid: ID!): Forums
2. forums(uid: ID!): SimpleForums
3. members(uid: ID!, fid: ID!): Users
4. messages(uid: ID, fid: ID, offset: Int, showCount: Int): Messages
5. userInfo(uid: ID!): User
6. myNotifies(uid: ID!): Notifies

## Mutations(mutationType)

1. createForum(uid: ID!, forum: ForumInput): Forum
2. joinForum(uid: ID!, fid: ID!): ForumMessage
3. postMessage(uid: ID!, fid: ID!, text: String): Message
4. processReq(uid: ID!, nid: ID!, yes: Boolean): String

# Test data

> ## myForums:

    query{
      myForums(uid: 1001){
        forum_id
        name
        users
      }
    }

> ## forums:

    query{
      forums(uid: 1003){
          forum_id
          name
      }
    }

> ## members:

    query{
      members(uid: 1001, fid:100100011){
          id
          name
          img
      }
    }

> ## messages:

    query{
      messages(uid: 1001, fid: 100100012){
          text
          sender{
            name
            img
          }
          time
      }
    }

> ## userInfo:

    query{
      userInfo(uid: 1005){
          id
          name
          img
      }
    }

> ## myNotifies:

    query{
      myNotifies(uid:1001){
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

> ## createForum:

    mutation{
      createForum(
        input:{
          uid: 1001,
          name:"priForum",
          isPrivilage:true})
      {
          forum_id
          name
          creator
          users
      }
    }

> ## joinForum:

    mutation{
      joinForum(
        input:{uid: 1007, fid:100100011}){
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

> ## postMessage:

    mutation{
      postMessage(
        input:{
          uid: 1005,
          fid: 100100012,
          text: "I'm here!"
        })
      {
          time
          text
          sender{
            name
            img
          }
      }
    }

> ## processReq:

    mutation{
      processReq(
        input:{
          uid: 1001,
          nid:10004,
          yes: true
        })
    }
