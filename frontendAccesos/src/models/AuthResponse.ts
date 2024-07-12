export interface AuthResponse {
    refresh: string;
    access:  string;
    detail : string | null;
}
