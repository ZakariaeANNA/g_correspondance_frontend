import React,{ useState,useEffect } from 'react'
import Paper from '@mui/material/Paper';
import { useSelector,useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, InputLabel } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import { useGetFeedbackByidAndBysenderQuery,useGetFeedbackByidAndByreceiverMutation,useAddFeedbackMutation } from "../../store/api/feedbackApi";
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { Tooltip } from '@material-ui/core';
import { DialogContent, IconButton , TextField } from "@mui/material";
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import MUIRichTextEditor from 'mui-rte';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { blue } from '@mui/material/colors';

const colorBlue = blue[900];


const columns = [
    { id: 'message', label: 'Message', minWidth: 170 },
    {
      id: 'idSender',
      label: 'Sender',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'created_at',
      label: 'Date',
      minWidth: 170,
      align: 'right',
      format: (value) => moment(value).format('DD-MM-YYYY'),
      renderCell : (value) => moment(value).format('DD-MM-YYYY')
    }
];

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



function SendFeedback({params}){
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const [value,setValue] = React.useState('')
    const handleDataChange = (event)=>{
        const plainText = event.getCurrentContent().getPlainText() // for plain text
        const rteContent = convertToRaw(event.getCurrentContent()) // for rte content with text formating
        rteContent && setValue(JSON.stringify(rteContent)) // store your rteContent to state
    }
    const [addFeedback, { data, isLoading, error, isError, isSuccess }] = useAddFeedbackMutation();
    const [files,setFiles] = useState();
    const changeFile = (event) => {
        setFiles(event.target.files[0]);
    }
    const [receiver,setReceiver] = React.useState()
    const onAddFeedback = (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        const user = decodeToken(token);
        const formData = new FormData(event.currentTarget);
        formData.append('receiver', receiver);
        formData.append('sender',user.codeGRESA);
        formData.append('message',value);
        formData.append('emailId',id);
        formData.append('file', files);
        addFeedback(formData);
    }
    const { enqueueSnackbar } = useSnackbar();
    useEffect(()=>{
        if(isSuccess){
            enqueueSnackbar( data.addFeedback, { variant: "success" });
        }
        if(isError){
            enqueueSnackbar(error.data.addFeedback, { variant: "error" });
        }
    },[data,error]);
    return(
        <>
            <Tooltip title="Envoyer un feedback">
                <Box sx={{ alignSelf : "flex-end" }}>
                    <Button variant="text" endIcon={<SendIcon />} onClick={handleClickOpen} >Envoyer un feedback</Button>
                </Box>
            </Tooltip>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth
                maxWidth="md" 
            >
                <form onSubmit={onAddFeedback} encType="multipart/form-data">
                    <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                        Envoyer un feedback
                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                            <MUIRichTextEditor
                                value={value} 
                                label="Start typing..." 
                                onChange={handleDataChange}
                                readOnly
                                toolbar={false}
                                />
                            <TextField id="outlined-basic"  sx={{mt:4}} required fullWidth label="Code GRESA" onChange={(value)=>setReceiver(value.target.value)} variant="outlined" />
                            <MUIRichTextEditor 
                                label="Start typing..." 
                                onChange={handleDataChange}
                            />
                            <input type="file" name="ffff" style={{marginTop: '4em'}} onChange={changeFile}/>
                    </DialogContent>
                    <DialogActions>
                    <Button variant="outlined" endIcon={<SendIcon />} autoFocus type="submit">
                        Envoyer
                    </Button>
                    </DialogActions>
                </form>
            </BootstrapDialog>
        </>
    );
}

  
export default function Feedback(){
    const auth = useSelector( state => state.auth.user );
    const dispatch = useDispatch();
    const history = useHistory();
    const { idemail } = useParams();
    const { data : dataSender, 
            isError , 
            isLoading : isLoadingSender} = useGetFeedbackByidAndBysenderQuery({ id:idemail , user : auth.codeGRESA});
    const [ getFeedbackByidAndByreceiver , 
            { data : dataReceiver, 
              isLoading : isLoadingReceiver,
              isSuccess : isSuccessReceiver }] = useGetFeedbackByidAndByreceiverMutation(); 
    const [ rowsSender,setRowsSender ] = useState([]);
    const [ rowsReceiver,setRowsReceiver ] = useState([])
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        dispatch({ type : "checkLogin" , history : history , route : "/auth/"});
        if(dataSender){
            setRowsSender(dataSender);
        }
        if(isSuccessReceiver){
            setRowsReceiver(dataReceiver);
        }
    },[dataReceiver,dataSender]);


    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        if(newValue == 2){
            getFeedbackByidAndByreceiver({ id:idemail , user:auth.codeGRESA });
        }
        setValue(newValue);
    };

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const isToday = (someDate) => {
        const today = moment();
        return today.isSame(someDate,'day');
    }

    return(
        <React.Fragment>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <SendFeedback />
                <Box sx={{ display:"flex"}}>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                            </ListItemAvatar>
                            <ListItemText
                            primary="Brunch this weekend?"
                            secondary={
                                <React.Fragment>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    Ali Connors
                                </Typography>
                                {" — I'll be in your neighborhood doing errands this…"}
                                </React.Fragment>
                            }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                            </ListItemAvatar>
                            <ListItemText
                            primary="Summer BBQ"
                            secondary={
                                <React.Fragment>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    to Scott, Alex, Jennifer
                                </Typography>
                                {" — Wish I could come, but I'm out of town this…"}
                                </React.Fragment>
                            }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                            <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                            </ListItemAvatar>
                            <ListItemText
                            primary="Oui Oui"
                            secondary={
                                <React.Fragment>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    Sandra Adams
                                </Typography>
                                {' — Do you have Paris recommendations? Have you ever…'}
                                </React.Fragment>
                            }
                            />
                        </ListItem>
                    </List>
                    <Box sx={{ p : 2 }}>
                        <Card fullWidth sx={{ textAlign:"left" , marginY : 2}}>
                            <CardHeader
                                avatar={<Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">R</Avatar>}
                                action={
                                    <Box>
                                        <Chip label="Completed" sx={{ marginX : 1 }} />
                                        <Chip label="Completed" sx={{ marginX : 1 }} />
                                    </Box> 
                                }
                                title="Shrimp and Chorizo Paella"
                                subheader="September 14, 2016"
                            />
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    This impressive paella is a perfect party dish and a fun meal to cook
                                    together with your guests. Add 1 cup of frozen peas along with the mussels,
                                    if you like.
                                </Typography>
                            </CardContent>
                            <Divider />
                            <CardActions disableSpacing>
                                <IconButton aria-label="add to favorites">
                                    <FavoriteIcon />
                                </IconButton>
                                <IconButton aria-label="share">
                                    <ShareIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                        <Card fullWidth sx={{ textAlign:"left" , bgcolor : blue[300] }}>
                            <CardHeader
                                avatar={<Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">R</Avatar>}
                                action={
                                    <Box>
                                        <Chip label="Completed" sx={{ marginX : 1 }} />
                                        <Chip label="Completed" sx={{ marginX : 1 }} />
                                    </Box> 
                                }
                                title="Shrimp and Chorizo Paella"
                                subheader="September 14, 2016"
                            />
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    This impressive paella is a perfect party dish and a fun meal to cook
                                    together with your guests. Add 1 cup of frozen peas along with the mussels,
                                    if you like.
                                </Typography>
                            </CardContent>
                            <Divider />
                            <CardActions disableSpacing>
                                <IconButton aria-label="add to favorites">
                                    <FavoriteIcon />
                                </IconButton>
                                <IconButton aria-label="share">
                                    <ShareIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Box>
                </Box>    
            </Paper>
        </React.Fragment>
    )
}