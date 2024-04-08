import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import axios from "axios";

export default function NewWorker ({ onMantAdded }) {;
  const [formData, setFormData] = useState({
    Name: "",
    Speciality: "",
    Role: "Mantenedor",
    Turn: "",
    IdEmpre: "",
    Comment: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeSpec = (event) => {
    setFormData({ ...formData, Speciality: event.target.value }); // Actualiza Speciality en formData
  };

  const handleChangeTurn = (event) => {
    setFormData({ ...formData, Turn: event.target.value }); // Actualiza Speciality en formData
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      Name: formData.Name,
      Role: formData.Role,
      Speciality: formData.Speciality,
      Turn: formData.Turn,
      IdEmpre: formData.IdEmpre,
      Comment: formData.Comment,
    };
    console.log(dataToSend);
    axios
    .post("http://localhost:8080/api/newWorker", dataToSend, {
      headers: {
        //Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("Respuesta del servidor:", response.data);
      onMantAdded(response.data);
    })
    .catch((error) => {
      console.error("Error al enviar la solicitud:", error);
    });
  };
  return (
    <Stack
      component="form"
      sx={{
        width: "25ch",
      }}
      spacing={2}
      noValidate
      autoComplete="off"
    >
      <TextField
        name="Name"
        label="Name"
        variant="outlined"
        value={formData.Name}
        onChange={handleChange}
      />
      <FormControl fullWidth>
        <InputLabel id="espec-select-label">Especialidad</InputLabel>
        <Select
          labelId="despec-select-label"
          id="espec-select-label"
          value={formData.Speciality}
          label="Speciality"
          onChange={handleChangeSpec}
        >
          <MenuItem value={"Mecánico"}>Mecánico</MenuItem>
          <MenuItem value={"Eléctrico"}>Eléctrico</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="turn-select-label">Turno</InputLabel>
        <Select
          labelId="turn-select-label"
          id="turn-select-label"
          value={formData.Turn}
          label="Turn"
          onChange={handleChangeTurn}
        >
          <MenuItem value={true}>turno</MenuItem>
          <MenuItem value={false}>Administrativo</MenuItem>
        </Select>
      </FormControl>
      <TextField
        name="IdEmpre"
        label="Id Empresa"
        variant="outlined"
        type="number"
        value={formData.IdEmpre}
        onChange={handleChange}
      />
      <TextField
        name="Comment"
        label="Comentarios"
        variant="outlined"
        value={formData.Comment}
        onChange={handleChange}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        Guardar
      </Button>
    </Stack>
  );
}