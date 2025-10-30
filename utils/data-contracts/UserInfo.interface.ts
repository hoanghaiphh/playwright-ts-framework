export interface NestedJson {
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

export interface FlatInNestedJson {
    users: FlatJson[];
}

export interface FlatJson {
    firstName: string;
    lastName: string;
    company: string;
}
