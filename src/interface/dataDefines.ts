export interface User{
  uid: string,
  name: string,
  img: string
}

export interface Forum{
  forum_id: string;
  creator: string;
  admins: string[];
  users: string[];
  name: string;
  isPrivilage: Boolean;
}

export interface ReqInfo{
  fid: string,
  info: string,
  requester: User
}

export interface Message{
  text: string,
  sender: User,
  time: number
}

export enum enumState{
  UNREAD,
  READ,
  DISCARD,
  AGREE
}
