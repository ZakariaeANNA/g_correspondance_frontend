import * as React from 'react';
import { DataGrid } from "@mui/x-data-grid";
import {Visibility , Delete, Close, Save, Send} from "@mui/icons-material";
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import { Button, DialogContent, IconButton, TextareaAutosize, Tooltip } from "@mui/material";
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { TextField } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import './Users.css';
import { Typography } from '@mui/material';
import { Paper } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AttachFileIcon from '@mui/icons-material/AttachFile';


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
function Adduser(){
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" startIcon={<AddCircle />} onClick={handleClickOpen}>
        Ajouter Un Utilsateur
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
        maxWidth="md" 
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Ajouter Un Utilsateur
        </BootstrapDialogTitle>
        <DialogContent dividers>
        <form className="p">
            <TextField id="outlined-basic" className='inputField' style={{width: '31%'}} label="Code GRESA" variant="outlined"/>
            <TextField id="outlined-basic" className='inputField' style={{width: '68%',marginLeft: '1%'}} label="Nom" variant="outlined" />
            <TextField id="outlined-basic" className='inputField' style={{width: '59%', marginTop: '0.5em'}} label="Nom d'Etablissement" variant="outlined" />
            <FormControl style={{width: '40%',marginLeft: '1%',marginTop: '0.5em'}}  className='inputField'>
                <InputLabel id="demo-simple-select-label">Type d'Etablissement</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Source"
                >
                    <MenuItem value={10}>G-Scolaire</MenuItem>
                    <MenuItem value={20}>Lycee</MenuItem>
                    <MenuItem value={30}>Collége</MenuItem>
                    <MenuItem value={40}>Adminstration</MenuItem>
                    <MenuItem value={50}>Prémaire</MenuItem>
                </Select>
            </FormControl>
            <TextField id="outlined-basic" style={{width: '49.5%',marginTop: '0.5em'}} className='inputField' label="Délegation" variant="outlined"/>
            <TextField id="outlined-basic" style={{width: '49.5%',marginLeft: '1%',marginTop: '0.5em'}} className='inputField' label="Email" variant="outlined"/>
            <TextField id="outlined-basic" style={{width: '68%',marginTop: '0.5em'}} className='inputField' label="Password" variant="outlined"/>
            <FormControl className='inputField' style={{width: '31%',marginLeft: '1%',marginTop: '0.5em'}}>
                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Source"
                >
                    <MenuItem value={10}>Admin</MenuItem>
                    <MenuItem value={20}>Directeur</MenuItem>
                </Select>
            </FormControl>
        </form>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' startIcon={<Save />} autoFocus onClick={handleClose}>
            Enregistrer
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );

}
function DeleteUser({params}){
  
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
      setOpen(false);
  };
  return(
      <div>
        <Tooltip title="Supprimer l'utlisateur">
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
            Suprimer Un Utilsateur
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Typography>
              Êtes-vous sûr de vouloir supprimer l'utilsateur {params.codeGRESA}
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
function ViewUser({params}){
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
      setOpen(false);
  };
  return(
    <div>
        <Tooltip title="Voir l'utilisateur">
          <IconButton aria-label="delete" size="large" onClick={handleClickOpen}> 
            <Visibility sx={{ color: '#7BE929' }} color="red" />
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
          Afficher Utilsateur
        </BootstrapDialogTitle>
        <DialogContent dividers>
        <TableContainer component={Paper}>
                <Table sx={{ minWidth: '60%' }} aria-label="simple table">
                    <TableBody>
                        <TableRow>
                            <TableCell style={{ fontWeight : "bold" }}>Nom</TableCell>
                            <TableCell component="th" scope="row">
                                {params.nom}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontWeight : "bold" }}>Code GRESA</TableCell>
                            <TableCell component="th" scope="row">
                                {params.codeGRESA}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontWeight : "bold" }}>Role</TableCell>
                            <TableCell component="th" scope="row">
                                {params.roles}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontWeight : "bold" }}>Nom d'Etablissement</TableCell>
                            <TableCell component="th" scope="row">
                                {params.nameEtab}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontWeight : "bold" }}>Type d'Etablissement</TableCell>
                            <TableCell component="th" scope="row">
                                {params.typeEtab}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontWeight : "bold" }}>Delegation</TableCell>
                            <TableCell component="th" scope="row">
                                {params.delegation}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" startIcon={<Close />} autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
        </BootstrapDialog>
    </div>
  )
}
function SendMail({params}){
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return(
    <div>
        <Tooltip title='Envoyer un mail'>
          <IconButton aria-label="delete" size="large" onClick={handleClickOpen}> 
            <Send sx={{ color: '#0078d2' }} color="red" />
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
            Envoyer un Email
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <TextareaAutosize
              aria-label="empty textarea"
              placeholder="Merci de saisir votre texte message ici !"
              minRows={4}
              style={{ width: '100%'}}
              required
            />
            <input
              style={{ display: "none" }}
              id="contained-button-file"
              type="file"
            />
            <label htmlFor="contained-button-file">
              <Button variant="contained" color="secondary" component="span">
                <AttachFileIcon />
              </Button>
            </label>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color='success' startIcon={<Send />} autoFocus onClick={handleClose}>
              Envoyer
            </Button>
          </DialogActions>
        </BootstrapDialog>
    </div>
  )
}
export default function Users(){
  const columns = [
    {field: "codeGRESA",headerName: "Code GRESA", flex: 1 ,headerAlign : 'center'},
    {field: "nom",headerName: "Nom", flex: 1 ,headerAlign : 'center'},
    {field: "nameEtab",headerName: "Nom Etablissement", flex: 1 ,headerAlign : 'center'},
    {field: "roles",headerName: "Role", flex: 1 ,headerAlign : 'center'},
    {field: "actions",headerName: "actions", flex: 1 ,headerAlign : 'center',renderCell:(params)=>(
      <div style={{display:'flex',flexDirection: 'row'}}>
        <ViewUser params={params.row}/>
        <DeleteUser params={params.row}/>
        <SendMail params={params.row} />
      </div>
    )},
  ]
  const dataGridRows = [
    {id:1,codeGRESA:'5636X',nom:'samir',roles:'Directeur',nameEtab:'hassan II',typeEtab: 'Lycee',delegation:'Tetouan'},
    {id:2,codeGRESA:'45376F',nom:'ahmed',roles:'Admin',nameEtab:'Direction provaicial',typeEtab: 'Adminstration',delegation:'Tetouan'},
    {id:3,codeGRESA:'87487X',nom:'ali',roles:'Directeur',nameEtab:'jaber ben hayen',typeEtab: 'Lycee',delegation:'Tetouan'},
    {id:4,codeGRESA:'76746C',nom:'rawan',roles:'Admin',nameEtab:'Direction provaicial',typeEtab: 'Adminstration',delegation:'Tetouan'},
    {id:5,codeGRESA:'84984H',nom:'salim',roles:'Directeur',nameEtab:'kadi ayad',typeEtab: 'Lycee',delegation:'Tetouan'},
    {id:6,codeGRESA:'84984G',nom:'nadia',roles:'Directeur',nameEtab:'lalla amina',typeEtab: 'Lycee',delegation:'Tetouan'}
  ]
  const [rows,setRows] = React.useState(dataGridRows)
  function FilterInputSearch(inputVlaue){
    let filtered = dataGridRows.filter((row)=>(
      row.nom.toLowerCase().includes(inputVlaue.toLowerCase())
    ))
    if(filtered){
      setRows(filtered)
    }else{
      setRows(dataGridRows)
    }
  }
  function FilterSelect(type){
    if(type!=='all'){
      let filtered = dataGridRows.filter((row)=>(
      row.typeEtab===type
      ))
      if(filtered){
        setRows(filtered)
      }else{
        setRows(dataGridRows)
      }
    }else{
      setRows(dataGridRows)
    }
  }
  return (
    <React.Fragment>
        <div style={{display: 'flex',flexDirection: 'row',justifyContent: 'flex-start'}}>
            <FormatListBulletedIcon style={{marginTop: '0.15em'}}/>
            <Typography variant='h6' style={{marginLeft: '0.5em'}}> Liste des Utilisateurs du Système</Typography>
        </div>
        <div className='serchBar'>
            <TextField id="outlined-basic" className='inputField' style={{width:'49%',marginRight:'1%'}} onChange={(text)=>FilterInputSearch(text.target.value)} label="Chercher par nom d'utilsateur" variant="outlined"/>
            <FormControl fullWidth className='inputField' style={{width:'49%',marginLeft:'1%'}}>
                <InputLabel id="demo-simple-select-label">Chercher par le type d'Etablissement</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Source"
                    onChange={(type)=>FilterSelect(type.target.value)}
                >
                <MenuItem value={'all'}>Tous les Etablissements</MenuItem>
                <MenuItem value={'G-Scolaire'}>G-Scolaire</MenuItem>
                <MenuItem value={'Lycee'}>Lycee</MenuItem>
                <MenuItem value={'College'}>Collége</MenuItem>
                <MenuItem value={'Prémaire'}>Prémaire</MenuItem>
                <MenuItem value={'Adminstration'}>Adminstration</MenuItem>
                </Select>
            </FormControl>
        </div>
        <div style={{ height: '60vh', width: '100%' , textAlign: "center",marginTop: '0.5em' }}>
            <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            />
        </div> 
        <div className='addUserSection'>
            <Adduser/>
        </div>
    </React.Fragment>
  );
}