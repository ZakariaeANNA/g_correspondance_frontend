import React,{ useState,useEffect,useLayoutEffect } from 'react'
import Paper from '@mui/material/Paper';
import { useSelector,useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import { useAddFeedbackMutation,useGetFeedbackBymailAndBysenderAndByreceiverMutation } from "../../store/api/feedbackApi";
import { useParams , useLocation } from 'react-router-dom';
import moment from 'moment';
import { Tooltip } from '@material-ui/core';
import { DialogContent, IconButton , TextField , Container, ListItemButton  } from "@mui/material";
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
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { blue } from '@mui/material/colors';
import { convertToRaw } from 'draft-js';
import { decodeToken } from "react-jwt";
import { useSnackbar } from 'notistack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import i18next from 'i18next'
import { t } from 'i18next';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import AddComment from '@mui/icons-material/AddComment';
import DropFileInput from '../drop-file-input/DropFileInput';
import Link from '@mui/material/Link';
import { stringToColor } from "../../Util/stringToAvatar";
import "./Feedback.css";
import 'moment/locale/ar-ma' 
import 'moment/locale/fr' 

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

const defaultTheme = createTheme({
    overrides: {
        MUIRichTextEditor: {
            root: {
            },
            editor: {
            },
            container: { 
            },
        }
    }
})



function SendFeedback(props){
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
    
    const [files,setFiles] = useState([]);

    const onAddFeedback = () => {
        const formData = new FormData();
        var index = 0;
        formData.append('mail_id', props.mailID);
        formData.append('idSender',props.sender);
        formData.append('idReceiver',props.receiver.doti);
        formData.append('file', files);
        formData.append('message',value);
        files.map( file => {
            formData.append('file['+index+']', file);        
            index++;    
        });
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

    const onFileChange = (files) => {
        setFiles(files);
    }

    return(
        <>
            <Tooltip title="Supprimer l'exportation">
                <IconButton color="secondary" aria-label="add an alarm" onClick={handleClickOpen}>
                    <AddComment />
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
                    Envoyer un feedback
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Box sx={{ padding: 1 , border : 1 , borderRadius : "6px" , borderColor : "#d6d8da" ,paddingBottom: 6 , marginBottom : 2}}>
                        <MUIRichTextEditor label="Start typing..." inlineStyle={{ marginY : 2 }} onChange={handleDataChange} />
                    </Box>
                    <DropFileInput
                        onFileChange={(files) => onFileChange(files)}
                        multiple={true}
                    />
                </DialogContent>
                <DialogActions>
                <Button variant="outlined" endIcon={<SendIcon />} autoFocus onClick={onAddFeedback}>
                    Envoyer
                </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    );
}

  
export default function FeedbackExport(props){
    const receivers = JSON.parse(localStorage.getItem("receivers"));
    const [ message , setMessage ] = useState([]);
    const [ receiverDisplay , setReceiverDisplay ] = useState();
    const [getFeedbackBymailAndBysenderAndByreceiver,
            { data , isLoading , 
              isError , isSuccess }] = useGetFeedbackBymailAndBysenderAndByreceiverMutation();

    moment.locale(i18next.language == "ar" ? ("ar-ma"):("fr"));


    useEffect(()=>{
        if(isSuccess){
            console.log(data);
            setMessage(data);
        }
    },[isSuccess]);

    const handleConversation = (receiver) => {
        getFeedbackBymailAndBysenderAndByreceiver({ mail : props.idemail , receiver : props.auth.doti , sender : receiver.doti });
        setReceiverDisplay(receiver);
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
                <Box sx={{ display:"flex"}}>
                   <List sx={{ width: '100%', maxWidth: 360, minWidth:"max-content" , bgcolor: 'background.paper',maxHeight:500 , overflow : "auto" }} className="scrollable">
                        { receivers.map( receiver =>(
                            <ListItem  
                                secondaryAction={
                                    receiver.receiverConfirmation === "pending" ? (
                                        <Chip label={t('pending')} />
                                    ):(
                                        <Chip label={receiver.receiverConfirmation} />
                                    )
                                } 
                                key={receiver.id} 
                                onClick={()=>handleConversation(receiver.receiver[0])}
                                disablePadding
                            >
                                <ListItemButton role={undefined} dense>   
                                    <ListItemAvatar>
                                        <Avatar alt={receiver.receiver[0].fullnamela} sx={{ bgcolor : stringToColor(receiver.receiver[0].fullnamela) }} src="/static/images/avatar/1.jpg" />
                                    </ListItemAvatar>
                                    <ListItemText primary={ i18next.language === "fr" ? (receiver.receiver[0].fullnamela) : (receiver.receiver[0].fullnamear) }/>
                                    <Divider variant="inset" component="li" />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Box sx={{ paddingX : 2 , width : "100%" }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                width: 'fit-content',
                                border: (theme) => `1px solid ${theme.palette.divider}`,
                                borderRadius: 1,
                                bgcolor: 'background.paper',
                                color: 'text.secondary',
                                '& svg': {
                                    m: 1.5,
                                },
                                '& hr': {
                                    mx: 0.5,
                                },
                            }}
                        >
                            <SendFeedback mailID={props.idemail} sender={props.auth.doti} receiver={receiverDisplay} />
                            <FormatAlignCenterIcon />
                            <FormatAlignRightIcon />
                            <Divider orientation="vertical" flexItem />
                            <FormatBoldIcon />
                            <FormatItalicIcon />
                        </Box>
                        <Box sx={{ maxHeight:400 , overflow : "auto" , marginY : 2 }} className="scrollable">
                            { data && data.map( message => (
                                <Card sx={{ textAlign:"left" , marginY : 1}} key={message.id} >
                                    <CardHeader
                                        avatar={<Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">R</Avatar>}
                                        action={
                                            <Box>
                                                <Chip label="Completed" sx={{ marginX : 1 }} />
                                                <Chip label="Completed" sx={{ marginX : 1 }} />
                                            </Box> 
                                        }
                                        title={ message.idSender === props.auth.doti && i18next.language === "fr" ? (props.auth.fullnamela) 
                                            : message.idSender === props.auth.doti && i18next.language === "ar" ? (props.auth.fullnamear) 
                                            : receiverDisplay.doti === message.idSender && i18next.language === "fr" ? (receiverDisplay.fullnamela) 
                                            : (receiverDisplay.fullnamear) }
                                        subheader={moment(message.created_at).format('MMMM Do YYYY, hh:mm')}
                                    />
                                    <CardContent>
                                        <ThemeProvider theme={defaultTheme}>
                                            <MUIRichTextEditor value={message.message} readOnly={true} toolbar={false} />
                                        </ThemeProvider>
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
                            ))}
                        </Box>
                    </Box>
                </Box>    
            </Paper>
        </React.Fragment>
    )
}