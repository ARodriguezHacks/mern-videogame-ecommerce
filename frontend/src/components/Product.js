import React from "react";
import { Link } from "react-router-dom";
import Rating from "../components/Rating";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardMedia, CardContent, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  media: {
    height: 310,
  },
});

const Product = ({ product }) => {
  const classes = useStyles();
  return (
    <Card>
      <Link to={`/product/${product._id}`}>
        <CardMedia
          className={classes.media}
          image={product.image}
          title={product.title}
        />
      </Link>

      <CardContent>
        <Link to={`/product/${product._id}`}>
          <Typography variant="body2" color="textSecondary" component="p">
            {product.name}
          </Typography>
        </Link>
        <Typography variant="body2" color="textSecondary" component="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Typography>
        <Typography variant="h5" color="secondary">
          ${product.price}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Product;
