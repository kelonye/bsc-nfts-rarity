import { FC, useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Pagination from '@material-ui/lab/Pagination';
import Chip from '@material-ui/core/Chip';
import flatten from 'lodash/flatten';

import { NFT, useCollections } from 'contexts/collections';
import NFTModal from 'components/shared/NFT';
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
  const [nftBeingViewed, setNFTBeingViewed] = useState<NFT | null>(null);

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
          <NFTView
            key={nft.index}
            {...{ nft }}
            onClick={() => setNFTBeingViewed(nft)}
          />
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

      {!nftBeingViewed ? null : (
        <NFTModal
          nft={nftBeingViewed}
          onClose={() => setNFTBeingViewed(null)}
        />
      )}
    </Box>
  );
};

const NFTView: FC<{ nft: NFT; onClick: () => void }> = ({ nft, onClick }) => {
  const classes = useStyles();
  return (
    <Box
      className='flex flex-col flex-grow items-center cursor-pointer'
      {...{ onClick }}
    >
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
