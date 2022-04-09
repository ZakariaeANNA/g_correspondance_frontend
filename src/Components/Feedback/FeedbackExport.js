import React,{ useState,useEffect} from 'react'
import Paper from '@mui/material/Paper';
import { Button, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import { useAddFeedbackMutation,useConfirmMailByReceiverMutation,useConfirmMailBySenderMutation,useGetFeedbackBymailAndBysenderAndByreceiverMutation } from "../../store/api/feedbackApi";
import moment from 'moment';
import { Tooltip } from '@material-ui/core';
import { DialogContent, IconButton , ListItemButton  } from "@mui/material";
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import MUIRichTextEditor from 'mui-rte';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { convertToRaw } from 'draft-js';
import { useSnackbar } from 'notistack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import i18next from 'i18next'
import { t } from 'i18next';
import {FileIcon,defaultStyles} from 'react-file-icon';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import AddComment from '@mui/icons-material/AddComment';
import DropFileInput from '../drop-file-input/DropFileInput';
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
    
    const [value,setValue] = React.useState('');
    const [ approval , setApproval ] = useState();
    
    const handleDataChange = (event)=>{
        const plainText = event.getCurrentContent().getPlainText() // for plain text
        const rteContent = convertToRaw(event.getCurrentContent()) // for rte content with text formating
        rteContent && setValue(JSON.stringify(rteContent)) // store your rteContent to state
    }
    
    const [addFeedback, { data , isLoading, error, isError, isSuccess }] = useAddFeedbackMutation();
    const [confirmMailBySender , {}] = useConfirmMailBySenderMutation();

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
        setValue('');
    }

    const { enqueueSnackbar } = useSnackbar();

    useEffect(()=>{
        if(isSuccess){
            if(approval != null){
                confirmMailBySender({ idReceiver : props.receiver.doti , mail_id : props.mailID , state : approval});
                setApproval();
            }
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
                    {   ["pending","unfinished"].includes(props.confirmReceiver) ? (
                        null
                    ):(
                        <FormControl sx={{ border : "1px solid #d6d8da" , padding : "4px 14px 4px 14px" , borderRadius : "6px"}} fullWidth>
                            <FormLabel id="demo-row-radio-buttons-group-label">{t("approval_achevement")}</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                onChange={(event)=>setApproval(event.target.value)}
                            >
                                <FormControlLabel value="notcomplet" control={<Radio />} label={t("notcomplet")} />
                                <FormControlLabel value="approved" control={<Radio />} label={t("approved")} />
                            </RadioGroup>
                        </FormControl>
                    )}
                    <Box sx={{ padding: 1 , border : 1 , borderRadius : "6px" , borderColor : "#d6d8da" ,paddingBottom: 6 , marginY : 2}}>
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
    const [onUpdateConfirmationBySender,{}] = useConfirmMailBySenderMutation();
    const [onUpdateConfirmationByReceiver,{}] = useConfirmMailByReceiverMutation();

    moment.locale(i18next.language === "ar" ? ("ar-ma"):("fr"));

    useEffect(()=>{
        if(isSuccess){
            setMessage(data);
        }
    },[isSuccess]);
    const [confirmSender,setConfirmSender] = React.useState('pending');
    const [confirmReceiver,setConfirmReceiver] = React.useState('pending');
    const handleConversation = (receiver,confirmationSender,confirmationReceiver) => {
        setConfirmSender(confirmationSender)
        setConfirmReceiver(confirmationReceiver)
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
                                        <Chip label={t(receiver.receiverConfirmation)} />
                                    )
                                } 
                                key={receiver.id} 
                                onClick={()=>handleConversation(receiver.receiver[0],receiver.senderConfirmation,receiver.receiverConfirmation)}
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
                                <SendFeedback mailID={props.idemail} sender={props.auth.doti} receiver={receiverDisplay} confirmReceiver={confirmReceiver} />
                                <Divider orientation="vertical" flexItem />
                                <Box sx={{display: 'flex',flexDirection: 'row', justifyContent: 'space-between',marginY: 1,marginX: 1 , alignItems:"center"}}>
                                    <Typography>{t("approval_achevement")}</Typography>
                                    <Chip label={t(confirmSender)} sx={{marginX: 1} } />
                                </Box>
                                <Divider orientation="vertical" flexItem />
                                <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'space-between',marginY: 1,marginX: 1 , alignItems:"center"}}>
                                    <Typography>{t("achevement_state")}</Typography>
                                    <Chip label={t(confirmReceiver)} sx={{marginX: 1} } />                                   
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
                                            : receiverDisplay.doti === message.idSender && i18next.language === "fr" ? (receiverDisplay.fullnamela) 
                                            : (receiverDisplay.fullnamear) }
                                        subheader={moment(message.created_at).format('MMMM Do YYYY, HH:mm')}
                                    />
                                    <CardContent>
                                        <ThemeProvider theme={defaultTheme}>
                                            <MUIRichTextEditor value={message.message} readOnly={true} toolbar={false} />
                                        </ThemeProvider>
                                    </CardContent>
                                    <Divider />
                                    <CardActions sx={{ p:2 }}>
                                    {
                                        message.attachement.map(attach=>(
                                            <Tooltip title={attach.filename} arrow>
                                                <a href={'http://localhost:8000/api/'+attach.attachement+'/'+attach.filename} style={{textDecoration: 'none'}}>
                                                        <Box sx={{display: 'flex',justifyContent: 'center',alignContent: 'center',height: '3.5em',width: '3.5em'}}>
                                                                <FileIcon extension={attach.type} {...defaultStyles[attach.type]}/>
                                                        </Box>
                                                </a>
                                            </Tooltip>
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