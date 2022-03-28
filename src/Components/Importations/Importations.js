import React,{ useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { Button, DialogContent, IconButton, Tooltip , Paper , TextField , CircularProgress  } from "@mui/material";
import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Send, Visibility } from '@mui/icons-material'; 
import FeedbackIcon from '@mui/icons-material/Feedback';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { Box } from '@mui/system';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {Delete} from "@mui/icons-material";
import { useGetImportationBycodeGRESAQuery } from "../../store/api/importationApi";
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import {FileIcon,defaultStyles} from 'react-file-icon';
import { Link } from 'react-router-dom';
import { Chat} from "@mui/icons-material";



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
                <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline label="Expéditeur" variant="filled" value={`${params.sender.FirstName} ${params.sender.LastName}`} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline label="Objet de l'exportation" variant="filled" value={params.emailTitle} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline label="Message" variant="filled" rows={4} value={params.message} inputProps={{ readOnly: true }}/>
                    <a href={'http://localhost:8000/api/'+params.attachement+'/'+params.fileName} style={{textDecoration: 'none'}}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                alignItems: 'flex-start',
                                flexDirection: 'column'
                            }}
                        >
                            <div style={{width:'4em',height: '4em',display:'flex',justifyContent: 'flex-start',alignItems: 'center'}}>
                                <FileIcon extension={params.type} {...defaultStyles[params.type]}/>
                            </div>
                            <Typography style={{marginTop: 10}}>{params.fileName}</Typography>
                        </Paper>
                    </a>
                </DialogContent>
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
    const auth = useSelector( state => state.auth.user );
    const { data, isError, isLoading } = useGetImportationBycodeGRESAQuery(auth.codeGRESA); 
    const [rows,setRows] = React.useState([]); 
    const dispatch = useDispatch();
    const history = useHistory();
    useEffect(() => {
        dispatch({ type : "checkLogin" , history : history , route : "/auth/"});
        if(data){
            setRows(data);
        }
    },[data]);
    const columns = [
        {field: "sender",headerName: "Expéditeur", flex: 1 ,headerAlign : 'center' ,align : "center",renderCell : (params)=>(
            <Box>{params.row.sender.FirstName} {params.row.sender.LastName}</Box>
        )},
        {field: "emailTitle",headerName: "L'objet de l'email", flex: 1 ,headerAlign : 'center',align : "center",renderCell : (params)=>(
            <Box>{params.row.emailTitle}</Box>
        )},
        {field: "departement",headerName: "Nom Departement", flex: 1 ,headerAlign : 'center',align : "center",renderCell: (params)=>(
            <Box>{params.row.sender.departement.nameDepartement}</Box>
        )},
        {field: "created_at",headerName: "Date d'Envoi", flex: 1 ,headerAlign : 'center',align:'center',renderCell : (params)=>{
            const date = moment(params.row.created_at).format('DD-MM-YYYY');
            return(
                <Box>{date}</Box>
            );
        }},
        {field: "Actions",headerName: "Actions", flex: 1 ,headerAlign : 'center',align : "center",renderCell : (params)=>(
            <div style={{display: 'flex',flexDirection: 'row',alignContent:"center"}}>
                <ViewImportation params={params.row}/>
                <DeleteImportation params={params.row} />
                <Link to={"/app/feedback/"+params.row.id} >
                    <Tooltip title="FeedBack">
                        <IconButton aria-label="delete" size="large"> 
                            <Chat />
                        </IconButton>
                    </Tooltip>
                </Link>
            </div>
        )},        
    ]
    return(
        <React.Fragment>
            <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'flex-start',paddingBottom:2,alignItems:"center"}}>
                <Typography variant='h6' sx={{fontSize:25 , fontWeight:"bold" }}>La liste des importations recus</Typography>
            </Box>
            {   isLoading ? (
                <Box
                    sx={{
                        position : "absolute",
                        top : "50%",
                        right : "50%",
                        background : "transparent"
                    }}
                >
                    <CircularProgress/>
                </Box>
            ):(
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '60vh', width: '100%' , textAlign: "center",marginTop: '0.5em' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            checkboxSelection
                        />
                    </div>
                </Paper>
            )}
        </React.Fragment>
    )
}