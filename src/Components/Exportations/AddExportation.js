import React,{useEffect,useState} from 'react';
import { useAddExportationsMutation } from "../../store/api/exportationApi";
import { Button, TextField , Paper , Typography } from "@mui/material";
import { Send} from "@mui/icons-material";
import { decodeToken } from "react-jwt";
import { useSnackbar } from 'notistack';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import DropFileInput from '../drop-file-input/DropFileInput';
import LoadingButton from '@mui/lab/LoadingButton';


export default function AddExportation(){
    const [files,setFiles] = useState([]);
    const [tags, setTags] = React.useState([]);
    const [addExportations, { data, isLoading, error, isError, isSuccess }] = useAddExportationsMutation();
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();

    const removeTags = indexToRemove => {
		setTags([...tags.filter((_, index) => index !== indexToRemove)]);
	};

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
    },[data,error]);

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
    const onFileChange = (files) => {
        setFiles(files);
    }
    return (
        <React.Fragment>
            <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'flex-start',paddingBottom:2,alignItems:"center"}}>
                <Typography variant='h6' sx={{fontSize:25 , fontWeight:"bold" }}>{t("sendExportation")}</Typography>
            </Box>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
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
                    <TextField sx={{ marginY : 1 , width : 3/12 , paddingRight : 1 }} id="outlined-basic" className='inputField' label={t("correspondance_number")} variant="outlined" name="number" required disabled={isLoading} />
                    <TextField sx={{ marginY : 1 , width : 9/12 }} id="outlined-basic" className='inputField' label={t("subject_message")} variant="outlined" name="title" required disabled={isLoading} />
                    <TextField sx={{ marginY : 1 , width : 6/12 , paddingRight : 1 }} id="outlined-basic" fullWidth multiline rows={2} className='inputField' label={t("references")} variant="outlined" name="references" disabled={isLoading} />
                    <TextField sx={{ marginY : 1 , width : 6/12}} id="outlined-basic" fullWidth multiline rows={2} className='inputField' label={t("concerned")} variant="outlined" name="concerned" required disabled={isLoading} />
                    <TextField sx={{ marginY : 1 , width : 8/12 , paddingRight : 1 }} id="outlined-basic" fullWidth className='inputField' label={t("notes")} variant="outlined" rows={4} name="notes" disabled={isLoading} />
                    <TextField sx={{ marginY : 1 , width : 4/12}} id="datetime-local" label={t("achevement_date")} type="datetime-local"defaultValue={new Date("dd-mm-yyyy hh:mm")} name="dateachevement" fullWidth InputLabelProps={{ shrink: true,}} disabled={isLoading} />
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline className='inputField' label={t("message")} variant="outlined" rows={4} name="message" required disabled={isLoading} />
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
                            <Button variant='contained' type="submit" startIcon={<Send />} autoFocus >
                                {t("send")}
                            </Button> 
                        )} 
                    </Box>
                </form> 
            </Paper>
        </React.Fragment>
    );
  
}
