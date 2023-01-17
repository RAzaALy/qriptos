import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import { Formik } from "formik";
import * as Yup from "yup";
import Container from "@material-ui/core/Container";
import { Link as RouterLink } from "react-router-dom";
import history from "../Utilities/history";
import { useLogin } from "../Services/authenticationService";
import DialogBox from "../components/DialogBox";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { authenticationService } from "../Services/authenticationService";
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
}));

const Login = () => {
  const login = useLogin();
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [data, setData] = useState({ name: "", address: "" });
  const [infoModal, setInfoModal] = useState(false);
  const classes = useStyles();
  const handleChange = (event) => {
    setName(event.target.value);
  };

  useEffect(() => {
    setAddress(authenticationService.currentUserValue.address);
    setData({
      name: authenticationService.currentUserValue.userName,
      address: authenticationService.currentUserValue.address,
    });
  }, []);
  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5" align="center">
        Login
      </Typography>
      <div className={classes.paper}>
        <DialogBox
          modalOpen={infoModal}
          setModalOpen={setInfoModal}
          title="Your Keys"
        >
          <div className={classes.root}>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="chat"
                name="chat"
                value={name}
                onChange={handleChange}
              >
                <FormControlLabel
                  key={data.address}
                  value={data.name}
                  control={<Radio />}
                  label={data.name}
                />
              </RadioGroup>
            </FormControl>
          </div>

          <Button
            color="primary"
            variant="contained"
            size="small"
            type="button"
            component={RouterLink}
            to="/generateKey"
            className={classes.submitButton}
          >
            Adanother Existing Key
          </Button>
        </DialogBox>
        <Grid container>
          <Grid item>
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              variant="contained"
              color="primary"
              onClick={() => setInfoModal(true)}
              fullWidth={true}
            >
              Select Chat Account
            </Button>
          </Grid>
          <Grid item>
            <Formik
              initialValues={{
                password: "",
              }}
              validationSchema={Yup.object().shape({
                password: Yup.string()
                  .required("Password is Required")
                  .max(100, "Password too long")
                  .min(6, "Password should be at least 6 characters long"),
              })}
              onSubmit={({ password }, { setStatus, setSubmitting }) => {
                setStatus();
                login(address, password).then(
                  (user) => {
                    const { from } = history.location.state || {
                      from: { pathname: "/chat" },
                    };
                    history.push(from);
                  },
                  (error) => {
                    setSubmitting(false);
                    setStatus(error);
                  }
                );
              }}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({
                handleSubmit,
                handleChange,
                values,
                touched,
                isValid,
                errors,
              }) => (
                <form onSubmit={handleSubmit} className={classes.form}>
                  <TextField
                    id="password"
                    className={classes.textField}
                    name="password"
                    label="Password"
                    fullWidth={true}
                    variant="outlined"
                    margin="normal"
                    required={true}
                    helperText={touched.password ? errors.password : ""}
                    error={touched.password && Boolean(errors.password)}
                    value={values.password}
                    onChange={handleChange}
                    type="password"
                  />

                  <Button
                    type="submit"
                    fullWidth={true}
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Login
                  </Button>
                </form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </div>
      <Typography style={{ cursor: "pointer", marginTop: "20px" }}>
        <Link component={RouterLink} to="/generateKey">
          Generate New Key
        </Link>
      </Typography>
    </Container>
  );
};

export default Login;
