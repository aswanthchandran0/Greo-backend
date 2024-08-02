export class PasswordValidation{
   static validate(password:string):boolean{
      const minLength = 6
      const hasUpperCase = /[A-Z]/.test(password)
      const hasLowerCase = /[a-z]/.test(password)
      const hasDigit = /\d/.test(password)

  
    if(password.length>=minLength &&
         hasUpperCase &&
         hasLowerCase &&
         hasDigit
    ){
      return true
    }else{
        return false
    }  
}
   static getStrengthFeedback(password:string):string{
    const feedback:string[] = []
    if(password.length<6){
        feedback.push('password should be atleas 6 characters long.')
    }
    if(!/[A-Z]/.test(password)){
        feedback.push('password should include at least one uppercase letter.')
    }
    if(!/[a-z]/.test(password)){
        feedback.push('password should include at least one lowercase letter.')
    }
    if(!/\d/.test(password)){
        feedback.push('password should include at least one special character.')
    }
    return feedback.length>0? feedback.join(' '): 'Password is strong.'
   }
}