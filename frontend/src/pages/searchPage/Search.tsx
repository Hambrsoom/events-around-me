import { gql, useMutation, useQuery } from '@apollo/client';
import AlertNotifcation from '../../components/alert/Alert';
import { Severity } from '../../models/ErrorNotification';
import Events from '../../components/displayEvents/Events';

interface Props {
    text: string
}
  
export default function Search(props: Props) {
    const GET_SEARCHED_EVENTS = gql`
    query {
        searchForEvents(text: "${props.text}"){
          id
          title
          url
          description
          address {
            street
            postalCode
          }
          date
          images {
            path
          }
        }
    }`
    const {loading, error, data}= useQuery(GET_SEARCHED_EVENTS);
    if (loading) return <p>Loading...</p>

    if(error) {
      return <AlertNotifcation
        message={error.message}
        severity={Severity.Error}/>
    }

    return (   
      <Events events={data.searchForEvents}></Events>
    );
}
