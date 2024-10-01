export class RegistrationException extends Error {
    
    constructor(messgae: string = 'User with this username already exists.'){
        super(messgae)
        this.name = 'RegistrationException'
    }
}
