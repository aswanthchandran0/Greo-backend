

export interface RollDto{
  userId:string,
  thumbnail:string,
  mediaUrl: string,
  content?: string,
  createdAt:Date
  name?: string;
  userName?:string
  profileImage?: string;
  likeCount?:number,
  commentCount?:number,
  isLikedByViewingUser?:boolean
  type?:string
}