export class User{
    constructor(
        public id:string,
        public user_name:string,
        public full_name:string,
        public email:string,
        public phone_number:Number,
        public password:string
    ){}
}

export type UserGender = 'prefer not to say'|'male'|'female'|'other'
export type LastSeenOnline = 'Everyone'|'private'|'hide'

export class UserProfile{
    constructor(
    public user_id:string,
    public user_image:string,
    public user_bio:string,
    public user_gender:UserGender,
    public private_account:boolean,
    public lastseen_online:LastSeenOnline,
    public post:string[],
    public roll:string[],
    public followers:string[],
    public following:string[],
    public community:string[],
    public stories:string[]

    ){}
}
