export class UserInfo {
    private _firstName: string;
    private _lastName: string;
    private _email: string;
    private _company: string;
    private _password: string;

    constructor(data?: Partial<UserInfo>) {
        this._firstName = data?.firstName || '';
        this._lastName = data?.lastName || '';
        this._email = data?.email || '';
        this._company = data?.company || '';
        this._password = data?.password || '';
    }

    public setFirstName(value: string): void { this._firstName = value; }
    public setLastName(value: string): void { this._lastName = value; }
    public setEmail(value: string): void { this._email = value; }
    public setCompany(value: string): void { this._company = value; }
    public setPassword(value: string): void { this._password = value; }

    public get firstName(): string { return this._firstName; }
    public get lastName(): string { return this._lastName; }
    public get email(): string { return this._email; }
    public get company(): string { return this._company; }
    public get password(): string { return this._password; }
    
}