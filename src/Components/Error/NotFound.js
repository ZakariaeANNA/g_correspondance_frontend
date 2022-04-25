import React from 'react'
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/system';



const NotFound =  () =>{
return(
    <React.Fragment>
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    maxHeight : 600,
                    width : "auto",
                    overflow : "hidden"
                }}
            >
                <img src={require('../../assets/notFoundImage.jpg')} height="40%" width={'45%'}/>
                <Link to={'/app/'} style={{textDecoration: 'none',color: 'black',fontSize: 25,bottom: 20}}>
                    <p>Page non trouvé <span style={{textDecoration: 'underline'}}>Retour ver la page d'acceuil</span></p>
                </Link>
            </Box>
        </Paper>
    </React.Fragment>    
)
}
export default NotFound;