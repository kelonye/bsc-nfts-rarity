import { FC, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Pagination from '@material-ui/lab/Pagination';
import Chip from '@material-ui/core/Chip';
import flatten from 'lodash/flatten';

import { NFT, useCollections } from 'contexts/collections';
import { BORDER_RADIUS } from 'config';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  filters: {
    minHeight: 32,
  },
  nfts: {
    display: 'grid',
    gridTemplateColumns: 'repeat(9, 1fr)',
    // maxHeight: 800,
    // overflowY: 'auto',
  },
  img: {
    borderRadius: BORDER_RADIUS,
  },
}));

const NFTsView: FC<{}> = () => {
  const classes = useStyles();
  const { nfts, setPage, pages, page, filters, removeFilter } =
    useCollections();

  const values = useMemo(() => {
    return flatten(
      Object.entries(filters).map(([filter, values]) =>
        values.map((value) => ({ value, filter }))
      )
    );
  }, [filters]);

  return (
    <Box className='flex flex-col flex-grow'>
      <Box className={clsx(classes.filters, 'flex')} mb={2}>
        {values.map(({ filter, value }) => (
          <Box mr={0.5} key={value}>
            <Chip label={value} onDelete={() => removeFilter(filter, value)} />
          </Box>
        ))}
      </Box>

      <Box className={classes.nfts}>
        {nfts.map((nft) => (
          <NFTView key={nft.index} {...{ nft }} />
        ))}
      </Box>

      <Box mt={3} className={clsx('flex justify-center')}>
        {!pages ? null : (
          <Pagination
            count={pages}
            page={page}
            onChange={(event, value) => {
              setPage(value);
            }}
          />
        )}
      </Box>
    </Box>
  );
};

const NFTView: FC<{ nft: NFT }> = ({ nft }) => {
  const classes = useStyles();
  return (
    <Box className='flex flex-col flex-grow items-center'>
      <img
        src={nft.image}
        alt={nft.index.toString()}
        width={96}
        className={classes.img}
      />
      <Box>#{nft.index}</Box>
    </Box>
  );
};

export default NFTsView;
