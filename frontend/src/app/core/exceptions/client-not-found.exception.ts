export class ClientNotFoundException extends Error {
    constructor(message: string = 'Client not found') {
      super(message);
      this.name = 'ClientNotFoundException';
    }
}