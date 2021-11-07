import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  container: {
    boxShadow: 'none',
    background: 'rgb(30, 32, 38)',

    '& a': {
      textTransform: 'uppercase',
      marginLeft: 54,
      color: 'rgba(0, 0, 0, 0.5)',
    },
  },
  title: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
  network: {
    background: '#C4C4C4',
    '&, &:hover': {
      boxShadow: 'none',
    },
  },
  activeLink: {
    color: 'black !important',
  },
}));

const Header: FC = () => {
  const classes = useStyles();

  return (
    <AppBar position='fixed' color='inherit' className={classes.container}>
      <Toolbar color='inherit'>
        <Typography variant='h6' className={'flex flex-grow'}>
          <div className={'flex items-center'}>BSC NFTs Rarity</div>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(Header);
