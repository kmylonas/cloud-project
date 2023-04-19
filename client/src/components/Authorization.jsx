import React from "react";
import { Container, Typography, Grid } from "@mui/material";
import BackgroundWave from "../common/BackgroundWave";
import Form from "./Form";
import { styled } from "@mui/material/styles";
import { ReactComponent as IconShopping } from "../images/shopping.svg";

const StyledContainer = styled(Container)({
  height: "100vh",
});

function Authorization(props) {
  const { user } = props;
  if (user) {
    return (window.location = "/welcome");
  }
  return (
    <React.Fragment>
      <BackgroundWave />

      <StyledContainer>
        <Grid container direction="row" height="100%">
          <Grid
            container
            item
            xs
            direction="column"
            alignItems="center"
            justifyContent="space-evenly"
          >
            <Grid container item direction="column" alignItems="center">
              <Typography variant="h4" gutterBottom={true} color="primary.dark">
                Welcome
              </Typography>
              <Typography variant="body1" paragraph={true} width="75%">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro
                magni dolore pariatur nam velit cumque perferendis aspernatur ex
                beatae architecto.
              </Typography>
            </Grid>
            <Grid item>
              <IconShopping width={400} height={400} />
            </Grid>
          </Grid>
          <Grid container item xs alignItems="center" justifyContent="center">
            <Grid item xs={9}>
              <Form></Form>
            </Grid>
          </Grid>
        </Grid>
      </StyledContainer>
    </React.Fragment>
  );
}

export default Authorization;
