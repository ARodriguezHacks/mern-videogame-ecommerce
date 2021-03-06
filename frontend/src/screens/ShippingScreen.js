import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  FormGroup,
  Typography,
} from "@material-ui/core";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../actions/cartActions";

const ShippingScreen = () => {
  let history = useHistory();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    history.push("/payment");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <Typography variant="h4">Shipping</Typography>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <FormControl>
            <InputLabel htmlFor="address">Address</InputLabel>
            <Input
              type="text"
              id="address"
              name="address"
              value={address}
              required
              placeholder="Enter address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormControl>
            <InputLabel htmlFor="city">City</InputLabel>
            <Input
              type="text"
              id="city"
              name="city"
              value={city}
              required
              placeholder="Enter city"
              onChange={(e) => setCity(e.target.value)}
            />
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormControl>
            <InputLabel htmlFor="postalCode">Postal Code</InputLabel>
            <Input
              type="text"
              id="postalCode"
              name="postalCode"
              value={postalCode}
              required
              placeholder="Enter postal code"
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormControl>
            <InputLabel htmlFor="country">Country</InputLabel>
            <Input
              type="text"
              id="country"
              name="country"
              value={country}
              required
              placeholder="Enter country"
              onChange={(e) => setCountry(e.target.value)}
            />
          </FormControl>
        </FormGroup>
        <Button type="submit">Continue</Button>
      </form>
    </FormContainer>
  );
};

export default ShippingScreen;
