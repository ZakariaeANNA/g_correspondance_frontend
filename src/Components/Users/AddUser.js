import React ,{useEffect, useState} from 'react'
import MenuItem from '@mui/material/MenuItem';
import { useAddUserMutation } from "../../store/api/userApi";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { Button } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {Save} from "@mui/icons-material";
import { TextField,Typography,Paper,CircularProgress } from "@mui/material";
import { t } from 'i18next';
import i18next from 'i18next'
import { useSnackbar } from 'notistack';
import { Box } from '@mui/system';
import LoadingButton from '@mui/lab/LoadingButton';


export default function Adduser(){
    const [AddUser, { data, isLoading, error, isError, isSuccess }] = useAddUserMutation();
    const { data : dataDep , isLoading : isLoadingDep , error : errorDep , isError : isErrorDep , isSuccess : isSuccessDep } = useGetDepartmentsQuery();
    const { enqueueSnackbar } = useSnackbar();
    const [ departments , setDepartments ] = useState([]);
    const [userDepartement,setUserDepartement] = useState();

    const handleUserDepartementChange  = (event)  =>{
      setUserDepartement(event.target.value)
    }
    const handleUserDepartementSubmit = () => {
      setUserDepartement();
    }
    const onAddUser = (event) =>{
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      formData.append("online",1);
      AddUser(formData);
      event.target.reset();
    }
    useEffect(()=>{
      if(isSuccess){
          enqueueSnackbar( t("add_user_success") ,  { variant: "success" });
      }
      if(isError){
        if(error.data === "register/fields_required")
          enqueueSnackbar(t("credentials_empty"),  { variant: "error" });
        else if(error.data === "register/user_already_exist")
          enqueueSnackbar(t("user_already_exist"),  { variant: "error" });
        else if(error.data === "register/foreign_not_exist")
          enqueueSnackbar(t("foreign_not_exist"),  { variant: "error" });
      }
      if(isSuccessDep){
        setDepartments(dataDep.data);
      }
    },[data,error,dataDep]);
    return (
      <React.Fragment>
          <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'flex-start',paddingBottom:2,alignItems:"center"}}>
            <Typography variant='h6' sx={{fontSize:25 , fontWeight:"bold" }}>{t("addUser")}</Typography>
          </Box>
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
              <form className="p" onSubmit={onAddUser}>
                <Box>
                    <TextField name='fullnamela' sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} label={t("namefr")} variant="outlined" required/>
                    <TextField name='fullnamear' sx={{ width : 1/2 , marginY : 1 }}label={t("namear")} variant="outlined" required/>
                    <TextField name='phone' sx={{ width : 1/3 , paddingInlineEnd : 1 , marginY : 1 }} label={t("phone")} variant="outlined" required/>
                    <TextField name='CIN' sx={{ width : 1/3 , paddingInlineEnd : 1 , marginY : 1 }} label={t("cin")} variant="outlined" required/>
                    <TextField name='doti' sx={{ width : 1/3 , marginY : 1 }}  label={t("doti")} variant="outlined" required/>
                    <TextField name='email' sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} label={t("email")} variant="outlined" required/>
                    <FormControl sx={{ width : 1/2 , marginY : 1 }} required>
                        <InputLabel id="demo-simple-select-label">{t("departementOrestablishement")}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label={t("departementOrestablishement")}
                            onChange={handleUserDepartementChange}
                            onSubmit={handleUserDepartementSubmit}
                            style={{ textAlign : "start" }}
                        >
                            <MenuItem value={'departement'}>Departement</MenuItem>
                            <MenuItem value={'etablissement'}>Etablissement</MenuItem>
                        </Select>
                    </FormControl>
                    { userDepartement === undefined ? (
                      null
                    ):(
                      <FormControl sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} required>
                        <InputLabel id="demo-simple-select-label">{t("role")}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label={t("role")}
                            name="roles"
                        >
                          {userDepartement==="departement" ?
                            (<MenuItem value={'admin'}>Admin</MenuItem>):
                            (<MenuItem value={'directeur'}>Directeur</MenuItem>)
                          }
                        </Select>
                      </FormControl>
                    )}
        
                    { userDepartement === "departement" ? (
                      <FormControl sx={{ width : 1/2 , marginY : 1 }} required>
                        <InputLabel id="demo-simple-select-label">{t("department")}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label={t("department")}
                            name="idDepartement"
                            style={{ textAlign : "start" }}
                        >
                          { departments.map( dep => (
                            <MenuItem value={dep.id}>{i18next.language === "fr" ? (dep.nomLa):(dep.nomAr)}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : userDepartement === "etablissement" ? (
                      <TextField name={"codegresa"} sx={{ width : 1/2  , marginY : 1 }} label={t("codeGresa")} variant="outlined" required/>
                    ) : null}
                  </Box>
                  <Box sx={{display:'flex',justifyContent: 'flex-end' , marginY : 1}}>
                    { isLoading ? (
                        <LoadingButton 
                            loading 
                            variant="contained"
                        >
                            Submit
                        </LoadingButton>
                    ) : (
                      <Button variant='contained' type='submit' startIcon={<Save />}>
                        {t("save")}
                      </Button>
                    )}
                  </Box>
              </form>
            )}
          </Paper>
      </React.Fragment>
    );
  
  }