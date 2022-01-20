import React from 'react'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
  footer:{
    margin:'40px 0 0',
  },
  footertext:{
    textAlign:'center',
    fontSize:14,
  },
}))

function Footer() {
  const classes = useStyles();
  return (
    <div className={classes.footer}>
    <Typography className={classes.footertext} color="textSecondary">
      2022
    </Typography>
    </div>
  )
}

export default Footer
