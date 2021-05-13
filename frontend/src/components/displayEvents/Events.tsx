import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { Event } from '../../models/Event.Model';
import useStyles from './EventsDisplayStyling';
import EventCard from './eventCard/EventCard';
interface Props {
    events: Event[];
}

export default function Events(props: Props) {
    const classes = useStyles();
       
    return (
        <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {props.events.map((event: Event) => (
            <Grid item key={event.id} xs={12} sm={6} md={4}>
              <EventCard event={event}/>
            </Grid>
          ))}
        </Grid>
      </Container>
    )
}
