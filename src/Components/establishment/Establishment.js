import React,{useEffect, useState} from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { CircularProgress,Paper } from "@mui/material";
import { TextField , Button } from "@mui/material";
import { useGetEstablishmentsQuery } from "../../store/api/establishementApi";
import { Typography } from '@mui/material';
import { t } from 'i18next';
import i18next from 'i18next';
import { Box } from '@mui/system';
import { useDispatch , useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import UpdateEstablishment from './UpdateEstablishment';
import RemoveEstablishment from './RemoveEstablishment';
import AddEstablishment from './AddEstablishment';
import Modal from '@mui/material/Modal';
import { AddCircle, PropaneSharp } from "@mui/icons-material";
import Divider from '@mui/material/Divider';
import { useSnackbar } from 'notistack';
import { DialogContent } from "@mui/material";
import { styled } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import DialogActions from '@mui/material/DialogActions';
import { useAddEstablishmentMutation } from "../../store/api/establishementApi";

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

function ConfirmationFile(props){
    const { enqueueSnackbar } = useSnackbar();
    const [addEstablishment,{data,error,isLoading,isError,isSuccess}] = useAddEstablishmentMutation();
    const handleClickOpen = () => {
        props.setOpen(true);
    };
    const handleClose = () => {
        props.setOpen(false);
    };
  
    const handleResetClick = () =>{
      const formData = new FormData();
      formData.append("file",props.file);
      addEstablishment(formData);
      handleClose();
    }
  
    useEffect(()=>{
      if(isError){
          if(error.data === "add_establishment/fields_required")
              enqueueSnackbar(t("credentials_empty"),  { variant: "error" });
          else if(error.data === "add_establishment/establishment_already_exist")
              enqueueSnackbar(t("establishment_already_exist"),  { variant: "error" });
      }
      if(isSuccess){
          enqueueSnackbar(t("edit_user_success"),  { variant: "success" });
          props.refetch();
      }
    },[data,error]);
  
    return(
        <>
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
            fullWidth
            maxWidth="sm" 
          >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
              {t("confirmationfile")}
            </BootstrapDialogTitle>
            <DialogContent dividers>
              <Typography>
                 {t("confirm_send_file_eta" , { name : props.file.name })}
              </Typography>
            </DialogContent>
            <DialogActions> 
              <Button variant="outlined" color='error' type='submit' autoFocus onClick={handleResetClick}>
                {t("send")}
              </Button>
            </DialogActions>
          </BootstrapDialog>
        </>
    );
}

export default function Establishment(){
  const { data, isLoading , refetch } = useGetEstablishmentsQuery(); 
  const user = useSelector( state => state.auth.user );
  const [rows,setRows] = React.useState([]); 
  const dispatch = useDispatch();
  const [ openConfirmation , setOpenConfirmation ] = useState(false);
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const hiddenFileInput = React.useRef(null);
  const [ file , setFile ] = useState([]);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    justifyContent : "center",
    alignContent : "center"
  };

  useEffect(() => {
    dispatch({ type : "checkLogin" , history : history , route : "/auth/"});
    if(data){
        setRows(data);
    }
  },[data]);
  
  const columns = [
    {field: "codegresa",headerName: t("codegresa"), flex: 2 ,headerAlign : 'center',align: 'center',renderCell : (params)=>(
      <Box>{params.row.codegresa}</Box>
    )},
    {field: "name",headerName: t("nomEstablishment"), flex: 2 ,headerAlign : 'center',align: 'center',renderCell : (params)=>(
      <Box>{i18next.language==="fr" ? params.row.nomla : params.row.nomar}</Box>
    )},
    {field: "delegation",headerName: t("delegation"), flex: 2 ,headerAlign : 'center',align: 'center',renderCell : (params)=>(
      <Box>{params.row.delegation}</Box>
    )},
    {field: "type",headerName: t("type"), flex: 2 ,headerAlign : 'center',align: 'center',renderCell:(params)=>(
      <Box>{t(params.row.type)}</Box>
    )},
    {field: "action" ,headerName : "" , flex: 1 ,headerAlign : 'center',align: 'center',renderCell:(params)=>(
      <div style={{display:'flex',flexDirection: 'row'}}>
        <UpdateEstablishment establishment={params.row} refetch={refetch} />
        <RemoveEstablishment establishment={params.row} refetch={refetch} />
      </div>
    )},
  ]
  function FilterInputSearch(inputValue){
    let filtered = data.filter((row)=>(
      row.nomla.toLowerCase().includes(inputValue.toLowerCase()) || row.nomar.includes(inputValue)
    ));
    if(filtered){
      setRows(filtered);
    }
  }

  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    setFile(fileUploaded);
    setOpenConfirmation(true);
  };

  return (
    <React.Fragment>
      <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'flex-start',paddingBottom:2,alignItems:"center"}}>
          <Typography variant='h6' sx={{fontSize:25 , fontWeight:"bold" }}>{t("listUsers")}</Typography>
      </Box>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Box className='searchBar'>
            <TextField id="outlined-basic" className='inputField' fullWidth onChange={(text)=>FilterInputSearch(text.target.value)} label={t("name_search_eta")} variant="outlined"/>
        </Box>
        {isLoading ?(
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
        ) : (
            <Box sx={{ height: '60vh', width: '100%' , textAlign: "center" , marginY : 2 }}>
              <DataGrid
                rows={rows}
                columns={columns}
                rowsPerPageOptions={[5]}
                pageSize={5}
                disableSelectionOnClick
              />
            </Box>
        )}
        <div className='addUserSection'>
            <Button variant="outlined" startIcon={<AddCircle />} onClick={handleOpen}>
              {t("addEta")}
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <AddEstablishment refetch={refetch} />
                    <Divider sx={{ paddingY : 1 , color : "black"}}>{t("or")}</Divider>
                    <Button variant="outlined" onClick={handleClick} fullWidth>
                        {t("addEtawithfile")}
                    </Button>
                    <input
                        type="file"
                        ref={hiddenFileInput}
                        onChange={handleChange}
                        style={{display: 'none'}}
                        accept=".csv, .xls, .xlsx, text/csv, application/csv,
                        text/comma-separated-values, application/csv, application/excel,
                        application/vnd.msexcel, text/anytext, application/vnd. ms-excel,
                        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    /> 
                    <ConfirmationFile setOpen={setOpenConfirmation} open={openConfirmation} file={file} refetch={refetch} />
                </Box>
            </Modal>
        </div>
      </Paper>
    </React.Fragment>
  );
}