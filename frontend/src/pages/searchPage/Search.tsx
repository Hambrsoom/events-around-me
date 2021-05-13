import { gql, useMutation, useQuery } from '@apollo/client';
import SnackBar from '../../components/snackbar/SnackBar';
import { Severity } from '../../models/ErrorNotification';
import Events from '../../components/displayEvents/Events';
import { getSearchedEvents } from '../../graphql/Event.graphql';
import Loading from '../../components/loading/Loading';

interface Props {
    text: string
}

export default function Search(props: Props) {
    const GET_SEARCHED_EVENTS = getSearchedEvents(props.text);
    const {loading, error, data}= useQuery(GET_SEARCHED_EVENTS);
    
    if (loading) return <Loading/>

    if(error) {
      return <SnackBar
        message={error.message}
        severity={Severity.Error}/>
    }

    return (   
      <Events events={data.searchForEvents}></Events>
    );
}
