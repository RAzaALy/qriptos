import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { Link as RouterLink } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import DialogBox from "../components/DialogBox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {
  useGenerateKey,
  useGenerateName,
  useSaveName,
} from "../Services/authenticationService";
import { authenticationService } from "../Services/authenticationService";
import Container from "@material-ui/core/Container";
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

const GetKey = (props) => {
  const [infoModal, setInfoModal] = useState(false);
  const [infoModal2, setInfoModal2] = useState(false);
  const [success, setSuccess] = useState(false);
  const classes = useStyles();
  const getKey = useGenerateKey();
  const getNames = useGenerateName();
  const saveName = useSaveName();
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleChange = (event) => {
    setName(event.target.value);
  };
  const GetNames = () => {
    getNames()
      .then(function (response) {
        setName(response[0]);
        setAddress(authenticationService.currentUserValue.address)
        setData(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleSave = () => {
    saveName(address, name)
      .then(function (response) {})
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    getKey()
      .then(function (response) {
        setSuccess((prev) => !prev);
        GetNames();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Grid container>
          <Grid item>
            <Typography component="h1" variant="h5" align="center">
              Get Your Keys
              <br />
              <small>
                A set of keys is required to control your account. Your keys
                live on your phone, so only you can access them.
              </small>
            </Typography>
            {success && (
              <DialogBox
                modalOpen={infoModal}
                setModalOpen={setInfoModal}
                title="Choose a Chat Name"
              >
                <Typography
                  variant="h6"
                  color="secondary"
                  className={classes.title}
                >
                  <p>
                    One key is for chat. It comes with a readable name that
                    can't be changed.
                  </p>
                  <strong style={{ color: "orangered" }}>Learn More</strong>
                </Typography>
                <div className={classes.root}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      aria-label="chat"
                      name="chat"
                      value={name}
                      onChange={handleChange}
                    >
                      {data.map((item, index) => (
                        <FormControlLabel
                          key={index}
                          value={item}
                          control={<Radio />}
                          label={item}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </div>

                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  type="button"
                  component={RouterLink}
                  to="/createPassword"
                  onClick={handleSave}
                  className={classes.submitButton}
                >
                  Next
                </Button>
              </DialogBox>
            )}

            <DialogBox
              modalOpen={infoModal2}
              setModalOpen={setInfoModal2}
              title="Enter a Seed Phrase"
            >
              <Typography
                variant="h6"
                color="secondary"
                className={classes.title}
              >
                <p>Do you want to add an other existing key?</p>
              </Typography>
              <Button
                color="primary"
                variant="contained"
                size="small"
                type="button"
                onClick={() => setInfoModal2(false)}
                className={classes.submitButton}
              >
                Add another Existing Key
              </Button>
            </DialogBox>

            <form onSubmit={handleSubmit} className={classes.form}>
              <Button
                type="submit"
                fullWidth={true}
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => setInfoModal(true)}
              >
                Generate Key
              </Button>
            </form>
          </Grid>
          <Grid item xs={9}>
            <Typography>
              <Link
                onClick={() => setInfoModal2(true)}
                style={{ cursor: "pointer" }}
              >
                Access Existing Keys
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default GetKey;
