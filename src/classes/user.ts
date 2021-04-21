export class User {
    username: string;
    token: string;
    type: 'adm' | 'user';

    constructor(
        username: string, 
        token: string,
        type: 'adm' | 'user'
    ) {
        this.username = username
        this.token = token
        this.type = type
    }
  }
  