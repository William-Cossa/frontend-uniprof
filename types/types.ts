export interface searchParamsProps {
  searchParams: { [key: string]: string | string[] | undefined };
}
export interface paramsProps {
  params: {
    id: string;
  };
}

export interface UserSession {
  accessToken: string;
  iss?: string;
  aud?: string;
  sub?: number;
  email?: string;
  telephone?: number;
  statusAccount?: boolean;
  name?: string;
  lastname?: string;
  id?: number;
  exp?: string;
}
