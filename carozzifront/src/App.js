import React, { useState } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';

import ReCAPTCHA from "react-google-recaptcha";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  flexGrow: 1,
}));

const containerStyle = {
  width: '80%', 
  margin: '0 auto' 
};

function App() {

  const recaptchaRef = React.createRef();
  function onChange(value) {
    console.log("Captcha value:", value);
  }



  return (
    <div style={ containerStyle}>
      <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Item>
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="standard-adornment-amount">Nombre</InputLabel>
              <Input/>
            </FormControl> 
          </Item>
        </Grid>
        <Grid item xs={8}>
          <Item>
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="standard-adornment-amount">Correo</InputLabel>
              <Input/>
            </FormControl> 
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="standard-adornment-amount">Razon de usar esta app</InputLabel>
              <Input/>
            </FormControl> 
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <FormGroup>
              <FormControlLabel control={<Checkbox />} label="Me gusta la computacion" />
              <FormControlLabel control={<Checkbox />} label="Quiero irme de chile" />
              <FormControlLabel control={<Checkbox />} label="SAQUENME DE LATINOAMERICA" />
            </FormGroup>
          </Item>
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={3}>
          <Item>
            <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="Your client site key"
            onChange={onChange}
          />
          </Item>
        </Grid>
        <Grid item xs={5}></Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <Stack spacing={2} direction="row">
            <Button variant="contained" startIcon={<DeleteIcon />}>Cancelar</Button>
            <Button variant="contained" endIcon={<SendIcon />} >Enviar</Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
    </div>
  );
}

export default App;