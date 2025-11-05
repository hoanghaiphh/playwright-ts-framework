export interface Json1 {
    name: {
        firstName: string;
        lastName: string;
    };
    company: string;
    login: {
        email: string;
        password: string;
    };
    languages: string[];
    buildTools: string[];
}

export interface Json2 {
    users: Json3[];
}

export interface Json3 {
    firstName: string;
    lastName: string;
    company: string;
}