import React, { useState, useEffect } from 'react'
// import CircularProgress from '@material-ui/core/CircularProgress'
import { inject, observer } from 'mobx-react'
import { Card, Badge, Form, Button, ButtonGroup } from 'react-bootstrap'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
// import Manage from '../modals/Manage'
// import { ApiEndpoint } from '../../config'
// import axios from 'axios'


// async function getAllFunds(){
//
// }

const useStyles = makeStyles(theme => ({
  footer:{
    margin:'40px 0 0',
  },
  footertext:{
    textAlign:'center',
    fontSize:14,
  },
}))

function Stats(props) {
  const classes = useStyles()
  const [funds, setFunds] = useState([]);

  // useEffect(() => {
  //   let isCancelled = false
  //    async function getFunds() {
  //        const funds = await getAllFunds()
  //        if(!isCancelled)
  //        setFunds(funds)
  //    }
  //    getFunds()
  //    return () => {
  //    isCancelled = true
  //  }
  // }, [])

  return (
    <div>
    <Typography className={classes.footertext} color="textSecondary">
    APY
    </Typography>

    <Typography className={classes.footertext} color="textSecondary">
    MC
    </Typography>

    <Typography className={classes.footertext} color="textSecondary">
    Price
    </Typography>

    <Typography className={classes.footertext} color="textSecondary">
    Supply
    </Typography>
    </div>
  );
}

export default inject('MobXStorage')(observer(Stats))
