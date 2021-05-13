import Alert from '@material-ui/lab/Alert';
import useStyles from './AlertStyling';
import { ErrorNotification } from '../../../models/ErrorNotification';

export default function AlertNotifcation(props: ErrorNotification) {
    const classes = useStyles();
    return (
      <div className={classes.root}>
        <Alert  variant="filled" severity={props.severity}>{props.message}</Alert>
      </div>
    );
  }
