import { FC } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

import { UIProvider } from 'contexts/ui';
import { CollectionsProvider } from 'contexts/collections';

import Layout from 'components/global/Layout';

import theme from 'utils/theme';

const App: FC = () => {
  return (
    <ThemeProvider {...{ theme }}>
      <CssBaseline />
      <UIProvider>
        <CollectionsProvider>
          <Layout />
        </CollectionsProvider>
      </UIProvider>
    </ThemeProvider>
  );
};

export default App;
