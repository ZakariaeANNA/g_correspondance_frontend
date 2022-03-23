import React,{ useState,useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { Button, DialogContent, IconButton , TextField , CircularProgress } from "@mui/material";
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
import Paper from '@mui/material/Paper';
import { IosShare,Chat,Send } from "@mui/icons-material";
import SendIcon from '@mui/icons-material/Send';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from "axios";
import { useAddExportationsMutation , useGetExportationBycodeGRESAQuery } from "../../store/api/exportationApi";
import "./Exportations.css";
import { isExpired, decodeToken } from "react-jwt";



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

function AddExportation(){
    const [open, setOpen] = useState(false);
    const [type, setType] = useState();
    const [files,setFiles] = useState();
    const [tags, setTags] = React.useState([]);
    const [addExportations, { data, isLoading, error, isError, isSuccess }] = useAddExportationsMutation();
  
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    const removeTags = indexToRemove => {
		setTags([...tags.filter((_, index) => index !== indexToRemove)]);
	};

    useEffect(()=>{
        if (isSuccess) {
          console.log("fffffff");
        }
        if (isError) {
          console.log(error);
        }
    });

    const changeFile = (event) => {
        setFiles(event.target.files[0]);
        setType(event.target.files[0].type);
    }

    const addTags = event => {
        if (event.key === " " && event.target.value !== "") {
            setTags([...tags, { idReceiver : event.target.value.replace(/\s+/g, '') } ]);
            event.target.value = "";
        }
    }

    const onAddExportations = (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        const user = decodeToken(token);
        const formData = new FormData(event.currentTarget);
        console.log(tags);
        console.log(event.target);
        formData.append('receiver', JSON.stringify(tags));
        formData.append('sender',user.codeGRESA);
        formData.append('file', files);
        formData.append("type",type);
        addExportations(formData);
    }
  
    return (
      <div>
        <Box sx={{ justifyContent:"flex-end", display:"flex" ,paddingTop:2}} onClick={handleClickOpen}>
            <Button variant="contained" endIcon={<SendIcon />} >
                Envoyer une exportation
            </Button>
        </Box>
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          fullWidth
          maxWidth="md" 
        >
            <form onSubmit={onAddExportations} encType="multipart/form-data">
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                Envoyer une exportation
            </BootstrapDialogTitle>
            <DialogContent dividers>
                <div className="tags-input">
                    <ul id="tags">
                        {tags.map((tag, index) => (
                            <li key={index} className="tag">
                                <span className='tag-title'>{tag.idReceiver}</span>
                                <span className='tag-close-icon'
                                    onClick={() => removeTags(index)}
                                >
                                    x
                                </span>
                            </li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        onKeyDown={event => event.key === " " ? addTags(event) : null}
                        placeholder="Code GRESA"
                    />
                </div>
                <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth className='inputField' label="Objet" variant="outlined" name="emailTitle" required/>
                <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline className='inputField' label="Message" variant="outlined" rows={4} name="message" required/>
                <input type="file" name="ffff" onChange={changeFile}/>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' type="submit" startIcon={<Send />} autoFocus >
                    Envoyer
                </Button>
            </DialogActions>
            </form>
        </BootstrapDialog>
      </div>
    );
  
}

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
    const { data, isError, isLoading } = useGetExportationBycodeGRESAQuery(decodeToken(localStorage.getItem("token")).codeGRESA);
    const history = useHistory();
    const dispatch = useDispatch();
    const [rows,setRows] = React.useState([]); 
    useEffect(() => {
        dispatch({ type : "checkLogin" , history : history});
        if(data){
            setRows(data.emails);
        }
    },[data]);

    const columns = [
        {field: "sender",headerName: "Expéditeur", flex: 1 ,headerAlign : 'center'},
        {field: "emailTitle",headerName: "L'objet de l'email", flex: 1 ,headerAlign : 'center'},
        {field: "updated_at",headerName: "Date d'Envoi", flex: 1 ,headerAlign : 'center'},
        {field: "status",headerName: "Statut", flex: 1 ,headerAlign : 'center'},
        {field: "Actions",headerName: "Actions", flex: 1 ,headerAlign : 'center',renderCell : (params)=>(
            <Box sx={{display: 'flex',flexDirection: 'row',textAlign:"center"}}>
                <ViewExportation params={params.row}/>
                <DeleteExportation params={params.row}/>
                <Tooltip title="FeedBack">
                    <IconButton aria-label="delete" size="large"> 
                        <Chat />
                    </IconButton>
                </Tooltip>
            </Box>
        )},        
    ]
    return(
        <React.Fragment>
            <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'flex-start',paddingBottom:2,alignItems:"center"}}>
                <Typography variant='h6' sx={{fontSize:25 , fontWeight:"bold" }}>La liste des exportations envoyés</Typography>
            </Box>
                {   isLoading ? (
                    <Paper
                        sx={{
                            position : "absolute",
                            top : "50%",
                            right : "50%",
                            background : "transparent"
                        }}
                    >
                        <CircularProgress/>
                    </Paper>
                ):(
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <div style={{ height: '60vh', width: '100%' , textAlign: "center",marginTop: '0.5em' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            checkboxSelection
                            />
                        </div>
                        <AddExportation />
                    </Paper>
                )}
        </React.Fragment>
    )
}