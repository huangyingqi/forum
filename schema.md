### Types

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

### Querys

    myForums(uid: ID!): [Forum]
    forums(uid: ID!): [SimpleForum]
    members(uid: ID!, fid: ID!): [User]
    messages(uid: ID, fid: ID, offset: Int, showCount: Int): [Message]
    userInfo(uid: ID!): User

### Mutations

    createForum(uid: ID!, forum: ForumInput): Forum
    joinForum(uid: ID!, fid: ID!): ForumMessage
    postMessage(uid: ID!, fid: ID!, text: String): Message

#### input

    input ForumInput {
    name: String
    isPrivilage: Boolean
    }
