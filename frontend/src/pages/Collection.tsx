import { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

import CollectionsChangeInput from 'components/shared/CollectionsChangeInput';
// import CollectionSearchInput from 'components/shared/CollectionSearchInput';
import NFTs from 'components/shared/NFTs';
import { useCollections } from 'contexts/collections';
import clsx from 'clsx';
import { BORDER_RADIUS } from 'config';

const useStyles = makeStyles((theme) => {
  return {
    container: {
      display: 'flex',
    },
    sidebar: {
      marginTop: 32 + 14,
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
    trait: {
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    value: {
      borderRadius: BORDER_RADIUS,
      '&:hover': {
        background: 'rgb(50, 52, 58)',
      },
    },
  };
});

const WalletOverview: FC<{}> = () => {
  const classes = useStyles();
  const { activeCollection, addFilter } = useCollections();
  const [expandedTrait, setExpandedTrait] = useState<string | null>(null);

  const toggleExpandedTrait = (trait: string) => {
    setExpandedTrait((t) => (trait === t ? null : trait));
  };

  return (
    <Box className={classes.container}>
      <Paper className={classes.sidebar}>
        <Box mb={3}>
          <CollectionsChangeInput />
        </Box>
        {/* <Box mb={3}>
          <CollectionSearchInput />
        </Box> */}
        <Box>
          {!activeCollection ? null : (
            <Box className='flex flex-col'>
              {Object.entries(activeCollection.traits).map(
                ([trait, values]) => (
                  <Box key={trait} className={clsx('flex flex-col')}>
                    <Box
                      onClick={() => toggleExpandedTrait(trait)}
                      className={clsx('cursor-pointer', classes.trait)}
                    >
                      {trait}
                    </Box>
                    {expandedTrait !== trait
                      ? null
                      : Object.entries(values).map(([value, n]) =>
                          value === 'sum' ? null : (
                            <Box
                              key={value}
                              ml={2}
                              py={0.5}
                              px={1}
                              onClick={() => addFilter(trait, value)}
                              className={clsx(classes.value, 'cursor-pointer')}
                            >
                              {value} ({n})
                            </Box>
                          )
                        )}
                  </Box>
                )
              )}
            </Box>
          )}
        </Box>
      </Paper>

      <Box className={classes.nfts} ml={1}>
        <NFTs />
      </Box>
    </Box>
  );
};

export default WalletOverview;
