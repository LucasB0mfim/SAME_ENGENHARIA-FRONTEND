export interface IValidateTokenResponse {
  success: boolean,
  message: string,
  result: {
    email: string,
    iat: number,
    exp: number
  }
}
