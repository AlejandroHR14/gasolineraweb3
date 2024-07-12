import { Surtidor } from "./Surtidor";

export interface User {
    id:         number | null;
    password:   string | null;
    username:   string;
    first_name: string;
    last_name:  string;
    email:      string;
    groups:     number[];
    surtidor:   Surtidor | null;
}
