import React,{ useState,useEffect } from 'react'
import Paper from '@mui/material/Paper';
import { useSelector,useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import { useGetFeedbackByidAndBysenderQuery,useGetFeedbackByidAndByreceiverMutation } from "../../store/api/feedbackApi";
import { useParams } from 'react-router-dom';
import { CircularProgress } from "@mui/material";
import moment from 'moment';


const columns = [
    { id: 'message', label: 'Message', minWidth: 170 },
    {
      id: 'idSender',
      label: 'Sender',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'created_at',
      label: 'Date',
      minWidth: 170,
      align: 'right',
      format: (value) => moment(value).format('DD-MM-YYYY'),
      renderCell : (value) => moment(value).format('DD-MM-YYYY')
    }
];
  
  
export default function Feedback(){
    const auth = useSelector( state => state.auth.user );
    const dispatch = useDispatch();
    const history = useHistory();
    const { idemail } = useParams();
    const { data : dataSender, 
            isError , 
            isLoading : isLoadingSender} = useGetFeedbackByidAndBysenderQuery({ id:idemail , user : auth.codeGRESA});
    const [ getFeedbackByidAndByreceiver , 
            { data : dataReceiver, 
              isLoading : isLoadingReceiver,
              isSuccess : isSuccessReceiver }] = useGetFeedbackByidAndByreceiverMutation(); 
    const [ rowsSender,setRowsSender ] = useState([]);
    const [ rowsReceiver,setRowsReceiver ] = useState([]);

    useEffect(() => {
        dispatch({ type : "checkLogin" , history : history , route : "/auth/"});
        if(dataSender){
            setRowsSender(dataSender);
        }
        if(isSuccessReceiver){
            setRowsReceiver(dataReceiver);
        }
    },[dataReceiver,dataSender]);


    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        if(newValue == 2){
            getFeedbackByidAndByreceiver({ id:idemail , user:auth.codeGRESA });
        }
        setValue(newValue);
    };

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const isToday = (someDate) => {
        const today = moment();
        return today === someDate;
    }

    return(
        <React.Fragment>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Envoyés" value="1" />
                        <Tab label="Recus" value="2" />
                    </TabList>
                    </Box>
                    <TabPanel value="1" sx={{ p:0 }}>
                        <TableContainer>
                            <Table stickyHeader aria-label="sticky table">
                                <TableBody>
                                    { isLoadingSender ? (
                                        <Box
                                            sx={{
                                                p:3
                                            }}
                                        >
                                            <CircularProgress/>
                                        </Box>
                                    ) : (
                                        rowsSender.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id} onClick={()=>console.log(row)}>
                                                        {columns.map((column) => {
                                                            const value = row[column.id];
                                                            return (
                                                                <TableCell key={column.id} align={column.align}>
                                                                    {column.format && typeof value === 'number'
                                                                        ? column.format(value)
                                                                        : !isNaN(Date.parse(value)) ? isToday(moment(value)) ? moment(value).format('HH:mm') : moment(value).format('DD-MM-YYYY') 
                                                                        : value}
                                                                </TableCell>
                                                            );
                                                        })}
                                                    </TableRow>
                                                    );
                                                }
                                            )
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={rowsSender.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />  
                    </TabPanel>
                    <TabPanel value="2" sx={{ p:0 }}>
                        <TableContainer >
                            <Table stickyHeader aria-label="sticky table">
                            <TableBody>
                                    { isLoadingReceiver ? (
                                        <Box
                                            sx={{
                                                p:3
                                            }}
                                        >
                                            <CircularProgress/>
                                        </Box>
                                    ) : (
                                        rowsReceiver.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id} onClick={()=>console.log(row)}>
                                                        {columns.map((column) => {
                                                            const value = row[column.id];
                                                            return (
                                                                <TableCell key={column.id} align={column.align}>
                                                                {column.format && typeof value === 'number'
                                                                    ? column.format(value)
                                                                    : value}
                                                                </TableCell>
                                                            );
                                                        })}
                                                    </TableRow>
                                                    );
                                                }
                                            )
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={rowsReceiver.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />  
                    </TabPanel>
                </TabContext>               
            </Paper>
        </React.Fragment>
    )
}