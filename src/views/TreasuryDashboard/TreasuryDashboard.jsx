import { Paper, Typography, Box, Grid, Container, useMediaQuery } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useSelector } from "react-redux";
import { trim, formatCurrency } from "../../helpers";
<<<<<<< HEAD
import { useTheme } from "@material-ui/core/styles";
=======
>>>>>>> 03b8acf41f325c17421aacd6755508b0bcb04304
import "./treasury-dashboard.scss";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip.jsx";

function TreasuryDashboard() {
<<<<<<< HEAD
  const theme = useTheme();
=======
>>>>>>> 03b8acf41f325c17421aacd6755508b0bcb04304
  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");

  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });
  const circSupply = useSelector(state => {
    return state.app.circSupply;
  });
  const totalSupply = useSelector(state => {
    return state.app.totalSupply;
  });
  const marketCap = useSelector(state => {
    return state.app.marketCap;
  });

  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });

  const backingPerOhm = useSelector(state => {
    return state.app.treasuryMarketValue / state.app.circSupply;
  });

  const wsOhmPrice = useSelector(state => {
    return state.app.marketPrice * state.app.currentIndex;
  });
  return (
    <div id="treasury-dashboard-view" className={`${smallerScreen && "smaller"} ${verySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: smallerScreen || verySmallScreen ? "0" : "3.3rem",
          paddingRight: smallerScreen || verySmallScreen ? "0" : "3.3rem",
        }}
      >
        <Box className={`hero-metrics`}>
          <Paper className="ohm-card">
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
              <Box className="metric market">
                <Typography className="Typography-index" variant="h6" color="textSecondary">
                  Market Cap
                </Typography>
                <Typography variant="h5">
                  {marketCap && formatCurrency(marketCap, 0)}
                  {!marketCap && <Skeleton type="text" />}
                </Typography>
              </Box>

              <Box className="metric price">
                <Typography className="Typography-index" variant="h6" color="textSecondary">
                  MUMBAI Price
                </Typography>
                <Typography variant="h5">
                  {/* appleseed-fix */}
                  {marketPrice ? formatCurrency(marketPrice, 2) : <Skeleton type="text" />}
                </Typography>
              </Box>
              <Box className="metric wsoprice">
                <Typography className="Typography-index" variant="h6" color="textSecondary">
                  wsPIP Price
                  <InfoTooltip
                    message={
                      "wsPIP = sPIP * index\n\nThe price of wsPIP is equal to the price of OHM multiplied by the current index"
                    }
                  />
                </Typography>

                <Typography variant="h5">
                  {wsOhmPrice ? formatCurrency(wsOhmPrice, 2) : <Skeleton type="text" />}
                </Typography>
              </Box>

              <Box className="metric circ">
                <Typography className="Typography-index" variant="h6" color="textSecondary">
                  Circulating Supply (total)
                </Typography>
                <Typography variant="h5">
                  {circSupply && totalSupply ? (
                    parseInt(circSupply) + " / " + parseInt(totalSupply)
                  ) : (
                    <Skeleton type="text" />
                  )}
                </Typography>
              </Box>

              <Box className="metric bpo">
                <Typography className="Typography-index" variant="h6" color="textSecondary">
                  Backing per MUMBAI
                </Typography>
                <Typography variant="h5">
                  {backingPerOhm ? formatCurrency(backingPerOhm, 2) : <Skeleton type="text" />}
                </Typography>
              </Box>

              <Box className="metric index">
                <Typography className="Typography-index" variant="h6" color="textSecondary">
                  Average MUMBAI HOLDING
                  <InfoTooltip
                    message={
                      "The current index tracks the amount of sPIP accumulated since the beginning of staking. Basically, how much sPIP one would have if they staked and held a single OHM from day 1."
                    }
                  />
                </Typography>
                <Typography variant="h5">
                  {currentIndex ? trim(currentIndex, 2) + " sPIP" : <Skeleton type="text" />}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box className={`hero-metrics`}>
              <Paper className="ohm-card">
                <Box className="dashboard-info">
                  <Typography className="Typography-index price-percentage" variant="h6" color="textSecondary">
                    +17.18%
                  </Typography>
                  <Typography className="Typography-index price-caption" variant="h6" color="textSecondary">
                    MUMBAI Price
                  </Typography>
                  <Typography variant="h3" color="textSecondary">
                    $0.0698
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box className={`hero-metrics`}>
              <Paper className="ohm-card">
                <Box className="dashboard-info">
                  <Typography className="Typography-index price-percentage" variant="h6" color="textSecondary">
                    +27.18%
                  </Typography>
                  <Typography className="Typography-index price-caption" variant="h6" color="textSecondary">
                    Market Value Of Treasury Assets
                  </Typography>
                  <Typography variant="h3" color="textSecondary">
                    $21,033,460.25
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box className={`hero-metrics`}>
              <Paper className="ohm-card">
                <Box className="dashboard-info">
                  <Typography className="Typography-index price-percentage" variant="h6" color="textSecondary">
                    +2.45%
                  </Typography>
                  <Typography className="Typography-index price-caption" variant="h6" color="textSecondary">
                    BNB Liquidity Value
                  </Typography>
                  <Typography variant="h3" color="textSecondary">
                    $8,281,063.32
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box className={`hero-metrics`}>
              <Paper className="ohm-card">
                <Box className="dashboard-info">
                  <Typography className="Typography-index price-percentage" variant="h6" color="textSecondary">
                    +24.50%
                  </Typography>
                  <Typography className="Typography-index price-caption" variant="h6" color="textSecondary">
                    Risk Free Value Market Value
                  </Typography>
                  <Typography variant="h3" color="textSecondary">
                    $12,730,269.45
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default TreasuryDashboard;
