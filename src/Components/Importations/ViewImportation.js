import React from 'react'
import { t } from 'i18next';
import {FileIcon,defaultStyles} from 'react-file-icon';
import { Typography } from '@mui/material';
import {DialogContent, IconButton, Tooltip , Paper , TextField} from "@mui/material";
import {Visibility } from '@mui/icons-material'; 
import moment from 'moment';
import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import i18next from 'i18next'


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
export default function ViewImportation({params}){
  
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const date = moment(params.created_at).format('DD-MM-YYYY HH:mm');
    const achevelentDate = moment(params.created_at).format('DD-MM-YYYY HH:mm');
    const handleClose = () => {
        setOpen(false);
    };
    return(
        <div>
            <Tooltip title={t("see_exportation")}>
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
                    {t("see_exportation")}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth label={t("correspondance_number")} variant="filled" rows={4} value={params.mail.number} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline label={t("sender")} variant="filled" value={i18next.language === "ar" ? ( params.mail.sender.fullnamela ) : ( params.sender.fullnamear )} inputProps={{ readOnly: true }}/>                                      
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline label={t("sending_date")} variant="filled" value={date} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth label={t("achevement_date")} variant="filled" value={achevelentDate} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline label={t("subject_message")} variant="filled" value={params.mail.title} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline label={t("message")} variant="filled" rows={4} value={params.mail.message} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth label={t("concerned")} variant="filled" rows={4} value={params.mail.concerned} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth label={t("notes")} variant="filled" rows={4} value={params.mail.notes} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth label={t("references")}variant="filled" rows={4} value={params.mail.references} inputProps={{ readOnly: true }}/>
                    <a href={'http://localhost:8000/api/'+params.mail.attachement+'/'+params.mail.fileName} style={{textDecoration: 'none'}}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                alignItems: 'flex-start',
                                flexDirection: 'column'
                            }}
                        >
                            <div style={{width:'4em',height: '4em',display:'flex',justifyContent: 'flex-start',alignItems: 'center'}}>
                                <FileIcon extension={params.mail.type} {...defaultStyles[params.mail.type]}/>
                            </div>
                            <Typography style={{marginTop: 10}}>{params.mail.filename}</Typography>
                        </Paper>
                    </a>
                </DialogContent>
            </BootstrapDialog>
        </div>
    );
}