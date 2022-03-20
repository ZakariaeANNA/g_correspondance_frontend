import * as React from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { Button, DialogContent, IconButton, Tooltip } from "@mui/material";
import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Close, Send, Visibility } from '@mui/icons-material'; 
import FeedbackIcon from '@mui/icons-material/Feedback';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { Box } from '@mui/system';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {Delete} from "@mui/icons-material";


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
function DeleteImportation({params}){
  
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return(
        <div>
            <Tooltip title="Supprimer l'importation">
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
                Suprimer Un Importation
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
function ViewImportation({params}){
  
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return(
        <div>
            <Tooltip title="Voir l'impotation">
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
                Voir Mon importation
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
                        <Button variant='contained'>Envoyer un FeedBack</Button>
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
function SendFeedback({params}){
  
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return(
        <div>
            <Tooltip title="Envoyer un FeedBack">
                <IconButton aria-label="delete" size="large" onClick={handleClickOpen}> 
                    <FeedbackIcon sx={{ color: '#0078d2'}} color="red" />
                </IconButton>
            </Tooltip>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth
                maxWidth="sm"
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Envoyer un Feedback
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <TextareaAutosize
                        aria-label="empty textarea"
                        placeholder="Merci de saisir votre texte feedback ici !"
                        minRows={4}
                        style={{ width: '100%'}}
                        required
                    />
                    <input
                        style={{ display: "none" }}
                        id="contained-button-file"
                        type="file"
                    />
                    <label htmlFor="contained-button-file">
                        <Button variant="contained" color="secondary" component="span">
                            <AttachFileIcon />
                        </Button>
                    </label>
                </DialogContent>
                <DialogActions>
                <Button variant="contained" startIcon={<Send />} autoFocus onClick={handleClose}>
                    Envoyer
                </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}
export default function Importations(){
    const columns = [
        {field: "Namesender",headerName: "Envoyé par", flex: 1 ,headerAlign : 'center'},
        {field: "role",headerName: "Role", flex: 1 ,headerAlign : 'center'},
        {field: "nameEtab",headerName: "Nom d'Etablissement", flex: 1 ,headerAlign : 'center'},
        {field: "dateSend",headerName: "Date d'Envoi", flex: 1 ,headerAlign : 'center'},
        {field: "Actions",headerName: "Actions", flex: 1 ,headerAlign : 'center',renderCell : (params)=>(
            <div style={{display: 'flex',flexDirection: 'row',justifyContent: 'flex-start'}}>
                <ViewImportation params={params.row}/>
                <SendFeedback params={params.row}/>
                <DeleteImportation params={params.row} />
            </div>
        )},        
    ]
    const DataGridRows = [
        {id:1,Namesender: 'raafat',role: 'Admin',nameEtab: 'Direction provaincial',dateSend: '2022-03-17 18:19:38'},
        {id:2,Namesender: 'raafat',role: 'Admin',nameEtab: 'Direction provaincial',dateSend: '2022-02-17 11:39:18'},
        {id:3,Namesender: 'raafat',role: 'Admin',nameEtab: 'Direction provaincial',dateSend: '2022-11-25 20:20:23'},
        {id:4,Namesender: 'raafat',role: 'Admin',nameEtab: 'Direction provaincial',dateSend: '2022-03-07 12:19:12'},
        {id:5,Namesender: 'raafat',role: 'Admin',nameEtab: 'Direction provaincial',dateSend: '2022-10-17 18:40:38'},
    ]
    const [rows,setRows] = React.useState(DataGridRows); 
    return(
        <React.Fragment>
            <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'flex-start'}}>
                <Typography variant='h6'>Mes Importations</Typography>
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