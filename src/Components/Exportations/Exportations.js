import React,{ useState,useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { Button, DialogContent, IconButton, CircularProgress} from "@mui/material";
import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import {Delete} from "@mui/icons-material";
import { Tooltip } from '@material-ui/core';
import Paper from '@mui/material/Paper';
import { Chat} from "@mui/icons-material";
import { useSelector,useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {useGetExportationBycodeGRESAQuery } from "../../store/api/exportationApi";
import "./Exportations.css";
import moment from 'moment';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ViewExportation from './ViewExportation';
import AddExportation from './AddExportation'
import { t } from 'i18next';

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

function DeleteExportation({params}){
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return(
        <div>
            <Tooltip title={t("delete_correspondance")}>
                <IconButton aria-label="delete" size="large" onClick={handleClickOpen}> 
                        <Delete sx={{ color: 'red' }} color="red" />
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
                    Suprimer Un Exportation
                </BootstrapDialogTitle>
                <DialogContent dividers>
                <Typography>
                    Êtes-vous sûr de vouloir supprimer l'element selectionné
                </Typography>
                </DialogContent>
                <DialogActions>
                <Button variant="contained" color='error' startIcon={<Delete />} autoFocus onClick={handleClose}>
                    Confirmer
                </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}

export default function Exportation(){
    const auth = useSelector( state => state.auth.user );
    const doti = auth.doti
    const [ page , setPage ] = useState(1);
    const [ loading , setLoading ] = useState(false);
    const [rows,setRows] = React.useState([]);
    const {refetch , data, isError, isLoading } = useGetExportationBycodeGRESAQuery({doti:doti,page:page});
    const dispatch = useDispatch();
    const history = useHistory();
    const { t } = useTranslation();
    useEffect(() => {
        dispatch({ type : "checkLogin" , history : history , route : "/auth/"});
        if(data){
            setPage(data.meta.current_page);
            setLoading(false);
            setRows(data.data);
            refetch();
        }
    },[data]);
    const handlePageChange = (newPage) => {
        setPage(newPage + 1);
        setLoading(true);
        refetch();
    }
    const columns = [
        {field: "number",headerName: t('correspondance_number'), flex: 1 ,headerAlign : 'center',align:'center',fontWeight:"bold",renderCell : (params)=>{
            return(
                <Typography>{params.row.number}</Typography>
            )
        }},
        {field: "created_at",headerName: t('sending_date'), flex: 1 ,headerAlign : 'center',align:'center',renderCell : (params)=>{
            const date = moment(params.row.created_at).format('DD-MM-YYYY');
            return(
                <Box>{date}</Box>
            );
        }},
        {field: "title",headerName: t('subject_message'), flex: 3 ,headerAlign : 'center',align:'center'},
        {field: "achevementdate",headerName: t('achevement_date'), flex: 1 ,headerAlign : 'center',align:'center',renderCell : (params)=>{
            const date = moment(params.row.achevementdate).format('DD-MM-YYYY');
            return(
                <Box>{date}</Box>
            );
        }},
        {field: "Actions",headerName: t('actions'), flex: 2 ,headerAlign : 'center',align:'center',renderCell : (params)=>(
            <Box sx={{display: 'flex',flexDirection: 'row',textAlign:"center"}}>
                <ViewExportation params={params.row}/>
                <DeleteExportation params={params.row}/>
                <Link to={"/app/feedback/"+params.row.id} >
                    <Tooltip title="FeedBack">
                        <IconButton aria-label="delete" size="large"> 
                            <Chat />
                        </IconButton>
                    </Tooltip>
                </Link>
            </Box>
        )},        
    ]
    return(
        <React.Fragment>
            <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'flex-start',paddingBottom:2,alignItems:"center"}}>
                <Typography variant='h6' sx={{fontSize:25 , fontWeight:"bold" }}>{t("listExportations")}</Typography>
            </Box>
            {   isLoading ? (
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
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div style={{ height: '60vh', width: '100%' , textAlign: "center",marginTop: '0.5em' }}>
                    <DataGrid
                         rows={rows}
                         columns={columns}
                         pagination
                         pageSize={data.meta.per_page}
                         rowsPerPageOptions={[5]}
                         rowCount={data.meta.total}
                         paginationMode="server"
                         onPageChange={handlePageChange}
                         page={(page - 1)}
                         loading={loading}
                        />
                    </div>
                    <AddExportation />
                </Paper>
            )}
        </React.Fragment>
    )
}