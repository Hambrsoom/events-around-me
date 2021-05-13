import { gql } from '@apollo/client';

export const addEventMutation = () => {
    return gql`mutation addEvent($event: EventInput!){
        addEvent(event: $event){
          title
        }
    }`
}

export const uploadImageToEvent = () => {
    return gql`
        mutation addImageToEvent($eventId: String!, $pictures:[Upload!]!){
        addImageToEvent(eventId: $eventId, pictures: $pictures)
    }`
}

export const getAllEventsQuery = () => {
    return gql`
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
}

export const getEventById = (eventId: string) => {
    return gql`query {
        getEventById(id:"${eventId}"){
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
}


export const getSearchedEvents = (text: string) => { 
    return gql`
    query {
        searchForEvents(text: "${text}"){
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
}