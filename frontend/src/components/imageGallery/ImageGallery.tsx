import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import useStyles from './ImageGalleryStyling';
import { Image } from '../../models/Image.Model';
import Box from '@material-ui/core/Box';

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
            <div>There are not any images</div>
        }
    </div>
  );
}