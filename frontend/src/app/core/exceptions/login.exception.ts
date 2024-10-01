export class LoginException extends Error {
    
    constructor(message: string){
        super(message)
        this.name = 'LoginException';
    }

    public static invalidCredentials() {
        return new LoginException("Invalid username or password.");
    }

    public static authenticationFailed() {
        return new LoginException("Authentication failed. Please try again.");
    }
}
