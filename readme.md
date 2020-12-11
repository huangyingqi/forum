# install

        npm i

# dev start

        npm run build:dev

# test condition
   http://localhost:3000/graphql

# schema

## Types

    type Forum {
        forum_id: ID!
        creator: ID!
        name: String
        admins: [ID!]
        users: [ID!]
        isPrivilage: Boolean
    }

    type SimpleForum {
        forum_id: ID!
        name: String
    }

    type User {
        id: ID!
        name: String
        img: String
    }

    type Message {
        id: ID!
        text: String
        sender: User
        time: Float
    }

    type ForumMessage {
        forum: Forum
        messages: [Message]
    }

## Querys

>

1. myForums(uid: ID!): [Forum]
2. forums(uid: ID!): [SimpleForum]
3. members(uid: ID!, fid: ID!): [User]
4. messages(uid: ID, fid: ID, offset: Int, showCount: Int): [Message]
5. userInfo(uid: ID!): User

## Mutations

>

1. createForum(uid: ID!, forum: ForumInput): Forum
2. joinForum(uid: ID!, fid: ID!): ForumMessage
3. postMessage(uid: ID!, fid: ID!, text: String): Message

>

### input

        input ForumInput {
            name: String
            isPrivilage: Boolean
        }

# Directory

## fixtures

all json files stored data

## interface

define common interfaces

## memData

process memData include(forum, user, message, notify)

## schema

type define of graphaql
