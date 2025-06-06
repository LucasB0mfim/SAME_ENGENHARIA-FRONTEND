export interface IEmployeeResponse {
  success: boolean,
  message: string,
  employee: {
    id: number,
    name: string,
    username: string,
    position: string,
    role: string,
    email: string,
    password: string,
    created_at: string,
    updated_at: string,
    avatar: string,
    birthday: string,
  }
}
