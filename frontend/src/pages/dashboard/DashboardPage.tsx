import { gql, useQuery } from '@apollo/client';
import AlertNotifcation from '../../components/alert/Alert';
import { Severity } from '../../models/ErrorNotification';
import Events from '../../components/displayEvents/Events';

const GET_ALL_EVENTS = gql`
query {
  getAllEvents{
    id
    title
		url
    description
    address {
      street
      postalCode
      city
      province
      country
    }
    date
    images {
      path
    }
  }
}`


export default function DashboardPage() {
    const {loading, error, data} = useQuery(GET_ALL_EVENTS);

    if (loading) return <p>Loading...</p>

    if(error) {
      return <AlertNotifcation
        message={error.message}
        severity={Severity.Error}/>
    }

    return (    
      <Events events={data.getAllEvents}></Events>
    )
}
