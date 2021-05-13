import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Event } from '../../../models/Event.Model';
import useStyles from '../EventsDisplayStyling';
import { useHistory } from 'react-router';
import Typography from '@material-ui/core/Typography';

interface Props {
    event: Event
}

export default function EventCard(props: Props) {
    const classes = useStyles();
    const history = useHistory();
    const event = props.event;

    const handleOnClickView = (eventId: string) => {
        history.push(`/event/${eventId}`)
    }

    return (
        <Card className={classes.card}>
            {event?.images.length > 0 && (
                <CardMedia
                    className={classes.cardMedia}
                    image={event?.images[0].path}
                />
            )}                  
            <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
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
    )
}
