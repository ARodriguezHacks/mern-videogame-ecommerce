import React, { useState, useEffect } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrderDetails, payOrder } from "../actions/orderActions";
import { ORDER_PAY_RESET } from "../constants/orderConstants";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";
import axios from "axios";

const OrderScreen = ({ match }) => {
  const orderId = match.params.id;
  const [sdkReady, setSdkReady] = useState(false);
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  if (!loading) {
    // Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }

  useEffect(() => {
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!order || order._id !== orderId || successPay) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, order, orderId, successPay]);

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message severity="warning">{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>

      <Grid container spacing={2}>
        <Grid item md={8}>
          <List>
            <ListItem>
              <ListItemText>
                <Typography variant="h5">Shipping</Typography>
                <Typography>
                  <strong>Name: </strong> {order.user.name}
                </Typography>
                <Typography>
                  <strong>Email: </strong>
                  <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem divider>
              <ListItemText>
                <Typography>
                  <strong>Address:</strong> {order.shippingAddress.address},{" "}
                  {order.shippingAddress.city}{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </Typography>
                {order.isDelivered ? (
                  <Message>Paid on {order.deliveredAt}</Message>
                ) : (
                  <Message severity="error">Not Delivered</Message>
                )}
              </ListItemText>
            </ListItem>
          </List>

          <List>
            <ListItem>
              <ListItemText>
                <Typography variant="h5">Payment Method</Typography>
              </ListItemText>
            </ListItem>
            <ListItem divider>
              <ListItemText>
                <Typography>
                  <strong>Method: </strong>
                  {order.paymentMethod}
                </Typography>
                {order.isPaid ? (
                  <Message>Paid on {order.paidAt}</Message>
                ) : (
                  <Message severity="error">Not Paid</Message>
                )}
              </ListItemText>
            </ListItem>
          </List>

          <List>
            <ListItem>
              <ListItemText>
                <Typography variant="h5">Order Items</Typography>
              </ListItemText>
            </ListItem>
            <ListItem>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <List>
                  {order.orderItems.map((item, index) => (
                    <ListItem key={index} divider>
                      <Grid container>
                        <Grid container item md={1}>
                          <Card>
                            <CardMedia
                              component="img"
                              image={item.image}
                              alt={item.name}
                            />
                          </Card>
                        </Grid>
                        <Grid item md={1}>
                          <Link to={`/product/${item.product}`} />
                        </Grid>
                        <Grid item md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Grid>
                        <Grid item md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Grid>
                      </Grid>
                    </ListItem>
                  ))}
                </List>
              )}
            </ListItem>
          </List>
        </Grid>

        <Grid item md={4}>
          <Card>
            <CardContent>
              <List>
                <ListItem divider>
                  <ListItemText>
                    <Typography variant="h5">Order Summary</Typography>
                  </ListItemText>
                </ListItem>

                <ListItem divider>
                  <Grid container>
                    <Grid item xs={6}>
                      <ListItemText>Items</ListItemText>
                    </Grid>
                    <Grid item xs={6}>
                      <ListItemText>${order.itemsPrice}</ListItemText>
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem divider>
                  <Grid container>
                    <Grid item xs={6}>
                      <ListItemText>Shipping</ListItemText>
                    </Grid>
                    <Grid item xs={6}>
                      <ListItemText>${order.shippingPrice}</ListItemText>
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem divider>
                  <Grid container>
                    <Grid item xs={6}>
                      <ListItemText>Tax</ListItemText>
                    </Grid>
                    <Grid item xs={6}>
                      <ListItemText>${order.taxPrice}</ListItemText>
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem divider>
                  <Grid container>
                    <Grid item xs={6}>
                      <ListItemText>Total</ListItemText>
                    </Grid>
                    <Grid item xs={6}>
                      <ListItemText>${order.totalPrice}</ListItemText>
                    </Grid>
                  </Grid>
                </ListItem>
                {!order.isPaid && (
                  <ListItem>
                    {loadingPay && <Loader />}
                    {!sdkReady ? (
                      <Loader />
                    ) : (
                      <PayPalButton
                        amount={order.totalPrice}
                        onSuccess={successPaymentHandler}
                      />
                    )}
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default OrderScreen;