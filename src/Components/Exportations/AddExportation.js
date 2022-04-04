import React,{useEffect,useState} from 'react';
import { useAddExportationsMutation } from "../../store/api/exportationApi";
import { Button, DialogContent, IconButton , TextField } from "@mui/material";
import { Send} from "@mui/icons-material";
import SendIcon from '@mui/icons-material/Send';
import { decodeToken } from "react-jwt";
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';

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
export default function AddExportation(){
    const [open, setOpen] = useState(false);
    const [files,setFiles] = useState();
    const [tags, setTags] = React.useState([]);
    const [addExportations, { data, isLoading, error, isError, isSuccess }] = useAddExportationsMutation();
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
    const [AchevementDate,setAchevementDate] = React.useState(new Date())
    const handleDateChange = (newAchevementDate)=>{
        setAchevementDate(newAchevementDate);
    }
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
        console.log(event.currentTarget)
        event.preventDefault();
        const token = localStorage.getItem("token");
        const user = decodeToken(token);
        const formData = new FormData(event.currentTarget);
        formData.append('receiver', JSON.stringify(tags));
        formData.append('sender',user.doti);
        formData.append('file', files);
        addExportations(formData);
       
    }
    return (
      <div>
        <Box sx={{ justifyContent:"flex-end", display:"flex" ,paddingTop:2}} onClick={handleClickOpen}>
            <Button variant="outlined" endIcon={<SendIcon />} >
                {t("sendExportation")}
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
                    {t("sendExportation")}
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
                            placeholder={t("doti")}
                        />
                    </div>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth className='inputField' label={t("subject_message")} variant="outlined" name="title" required/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth className='inputField' label={t("references")} variant="outlined" rows={4} name="references"/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth className='inputField' label={t("concerned")} variant="outlined" rows={4} name="concerned" required/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth  className='inputField' label={t("notes")} variant="outlined" rows={4} name="notes"/>
                    <TextField id="datetime-local" label={t("achevement_date")} type="datetime-local"defaultValue={new Date("dd-mm-yyyy hh:mm")} name="dateachevement" fullWidth InputLabelProps={{ shrink: true,}}/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline className='inputField' label={t("message")} variant="outlined" rows={4} name="message" required/>
                    <input type="file" name="ffff" onChange={changeFile} required/>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' type="submit" startIcon={<Send />} autoFocus >
                        {t("send")}
                    </Button>
                </DialogActions>
            </form> 
        </BootstrapDialog>
      </div>
    );
  
}
