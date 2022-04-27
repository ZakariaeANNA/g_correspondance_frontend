import React,{ useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import FeedbackExport from './FeedbackExport';
import FeedbackImport from './FeedbackImport';
import { useCheckUserInMailQuery } from "../../store/api/feedbackApi";
import { CircularProgress , Box  } from "@mui/material";

  
export default function Feedback(){
    const auth = useSelector( state => state.auth.user );
    const dispatch = useDispatch();
    const history = useHistory();
    const { idemail } = useParams();
    const previousRoute = localStorage.getItem("path");
    const { isLoading , isError } = useCheckUserInMailQuery({ id : idemail , doti : auth.doti });
    
    useEffect(()=>{
        dispatch({ type : "checkLogin" , history : history , route : "/auth/"});
        if(isError){
            history.push("/403");
        }
    },[isError]);

    if( isLoading ){
        return (
            <Box
                sx={{
                    position : "absolute",
                    top : "50%",
                    right : "50%"
                }}
            >
                <CircularProgress/>
            </Box>
        );
    }

    if(previousRoute === "export"){
        return(
            <FeedbackExport idemail={idemail} auth={auth} />
        )
    }else{
        return (
            <FeedbackImport idemail={idemail} auth={auth}/>
        )
    }
}