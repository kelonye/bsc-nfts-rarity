import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Pagination from '@material-ui/lab/Pagination';

import { NFT, useCollections } from 'contexts/collections';
import { BORDER_RADIUS } from 'config';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  img: {
    borderRadius: BORDER_RADIUS,
  },
  nfts: {
    display: 'grid',
    gridTemplateColumns: 'repeat(9, 1fr)',
    maxHeight: 800,
    overflowY: 'auto',
  },
}));

const NFTsView: FC<{}> = () => {
  const classes = useStyles();
  const { nfts, setPage, pages, page } = useCollections();

  return (
    <Box className='flex flex-col flex-grow'>
      <Box className={classes.nfts}>
        {nfts.map((nft) => (
          <NFTView key={nft.id} {...{ nft }} />
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
        alt={nft.id.toString()}
        width={96}
        className={classes.img}
      />
      <Box>#{nft.id}</Box>
    </Box>
  );
};

export default NFTsView;
