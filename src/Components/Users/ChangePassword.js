import { Box, Button, Typography } from '@mui/material'
import { Save } from '@mui/icons-material'
import { TextField,Paper } from '@mui/material'
import React, { useEffect } from 'react'
import { t } from 'i18next';
import { useSelector} from 'react-redux';
import {useChangePasswordMutation } from "../../store/api/userApi";
import { useSnackbar } from 'notistack';
import i18next from 'i18next'
import Divider from '@mui/material/Divider';


const ChangePassword =  () =>{
    const { enqueueSnackbar } = useSnackbar();
    const auth = useSelector( state => state.auth.user );
    const [oldPassword,setOldPassword] = React.useState("");
    const [newPassword,setNewPassword] = React.useState("");
    const [retypePassword,setRetypePassword] = React.useState("");
    const [onPasswordChange,{ data, isLoading, error, isError, isSuccess}] = useChangePasswordMutation()
    const handleSaveButton = () =>{
        if(newPassword.length <= 8){
            enqueueSnackbar( t("password_length_error"),  { variant: "error" });

        }else{
            if(newPassword!==retypePassword){
                enqueueSnackbar(t("password_match_error"),  { variant: "error" });
            }else{
                onPasswordChange({doti:auth.doti,password: newPassword,currentPassword: oldPassword});
            }
        }
    }
    useEffect(()=>{
        if(isError){
            enqueueSnackbar(t("password_incorrect"),  { variant: "error" });
        }
        if(isSuccess){
            enqueueSnackbar(t("password_changed"),  { variant: "success" });
        }
    },[data,error])
    return(
        <React.Fragment>
            <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'flex-start',paddingBottom:2,alignItems:"center"}}>
                <Typography variant='h6' sx={{fontSize:25 , fontWeight:"bold" }}>{t("welcome")} {i18next.language==="fr" ? auth.fullnamela : auth.fullnamear}</Typography>
            </Box>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column',justifyContent: 'space-between' }}>
                    <Box sx={{display: 'flex',justifyContent: 'flex-start',alignContent: 'center',paddingBottom: 2}}>
                        <Typography variant='h5' component='p'>
                            {t("change_password")}
                        </Typography>
                    </Box>
                    <Divider variant='fullWidth' component="hr"/>
                    <Box sx={{marginTop: 3,width: '50vw'}}>
                        <TextField id="outlined-basic" type={"password"} sx={{marginY: 1}} onChange={e=>setOldPassword(e.target.value)} name="oldpassword" fullWidth className='inputField' label={t("old_password")} variant="outlined" required/>
                        <TextField id="outlined-basic" type={"password"} sx={{marginY: 1}} onChange={e=>setNewPassword(e.target.value)} name="newpassword" fullWidth className='inputField' label={t("new_password")} variant="outlined" required/>
                        <TextField id="outlined-basic" type={"password"} sx={{marginY: 1}} onChange={e=>setRetypePassword(e.target.value)} className='inputField' fullWidth label={t("retype_password")} variant="outlined" required/>
                        <Box sx={{display:'flex',justifyContent: 'flex-end'}}>
                            <Button variant='contained' onClick={handleSaveButton} startIcon={<Save />} >
                                {t("save")}
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{display: 'flex',justifyContent: 'center',alignContent: 'center',p:3}}>
                        <Typography style={{color: "#FF0033"}}>
                            {t("password_condition")}
                        </Typography>
                    </Box>
            </Paper>
        </React.Fragment>
    )
}

export default ChangePassword