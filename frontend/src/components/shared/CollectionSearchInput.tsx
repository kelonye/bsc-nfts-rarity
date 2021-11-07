import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import { useCollections } from 'contexts/collections';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    // boxShadow: 'none',
    // border: '1px solid rgba(0, 0, 0, 0.25)',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
}));

const CollectionSearchInput: FC<{}> = () => {
  const classes = useStyles();
  const { setSearchTerm, searchTerm } = useCollections();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as any;
        const localSearchTerm = form.input.value as string;
        if (localSearchTerm) {
          setSearchTerm(localSearchTerm);
        }
      }}
    >
      <InputBase
        name='input'
        className={classes.input}
        placeholder='Search e.g. token id...'
        inputProps={{ 'aria-label': 'search' }}
        defaultValue={searchTerm}
      />
      <IconButton
        type='submit'
        className={classes.iconButton}
        aria-label='search'
      >
        <SearchIcon />
      </IconButton>
    </form>
  );
};

export default CollectionSearchInput;
