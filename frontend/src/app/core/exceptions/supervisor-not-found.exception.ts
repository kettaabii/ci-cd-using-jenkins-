export class SupervisorNotFoundException extends Error {
    constructor(message: string = 'Supervisor not found') {
      super(message);
      this.name = 'SupervisorNotFoundException';
    }
}