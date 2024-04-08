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

export default function GestUserProfile() {

  const [dataProfile, setDataProfile] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  const [dataRel, setDataRel] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:8080/api/profiles`)
      .then(response => setDataProfile(response.data))
      .catch(error => console.error("Error fetching profiles:", error));
    
    axios.get(`http://localhost:8080/api/users`)
      .then(response => setDataUser(response.data))
      .catch(error => console.error("Error fetching users:", error));

    axios.get(`http://localhost:8080/api/profUser`)
    .then(response => {
      const initialCheckedItems = {};
      response.data.forEach(rel => {
        initialCheckedItems[rel.UserID] = {
          ...initialCheckedItems[rel.UserID],
          [rel.ProfileID]: true
        };
      });
      setCheckedItems(initialCheckedItems);
      setDataRel(response.data);
    })
    .catch(error => console.error("Error fetching user-profile relationships:", error));
  }, []);

  const handleCheckboxChange = (event, userID, profileID) => {
    const { checked } = event.target;
    setCheckedItems(prevCheckedItems => ({
      ...prevCheckedItems,
      [userID]: {
        ...prevCheckedItems[userID],
        [profileID]: checked
      }
    }));
  };

  const handleSubmit = () => {
    const selectedItems = [];
    const deletedItems = [];
  
    // Eliminar las relaciones del usuario de la base de datos
    Object.keys(checkedItems).forEach(userID => {
      axios.delete(`http://localhost:8080/api/deleteProfUser/${userID}`, {
        headers: {
          //Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Relaciones eliminadas de la base de datos para el usuario:", userID);
        // Después de eliminar las relaciones existentes, procede a guardar las nuevas relaciones seleccionadas
        Object.keys(checkedItems[userID]).forEach(profileID => {
          if (checkedItems[userID][profileID]) {
            selectedItems.push({ UserID: userID, ProfileID: profileID });
          }
        });
  
        selectedItems.forEach(dataToSend => {
          axios
            .post(`http://localhost:8080/api/newProfUser`, dataToSend, {
              headers: {
                //Authorization: localStorage.getItem("token"),
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              console.log("Relación guardada en la base de datos:", response.data);
            })
            .catch((error) => {
              console.error("Error al guardar la relación en la base de datos:", error);
            });
        });
      })
      .catch((error) => {
        console.error("Error al eliminar las relaciones de usuario de la base de datos:", error);
      });
    });
  };

  const containerStyle = {
    width: '80%', 
    margin: '0 auto' 
  };
  return (
    <div style={containerStyle} >
      {dataUser.map((user) => (
        <Accordion key={user.ID}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-${user}-content`}
            id={`panel-${user.ID}-header`}
          >
            {user.Name} - {user.Email}
          </AccordionSummary>
          <AccordionDetails>
            <div>
              {dataProfile.map(profile => (
                <FormControlLabel
                  key={profile.ID}
                  control={
                    <Checkbox
                      checked={!!checkedItems[user.ID] && checkedItems[user.ID][profile.ID]}
                      onChange={event => handleCheckboxChange(event, user.ID, profile.ID)}
                      name={String(profile.ID)}
                    />
                  }
                  label={profile.Name}
                />
              ))}
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
