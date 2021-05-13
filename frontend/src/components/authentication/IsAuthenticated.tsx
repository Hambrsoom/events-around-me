import React from 'react'
import { useQuery } from '@apollo/client';
import { Redirect } from 'react-router-dom';
import { getNewAccessTokenQuery } from '../../graphql/Authentication.graphql';
import Loading from '../loading/Loading';

const GET_NEW_ACCESS_TOKEN = getNewAccessTokenQuery(localStorage.getItem('refreshToken')|| '');

interface Props {
    children?: React.ReactNode
}

export default function IsAuthenticated({children}: Props) {
    const {loading, error, data} = useQuery(GET_NEW_ACCESS_TOKEN);
    
    if(loading) {
        return <Loading/>
    }
    
    if(error) {
        return <Redirect to={{pathname: '/signin'}}/>
    }

    if(data){
        localStorage.setItem('accessToken', data.getNewAccessToken.accessToken);
    }

    return <>{children}</>;
}
