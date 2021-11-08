import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { useCollections } from 'contexts/collections';

const useStyles = makeStyles((theme) => ({
  container: {},
}));

const CollectionsChangeInput: FC<{}> = () => {
  const classes = useStyles();
  const { setCollection, activeCollectionSlug, collections } = useCollections();

  return !activeCollectionSlug ? null : (
    <FormControl className={classes.container} fullWidth>
      <InputLabel id='collections-change-label' shrink>
        Collection
      </InputLabel>
      <Select
        labelId='collections-change-label'
        id='collections-change-select'
        value={activeCollectionSlug}
        fullWidth
        onChange={(event: any) => setCollection(event.target.value as string)}
      >
        {collections.map((collection) => (
          <MenuItem key={collection.slug} value={collection.slug}>
            {collection.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CollectionsChangeInput;
