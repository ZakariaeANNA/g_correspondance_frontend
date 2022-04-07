import React ,{useEffect, useState} from 'react'
import MenuItem from '@mui/material/MenuItem';
import { useAddUserMutation } from "../../store/api/userApi";
import { Button } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {Save} from "@mui/icons-material";
import { TextField,Typography,Paper } from "@mui/material";
import { t } from 'i18next';
import i18next from 'i18next'
import { useSnackbar } from 'notistack';
import { Box} from '@mui/system';



export default function Adduser(){
    const [AddUser, { data, isLoading, error, isError, isSuccess }] = useAddUserMutation();
    const { enqueueSnackbar } = useSnackbar();
    const [roles,setRoles] = useState("admin");
    const handleRoleChange = (event) =>{
        setRoles(event.target.value)
    }
    const [userDepartement,setUserDepartement] = useState("departement")
    const handleUserDepartementChange  = (event)  =>{
      setUserDepartement(event.target.value)
    }
    const onAddUser = (event) =>{
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      formData.append('roles',roles);
      formData.append("online",1);
      AddUser(formData);
    }
    useEffect(()=>{
      if(isSuccess){
          enqueueSnackbar( "user has been created successfully",  { variant: "success" });
      }
      if(isError){
          console.log(error)
          enqueueSnackbar("problem accured while saving data",  { variant: "error" });
      }
    },[data,error]);
    return (
      <React.Fragment>
          <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'flex-start',paddingBottom:2,alignItems:"center"}}>
            <Typography variant='h6' sx={{fontSize:25 , fontWeight:"bold" }}>{t("addUser")}</Typography>
          </Box>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <form className="p" onSubmit={onAddUser}>
              <Box>
                  <TextField id="outlined-basic" name='fullnamela' className='inputField' style={i18next.language === 'fr' ? {width: '49.5%',marginTop: '0.5em'} : {width: '49.5%',marginTop: '0.5em',marginLeft: '1%'}} label={t("namefr")} variant="outlined" required/>
                  <TextField id="outlined-basic" name='fullnamear' className='inputField' style={i18next.language === 'fr' ? {width: '49.5%',marginTop: '0.5em',marginLeft: '1%'} : {width: '49.5%',marginTop: '0.5em'}} label={t("namear")} variant="outlined" required/>
                  <TextField id="outlined-basic" name='phone' className='inputField' style={i18next.language === 'fr' ? {width: '49.5%',marginTop: '0.5em'} : {width: '49.5%',marginTop: '0.5em',marginLeft: '1%'}} label={t("phone")} variant="outlined" required/>
                  <TextField id="outlined-basic" name='CIN' className='inputField' style={i18next.language === 'fr' ? {width: '49.5%',marginTop: '0.5em',marginLeft: '1%'} : {width: '49.5%',marginTop: '0.5em'}} label={t("cin")} variant="outlined" required/>
                  <TextField id="outlined-basic" name='email' style={i18next.language === 'fr' ? {width: '49.5%',marginTop: '0.5em'} : {width: '49.5%',marginTop: '0.5em',marginLeft: '1%'}} className='inputField' label={t("email")} variant="outlined" required/>
                  <TextField id="outlined-basic" name='doti' style={i18next.language === 'fr' ? {width: '49.5%',marginTop: '0.5em',marginLeft: '1%'} : {width: '49.5%',marginTop: '0.5em'}} className='inputField'  label={t("doti")} variant="outlined" required/>
                  <FormControl className='inputField' style={i18next.language === 'fr' ? {width: '49.5%',marginTop: '0.5em'} : {width: '49.5%',marginTop: '0.5em',marginLeft: '1%'}} required>
                      <InputLabel id="demo-simple-select-label">{t("departementOrestablishement")}</InputLabel>
                      <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label={t("departementOrestablishement")}
                          onChange={handleUserDepartementChange}
                      >
                          <MenuItem value={'departement'}>Departement</MenuItem>
                          <MenuItem value={'etablissement'}>Etablissement</MenuItem>
                      </Select>
                  </FormControl>
                  <FormControl className='inputField' style={i18next.language === 'fr' ? {width: '49.5%',marginTop: '0.5em',marginLeft: '1%'} : {width: '49.5%',marginTop: '0.5em'}} required>
                      <InputLabel id="demo-simple-select-label">{t("role")}</InputLabel>
                      <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label={t("role")}
                          onChange={handleRoleChange}
                      >
                        {userDepartement==="departement" ?
                          (<MenuItem value={'admin'}>Admin</MenuItem>):
                          (<MenuItem value={'directeur'}>Directeur</MenuItem>)
                        }
                      </Select>
                  </FormControl>
                  <TextField id="outlined-basic" name={userDepartement==="departement"? "idDepartement" : "codegresa"} className='inputField' style={i18next.language=='fr' ? {width: '49.5%',marginTop: '0.5em',marginRight:'100%'}:{width: '49.5%',marginTop: '0.5em',marginLeft:'100%'}} label={userDepartement==="departement" ? t("idDepartement") : t("codeGresa")} variant="outlined" required/>
                </Box>
                <Box sx={{display:'flex',justifyContent: 'flex-end',alignItems: 'center'}}>
                  <Button variant='contained' type='submit' startIcon={<Save />} autoFocus>
                    {t("save")}
                  </Button>
                </Box>
            </form>
          </Paper>
      </React.Fragment>
    );
  
  }