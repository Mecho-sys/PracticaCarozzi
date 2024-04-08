import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import axios from "axios";
import Facilities from "./Facilities";

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function FacilityFinder() {
  const [dataPlant, setDataPlant] = useState([]);
  const [dataArea, setDataArea] = useState([]);
  const [dataEquip, setDataEquip] = useState([]);
  const [dataComp, setDataComp] = useState([]);

  const [plantId, setPlantId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [equipId, setEquipId] = useState("");
  const [componentInfo, setComponentInfo] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/plants", {
        headers: {
          //Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setDataPlant(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (plantId !== '') {
      axios
        .get(`http://localhost:8080/api/areaByPlant/${plantId}`, {
          headers: {
            //Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setDataArea(response.data);
        })
        .catch((error) => {
          console.error("Error al buscar las areas de la planta:", error);
        });
    }
  }, [plantId]);

  useEffect(() => {
    if (areaId !== '') {
      axios
        .get(`http://localhost:8080/api/equipByArea/${areaId}`, {
          headers: {
            //Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setDataEquip(response.data);
        })
        .catch((error) => {
          console.error("Error al registrar datos masivos:", error);
        });
    }
  }, [areaId]);

  useEffect(() => {
    if (equipId !== '') {
      axios
        .get(`http://localhost:8080/api/CompByEquip/${equipId}`, {
          headers: {
            //Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setDataComp(response.data);
        })
        .catch((error) => {
          console.error("Error al registrar datos masivos:", error);
        });
    }
  }, [equipId]);

  const handleCreateFasilitiesData = () => {
      const info = {
        plantName: plantId,
        areaName: areaId,
        equipName: equipId,
      };
      setComponentInfo(info);
  }
  console.log(componentInfo)
  return (
    <div style={{ margin: '20px' }}>
      <Box sx={{ maxWidth: '80%', margin: 'auto', marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
        Seleccione la planta, el area y el equipo que quiera revisar
        </Typography>
        <Stack direction="row" spacing={2}>
          <Item>
            <Box sx={{ minWidth: 200 }}>
              <FormControl fullWidth>
                <InputLabel id="plant-select-label">Planta</InputLabel>
                <Select
                  labelId="plant-select-label"
                  id="plant-select"
                  value={plantId}
                  label="Planta"
                  onChange={(e) => setPlantId(e.target.value)}
                >
                  <MenuItem value="">...</MenuItem>
                  {dataPlant.map((plant) => (
                    <MenuItem key={plant.Id} value={plant.Id}>
                      {plant.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Item>
          <Item>
            <Box sx={{ minWidth: 200 }}>
              <FormControl fullWidth>
                <InputLabel id="area-select-label">Línea</InputLabel>
                <Select
                  labelId="area-select-label"
                  id="area-select"
                  value={areaId}
                  label="Línea"
                  onChange={(e) => setAreaId(e.target.value)}
                >
                  <MenuItem value="">...</MenuItem>
                  {dataArea.map((area) => (
                    <MenuItem key={area.Id} value={area.Id}>
                      {area.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Item>
          <Item>
            <Box sx={{ minWidth: 200 }}>
              <FormControl fullWidth>
                <InputLabel id="equip-select-label">Equipo</InputLabel>
                <Select
                  labelId="equip-select-label"
                  id="equip-select"
                  value={equipId}
                  label="Equipo"
                  onChange={(e) => setEquipId(e.target.value)}
                >
                  <MenuItem value="">...</MenuItem>
                  {dataEquip.map((equip) => (
                    <MenuItem key={equip.Id} value={equip.Id}>
                      {equip.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Item>
          <Button onClick={handleCreateFasilitiesData} variant="outlined">Mostrar Componentes</Button>
        </Stack>
      </Box>
      
      <Box sx={{ maxWidth: '80%', margin: 'auto', marginTop: 4 }}>
        {componentInfo && <Facilities componentInfo={componentInfo} />}
      </Box>
    </div>
    
  );
}
