export interface User{
  id: string,
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
  reqInfo: string,
  reqUser: User
}

export interface Message{
  text: string,
  sender: User,
  time: number
}

export enum enumState{
  UNREAD,
  READ,
  DISAGREE,
  AGREE
}
