import { FC } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router } from 'react-router-dom';

import { UIProvider } from 'contexts/ui';
import { CollectionsProvider } from 'contexts/collections';

import Layout from 'components/global/Layout';

import theme from 'utils/theme';

const App: FC = () => {
  return (
    <ThemeProvider {...{ theme }}>
      <CssBaseline />
      <Router>
        <UIProvider>
          <CollectionsProvider>
            <Layout />
          </CollectionsProvider>
        </UIProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
