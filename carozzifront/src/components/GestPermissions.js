import React, { useState, useEffect } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from '@mui/material/Checkbox'; 
import Button from '@mui/material/Button';

import axios from "axios";

export default function GestPermissions() {

  const [dataProfile, setDataProfile] = useState([]);
  const [dataAccess, setDataAccess] = useState([]);
  const [dataRel, setDataRel] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:8080/api/profiles`)
      .then(response => setDataProfile(response.data))
      .catch(error => console.error("Error fetching profiles:", error));
    
    axios.get(`http://localhost:8080/api/accesList`)
      .then(response => setDataAccess(response.data))
      .catch(error => console.error("Error fetching access lists:", error));

    axios.get(`http://localhost:8080/api/profList`)
      .then(response => {
        const initialCheckedItems = {};
        response.data.forEach(rel => {
          initialCheckedItems[rel.ProfileID] = {
            ...initialCheckedItems[rel.ProfileID],
            [rel.AccessListID]: true
          };
        });
        setCheckedItems(initialCheckedItems);
        setDataRel(response.data);
      })
      .catch(error => console.error("Error fetching profile-access relationships:", error));
  }, []);
  
  const handleCheckboxChange = (event, profileID, accessID) => {
    const { checked } = event.target;
    setCheckedItems(prevCheckedItems => ({
      ...prevCheckedItems,
      [profileID]: {
        ...prevCheckedItems[profileID],
        [accessID]: checked
      }
    }));
  };

  const handleSubmit = () => {
    const selectedItems = [];

    Object.keys(checkedItems).forEach(profileID => {
      Object.keys(checkedItems[profileID]).forEach(accessID => {
        if (checkedItems[profileID][accessID]) {
          selectedItems.push({
            ProfileID: profileID,
            AccessListID: accessID
          });
        }
      });
    });

    // Elimina las relaciones de perfil-acceso existentes de la base de datos
    Object.keys(checkedItems).forEach(profileID => {
      axios.delete(`http://localhost:8080/api/deleteProfileAccess/${profileID}`, {
        headers: {
          //Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Relaciones eliminadas de la base de datos para el perfil:", profileID);
        // Después de eliminar las relaciones existentes, procede a guardar las nuevas relaciones seleccionadas
        selectedItems.forEach(dataToSend => {
          axios
            .post(`http://localhost:8080/api/newAccesProf`, dataToSend, {
              headers: {
                //Authorization: localStorage.getItem("token"),
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              console.log("Respuesta del servidor:", response.data);
            })
            .catch((error) => {
              console.error("Error al enviar la solicitud:", error);
            });
        });
      })
      .catch((error) => {
        console.error("Error al eliminar las relaciones de perfil-acceso de la base de datos:", error);
      });
    });
  };

  const containerStyle = {
    width: '80%', 
    margin: '0 auto' 
  };
  
  return (
    <div style={containerStyle} >
      {dataProfile.map((profile) => (
        <Accordion key={profile.ID}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-${profile}-content`}
            id={`panel-${profile}-header`}
          >
            {profile.Name}
          </AccordionSummary>
          <AccordionDetails>
            <div>
              {dataAccess.map((item) => {
                // Verificar si el acceso está relacionado con el perfil actual
                const relatedAccess = dataRel.find(rel => rel.ProfileID === profile.ID && rel.AccessListID === item.ID);
                return (
                  <FormControlLabel
                  key={item.ID}
                  control={
                    <Checkbox
                      checked={!!checkedItems[profile.ID] && !!checkedItems[profile.ID][item.ID]}
                      onChange={(event) => handleCheckboxChange(event, profile.ID, item.ID)}
                      name={String(item.ID)}
                    />
                  }
                  label={item.Name}
                />
                );
              })}
            </div>
          </AccordionDetails>
          <AccordionActions>
            <Button onClick={handleSubmit}>
              Guardar
            </Button>
          </AccordionActions>
        </Accordion>
      ))}   
    </div>
  );
}
