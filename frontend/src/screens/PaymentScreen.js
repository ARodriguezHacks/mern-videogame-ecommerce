import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Button,
  FormGroup,
  RadioGroup,
  Radio,
  Typography,
} from "@material-ui/core";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../actions/cartActions";

const PaymentScreen = () => {
  let history = useHistory();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress) {
    history.push("/shipping");
  }

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <Typography variant="h4">Payment Method</Typography>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <FormControl>
            <FormLabel component="legend">Select Method</FormLabel>
            <RadioGroup
              aria-label="paymentMethod"
              value={paymentMethod}
              onChange={handleChange}
            >
              <FormControlLabel
                control={<Radio />}
                label="PayPal"
                id="PayPal"
                name="paymentMethod"
                value="PayPal"
              />
            </RadioGroup>
          </FormControl>
        </FormGroup>
        <Button type="submit">Continue</Button>
      </form>
    </FormContainer>
  );
};

export default PaymentScreen;
