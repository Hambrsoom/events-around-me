import { useQuery } from '@apollo/client';
import { Severity } from '../../models/ErrorNotification';
import Events from '../../components/displayEvents/Events';
import SnackBar from '../../components/snackbar/SnackBar';
import { getAllEventsQuery } from '../../graphql/Event.graphql';
import Loading from '../../components/loading/Loading';

const GET_ALL_EVENTS = getAllEventsQuery();

export default function DashboardPage() {
    const {loading, error, data} = useQuery(GET_ALL_EVENTS);

    if (loading) return <Loading/>

    if(error) {
      return <SnackBar
        message={error.message}
        severity={Severity.Error}/>
    }

    return (    
      <Events events={data.getAllEvents}></Events>
    )
}
