import React from 'react'
import { gql, useQuery } from '@apollo/client';
import { Redirect } from 'react-router-dom';

const GET_NEW_ACCESS_TOKEN = gql`
query {
    getNewAccessToken(refreshToken: "${localStorage.getItem('refreshToken')}"){
      accessToken
    }
  }`

interface Props {
    children?: React.ReactNode
}

export default function IsAuthenticated({children}: Props) {
    const {loading, error, data} = useQuery(GET_NEW_ACCESS_TOKEN);
    if(error) {
        return <Redirect to={{pathname: '/signin'}}/>
    }
    if(data){
        localStorage.setItem('accessToken', data.getNewAccessToken.accessToken);
    }

    return <>{children}</>;
}
