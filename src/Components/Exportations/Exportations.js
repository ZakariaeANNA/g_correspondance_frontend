import * as React from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { Button, DialogContent, IconButton } from "@mui/material";
import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Close, Visibility } from '@mui/icons-material'; 
import { Box } from '@mui/system';
import {Delete} from "@mui/icons-material";
import { Tooltip } from '@material-ui/core';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
  }));
  const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
            }}
            >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  };
  BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};
function DeleteExportation({params}){
  
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return(
        <div>
            <Tooltip title="Supprimer l'exportation">
                <IconButton aria-label="delete" size="large" onClick={handleClickOpen}> 
                        <Delete sx={{ color: 'red' }} color="red" />
                </IconButton>
            </Tooltip>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth
                maxWidth="md" 
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                Suprimer Un Exportation
                </BootstrapDialogTitle>
                <DialogContent dividers>
                <Typography>
                    Êtes-vous sûr de vouloir supprimer l'element selectionné
                </Typography>
                </DialogContent>
                <DialogActions>
                <Button variant="contained" color='error' startIcon={<Delete />} autoFocus onClick={handleClose}>
                    Confirmer
                </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}
function ViewExportation({params}){
  
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return(
        <div>
            <Tooltip title="Voir l'exportation">
                <IconButton aria-label="delete" size="large" onClick={handleClickOpen}> 
                    <Visibility sx={{ color: '#7BE929'}} color="red" />
                </IconButton>
            </Tooltip>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth
                maxWidth="md"
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Voir Mon Exportation
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'space-between'}}>
                        <Box
                                sx={{
                                    width: '48%',
                                    height: '60vh',
                                    backgroundColor: 'primary.dark',
                                    '&:hover': {
                                    backgroundColor: 'primary.main',
                                    opacity: [0.9, 0.8, 0.7],
                                    },
                                }}
                        />
                        <Box
                            sx={{
                                width: '48%',
                                height: '60vh',
                                backgroundColor: 'primary.dark',
                                '&:hover': {
                                backgroundColor: 'primary.main',
                                opacity: [0.9, 0.8, 0.7],
                                },
                            }}
                        />
                    </Box>
                    <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'space-between',marginTop: '10px'}}>
                        <Button variant='contained'>Telecharger fichier</Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                <Button variant="contained" startIcon={<Close />} autoFocus onClick={handleClose}>
                    Fermer
                </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}

export default function Exportation(){
    const columns = [
        {field: "NameReceiver",headerName: "Envoyé pour", flex: 1 ,headerAlign : 'center'},
        {field: "role",headerName: "Role", flex: 1 ,headerAlign : 'center'},
        {field: "nameEtab",headerName: "Nom d'Etablissement", flex: 1 ,headerAlign : 'center'},
        {field: "dateSend",headerName: "Date d'Envoi", flex: 1 ,headerAlign : 'center'},
        {field: "status",headerName: "Status", flex: 1 ,headerAlign : 'center'},
        {field: "Actions",headerName: "Actions", flex: 1 ,headerAlign : 'center',renderCell : (params)=>(
            <div style={{display: 'flex',flexDirection: 'row',justifyContent: 'flex-start'}}>
                <ViewExportation params={params.row}/>
                <DeleteExportation params={params.row}/>
            </div>
        )},        
    ]
    const DataGridRows = [
        {id:1,NameReceiver: 'hassan',role: 'Admin',nameEtab: 'Direction provaincial',dateSend: '2022-03-17 18:19:38',status: 'lue'},
        {id:2,NameReceiver: 'raafat',role: 'Admin',nameEtab: 'Direction provaincial',dateSend: '2022-02-17 11:39:18',status: 'non lue'},
        {id:3,NameReceiver: 'raafat',role: 'Admin',nameEtab: 'Direction provaincial',dateSend: '2022-11-25 20:20:23',status: 'lue'},
        {id:4,NameReceiver: 'raafat',role: 'Admin',nameEtab: 'Direction provaincial',dateSend: '2022-03-07 12:19:12',status: 'nonlue'},
        {id:5,NameReceiver: 'raafat',role: 'Admin',nameEtab: 'Direction provaincial',dateSend: '2022-10-17 18:40:38',status: 'lue'},
    ]
    const [rows,setRows] = React.useState(DataGridRows); 
    return(
        <React.Fragment>
            <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'flex-start'}}>
                <Typography variant='h6'>Mes Exportations</Typography>
            </Box>
            <div style={{ height: '60vh', width: '100%' , textAlign: "center",marginTop: '0.5em' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                />
            </div>
        </React.Fragment>
    )
}