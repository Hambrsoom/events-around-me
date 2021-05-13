import React from 'react'
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Event } from '../../models/Event.Model';
import useStyles from './EventsDisplayStyling';
import { useHistory } from 'react-router';

interface Props {
    events: Event[];
}

export default function Events(props: Props) {
    const classes = useStyles();
    const history = useHistory();
    
    const handleOnClickView = (eventId: string) => {
      history.push(`/event/${eventId}`)
    }

    return (
        <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {props.events.map((event: Event) => (
            <Grid item key={event.id} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                {event?.images.length > 0 && (
                  <CardMedia
                    className={classes.cardMedia}
                    image={event?.images[0].path}
                  />
                )}                  
                <CardContent className={classes.cardContent}>
                  <Typography  gutterBottom variant="h5" component="h2">
                    {event.title}
                  </Typography>
                  <Typography>
                    {event.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" onClick={()=>handleOnClickView(event.id)}>
                    View
                  </Button>
                  {(event.url || event.url !== "") && (
                    <Button size="small" color="primary" href={event.url}>
                        Watch Me 
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    )
}
