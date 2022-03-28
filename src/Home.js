import React , { useEffect } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems, secondaryListItems } from './Components/listItems/listItems';
import Chart from './Components/Chart/Chart';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Route , Switch } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Users from '../src/Components/Users/Users';
import Importations from './Components/Importations/Importations';
import Exportation from './Components/Exportations/Exportations';
import Feedback from './Components/Feedback/Feedback';



const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
const notificationsList = ['mohamed addhamed have sent this notification', 'account that one sent from that one', 'hello body how are you ?', 'there is too many notifications'];

const drawerWidth = 240;

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */
  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();


export default function Home() {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [notifications, setNotifications] = React.useState(null);
  const auth = useSelector( state => state.auth.user );
  const history = useHistory();

  useEffect(() => {
    dispatch({ type : "checkLogin" , history : history , route : "/auth/"});
  },[]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (setting) => {
    if(setting === "Logout"){
      dispatch({ type : "logout" , history : history , route : "/auth/"});
    }
    setAnchorElUser(null);
  };
  
  const handleOpenNotification = (event) => {
    setNotifications(event.currentTarget);
  };

  const handleCloseNotification = () => {
    setNotifications(null);
  };

  return (
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="absolute" open={open} sx={{ justifyItems : "center" , zIndex : "2" }}>
            <Toolbar
              sx={{
                pr: '24px', // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: '36px',
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 , textAlign : "left" }}
              >
                Système de Gestion de Correspondance
              </Typography>
              <Box sx={{ marginRight : 2 }}>
                <Tooltip title="notifications">
                  <IconButton color="inherit" onClick={handleOpenNotification}>
                      <Badge badgeContent={4} color="secondary">
                          <NotificationsIcon />
                      </Badge>
                  </IconButton>
                </Tooltip>
                <Menu
                      sx={{ mt: '45px' }}
                      id="menu-appbar"
                      anchorEl={notifications}
                      anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                      }}
                      open={Boolean(notifications)}
                      onClose={handleCloseNotification}
                      >
                      {notificationsList.map((notification) => (
                          <MenuItem key={notification} onClick={handleCloseNotification}>
                          <Typography textAlign="center">{notification}</Typography>
                          </MenuItem>
                      ))}
                  </Menu>

              </Box>
              <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                  <Avatar {...stringAvatar(`${auth.FirstName} ${auth.LastName}`)} onClick={handleOpenUserMenu} />
                  </Tooltip>
                  <Menu
                      sx={{ mt: '45px' }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                      >
                      {settings.map((setting) => (
                          <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                            <Typography textAlign="center">{setting}</Typography>
                          </MenuItem>
                      ))}
                  </Menu>
              </Box>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open} sx={{ zIndex : "0" }}>
            <Toolbar
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  px: [1],
                }}
              >
            </Toolbar>
            <List component="nav">
              {mainListItems}
              <Divider sx={{ my: 1 }} />
              {secondaryListItems}
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
            }}
          >
            <Toolbar />
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
              <Switch>
                <Route exact path="/app/" >
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Chart />
                  </Paper>
                </Route>
                <Route path="/app/exportations">
                    <Exportation />
                </Route>
                <Route path="/app/importations">
                    <Importations />
                </Route>
                <Route path="/app/feedback/:idemail">
                    <Feedback />
                </Route>
                <Route path="/app/users">
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Users />
                  </Paper>
                </Route>
              </Switch>
              {/* Content */}
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
  );
}