import React from 'react'
import { t } from 'i18next';
import {FileIcon,defaultStyles} from 'react-file-icon';
import { Typography } from '@mui/material';
import {DialogContent, IconButton, Tooltip , Paper , TextField, Container, ListItemButton} from "@mui/material";
import {Visibility } from '@mui/icons-material'; 
import moment from 'moment';
import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import Collapse from "@material-ui/core/Collapse";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Box } from '@mui/system';
import i18next from 'i18next'
import stringAvatar from "../../Util/stringToAvatar";

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
                        <Box style={{display: 'flex',justifyContent: 'flex-start',flexDirection:'row',paddingLeft: '2em',paddingRight: '2em',marginBottom: 10}}>
                            <Avatar {...stringAvatar(params.fullnamela)}></Avatar>
                            <Typography variant='h5' style={{marginTop : 3,marginLeft: 15,marginRight: 15}}>{params.fullnamela}</Typography>
                        </Box>
                        <TableContainer component={Paper} sx={{px:2}}>
                            <Table sx={{ minWidth: '60%' }} aria-label="simple table">
                                <TableBody>
                                    <TableRow>
                                        <TableCell style={{ fontWeight : "bold" }}>{t("doti")}</TableCell>
                                        <TableCell component="th" scope="row">
                                            {params.doti}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ fontWeight : "bold" }}>{t("email")}</TableCell>
                                        <TableCell component="th" scope="row">
                                            {params.email}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ fontWeight : "bold" }}>{t("phone")}</TableCell>
                                        <TableCell component="th" scope="row">
                                            {params.phone}
                                        </TableCell>
                                    </TableRow>
                                    {params.etablissement==null ? (<><TableRow>
                                        <TableCell style={{ fontWeight : "bold" }}>{t("departementName")}</TableCell>
                                        <TableCell component="th" scope="row">
                                            {params.departement.nomLa}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ fontWeight : "bold" }}>{t("departementType")}</TableCell>
                                        <TableCell component="th" scope="row">
                                            {params.departement.type}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ fontWeight : "bold" }}>{t("delegation")}</TableCell>
                                        <TableCell component="th" scope="row">
                                            {params.departement.delegation}
                                        </TableCell>
                                    </TableRow>
                                    </>):(
                                        <>
                                    <TableRow>
                                        <TableCell style={{ fontWeight : "bold" }}>{t("establishementName")}</TableCell>
                                        <TableCell component="th" scope="row">
                                            {params.etablissement.nomla}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ fontWeight : "bold" }}>{t('establishementName')}</TableCell>
                                        <TableCell component="th" scope="row">
                                            {params.etablissement.type}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ fontWeight : "bold" }}>{t('delegation')}</TableCell>
                                        <TableCell component="th" scope="row">
                                            {params.etablissement.delegation}
                                        </TableCell>
                                    </TableRow>
                                    </>)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}
export default function ViewExportation({params}){
  
    const [open, setOpen] = React.useState(false);
    const achevelentDate = moment(params.achevementdate).format('DD-MM-YYYY HH:mm');
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
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth label={t("correspondance_number")} variant="filled" rows={4} value={params.number} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth label={t("sender")} variant="filled" value={i18next.language === "fr" ? ( params.sender.fullnamela ) : ( params.sender.fullnamear )} inputProps={{ readOnly: true }}/>                                      
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth label={t("sending_date")} variant="filled" value={date} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth label={t("achevement_date")} variant="filled" value={achevelentDate} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth label={t("subject_message")} variant="filled" value={params.title} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline label={t("message")} variant="filled" rows={4} value={params.message} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth label={t("concerned")} variant="filled" rows={4} value={params.concerned} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth label={t("notes")} variant="filled" rows={4} value={params.notes} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth label={t("references")} variant="filled" rows={4} value={params.references} inputProps={{ readOnly: true }}/>
                    {/*show users content*/}
                    <Grid item variant='filled' id='outlined-basic'>
                        <div>
                            <List
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                            >
                                <ListItemButton onClick={handleClick} className={classes.color}>
                                    <ListItemText primary={t("receivers")} />
                                    {display ? <ExpandLessIcon /> : <ExpandMoreIcon />} 
                                </ListItemButton>                                   
                                <Collapse in={display} timeout="auto" unmountOnExit >
                                    <List component="div" disablePadding>
                                        {
                                            params.receiver.map(email=>(
                                                email.receiver.map(receive=>(
                                                    <ListItem key={receive.doti}> 
                                                        <ListItem>
                                                            <ListItemText
                                                                primary={<Typography>{receive.fullnamela}</Typography>}
                                                            />
                                                        </ListItem>
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

