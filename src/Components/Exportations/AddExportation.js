import React,{useEffect,useState} from 'react';
import { useAddExportationsMutation } from "../../store/api/exportationApi";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { useGetEstablishmentsQuery } from '../../store/api/establishementApi';
import { Button, TextField , Paper , Typography } from "@mui/material";
import { Send} from "@mui/icons-material";
import { decodeToken } from "react-jwt";
import { useSnackbar } from 'notistack';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import DropFileInput from '../drop-file-input/DropFileInput';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import i18next from 'i18next';


export default function AddExportation(){
    const [ departments , setDepartments ] = useState([]);
    const [establishment,setEstablishment] = useState([]);
    const [files,setFiles] = useState([]);
    const [tags, setTags] = React.useState([]);
    const [addExportations, { data, isLoading, error, isError, isSuccess }] = useAddExportationsMutation();
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    const { data : dataDep , isLoading : isLoadingDep , error : errorDep , isError : isErrorDep , isSuccess : isSuccessDep } = useGetDepartmentsQuery();
    const { data : dataEsta , isLoading : isLoadingEsta , error : errorEsta , isError : isErrorEsta , isSuccess : isSuccessEsta } = useGetEstablishmentsQuery();
    const removeTags = indexToRemove => {
		setTags([...tags.filter((_, index) => index !== indexToRemove)]);
	};
    const [codeGresa,setCodeGresa] = useState();
    const [idDepartment,setIdDepartment] = useState();
    const handleChooseEstablishment = (event) =>{
        setCodeGresa(event.target.value);
    }
    const handleChooseDepartement = (event)=>{
        setIdDepartment(event.target.value);
    }
    useEffect(()=>{
        if(isSuccess){
            enqueueSnackbar( t('correspondence_success_send') ,  { variant: "success" });
        }
        if(isError){
            if(error.data === "correspondence_add/user_not_found"){
                enqueueSnackbar( t('correspondence_send_user_not_found') ,  { variant: "error" });
            }else if(error.data === "correspondence_add/informations_incorrects"){
                enqueueSnackbar( t('correspondence_informations_incorrects') ,  { variant: "error" });
            }
        }
        if(dataEsta){
            setEstablishment(dataEsta)
        }
        if(dataDep){
            setDepartments(dataDep.data)
        }
    },[data,error,dataDep,dataEsta]);
    const addTags = event => {
        if (event.key === " " && event.target.value !== "") {
            setTags([...tags, { idReceiver : event.target.value.replace(/\s+/g, '') } ]);
            event.target.value = "";
        }
    }
    const onAddExportations = (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        const user = decodeToken(token);
        const formData = new FormData(event.currentTarget);
        formData.append('receiver', JSON.stringify(tags));
        formData.append('sender',user.doti);
        formData.append('file', files[0]);
        addExportations(formData);
        setFiles([]); setTags([]); event.target.reset();
    }
    return (
        <React.Fragment>
            <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'flex-start',paddingBottom:2,alignItems:"center"}}>
                <Typography variant='h6' sx={{fontSize:25 , fontWeight:"bold"}}>{t("sendExportation")}</Typography>
            </Box>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <form onSubmit={onAddExportations} encType="multipart/form-data">
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
                            style={{ fontSize : "1rem" , paddingTop : 2 , paddingBottom : 2}}
                        />
                    </div>
                    <FormControl sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} disabled={isLoading}>
                        <InputLabel id="demo-simple-select-label">{t("departementOrestablishement")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label={t("the_department")}
                                onChange={handleChooseDepartement}
                                name={'department'}
                                style={{textAlign: 'start'}}
                            >
                                {
                                    departments && departments.map(row=>(
                                        <MenuItem key={row.id} value={row.id}>{i18next.language==="fr" ? (row.nomLa) : (row.nomAr)}</MenuItem>
                                    ))
                                }
                                <MenuItem value={'all'}>Tout Les Departements</MenuItem>
                            </Select>
                    </FormControl>
                    <FormControl sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} disabled={isLoading}>
                        <InputLabel id="demo-simple-select-label">{t("departementOrestablishement")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label={t("the_establishment")}
                                onChange={handleChooseEstablishment}
                                name={'codegresa'}
                            >
                                {
                                    establishment && establishment.map(row=>(
                                        <MenuItem key={row.codegresa} value={row.codegresa}>{i18next.language==="fr"? (row.nomla) : (row.nomar)}</MenuItem>)
                                    )
                                }
                                <MenuItem value={'g-scolaire'}>Group-scolaire</MenuItem>
                                <MenuItem value={'primaire'}>Primaires</MenuItem>
                                <MenuItem value={'lycee'}>Lycees</MenuItem>
                                <MenuItem value={'all'}>Tout Les etablissements</MenuItem>
                            </Select>
                    </FormControl>
                    <TextField sx={{ marginY : 1 , width : 3/12 , paddingRight : 1 }} label={t("correspondance_number")} variant="outlined" name="number" required disabled={isLoading} />
                    <TextField sx={{ marginY : 1 , width : 9/12 }} label={t("subject_message")} variant="outlined" name="title" required disabled={isLoading} />
                    <TextField sx={{ marginY : 1 , width : 6/12 , paddingRight : 1 }} fullWidth multiline rows={2} label={t("references")} variant="outlined" name="references" disabled={isLoading} />
                    <TextField sx={{ marginY : 1 , width : 6/12}} fullWidth multiline rows={2} label={t("concerned")} variant="outlined" name="concerned" required disabled={isLoading} />
                    <TextField sx={{ marginY : 1 , width : 8/12 , paddingRight : 1 }} fullWidth label={t("notes")} variant="outlined" rows={4} name="notes" disabled={isLoading} />
                    <TextField sx={{ marginY : 1 , width : 4/12}} id="datetime-local" label={t("achevement_date")} type="datetime-local"defaultValue={new Date("dd-mm-yyyy hh:mm")} name="dateachevement" fullWidth InputLabelProps={{ shrink: true,}} disabled={isLoading} />
                    <TextField sx={{ marginY : 1 }} fullWidth multiline label={t("message")} variant="outlined" rows={4} name="message" required disabled={isLoading} />
                    <DropFileInput
                        files={files}
                        setFiles={setFiles}
                        multiple={false}
                    />
                    <Box sx={{ display : "flex" , justifyContent:"flex-end" , marginTop : 1}}>
                        { isLoading ? (
                            <LoadingButton 
                                loading 
                                variant="contained"
                            >
                                Submit
                            </LoadingButton>
                        ) : (
                            <Button variant='contained' type="submit" startIcon={<Send />} >
                                {t("send")}
                            </Button> 
                        )} 
                    </Box>
                </form> 
            </Paper>
        </React.Fragment>
    );
}
