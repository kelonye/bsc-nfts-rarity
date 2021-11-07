import { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import CopyIcon from '@material-ui/icons/FileCopy';
import CopiedIcon from '@material-ui/icons/Check';
import clsx from 'clsx';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const useStyles = makeStyles((theme) => {
  return {
    container: {
      '& span': {
        opacity: '0',
      },
      '&:hover span': {
        opacity: '1',
      },
    },
  };
});

const CopyToClipboardContainer: FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  const classes = useStyles();
  const [copied, setCopied] = useState<boolean>(false);

  const onCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <CopyToClipboard text={value} {...{ onCopy }}>
      <Box
        className={clsx(classes.container, 'flex items-center cursor-pointer')}
      >
        <Box mr={1}>{label}</Box>
        <Box component='span' className='flex items-center'>
          {copied === true ? (
            <CopiedIcon fontSize={'small'} />
          ) : (
            <CopyIcon fontSize={'small'} />
          )}
        </Box>
      </Box>
    </CopyToClipboard>
  );
};

export default CopyToClipboardContainer;
