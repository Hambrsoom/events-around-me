import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      box: {
        backgroundColor: theme.palette.action.hover,
        border: '1px solid #000',
        boxShadow: theme.shadows[6],
        padding: theme.spacing(0, 2, 5),
      },
    }),
);

export default useStyles;
  