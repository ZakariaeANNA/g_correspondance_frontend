import React,{ useState,useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { Button, DialogContent, IconButton , TextField , CircularProgress , Container, ListItemButton  } from "@mui/material";
import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Visibility } from '@mui/icons-material'; 
import { Box } from '@mui/system';
import {Delete} from "@mui/icons-material";
import { Tooltip } from '@material-ui/core';
import Paper from '@mui/material/Paper';
import { Chat,Send} from "@mui/icons-material";
import SendIcon from '@mui/icons-material/Send';
import { useSelector,useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useAddExportationsMutation , useGetExportationBycodeGRESAQuery } from "../../store/api/exportationApi";
import "./Exportations.css";
import { decodeToken } from "react-jwt";
import moment from 'moment';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import Collapse from "@material-ui/core/Collapse";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { makeStyles } from "@material-ui/core/styles";
import {FileIcon,defaultStyles} from 'react-file-icon';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fit-content',
    minWidth:450,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt:3
};
const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    color:{
        backgroundColor: '#f0f0f0'
    }
}));

function stringColor(string) {
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

function stringToAvatar(name) {
    return {
      sx: {
        bgcolor: stringColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }
    
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
    const [files,setFiles] = useState();
    const [tags, setTags] = React.useState([]);
    const [addExportations, { data, isLoading, error, isError, isSuccess }] = useAddExportationsMutation();
    const { enqueueSnackbar } = useSnackbar();

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
        if(isSuccess){
            enqueueSnackbar( data.addExportation ,  { variant: "success" });
        }
        if(isError){
            enqueueSnackbar(error.data.addExportation ,  { variant: "error" });
        }
    },[data,error]);

    const changeFile = (event) => {
        setFiles(event.target.files[0]);
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
        formData.append('receiver', JSON.stringify(tags));
        formData.append('sender',user.codeGRESA);
        formData.append('file', files);
        addExportations(formData);
       
    }
    return (
      <div>
        <Box sx={{ justifyContent:"flex-end", display:"flex" ,paddingTop:2}} onClick={handleClickOpen}>
            <Button variant="outlined" endIcon={<SendIcon />} >
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
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline className='inputField' label="References" variant="outlined" rows={4} name="message" required/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline className='inputField' label="Concernants" variant="outlined" rows={4} name="message" required/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline className='inputField' label="Notes" variant="outlined" rows={4} name="message" required/>
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
function ViewUserDetails({params}){
  
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    return (
        <div>
            <IconButton onClick={handleOpen}>
                <Visibility />
            </IconButton>
            <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Box style={{display: 'flex',justifyContent: 'flex-start',flexDirection:'row',paddingLeft: '2em',marginBottom: 10}}>
                            <Avatar {...stringToAvatar(`${params.FirstName} ${params.LastName}`)}/><Typography variant='h5' style={{marginTop : 3,marginLeft: 15}}>{params.FirstName} {params.LastName}</Typography>
                        </Box>
                        <TableContainer component={Paper} sx={{px:2}}>
                            <Table sx={{ minWidth: '60%' }} aria-label="simple table">
                                <TableBody>
                                    <TableRow>
                                        <TableCell style={{ fontWeight : "bold" }}>Doti</TableCell>
                                        <TableCell component="th" scope="row">
                                            {params.codeGRESA}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ fontWeight : "bold" }}>Email</TableCell>
                                        <TableCell component="th" scope="row">
                                            {params.email}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ fontWeight : "bold" }}>Phone</TableCell>
                                        <TableCell component="th" scope="row">
                                            {params.phone}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ fontWeight : "bold" }}>Nom Departement</TableCell>
                                        <TableCell component="th" scope="row">
                                            {params.departement.nameDepartement}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ fontWeight : "bold" }}>Type Departement</TableCell>
                                        <TableCell component="th" scope="row">
                                            {params.departement.typeDepartement}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ fontWeight : "bold" }}>Delegation</TableCell>
                                        <TableCell component="th" scope="row">
                                            {params.departement.Delegation}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}
function ViewExportation({params}){
  
    const [open, setOpen] = React.useState(false);
    const date = moment(params.created_at).format('DD-MM-YYYY HH:mm');
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const [display,setDisplay] = React.useState(false);
    const handleClick = () => {
        setDisplay(!display);
    };
    const classes = useStyles()
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
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline label="Expéditeur" variant="filled" value={params.sender.FirstName+' '+params.sender.LastName} inputProps={{ readOnly: true }}/>                                      
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline label="Date d'Envoi" variant="filled" value={date} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline label="Objet de l'exportation" variant="filled" value={params.emailTitle} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline label="Message" variant="filled" rows={4} value={params.message} inputProps={{ readOnly: true }}/>
                    {/*show users content*/}
                    <Grid item variant='filled' id='outlined-basic'>
                        <div>
                            <List
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                            >
                                
                                <ListItemButton onClick={handleClick} className={classes.color}>
                                    <ListItemText primary="Récepteurs" />
                                    {display ? <ExpandLessIcon /> : <ExpandMoreIcon />} 
                                </ListItemButton>                                   
                                <Collapse in={display} timeout="auto" unmountOnExit >
                                    <List component="div" disablePadding>
                                        {
                                            params.incoming_email.map(email=>(
                                                email.receiver.map(receive=>(
                                                         <ListItem key={receive.codeGRESA}> 
                                                            <ListItemAvatar>
                                                                <Avatar
                                                                    {...stringToAvatar(`${receive.FirstName} ${receive.LastName}`)}
                                                                />
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={<Typography>{receive.LastName} {receive.FirstName}</Typography>}
                                                            />
                                                            <ListItemSecondaryAction>
                                                                <ViewUserDetails params={receive}/>
                                                            </ListItemSecondaryAction>
                                                        </ListItem>
                                                )
                                            )))
                                        }
                                    </List>
                                </Collapse>
                            </List>
                        </div>
                    </Grid>
                    {/*end user content section*/}
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

export default function Exportation(){
    const auth = useSelector( state => state.auth.user );
    const [rows,setRows] = React.useState([]);
    const { data, isError, isLoading } = useGetExportationBycodeGRESAQuery(auth.codeGRESA); 
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        dispatch({ type : "checkLogin" , history : history , route : "/auth/"});
        if(data){
            setRows(data);
        }
    },[data]);
    const columns = [
        {field: "sender",headerName: "Expéditeur", flex: 1 ,headerAlign : 'center',align:'center',fontWeight:"bold",renderCell : (params)=>{
            return(
                <Typography>{params.row.sender.LastName} {params.row.sender.FirstName}</Typography>
            )
        }},
        {field: "emailTitle",headerName: "L'objet de l'email", flex: 3 ,headerAlign : 'center',align:'center'},
        {field: "created_at",headerName: "Date d'Envoi", flex: 1 ,headerAlign : 'center',align:'center',renderCell : (params)=>{
            const date = moment(params.row.created_at).format('DD-MM-YYYY');
            return(
                <Box>{date}</Box>
            );
        }},
        {field: "Actions",headerName: "Actions", flex: 2 ,headerAlign : 'center',align:'center',renderCell : (params)=>(
            <Box sx={{display: 'flex',flexDirection: 'row',textAlign:"center"}}>
                <ViewExportation params={params.row}/>
                <DeleteExportation params={params.row}/>
                <Link to={"/app/feedback/"+params.row.id} >
                    <Tooltip title="FeedBack">
                        <IconButton aria-label="delete" size="large"> 
                            <Chat />
                        </IconButton>
                    </Tooltip>
                </Link>
            </Box>
        )},        
    ]
    return(
        <React.Fragment>
            <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'flex-start',paddingBottom:2,alignItems:"center"}}>
                <Typography variant='h6' sx={{fontSize:25 , fontWeight:"bold" }}>La liste des exportations envoyés</Typography>
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