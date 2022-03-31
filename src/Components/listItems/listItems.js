import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PeopleIcon from '@mui/icons-material/People';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';




export const MainListItems = () => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Link to={'/app/exportations'} style={{textDecoration: 'none',color: 'black'}}>
        <ListItemButton>
          <ListItemIcon>
            <ForwardToInboxIcon />
          </ListItemIcon>
          <ListItemText primary={t('exportation')} sx={{ alignItems: "flex-start" , display : "inherit"}} />
        </ListItemButton>
      </Link>
      <Link to={'/app/importations'} style={{textDecoration: 'none',color: 'black'}}>
        <ListItemButton>
          <ListItemIcon>
            <MoveToInboxIcon />
          </ListItemIcon>
          <ListItemText primary={t('importation')} sx={{ alignItems: "flex-start" , display : "inherit"}} />
        </ListItemButton>
      </Link>
    </React.Fragment>
  );
} 

export const SecondaryListItems = () => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Link to={'/app/users'} style={{textDecoration: 'none',color: 'black'}}>
        <ListItemButton>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
            <ListItemText primary={t('users_management')} sx={{ alignItems: "flex-start" , display : "inherit"}} />
        </ListItemButton>
      </Link>
    </React.Fragment>
  );
}