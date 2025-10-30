export interface NestedUserJson {
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

export interface UserListJson {
    users: FlatUserJson[];
}

export interface FlatUserJson {
    firstName: string;
    lastName: string;
    company: string;
}
