export type User = {
  avatar_url: string;
  id: number;
  username: string;
  email: string;
  created_at: Date;
};

export interface LoginData {
  email: string;
  password: string;
}
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
