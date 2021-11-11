import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Switch, Route } from 'react-router-dom';

import Header from './Header';

import Collection from 'pages/Collection';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '1200px',
    margin: '0 auto',
    padding: '20px 0 30px',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      padding: '20px 0 10px',
      width: 'auto',
    },
    '& a': {
      textDecoration: 'none',
    },
    '& a, a:visited': {
      color: theme.palette.secondary.main,
    },
    '& .MuiInputLabel-shrink': {
      right: 0,
      transform: 'translate(0, 1.5px) scale(1)',
      transformOrigin: 'top left',
      fontSize: 12,
    },
    '& td, th': {
      borderColor: 'transparent',
    },
  },
}));

const Layout: FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Header />

      <Switch>
        <Route path={'/:collectionSlug'} component={Collection} />
      </Switch>
    </Box>
  );
};

export default Layout;
