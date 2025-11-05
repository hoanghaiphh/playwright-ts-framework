export class UserModel {

    private _firstName: string;
    private _lastName: string;
    private _email: string;
    private _company: string;
    private _password: string;

    constructor(data?: Partial<UserModel>) {
        this._firstName = data?.firstName || '';
        this._lastName = data?.lastName || '';
        this._email = data?.email || '';
        this._company = data?.company || '';
        this._password = data?.password || '';
    }

    setFirstName(value: string): void { this._firstName = value; }
    setLastName(value: string): void { this._lastName = value; }
    setEmail(value: string): void { this._email = value; }
    setCompany(value: string): void { this._company = value; }
    setPassword(value: string): void { this._password = value; }

    get firstName(): string { return this._firstName; }
    get lastName(): string { return this._lastName; }
    get email(): string { return this._email; }
    get company(): string { return this._company; }
    get password(): string { return this._password; }

}