import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Typography,
} from "@mui/material";

// assets
import styles from "assets/styles/cards/Feature.module.css";

const Feature = ({ image, title, onClick }) => {

  return (
    <Card className={styles.card} onClick={onClick}>
      <CardActionArea>
        <CardMedia
          component="img"
          className={styles.media}
          image={image}
          title={title}
        />
        <CardContent>
          <Typography className={styles.text} gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

Feature.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
};

export default Feature;
