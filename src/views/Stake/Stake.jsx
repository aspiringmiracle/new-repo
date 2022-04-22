import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  Typography,
  Zoom,
} from "@material-ui/core";
import NewReleases from "@material-ui/icons/NewReleases";
import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import TabPanel from "../../components/TabPanel";
import { getOhmTokenImage, getTokenImage, trim } from "../../helpers";
import { changeApproval, changeStake } from "../../slices/StakeThunk";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./stake.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import ExternalStakePool from "./ExternalStakePool";
import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const sOhmImg = getTokenImage("sohm");
const ohmImg = getOhmTokenImage(16, 16);

function Stake() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("");

  const isAppLoading = useSelector(state => state.app.loading);
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });
  const fiveDayRate = 1; /* useSelector(state => {
    return state.app.fiveDayRate;
  });*/
  const pipBalance = useSelector(state => {
    return state.account.balances && state.account.balances.ohm;
  });
  const oldSohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.oldsohm;
  });
  const sPIPBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });
  const fsohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.fsohm;
  });
  const wsohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.wsohm;
  });
  const stakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.ohmStake;
  });
  const unstakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.ohmUnstake;
  });
  const stakingRebase = useSelector(state => {
    return state.app.stakingRebase;
  });
  const stakingAPY = useSelector(state => {
    return state.app.stakingAPY;
  });
  const stakingTVL = useSelector(state => {
    return state.app.stakingTVL;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    if (view === 0) {
      setQuantity(pipBalance);
    } else {
      setQuantity(sPIPBalance);
    }
  };

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const onChangeStake = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a value!"));
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity, "gwei");
    if (action === "stake" && gweiValue.gt(ethers.utils.parseUnits(pipBalance, "gwei"))) {
      return dispatch(error("You cannot stake more than your OHM balance."));
    }

    if (action === "unstake" && gweiValue.gt(ethers.utils.parseUnits(sPIPBalance, "gwei"))) {
      return dispatch(error("You cannot unstake more than your sPIP balance."));
    }

    await dispatch(changeStake({ address, action, value: quantity.toString(), provider, networkID: chainID }));
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "ohm") return stakeAllowance > 0;
      if (token === "sPIP") return unstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance, unstakeAllowance],
  );

  const isAllowanceDataLoading = (stakeAllowance == null && view === 0) || (unstakeAllowance == null && view === 1);

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const changeView = (event, newView) => {
    setView(newView);
  };

  const trimmedBalance = Number(
    [sPIPBalance, fsohmBalance, wsohmBalance]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );
  const trimmedStakingAPY = trim(stakingAPY * 100, 1);
  const stakingRebasePercentage = 1; //trim(stakingRebase * 100, 4);
  const nextRewardValue = trim((stakingRebasePercentage / 100) * trimmedBalance, 4);

  return (
    <div id="stake-view">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper className={`ohm-card`}>
          <Grid container direction="column">
            <Grid item>
              <Box className="dashboard-info">
                <Typography className="Typography-index" variant="h6" color="textSecondary">
                  Total earned
                </Typography>
                <Typography className="green-font" variant="h1" color="textSecondary">
                  $0.00
                </Typography>
                <Typography className="Typography-index" variant="h6" color="textSecondary">
                  0.00 MUMBAI (0.00% increase)
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Zoom>
      <Paper className="ohm-card price-card">
        <Grid container>
          <Grid xs={6}>
            <Box className="dashboard-info price-sub-card">
              <Typography className="Typography-index" variant="h6" color="textSecondary">
                APY
              </Typography>
              <Typography className="bold" variant="h3" color="textSecondary">
                102,483.58%
              </Typography>
              <Typography className="Typography-index" variant="h6" color="textSecondary">
                Daily ROI 1.9176%
              </Typography>
            </Box>
          </Grid>
          <Grid xs={6}>
            <Paper className="ohm-card child-card">
              <Box className="dashboard-info">
                <Typography className="Typography-index" variant="h6" color="textSecondary">
                  Risk Free Value Market Value
                </Typography>
                <Typography variant="h3">
                  <Skeleton width="100%" className="MuiSkeleton-text" variant="pulse root"></Skeleton>
                </Typography>
                <Typography className="Typography-index price-caption" variant="h6" color="textSecondary">
                  0.00 MUMBAI
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      <Paper className="ohm-card price-card">
        <Grid container>
          <Grid xs={6}>
            <Box className="dashboard-info price-sub-card">
              <Typography className="Typography-index" variant="h6" color="textSecondary">
                Next Rebase
              </Typography>
              <Typography className="bold" variant="h3" color="textSecondary">
                00:03:29
              </Typography>
              <Typography className="Typography-index" variant="h6" color="textSecondary">
                Interest Coming In Your Wallet
              </Typography>
            </Box>
          </Grid>
          <Grid xs={6}>
            <Paper className="ohm-card child-card">
              <Box className="dashboard-info">
                <Typography className="Typography-index" variant="h6" color="textSecondary">
                  Your Earnings/Daily
                </Typography>
                <Typography variant="h3">
                  <Skeleton width="100%" className="MuiSkeleton-text" variant="pulse root"></Skeleton>
                </Typography>
                <Typography className="Typography-index price-caption" variant="h6" color="textSecondary">
                  0.00 MUMBAI
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      <Paper className={`ohm-card`}>
        <Grid container direction="column">
          <Grid item>
            <Box className="dashboard-info flex-grow" my={3}>
              <Typography className="Typography-index" variant="h6" color="textSecondary">
                Current MUMBAI Price
              </Typography>
              <Typography className="green-font" variant="h6" color="textSecondary">
                $0.0729 USD
              </Typography>
            </Box>
            <Box className="dashboard-info flex-grow" my={3}>
              <Typography className="Typography-index" variant="h6" color="textSecondary">
                Next Reward Amount
              </Typography>
              <Typography variant="h6" color="textSecondary">
                MUMBAI
              </Typography>
            </Box>
            <Box className="dashboard-info flex-grow" my={3}>
              <Typography className="Typography-index" variant="h6" color="textSecondary">
                Next Reward Amount USD
              </Typography>
              <Typography className="green-font" variant="h6" color="textSecondary">
                USD
              </Typography>
            </Box>
            <Box className="dashboard-info flex-grow" my={3}>
              <Typography className="Typography-index" variant="h6" color="textSecondary">
                Next Reward Yield
              </Typography>
              <Typography variant="h6" color="textSecondary">
                0.03958%
              </Typography>
            </Box>
            <Box className="dashboard-info flex-grow" my={3}>
              <Typography className="Typography-index" variant="h6" color="textSecondary">
                ROI (30-Day Rate)
              </Typography>
              <Typography className="green-font" variant="h6" color="textSecondary">
                76.80%
              </Typography>
            </Box>
            <Box className="dashboard-info flex-grow" my={3}>
              <Typography className="Typography-index" variant="h6" color="textSecondary">
                ROI (30-Day Rate) USD
              </Typography>
              <Typography className="green-font" variant="h6" color="textSecondary">
                USD
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default Stake;
