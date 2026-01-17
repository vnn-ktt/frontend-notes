export interface INote {
  id?: string
  title: string
  content: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface IRegisterCredentials {
    email: string;
    name: string;
    password: string;
}