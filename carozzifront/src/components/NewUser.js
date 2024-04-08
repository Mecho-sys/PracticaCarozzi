import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import axios from "axios";

export default function NewUser ({ onUserAdded }) {
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      Name: formData.Name,
      Email: formData.Email,
      Password: formData.Password,
    };

    console.log(dataToSend)
    axios
      .post("http://localhost:8080/api/newUser", dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Respuesta del servidor:", response.data);
        onUserAdded(response.data);
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
      <TextField
        name="Email"
        label="Correo Electronico"
        variant="outlined"
        value={formData.Email}
        onChange={handleChange}
      />
      <TextField
        name="Password"
        label="Contraseña"
        variant="outlined"
        value={formData.Password}
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
};
