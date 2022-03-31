import React,{ useState,useEffect } from 'react'
import Paper from '@mui/material/Paper';
import { useSelector,useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, InputLabel } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { decodeToken } from "react-jwt";
import Box from '@mui/material/Box';
import { useGetFeedbackByidAndBysenderQuery,useGetFeedbackByidAndByreceiverMutation,useAddFeedbackMutation } from "../../store/api/feedbackApi";
import { useParams } from 'react-router-dom';
import { CircularProgress } from "@mui/material";
import moment from 'moment';
import { Tooltip } from '@material-ui/core';
import { DialogContent, IconButton , TextField } from "@mui/material";
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import MUIRichTextEditor from 'mui-rte';
import { convertToRaw } from 'draft-js';
import { useSnackbar } from 'notistack';


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

function SendFeedback({id}){
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
    const [ rowsReceiver,setRowsReceiver ] = useState([]);

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
                <SendFeedback id={idemail}/>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Envoyés" value="1" />
                        <Tab label="Recus" value="2" />
                    </TabList>
                    </Box>
                    <TabPanel value="1" sx={{ p:0 }}>
                        <TableContainer>
                            <Table stickyHeader aria-label="sticky table">
                                <TableBody>
                                    { isLoadingSender ? (
                                        <Box
                                            sx={{
                                                p:3
                                            }}
                                        >
                                            <CircularProgress/>
                                        </Box>
                                    ) : (
                                        rowsSender.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id} onClick={()=>console.log(row)}>
                                                        {columns.map((column) => {
                                                            const value = row[column.id];
                                                            return (
                                                                <TableCell key={column.id} align={column.align}>
                                                                    {column.format && typeof value === 'number'
                                                                        ? column.format(value)
                                                                        : !isNaN(Date.parse(value)) ? isToday(moment(value)) ? moment(value).format('HH:mm') : moment(value).format('DD-MM-YYYY') 
                                                                        : value}
                                                                </TableCell>
                                                            );
                                                        })}
                                                    </TableRow>
                                                    );
                                                }
                                            )
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={rowsSender.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />  
                    </TabPanel>
                    <TabPanel value="2" sx={{ p:0 }}>
                        <TableContainer >
                            <Table stickyHeader aria-label="sticky table">
                            <TableBody>
                                    { isLoadingReceiver ? (
                                        <Box
                                            sx={{
                                                p:3
                                            }}
                                        >
                                            <CircularProgress/>
                                        </Box>
                                    ) : (
                                        rowsReceiver.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id} onClick={()=>console.log(row)}>
                                                        {columns.map((column) => {
                                                            const value = row[column.id];
                                                            return (
                                                                <TableCell key={column.id} align={column.align}>
                                                                {column.format && typeof value === 'number'
                                                                    ? column.format(value)
                                                                    : !isNaN(Date.parse(value)) ? isToday(moment(value)) ? moment(value).format('HH:mm') : moment(value).format('DD-MM-YYYY') 
                                                                    : value}
                                                                </TableCell>
                                                            );
                                                        })}
                                                    </TableRow>
                                                    );
                                                }
                                            )
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={rowsReceiver.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />  
                    </TabPanel>
                </TabContext>               
            </Paper>
        </React.Fragment>
    )
}