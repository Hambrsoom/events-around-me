import useStyles from './DashboardStyling';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { gql, useQuery } from '@apollo/client';
import AlertNotifcation from '../../components/alert/Alert';
import { Severity } from '../../models/ErrorNotification';
import { Event } from '../../models/Event.Model';

const GET_NEW_ACCESS_TOKEN = gql`
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
    const classes = useStyles();
    const {loading, error, data} = useQuery(GET_NEW_ACCESS_TOKEN);

    if (loading) return <p>Loading...</p>

    if(error) {
      return <AlertNotifcation
        message={error.message}
        severity={Severity.Error}/>
    }

    console.log(data);

    return (    
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {data.getAllEvents.map((event: Event) => (
            <Grid item key={event.id} xs={12} sm={6} md={4}>
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
                  <Button size="small" color="primary">
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
