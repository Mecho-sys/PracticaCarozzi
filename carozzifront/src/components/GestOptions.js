import React from "react";
import Box from "@mui/material/Box";
import ListOptions from "./ListOptions";
import ListOptions2 from "./ListOptions2";


export default function GestOptions({ option }) {
  const containerStyle = {
    width: '80%', 
    margin: '0 auto' 
  };

  return (
    <div style={containerStyle}>
      <Box sx={{ maxWidth: '80%', margin: 'auto', marginTop: 4 }}>
      {option === "specialities" && (
          <>
            <p>Especialidades de trabajo</p>
            <ListOptions option={"specialities"}/>
          </>
        )}

        {option === "mantType" && (
          <>
            <p>Tipos de mantenimientos</p>
            <ListOptions option={"mantType"}/>
          </>
        )}

        {option === "activities" && (
          <>
            <p>Actividades a realizar</p>
            <ListOptions option={"activities"}/> 
          </>
        )}

        {option === "intType" && (
          <>
            <p>tipo de intervención</p>
            <ListOptions option={"intType"}/>
          </>
        )}

        {option === "equipStatus" && (
          <>
            <p>Estados de la maquinaria durante el proceso</p>
            <ListOptions option={"equipStatus"}/>
          </>
        )}

        {option === "failsMode" && (
          <>
            <p>Modos de fallas</p>
            <ListOptions option={"failsMode"}/>
          </>
        )}

        {option === "fails" && (
          <>
            <p>Tipos de fallos</p>
            <ListOptions option={"fails"} />
          </>
        )}

        {option === "accesList" && (
          <>
            <p>Listado de Permisos de acceso</p>
            <ListOptions2 option={"accesList"} />
          </>
        )}

        {option === "profiles" && (
          <>
            <p>Listado de Perfiles de usuario</p>
            <ListOptions2 option={"profiles"} />
          </>
        )}
      </Box>
    </div>
  );
}
