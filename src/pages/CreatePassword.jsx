import React, {useState, useEffect} from "react";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import { Formik } from "formik";
import * as Yup from "yup";
import Container from "@material-ui/core/Container";
import history from "../Utilities/history";
import { useSavePassword } from "../Services/authenticationService";
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

const CreatePassword = (props) => {
  const savePassword = useSavePassword();
  const [address, setAddress] = useState("");
  const classes = useStyles();

  useEffect(() => {
    setAddress(authenticationService.currentUserValue.data.address);
  }, []);


  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Grid container>
          <Grid item>
            <Typography component="h1" variant="h5" align="center">
            Create a Password 
            </Typography>
            <Formik
              initialValues={{
                password: "",
                password2: "",
              }}
              validationSchema={Yup.object().shape({
                password: Yup.string()
                  .required("Password is Required")
                  .max(100, "Password too long")
                  .min(6, "Password should be at least 6 characters long"),
                password2: Yup.string().oneOf(
                  [Yup.ref("password"), null],
                  "Passwords do not match"
                ),
              })}
              onSubmit={(
                { password, password2 },
                { setStatus, setSubmitting }
              ) => {
                setStatus();
                savePassword(address, password).then(
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

                  <TextField
                    id="password2"
                    className={classes.textField}
                    name="password2"
                    label="Confirm Password"
                    fullWidth={true}
                    variant="outlined"
                    margin="normal"
                    required={true}
                    helperText={touched.password2 ? errors.password2 : ""}
                    error={touched.password2 && Boolean(errors.password2)}
                    value={values.password2}
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
                    Save Password
                  </Button>
                </form>
              )}
            </Formik>
          </Grid>
          
        </Grid>
      </div>
    </Container>
  );
};

export default CreatePassword;
