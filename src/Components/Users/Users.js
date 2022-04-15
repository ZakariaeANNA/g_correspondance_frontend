import React,{useEffect} from 'react';
import { DataGrid } from "@mui/x-data-grid";
import {LockReset} from "@mui/icons-material";
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import { Button, DialogContent, IconButton,Tooltip,CircularProgress,Paper } from "@mui/material";
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { TextField } from "@mui/material";
import './Users.css';
import {useGetAllUsersQuery, useResetPasswordMutation } from "../../store/api/userApi";
import { Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { t } from 'i18next';
import { AddCircle } from "@mui/icons-material";
import i18next from 'i18next';
import ViewUser from './ViewUser';
import { Box } from '@mui/system';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import EditUser from './EditUser';



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
function ResetUserPassword({params}){

  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
      setOpen(false);
  };
  const [resetPassword, {data,isLoading,error,isError,isSuccess}] = useResetPasswordMutation()
  const handleResetClick = () =>{
    resetPassword({doti: params.doti,cin: params.cin})
    setOpen(false);
  }
  useEffect(()=>{
    if(isError)
      enqueueSnackbar("une erreur survenue l'ors de la reinitialisation de mot de passe",  { variant: "error" });
    if(isSuccess)
      enqueueSnackbar("le mot de pass a ete reinitialiser avec succe",  { variant: "success" });
  },[data,error])
  return(
      <div>
        <Tooltip title={t("reset_password_tip")}>
          <IconButton aria-label="delete" size="large" onClick={handleClickOpen}> 
                <LockReset color="red" />
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
            {t("reset_password_tip")}
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Typography>
               {t("confirm_reset_message")} <strong>{i18next.language==="fr" ? params.fullnamela : params.fullnamear}</strong>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" startIcon={<LockReset />} autoFocus onClick={handleResetClick}>
              {t("confirm")}
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </div>
  );
}
export default function Users(){
  const {data, isLoading , refetch } = useGetAllUsersQuery(); 
  const [rows,setRows] = React.useState([]); 
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch({ type : "checkLogin" , history : history , route : "/auth/"});
    if(data){
        setRows(data.data);
    }
  },[data]);
  const columns = [
    {field: "doti",headerName: t("doti"), flex: 1 ,headerAlign : 'center',align: 'center',renderCell : (params)=>(
      <Box>{params.row.doti}</Box>
    )},
    {field: "nom",headerName: t("name"), flex: 1 ,headerAlign : 'center',align: 'center',renderCell : (params)=>(
      <Box>{i18next.language==="fr" ? params.row.fullnamela : params.row.fullnamear}</Box>
    )},
    {field: "nameEtab",headerName: t("departement"), flex: 1 ,headerAlign : 'center',align: 'center',renderCell:(params)=>(
      <Box>{i18next.language==="fr" ? params.row.departement?.nomLa : params.row.departement?.nomAr}{i18next.language==="fr"?params.row.etablissement?.nomla:params.row.etablissement?.nomar}</Box>
    )},
    {field: "actions",headerName: t("actions"), flex: 1 ,headerAlign : 'center',align: 'center',renderCell:(params)=>(
      <div style={{display:'flex',flexDirection: 'row'}}>
        <ViewUser params={params.row}/>
        <EditUser props={params.row} refetch={refetch} />
        <ResetUserPassword params={params.row}/>
      </div>
    )},
  ]
  function FilterInputSearch(inputVlaue){
    let filtered = data?.data?.filter((row)=>(
      row.fullnamela.toLowerCase().includes(inputVlaue.toLowerCase()) || row.fullnamear.includes(inputVlaue)
    ))
    if(filtered){
      setRows(filtered);
    }
   
  }
  function FilterSelect(event){
    if(event.target.value!=='all'){
      let filtered = data?.data?.filter((row)=>(
        row.etablissement?.type===event.target.value || row.departement?.type===event.target.value
      ));
      setRows(filtered)
    }else{
      setRows(data.data)
    }
  }
  return (
    <React.Fragment>
      <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'flex-start',paddingBottom:2,alignItems:"center"}}>
          <Typography variant='h6' sx={{fontSize:25 , fontWeight:"bold" }}>{t("listUsers")}</Typography>
      </Box>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Box className='searchBar'>
            <TextField id="outlined-basic" className='inputField' style={i18next.language==="fr" ? {marginRight:'1%',width: '49%'}: {marginLeft:'1%',width: '49%'}} onChange={(text)=>FilterInputSearch(text.target.value)} label={t("name_search")} variant="outlined"/>
            <FormControl fullWidth className='inputField' style={i18next.language==="fr" ? {marginLeft:'1%',width: '49%'}: {marginRight:'1%',width: '49%'}}>
                <InputLabel id="demo-simple-select-label">{t("type_search")}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label={t("type_search")}
                    onChange={FilterSelect}
                    style={{ textAlign : "start" }}
                >
                    <MenuItem value={'all'}>Tous les Etablissements</MenuItem>
                    <MenuItem value={'GroupeScolaire'}>G-Scolaire</MenuItem>
                    <MenuItem value={'Administrative'}>Adminstration</MenuItem>
                </Select>
            </FormControl>
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
                pageSize={5}
                disableSelectionOnClick
              />
            </Box>
        )}
        <div className='addUserSection'>
          <Link to="/app/adduser" style={{textDecoration: 'none'}}>
            <Button variant="outlined" startIcon={<AddCircle />}>
              {t("addUser")}
            </Button>
          </Link>
        </div>
      </Paper>
    </React.Fragment>
  );
}