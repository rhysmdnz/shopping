import React from 'react';
import ButtonAppBarContainer from '../containers/ButtonAppBar'
import ShoppingListContainer from '../containers/ShoppingListContainer'
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import Notifier from '../features/notifications/Notifier'
import { SnackbarProvider } from 'notistack';


const useStyles = makeStyles((theme) => ({
  content: {
    marginTop: 50
  },
}));

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  },
});

function App() {
  const classes = useStyles()
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={1} hideIconVariant>
        <CssBaseline />
        <Notifier />
        <ButtonAppBarContainer />
        <Container maxWidth="sm">
          <Paper className={classes.content} elevation={1}>
            <ShoppingListContainer />
          </Paper>
        </Container>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
