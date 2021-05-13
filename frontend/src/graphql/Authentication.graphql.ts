import { gql } from '@apollo/client';

export const getNewAccessTokenQuery = (refreshToken: string) =>{
    return gql`query {
        getNewAccessToken(refreshToken: "${refreshToken}"){
          accessToken
        }
    }`
}

export const logoutMutation = () => {
  return gql`mutation logout($accessToken: String!){
    logout(
      accessToken: $accessToken
    )
  }`
}

export const signinMutation = () => {
  return gql`mutation login($user: LoginUserInput!) {
    login(user: $user) {
      accessToken
      refreshToken
    }
  }`
}

export const signupMutation = () => {
  return gql`mutation registerRegularUser($user: RegisterUserInput!) {
      registerRegularUser(user: $user)
    }`
}