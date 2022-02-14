import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import {
  //BrowserView,
  //MobileView,
  //isBrowser,
  isMobile
} from "react-device-detect"

// icons
import AttachMoney from '@material-ui/icons/AttachMoney'
import Add from '@material-ui/icons/Add'
import ShowChart from '@material-ui/icons/ShowChart'
import MoneyOff from '@material-ui/icons/MoneyOff'

// components
import Stats from '../pages/Stats'
import Deposit from '../pages/Deposit'
import MyDeposits from '../pages/MyDeposits'
import Claim from '../pages/Claim'

import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function MainApp() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          variant= { isMobile ? "scrollable" : "standard" }
          scrollButtons="on"
          indicatorColor="primary"
          centered={ isMobile ? false : true }
        >
          <Tab label="Stats" icon={<ShowChart />} {...a11yProps(0)} />
          <Tab label="Deposit" icon={<Add/>} {...a11yProps(1)} />
          <Tab label="MyDeposits" icon={<AttachMoney/>} {...a11yProps(2)} />
          <Tab label="Claim" icon={<MoneyOff/>} {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Stats />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Deposit/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <MyDeposits/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Claim/>
      </TabPanel>
    </div>
  );
}
