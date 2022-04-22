var React = require("react");
import { useSelector } from "react-redux";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Zoom,
  InputLabel,
  InputAdornment,
  Slider,
  OutlinedInput,
  styled,
} from "@material-ui/core";
import { BondDataCard, BondTableData } from "./BondRow";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { formatCurrency } from "../../helpers";
import useBonds from "../../hooks/Bonds";

import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import ClaimBonds from "./ClaimBonds";
import _ from "lodash";
import { allBondsMap } from "src/helpers/AllBonds";

function ChooseBond() {
  const [dateValue, setDateValue] = React.useState(1);
  const { bonds } = useBonds();
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query
  const isVerySmallScreen = useMediaQuery("(max-width: 420px)");

  const isAppLoading = useSelector(state => state.app.loading);
  const isAccountLoading = useSelector(state => state.account.loading);

  const accountBonds = useSelector(state => {
    const withInterestDue = [];
    for (const bond in state.account.bonds) {
      if (state.account.bonds[bond].interestDue > 0) {
        withInterestDue.push(state.account.bonds[bond]);
      }
    }
    return withInterestDue;
  });

  const marketPrice = useSelector(state => {
    return 1; //state.app.marketPrice;
  });

  const treasuryBalance = useSelector(state => {
    if (state.bonding.loading == false) {
      let tokenBalances = 0;
      for (const bond in allBondsMap) {
        if (state.bonding[bond]) {
          tokenBalances += state.bonding[bond].purchased;
        }
      }
      return tokenBalances;
    }
  });

  const DateSlider = styled(Slider)({
    color: "#52af77",
    height: 8,
    "& .MuiSlider-rail": {
      height: 10,
      borderRadius: 7,
      background: "#232323",
      border: "1px solid #64c9fc",
    },
    "& .MuiSlider-track": {
      border: "none",
      borderRadius: 7,
      height: 10,
      background: "linear-gradient(90deg,#64c9fc,#446cf6 90%)",
    },
    "& .MuiSlider-thumb": {
      height: 20,
      width: 20,
      backgroundColor: "#232323",
      border: "2px solid #446cf6",
      "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
        boxShadow: "inherit",
      },
      "&:before": {
        display: "none",
      },
    },
  });

  const handleSliderChange = (e, val) => {
    console.log("value", val);
    setDateValue(val);
  };
  console.log("second value", dateValue);
  return (
    <div id="choose-bond-view">
      {!isAccountLoading && !_.isEmpty(accountBonds) && <ClaimBonds activeBonds={accountBonds} />}

      <Zoom in={true}>
        <Paper className="ohm-card">
          <Box className="card-header">
            <Typography variant="h5">Calculator</Typography>
            <Typography variant="h6">Estimate your returns</Typography>
          </Box>

          <Grid container item xs={12} style={{ margin: "10px 0px 20px", marginTop: 40 }} className="bond-hero">
            <Grid item xs={4}>
              <Box textAlign={`${isVerySmallScreen ? "left" : "center"}`}>
                <Typography variant="h5" color="textSecondary">
                  MUMBAI Price
                </Typography>
                <Typography variant="h4">
                  {isAppLoading ? (
                    <Skeleton width="180px" />
                  ) : (
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(treasuryBalance)
                  )}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={4} className={`ohm-price`}>
              <Box textAlign={`${isVerySmallScreen ? "right" : "center"}`}>
                <Typography variant="h5" color="textSecondary">
                  APY:
                </Typography>
                <Typography variant="h4">
                  {isAppLoading ? <Skeleton width="100px" /> : formatCurrency(marketPrice, 2)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={4} className={`ohm-price`}>
              <Box textAlign={`${isVerySmallScreen ? "right" : "center"}`}>
                <Typography variant="h5" color="textSecondary">
                  Your MUMBAI Balance
                </Typography>
                <Typography variant="h4">
                  {isAppLoading ? <Skeleton width="100px" /> : formatCurrency(marketPrice, 2)}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Grid container item xs={12} style={{ marginTop: 50 }}>
            <Grid item xs={6}>
              <InputLabel htmlFor="input-with-icon-adornment">
                <Typography variant="h6">MUMBAI Amount</Typography>
              </InputLabel>
              <Box sx={{ marginRight: 15 }}>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  endAdornment={
                    <InputAdornment position="end">
                      <Typography variant="h6">Max</Typography>
                    </InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                  fullWidth
                  style={{ borderRadius: 12 }}
                  inputProps={{
                    name: "mb_amount",
                    type: "number",
                    placeholder: "placeholder",
                  }}
                  helperText="Incorrect entry"
                  defaultValue={0}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <InputLabel htmlFor="input-with-icon-adornment">
                <Typography variant="h6">APY(%)</Typography>
              </InputLabel>
              <Box sx={{ marginLeft: 15 }}>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  endAdornment={
                    <InputAdornment position="end">
                      <Typography variant="h6">Current</Typography>
                    </InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{
                    name: "mb_apy",
                    type: "number",
                  }}
                  fullWidth
                  style={{ borderRadius: 12 }}
                />
              </Box>
            </Grid>
          </Grid>

          <Grid container item xs={12} style={{ marginTop: 50 }}>
            <Grid item xs={6}>
              <InputLabel htmlFor="input-with-icon-adornment">
                <Typography variant="h6">MUMBAI price at purchase ($)</Typography>
              </InputLabel>
              <Box sx={{ marginRight: 15 }}>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  endAdornment={
                    <InputAdornment position="end">
                      <Typography variant="h6">Current</Typography>
                    </InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{
                    name: "mb_price",
                    type: "number",
                  }}
                  fullWidth
                  style={{ borderRadius: 12 }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <InputLabel htmlFor="input-with-icon-adornment">
                <Typography variant="h6">Future MUMBAI price ($)</Typography>
              </InputLabel>
              <Box sx={{ marginLeft: 15 }}>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  endAdornment={
                    <InputAdornment position="end">
                      <Typography variant="h6">Current</Typography>
                    </InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{
                    name: "mb_future_price",
                    type: "number",
                  }}
                  fullWidth
                  style={{ borderRadius: 12 }}
                />
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ width: 250, marginTop: 50, width: "100%" }}>
            <Typography id="non-linear-slider" gutterBottom>
              {dateValue} Day
            </Typography>
            <DateSlider
              min={1}
              max={365}
              onChange={(e, value) => handleSliderChange(e, value)}
              value={typeof dateValue === "number" ? dateValue : 1}
              valueLabelDisplay="off"
              aria-labelledby="non-linear-slider"
            />
          </Box>

          <Box sx={{ width: 250, marginTop: 50, width: "100%", clear: "both", content: "", display: "table" }}>
            <Typography gutterBottom style={{ float: "left", color: "#D0DCE8" }} variant="h6">
              Your initial investment
            </Typography>
            <Typography id="non-linear-slider" gutterBottom style={{ float: "right", color: "#D0DCE8" }} variant="h6">
              $0.00
            </Typography>
          </Box>
          <Box sx={{ width: 250, marginTop: 20, width: "100%", clear: "both", content: "", display: "table" }}>
            <Typography gutterBottom style={{ float: "left", color: "#D0DCE8" }} variant="h6">
              Current wealth
            </Typography>
            <Typography id="non-linear-slider" gutterBottom style={{ float: "right", color: "#D0DCE8" }} variant="h6">
              $0.00
            </Typography>
          </Box>
          <Box sx={{ width: 250, marginTop: 20, width: "100%", clear: "both", content: "", display: "table" }}>
            <Typography gutterBottom style={{ float: "left", color: "#D0DCE8" }} variant="h6">
              MUMBAI rewards estimation
            </Typography>
            <Typography id="non-linear-slider" gutterBottom style={{ float: "right", color: "#D0DCE8" }} variant="h6">
              0.00 MUMBAI
            </Typography>
          </Box>
          <Box sx={{ width: 250, marginTop: 20, width: "100%", clear: "both", content: "", display: "table" }}>
            <Typography gutterBottom style={{ float: "left", color: "#D0DCE8" }} variant="h6">
              Potential return
            </Typography>
            <Typography id="non-linear-slider" gutterBottom style={{ float: "right", color: "#D0DCE8" }} variant="h6">
              $0.00
            </Typography>
          </Box>
          <Box sx={{ width: 250, marginTop: 20, width: "100%", clear: "both", content: "", display: "table" }}>
            <Typography gutterBottom style={{ float: "left", color: "#D0DCE8" }} variant="h6">
              Potential number of Space Travels
            </Typography>
            <Typography id="non-linear-slider" gutterBottom style={{ float: "right", color: "#D0DCE8" }} variant="h6">
              0
            </Typography>
          </Box>
        </Paper>
      </Zoom>

      {isSmallScreen && (
        <Box className="ohm-card-container">
          <Grid container item spacing={2}>
            {bonds.map(bond => (
              <Grid item xs={12} key={bond.name}>
                <BondDataCard key={bond.name} bond={bond} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </div>
  );
}

export default ChooseBond;
