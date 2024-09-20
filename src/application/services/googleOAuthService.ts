import axios from "axios";
class GoogleOAuthService {
    private userInfoUrl:string
    constructor(){
        this.userInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo'
    }

    public async verifyGoogleToken(token:string):Promise<any>{
        try{
            const response = await axios.get(`${this.userInfoUrl}?access_token=${token}`)
            console.log(response.data)
            return response.data
        }catch(err){
            throw new Error('Invalid or Expired token')
        }
    }
}


export default GoogleOAuthService