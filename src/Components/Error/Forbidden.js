import React from 'react';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/system';


const Forbidden = () =>{
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
                    <img src={require('../../assets/forbiddenImage.jpg')} style={{height: '35%',width: '35%'}}/>
                    <Link to={'/app/'} style={{color: 'black',fontSize: 25,bottom: 20}}>
                        <p>Accée interdit</p>
                        <p style={{textDecoration: 'underline'}}>Retour vers la page d'acceuil</p>
                    </Link>
                </Box>
            </Paper>
        </React.Fragment>
    )
}
export default Forbidden;