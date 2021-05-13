import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import useStyles from './ImageGalleryStyling';
import { Image } from '../../models/Image.Model';

interface Props {
    images: Image[]
}

export default function ImageGallery(props: Props) {
  const classes = useStyles();

  return (
    <div>
        {props.images.length > 0 ? 
            <div className={classes.root}>
                <GridList className={classes.gridList} cols={2.5}>
                    {props.images.map((image: Image) => (
                    <GridListTile key={image.id}>
                        <img src={image.path} alt={"Image"} />
                    </GridListTile>
                    ))}
                </GridList>
            </div>
        :
            <h1>There are not any images</h1>
        }
    </div>
  );
}