export interface IEmployeesRecord {
  name: string,
  email: string,
  role: string,
  avatar: string,
}

export interface IEmployeesResponse {
  success: boolean;
  message: string;
  employees: IEmployeesRecord[];
}
