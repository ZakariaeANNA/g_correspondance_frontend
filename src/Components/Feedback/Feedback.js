import React,{ useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import FeedbackExport from './FeedbackExport';
import FeedbackImport from './FeedbackImport';

  
export default function Feedback(){
    const auth = useSelector( state => state.auth.user );
    const dispatch = useDispatch();
    const history = useHistory();
    const { idemail } = useParams();
    const previousRoute = localStorage.getItem("path");
    useEffect(()=>{
        dispatch({ type : "checkLogin" , history : history , route : "/auth/"});
    },[]);

    if(previousRoute === "export"){
        return (
            <FeedbackExport idemail={idemail} auth={auth} />
        )
    }else{
        return (
            <FeedbackImport idemail={idemail} auth={auth} />
        )
    }
}