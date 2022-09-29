import React from "react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  FormControlLabel,
  Button,
  Typography,
  Container,
  Checkbox,
} from "@material-ui/core";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const Welcome = () => {
  const [state, setState] = useState({
    checkedA: false,
    checkedB: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <Container>
      <div>
        <Typography variant="h4" color="secondary">
          <strong>Welcome to Qriptos</strong>
          <p>
            Create your wallet, a digital vault to store your NFT'S. Invite
            friends, business partners and family to chat. Scan, sign and make
            payments. And all ot this encrypted !
          </p>
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={state.checkedA}
              onChange={handleChange}
              name="checkedA"
            />
          }
          label="By using QRIPTOS, I acknowledge that I accept full
responsibility for all risks involving my data and
finances"
        />
        <br />
        <FormControlLabel
          control={
            <Checkbox
              checked={state.checkedB}
              onChange={handleChange}
              name="checkedB"
            />
          }
          label="I accept Terms of Use and Privacy Policy"
        />

        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          component={RouterLink}
          to="/generateKey"
          startIcon={<ExitToAppIcon />}
          disabled={
            state.checkedA === true && state.checkedB === true ? false : true
          }
        >
          Get Started
        </Button>
      </div>
    </Container>
  );
};

export default Welcome;
