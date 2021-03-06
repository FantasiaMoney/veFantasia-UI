import { makeStyles } from '@material-ui/core/styles'

const AboutPageCSS = makeStyles(theme => ({
  card: {
    minWidth: 275,
    margin: theme.spacing(2, 0),
    backgroundColor:'rgba(255,255,255,0.05)',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 22,
  },
  pos: {
    marginBottom: 12,
  },
  icon: {
    margin: theme.spacing(0),
    fontSize: 25,
    marginBottom: '-6px',
  },
  footer:{
    borderTop: '1px solid #eee',
  },
  modal:{
    margin: theme.spacing(0, 0, 2, 0),
  },
  button:{
    margin: theme.spacing(1),
  },
  footertext:{
    textAlign:'center',
    fontSize:14
  },
  readmore:{
    display:'inline-block!important',
    boxShadow:'none',
    backgroundColor: 'transparent',
    '&::before':{
      backgroundColor:'transparent!important'
    },
  },
  readmorebtn:{
    display:'inline-block!important',
    boxShadow:'none',
    backgroundColor: 'transparent',
    border:'1px solid #bbb',
    borderRadius:'4px',
  },
  readmorecontent:{
    display:'block!important',
  }
}))

export default AboutPageCSS
