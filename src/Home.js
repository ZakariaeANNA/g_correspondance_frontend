import React , { useEffect, useState } from 'react';
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
import { Translate } from '@mui/icons-material/';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { MainListItems, SecondaryListItems } from './Components/listItems/listItems';
import Chart from './Components/Chart/Chart';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Route , Switch , Link , Redirect } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Users from '../src/Components/Users/Users';
import Importations from './Components/Importations/Importations';
import Exportation from './Components/Exportations/Exportations';
import Feedback from './Components/Feedback/Feedback';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next'
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import fontTheme from "./Util/fontTheme";
import { useLogoutMutation } from "./store/api/authApi";
import { stringAvatar } from "./Util/stringToAvatar";
import Adduser from './Components/Users/AddUser';
import AddExportation from './Components/Exportations/AddExportation';
import ChangePassword from './Components/Users/ChangePassword';
import Profile from './Components/Users/Profile';
import IdleTimer from 'react-idle-timer';
import { isExpired } from "react-jwt";
import NotFound from './Components/Error/NotFound';

const cacheLtr = createCache({
  key: "muiltr"
});

const cacheRtl = createCache({
  key: "muirtl",
  // prefixer is the only stylis plugin by default, so when
  // overriding the plugins you need to include it explicitly
  // if you want to retain the auto-prefixing behavior.
  stylisPlugins: [prefixer, rtlPlugin]
});

const ltrTheme = createTheme({ direction: "ltr" });
const rtlTheme = createTheme({ direction: "rtl" });

const settings = ['Profile', 'Account', 'Logout'];
const notificationsList = ['mohamed addhamed have sent this notification', 'account that one sent from that one', 'hello body how are you ?', 'there is too many notifications'];
const drawerWidth = 240;



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


export default function Home() {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [ timeOut , setTimeOut ] = useState(false);
  const [anchorLanguage, setAnchorLanguage] = React.useState(null);
  const [notifications, setNotifications] = React.useState(null);
  const [logout , { isLoading : isLoadingLogout , isSuccess : isSuccessLogout }] = useLogoutMutation();
  const auth = useSelector( state => state.auth.user );
  const history = useHistory();
  const token = localStorage.getItem("token");
  const { t } = useTranslation();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(()=>{
    dispatch({ type : "checkLogin" , history : history , route : "/auth/"});
    if(isSuccessLogout){
      if(timeOut)
        dispatch({ type : "logoutTimeOut" , history : history , route : "/auth/" });
      else
        dispatch({ type : "logout" , history : history , route : "/auth/" });
    }
  },[isSuccessLogout]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (setting) => {
    if(setting === "Logout"){
      logout({token : `${localStorage.getItem("token")}` });
    }
    if(setting==="Account"){
      history.push("/app/changepassword");
    }
    if(setting === "Profile"){
      history.push("/app/profile");
    }
    setAnchorElUser(null);
  };

  const handleOpenLanguage = (event) => {
    setAnchorLanguage(event.currentTarget);
  };

  const handleCloseLanguage = () => {
    setAnchorLanguage(null);
  };
  
  const handleOpenNotification = (event) => {
    setNotifications(event.currentTarget);
  };

  const handleCloseNotification = () => {
    setNotifications(null);
  };

  const handleOnIdle = () => {
    setTimeOut(true);
    logout({token : `${localStorage.getItem("token")}` });
  }

  return (
    <IdleTimer
      timeout={300000}
      onIdle={handleOnIdle}
      debounce={250}
    >
      <CacheProvider value={i18next.language === "ar" ? cacheRtl : cacheLtr}>
        <ThemeProvider theme={i18next.language === "ar" ? { rtlTheme , fontTheme } : { ltrTheme , fontTheme }}>
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
                    marginRight:"36px"
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
                    <Link to={"/app/"} style={{ textDecoration : "none" , color : "white"}}>
                      {t('project_title')}
                    </Link>
                  </Typography>
                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title={t("language")}>
                      <Translate onClick={handleOpenLanguage} />
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorLanguage}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorLanguage)}
                        onClose={handleCloseLanguage}
                    >
                        <MenuItem key={t('fr')} onClick={() => { handleCloseLanguage(); i18next.changeLanguage("fr");}}>
                          <Typography textAlign="center">{t('fr')}</Typography>
                        </MenuItem>
                        <MenuItem key={t('ar')} onClick={() => { handleCloseLanguage(); i18next.changeLanguage("ar");}}>
                          <Typography textAlign="center">{t('ar')}</Typography>
                        </MenuItem>
                    </Menu>
                  </Box>
                <Box sx={{ marginX : 2 }}>
                  <Tooltip title={t("notification")}>
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
                    <Tooltip title={auth?.fullnamela || "Open Settings"}>
                    <Avatar {...stringAvatar(`${auth?.fullnamela} ${auth?.fullnamear}`)} onClick={handleOpenUserMenu} />
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
                              <Typography textAlign="center">{t(setting)}</Typography>
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
                    alignItems: 'flex-start',
                    justifyContent: 'flex-end',
                    px: [1],
                  }}
                >
              </Toolbar>
              <List component="nav" sx={{ paddingInlineStart: 1 }}>
                <MainListItems />
                <Divider sx={{ my: 1 }} />
                <SecondaryListItems/>
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
                  { !token || isExpired(token) ? (
                    <Redirect to="/auth/" />
                  ):(
                    <React.Fragment>
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
                        { auth && auth.role === "directeur" ? (
                          <Redirect to="/app/" />
                        ):(
                          <Users />
                        )}
                      </Route>
                      <Route path="/app/adduser">
                        { auth && auth.role === "directeur" ? (
                          <Redirect to="/app/" />
                        ):(
                          <Adduser />
                        )}
                      </Route>
                      <Route path="/app/addexportation">
                        <AddExportation />
                      </Route>
                      <Route path="/app/changepassword">
                        <ChangePassword />
                      </Route>
                      <Route path="/app/profile">
                        <Profile />
                      </Route>
                    </React.Fragment>
                  )}
                </Switch>
                {/* Content */}
              </Container>
            </Box>
          </Box>
        </ThemeProvider>
      </CacheProvider>
    </IdleTimer>
  );
}