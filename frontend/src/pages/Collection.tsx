import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

import CollectionsChangeInput from 'components/shared/CollectionsChangeInput';
import CollectionSearchInput from 'components/shared/CollectionSearchInput';
import NFTs from 'components/shared/NFTs';

const useStyles = makeStyles((theme) => {
  return {
    container: {
      display: 'flex',
    },
    sidebar: {
      width: 400,
      padding: '10px 15px',
      display: 'flex',
      flexDirection: 'column',
      // boxShadow: 'none',
      // border: '1px solid rgba(0, 0, 0, 0.25)',
    },
    nfts: {
      width: '100%',
    },
  };
});

const WalletOverview: FC<{}> = () => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Paper className={classes.sidebar}>
        <Box mb={3}>
          <CollectionsChangeInput />
        </Box>
        <CollectionSearchInput />
      </Paper>

      <Box className={classes.nfts} ml={1}>
        <NFTs />
      </Box>
    </Box>
  );
};

export default WalletOverview;
