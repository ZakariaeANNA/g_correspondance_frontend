import React,{useEffect, useState} from "react";
import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { Button, IconButton ,Tooltip, TextField , CircularProgress } from "@mui/material";
import { Box } from '@mui/system';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {Save} from "@mui/icons-material";
import {Paper } from "@mui/material";
import { t } from 'i18next';
import i18next from 'i18next'
import MenuItem from '@mui/material/MenuItem';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useSnackbar } from 'notistack';
import { useUpdateUserMutation } from "../../store/api/userApi";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import LoadingButton from '@mui/lab/LoadingButton';



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

const EditUser = (props) =>{
 
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const [ departments , setDepartments ] = useState([]);
    const { data : dataDep , isLoading : isLoadingDep , error : errorDep , isError : isErrorDep , isSuccess : isSuccessDep } = useGetDepartmentsQuery("",{skip : !open,});
    
    const { enqueueSnackbar } = useSnackbar();
    const [roles,setRoles] = useState(props.props.roles ? props.props.roles : "admin");
    const handleRoleChange = (event) =>{
        setRoles(event.target.value)
    }
    const [userDepartement,setUserDepartement] = useState(props.props?.departement ? "departement" : "etablissement");
    const handleUserDepartementChange  = (event) => {
      setUserDepartement(event.target.value)
    }
    const [updateUser,{data,error,isLoading,isError,isSuccess}] = useUpdateUserMutation();
    
    const onUpdateUser = (event)=>{
        event.preventDefault();
        const formdata = new FormData(event.currentTarget);
        const body = {
            fullnamear: formdata.get("fullnamear"),
            fullnamela: formdata.get("fullnamela"),
            doti: formdata.get("doti"),
            CIN: formdata.get("CIN"),
            email: formdata.get("email"),
            phone: formdata.get("phone"),
            roles: roles,
            idDepartement: formdata.get("idDepartement"),
            codegresa : formdata.get("codegresa")
        }
        updateUser({body: body ,id: props.props.id})
    }
    useEffect(()=>{
        if(isError){
            if(error.data == "edit_user/fields_required")
                enqueueSnackbar(t("credentials_empty"),  { variant: "error" });
            else if(error.data == "edit_user/user_already_exist")
                enqueueSnackbar(t("user_already_exist"),  { variant: "error" });
            else if(error.data == "edit_user/foreign_not_exist")
                enqueueSnackbar(t("foreign_not_exist"),  { variant: "error" });
        }
        if(isSuccess){
            enqueueSnackbar(t("edit_user_success"),  { variant: "success" });
            props.refetch();
        }
        if(isSuccessDep){
            setDepartments(dataDep.data);
        }
    },[data,error,dataDep]);

    return(
        <>
            <Tooltip title={t("edit_user")}>
                <IconButton aria-label="delete" size="large" onClick={handleClickOpen}> 
                    <ModeEditIcon sx={{ color: 'blue' }}/>
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
                    {t("edit_user")}
                </BootstrapDialogTitle>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    { isLoadingDep ? (
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
                    ):(
                        <form className="p" onSubmit={onUpdateUser}>
                            <Box>
                                <TextField id="outlined-basic" defaultValue={props.props.fullnamela} name='fullnamela' className='inputField' sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} label={t("namefr")} variant="outlined" required disabled={isLoading}/>
                                <TextField id="outlined-basic" defaultValue={props.props.fullnamear} name='fullnamear' className='inputField' sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} label={t("namear")} variant="outlined" required disabled={isLoading}/>
                                <TextField id="outlined-basic" defaultValue={props.props.phone} name='phone' className='inputField' sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} label={t("phone")} variant="outlined" required disabled={isLoading}/>
                                <TextField id="outlined-basic" defaultValue={props.props.cin} name='CIN' className='inputField' sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} label={t("cin")} variant="outlined" required disabled={isLoading}/>
                                <TextField id="outlined-basic" defaultValue={props.props.email} name='email' sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} className='inputField' label={t("email")} variant="outlined" required disabled={isLoading}/>
                                <FormControl className='inputField' sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} required disabled={isLoading}>
                                    <InputLabel id="demo-simple-select-label">{t("departementOrestablishement")}</InputLabel>
                                    <Select
                                        value={userDepartement}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label={t("departementOrestablishement")}
                                        onChange={handleUserDepartementChange}
                                    >
                                        <MenuItem value={'departement'}>Departement</MenuItem>
                                        <MenuItem value={'etablissement'}>Etablissement</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl className='inputField' sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} required disabled={isLoading}>
                                    <InputLabel id="demo-simple-select-label">{t("role")}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label={t("role")}
                                        value={roles}
                                        onChange={handleRoleChange}
                                    >
                                        {userDepartement==="departement" ?
                                        (<MenuItem value={'admin'}>Admin</MenuItem>):
                                        (<MenuItem value={'directeur'}>Directeur</MenuItem>)
                                        }
                                    </Select>
                                </FormControl>
                                <TextField id="outlined-basic" defaultValue={props.props.doti} name='doti' sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} className='inputField' label={t("doti")} variant="outlined" required disabled={isLoading}/>
                                { userDepartement === "departement" ? (
                                    <FormControl className='inputField' sx={{ width : 1/2 , marginY : 1 }} required disabled={isLoading}>
                                        <InputLabel id="demo-simple-select-label">{t("department")}</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label={t("department")}
                                            name="idDepartement"
                                            style={{ textAlign : "start" }}
                                            defaultValue={props.props?.departement?.id}
                                        >
                                        { departments.map( dep => 
                                            <MenuItem value={dep.id} selected={true}>{i18next.language === "fr" ? (dep.nomLa):(dep.nomAr)}</MenuItem>
                                        )}
                                        </Select>
                                    </FormControl>
                                ) : userDepartement === "etablissement" ? (
                                    <TextField id="outlined-basic" defaultValue={props.props?.etablissement?.codegresa} name={"codegresa"} className='inputField' sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} label={t("codeGresa")} variant="outlined" required disabled={isLoading}/>
                                ) : null}
                            </Box>
                            <Box sx={{display:'flex',justifyContent: 'flex-end',alignItems: 'center',paddingTop:2}}>
                                { isLoading ? (
                                    <LoadingButton 
                                        loading 
                                        variant="contained"
                                    >
                                        Submit
                                    </LoadingButton>
                                ) : (
                                    <Button variant='outlined' type='submit' startIcon={<Save />} autoFocus>
                                        {t("save")}
                                    </Button>
                                )}
                            </Box>
                        </form>
                    )}
                </Paper>
            </BootstrapDialog>
        </>
    )
}
export default EditUser