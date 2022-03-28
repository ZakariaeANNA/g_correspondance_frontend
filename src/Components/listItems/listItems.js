import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PeopleIcon from '@mui/icons-material/People';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import { Link } from 'react-router-dom';


export const mainListItems = (
  <React.Fragment>
    <Link to={'/app/exportations'} style={{textDecoration: 'none',color: 'black'}}>
      <ListItemButton>
        <ListItemIcon>
          <ForwardToInboxIcon />
        </ListItemIcon>
        <ListItemText primary="Exportations" />
      </ListItemButton>
    </Link>
    <Link to={'/app/importations'} style={{textDecoration: 'none',color: 'black'}}>
      <ListItemButton>
        <ListItemIcon>
          <MoveToInboxIcon />
        </ListItemIcon>
        <ListItemText primary="Importations" />
      </ListItemButton>
    </Link>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <Link to={'/app/users'} style={{textDecoration: 'none',color: 'black'}}>
      <ListItemButton>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
          <ListItemText primary="les Utilisateurs" />
      </ListItemButton>
    </Link>
  </React.Fragment>
);