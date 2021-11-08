import { FC, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import Close from '@material-ui/icons/Close';
import clsx from 'clsx';

import { NFT } from 'contexts/collections';
import { BORDER_RADIUS } from 'config';

export const useStyles = makeStyles((theme) => ({
  container: {
    width: 600,
    minHeight: 400,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
  img: {
    borderRadius: BORDER_RADIUS,
  },
  x: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  attributes: {
    display: 'grid',
    gridTemplateColumns: '1fr 3fr',
  },
}));

const NFTModal: FC<{ nft: NFT; onClose: () => void }> = ({ nft, onClose }) => {
  const classes = useStyles();

  // const close = () => history.back();

  const attributes = useMemo(
    () =>
      nft.attributes.reduce((r, a) => {
        r.push(`${a.traitType}:`);
        r.push(a.value);
        return r;
      }, [] as string[]),
    [nft.attributes]
  );

  return (
    <Dialog open={true} onClose={() => {}}>
      <Close className={clsx(classes.x, 'cursor-pointer')} onClick={onClose} />

      <Box className={classes.container} p={5}>
        <Box>
          <h4>#{nft.index}</h4>
          <img
            src={nft.image}
            alt={nft.index.toString()}
            width={250}
            className={classes.img}
          />
        </Box>

        <Box pl={1} pt={4}>
          <h5>Traits</h5>
          <Box className={classes.attributes} mb={3}>
            {attributes.map((attribute) => (
              <Box key={attribute} ml={2} py={0.5} px={1}>
                {attribute}
              </Box>
            ))}
          </Box>

          <h5>Missing Traits</h5>
          <Box className='flex flex-col'>
            {nft.missingTraits.map((attribute) => (
              <Box key={attribute.traitType} ml={2} py={0.5} px={1}>
                {attribute.traitType}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default NFTModal;
