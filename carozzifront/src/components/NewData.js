import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";  
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import axios from "axios";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));  

export default function NewData({ onDataAdded, option }) {
  const [formData, setFormData] = useState({
    Option: "",
    Name: "",
    Descrip: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      Name: formData.Name,
      Descrip: formData.Descrip,
    };
    console.log(option);
    console.log(dataToSend);
    axios
    .post(`http://localhost:8080/api/${option}`, dataToSend, {
      headers: {
        //Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("Respuesta del servidor:", response.data);
      onDataAdded(response.data);
    })
    .catch((error) => {
      console.error("Error al enviar la solicitud:", error);
    });
  };

  return (
    <div style={{ margin: '20px' }}>
        
      <Box sx={{ maxWidth: '80%', margin: 'auto', marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Ingresar la información
        </Typography>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Item>
            <TextField
              name="Name"
              label="Nombre"
              variant="outlined"
              value={formData.Name}
              onChange={handleChange}
            />
          </Item>
          <Item>
            <TextField
              name="Descrip"
              label="Comentario"
              variant="outlined"
              value={formData.Descrip}
              onChange={handleChange}
            />
          </Item>

          <Button onClick={handleSubmit}  variant="outlined">Guardar </Button>
        </Stack>
      </Box>
    </div>
  );
}
