export class AdminNotFoundException extends Error{
    constructor(message: string = 'Admin not found') {
        super(message);
        this.name = 'AdminNotFoundException';
      }
}
