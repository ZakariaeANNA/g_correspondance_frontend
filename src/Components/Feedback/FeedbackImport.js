import React,{ useState,useEffect } from 'react'
import Paper from '@mui/material/Paper';
import { Button, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import { useAddFeedbackMutation,useConfirmMailByReceiverMutation,useGetFeedbackBymailAndBysenderAndByreceivercloneQuery } from "../../store/api/feedbackApi";
import moment from 'moment';
import { Tooltip } from '@material-ui/core';
import { DialogContent, IconButton} from "@mui/material";
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import MUIRichTextEditor from 'mui-rte';
import {FileIcon,defaultStyles} from 'react-file-icon';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { convertToRaw } from 'draft-js';
import { useSnackbar } from 'notistack';
import { createTheme } from '@mui/material/styles';
import { t } from 'i18next';
import i18next from 'i18next'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import AddComment from '@mui/icons-material/AddComment';
import DropFileInput from '../drop-file-input/DropFileInput';
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

  
export default function FeedbackImport(props){
    const receivers = JSON.parse(localStorage.getItem("receivers"));
    const [expanded, setExpanded] = React.useState(false);
    const [ message , setMessage ] = useState([]);
    const { data , isLoading , 
            isError , isSuccess } = useGetFeedbackBymailAndBysenderAndByreceivercloneQuery({ mail : props.idemail , receiver : props.auth.doti , sender : receivers.mail.sender.doti });
    const [onUpdateConfirmationByReceiver,{}] = useConfirmMailByReceiverMutation();
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const previousRoute = localStorage.getItem("path");
    
    moment.locale(i18next.language == "ar" ? ("ar-ma"):("fr"));
    const [value, setValue] = React.useState("pending");

    useEffect(()=>{
        if(isSuccess){
            setMessage(data);
        }
    },[isSuccess]);


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
                    <Box sx={{ paddingX : 2 , width : "100%" }}>
                        <Box sx={{display: 'flex',flexDirection: 'row', justifyContent: 'space-between'}}>
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
                                <SendFeedback mailID={props.idemail} sender={props.auth.doti} receiver={receivers.mail.sender} />
                                <FormatAlignCenterIcon />
                                <FormatAlignRightIcon />
                                <Divider orientation="vertical" flexItem />
                                <FormatBoldIcon />
                                <FormatItalicIcon />
                            </Box>
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
                                <Box sx={{dislpay: 'flex',flexDirection: 'column',justifyContent: 'space-between'}}>
                                    <Box sx={{display: 'flex',flexDirection: 'row', justifyContent: 'space-between',marginY: 1,marginX: 1}}>
                                        <Typography>{t("approval_achevement")}</Typography>
                                        <Chip label={t(receivers.senderConfirmation)} sx={{marginX: 1} } />
                                    </Box>
                                    <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'space-between',marginY: 1,marginX: 1}}>
                                        <Typography>{t("achevement_state")}</Typography>
                                        <Chip label={t(receivers.receiverConfirmation)} sx={{marginX: 1} } />                                   
                                    </Box> 
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ maxHeight:400 , overflow : "auto" , marginY : 2 }} className="scrollable">
                            { data && data.map( message => (
                                <Card sx={{ textAlign:"left" , marginY : 1}} key={message.id} >
                                    <CardHeader
                                        avatar={<Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">R</Avatar>}
                                        title={ message.idSender === props.auth.doti && i18next.language === "fr" ? (props.auth.fullnamela) 
                                            : message.idSender === props.auth.doti && i18next.language === "ar" ? (props.auth.fullnamear) 
                                            : receivers.mail.sender.doti === message.idSender && i18next.language === "fr" ? (receivers.mail.sender.fullnamela) 
                                            : (receivers.mail.sender.fullnamear) }
                                        subheader={moment(message.created_at).format('MMMM Do YYYY, hh:mm')}
                                    />
                                    <CardContent>
                                        <MUIRichTextEditor value={message.message} readOnly={true} toolbar={false} />
                                    </CardContent>
                                    <Divider />
                                    <CardActions disableSpacing>
                                    {
                                        message.attachement.map(attach=>(
                                            <a href={'http://localhost:8000/api/'+attach.attachement+'/'+attach.filename} style={{textDecoration: 'none'}}>
                                                <Box sx={{display: 'flex',justifyContent: 'center',alignContent: 'center',height: '3.5em',width: '3.5em'}}>
                                                    <FileIcon extension={attach.type} {...defaultStyles[attach.type]}/>
                                                </Box>
                                            </a>
                                        ))
                                    }
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