export class AuthCredentialsDto {
    username: string;
    password: string;
    type: 'adm' | 'user';

    constructor(
        username: string, 
        password: string,
        type: 'adm' | 'user'
    ) {
        this.username = username
        this.password = password
        this.type = type
    }

    createObject() {
        return {
            username: this.username,
            password: this.password,
            type: this.type
        }
    }
  }
  