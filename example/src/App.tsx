import React from 'react';
import { createMuiTheme, CssBaseline } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';

import Form from './Form';

const theme = createMuiTheme({
  palette: {
    primary: blueGrey,
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Form mobile="123456" />
    </ThemeProvider>
  );
};

export default App;
