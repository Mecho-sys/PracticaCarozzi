import React, { useState, useEffect } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';

import TextField from "@mui/material/TextField";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

//datePiker
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import axios from "axios";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    flexGrow: 1,
  }));


export default function FormBinnacle() {
  const [formData, setFormData] = useState({
    Mant: "",  
    Mant2: "",
    Mant3: "",
    ShiftManager: "",
    Comp: 1, // componente sobre el que se trabajo
    Equip: "",  // equipo sobre el que se trabajo
    Area: "", // Linea del trabajo
    Plant: "", //planta donde se trabajo
    FechaReal: "", //fecha de la mantencion (la fecha real del trabajo)
    EquipStatus: "", // Estado del equipo al momento de la intervencion
    TypeMant: "", //tipo de intervencion (correctivo/preventivo/predictivo)
    Speciality: "", // tipo de trabajo, mecanico o electrico
    Turn: "", // Turno de la operacion
    InitTime: "",  //hora de inicio del trabajo
    FinishTime: "",  //hora de termino del trabajo
    Duration: "",  //tiempo de trabajo
    WorkOrder: "",  //orden de trabajo
    DescActivity: "", // tipo de trabajo realizado (Falla / Cambio de Bomba)
    Content: "",  // una explicacion de lo anterior
    FailureType: "", // opcion para el origen que genero el problema
    FailureMode: "", //el motivo de la falla (aseo general/ ...)
    Content2: "", // una explicacion de lo anterior
    Comments: "", //comentarios extras
    validation1: false,
    validation2: false,
    validation3: false,
  });

  const [dataPlant, setDataPlant] = useState([]);
  const [dataArea, setDataArea] = useState([]);
  const [dataEquip, setDataEquip] = useState([]);
  const [dataComp, setDataComp] = useState([]);
  const [dataTypeMant, setDataTypeMant] = useState([]);
  const [realDate, setRealDate] = React.useState(dayjs('2022-04-17'));
  const [dataFailMode, setDataFailMode] = useState([]);
  const [dataFailType, setDataFailType] = useState([]);
  const [dataSpeciality, setDataSpeciality] = useState([]);
  const [dataDescAct, setDataDescAct] = useState([]);
  const [dataIntervType, setDataIntervType] = useState([]);
  const [dataMants, setDataMants] = useState([]);
  const [dataShifts, setDataShifts] = useState([]);

  const [plantId, setPlantId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [equipId, setEquipId] = useState("");
  const [compId, setCompId] = useState("");
  
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

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/mantType", {
        headers: {
          //Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setDataTypeMant(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/fails", {
        headers: {
          //Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setDataFailType(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/failsMode", {
        headers: {
          //Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setDataFailMode(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/specialities", {
        headers: {
          //Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setDataSpeciality(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/activities", {
        headers: {
          //Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setDataDescAct(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/intType", {
        headers: {
          //Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setDataIntervType(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/manteiners", {
        headers: {
          //Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setDataMants(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/Shifts", {
        headers: {
          //Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setDataShifts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  
  const handleChangeSelect = (fieldName, value) => {
    if (fieldName === 'FechaReal') {
      // Convierte el valor de fecha seleccionado a formato de fecha de dayjs
      const newDate = dayjs(value);
      // Actualiza el estado 'realDate' con la nueva fecha
      setRealDate(newDate);
    }
    setFormData({ ...formData, [fieldName]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      Mant: formData.Mant,
      Mant2: formData.Mant2,
      Mant3: formData.Mant3,
      ShiftManager: formData.ShiftManager,
      Comp: formData.Comp,
      Equip: formData.Equip,
      Area: formData.Area,
      Plant: formData.Plant,
      FechaReal: formData.FechaReal,
      EquipStatus: formData.EquipStatus,
      TypeMant: formData.TypeMant,
      Speciality: formData.Speciality,
      Turn: formData.Turn,
      InitTime: formData.InitTime,
      FinishTime: formData.FinishTime,
      Duration: formData.Duration,
      WorkOrder: formData.WorkOrder,
      DescActivity: formData.DescActivity,
      Content: formData.Content,
      FailureType: formData.FailureType,
      FailureMode: formData.FailureMode,
      Content2: formData.Content2,
      Comments: formData.Comments,
      validation1: false,
      validation2: false,
      validation3: false,
    };
    axios
    .post("http://localhost:8080/api/newBinnEntry", dataToSend, {
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
    console.log(dataToSend);
  };


  const containerStyle = {
    width: '80%', 
    margin: '0 auto' 
  };
  
  return (
    <div style={containerStyle}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Turno y especialidad de mantención
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={2}>
            <Item>
              <FormControl fullWidth>
              <InputLabel id="turn-select-label">Turno</InputLabel>
                <Select
                labelId="turn-select-label"
                id="turn-select-label"
                value={formData.Turn}
                label="Turn"
                onChange={(e) => handleChangeSelect('Turn', e.target.value)}
                >
                  <MenuItem value="">...</MenuItem>
                  <MenuItem value={"Mañana"}>Mañana</MenuItem>
                  <MenuItem value={"Tarde"}>Tarde</MenuItem>
                  <MenuItem value={"Noche"}>Noche</MenuItem>
                  <MenuItem value={"Administrativo"}>Administrativo</MenuItem>
                </Select>
              </FormControl>
            </Item>
            <Item>
              <FormControl fullWidth>
                <InputLabel id="speciality-select-label">Especialidad</InputLabel>
                <Select
                labelId="speciality-select-label"
                id="speciality-select-label"
                value={formData.Speciality}
                label="Especialidad"
                onChange={(e) => handleChangeSelect('Speciality', e.target.value)}
                >
                  <MenuItem value="">...</MenuItem>
                  {dataSpeciality.map((spec) => (
                    <MenuItem key={spec.Id} value={spec.Name}>
                      {spec.Name}
                    </MenuItem>
                  ))} 
                </Select>
              </FormControl>
            </Item>
            <Item>
              <FormControl fullWidth>
                <InputLabel id="shift-manager-select-label">Jefe de turno</InputLabel>
                <Select
                labelId="shift-manager-select-label"
                id="shift-manager-select-label"
                value={formData.ShiftManager}
                label="shift-manager"
                onChange={(e) => handleChangeSelect('ShiftManager', e.target.value)}
                >
                  <MenuItem value="">...</MenuItem>
                  {dataShifts.map((shift) => (
                    <MenuItem key={shift.Id} value={shift.Name}>
                      {shift.Name}
                    </MenuItem>
                  ))} 
                </Select>
              </FormControl>
            </Item>
          </Stack>
          <Stack 
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}>
            <Item sx={{ margin: '0 auto' }}>  
              <p>Fecha del trabajo</p>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={[ 'DatePicker']}>
                  <DatePicker
                    label="Seleccion de Fecha"
                    value={realDate}
                    onChange={(newValue) => {
                      setRealDate(newValue)
                      handleChangeSelect('FechaReal', newValue.format('YYYY-MM-DD'));
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Item>
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          Personal asignado
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Item>
              <FormControl fullWidth>
                <InputLabel id="Mant-select-label">Personal 1</InputLabel>
                <Select
                labelId="Mant-select-label"
                id="Mant-select-label"
                value={formData.Mant}
                label="Mante"
                onChange={(e) => handleChangeSelect('Mant', e.target.value)}
                >
                  <MenuItem value="">...</MenuItem>
                  {dataMants.map((mants) => (
                    <MenuItem key={mants.Id} value={mants.Name}>
                      {mants.Name}
                    </MenuItem>
                  ))} 
                </Select>
              </FormControl>
            </Item>
            <Item>
              <FormControl fullWidth>
                <InputLabel id="Mant2-select-label">Personal 2</InputLabel>
                <Select
                labelId="Mant2-select-label"
                id="Mant2-select-label"
                value={formData.Mant2}
                label="Mante2"
                onChange={(e) => handleChangeSelect('Mant2', e.target.value)}
                >
                  <MenuItem value="">...</MenuItem>
                  {dataMants.map((mants) => (
                    <MenuItem key={mants.Id} value={mants.Name}>
                      {mants.Name}
                    </MenuItem>
                  ))} 
                </Select>
              </FormControl>
            </Item>
            <Item>
              <FormControl fullWidth>
                <InputLabel id="Mant3-select-label">Personal 3</InputLabel>
                <Select
                labelId="Mant3-select-label"
                id="Mant3-select-label"
                value={formData.Mant3}
                label="Mante3"
                onChange={(e) => handleChangeSelect('Mant3', e.target.value)}
                >
                  <MenuItem value="">...</MenuItem>
                  {dataMants.map((mants) => (
                    <MenuItem key={mants.Id} value={mants.Name}>
                      {mants.Name}
                    </MenuItem>
                  ))} 
                </Select>
              </FormControl>
            </Item>
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          Información de la intervención
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Item>
                <FormControl fullWidth>
                  <InputLabel id="type-mant-select-label">Tipo de Mantención</InputLabel>
                  <Select
                  labelId="type-mant-select-label"
                  id="type-mant-select-label"
                  value={formData.TypeMant}
                  label="Tipo"
                  onChange={(e) => handleChangeSelect('TypeMant', e.target.value)}
                  >
                    <MenuItem value="">...</MenuItem>
                    {dataTypeMant.map((typeMant) => (
                      <MenuItem key={typeMant.Id} value={typeMant.Name}>
                        {typeMant.Name}
                      </MenuItem>
                    ))} 
                </Select>
                </FormControl>
              </Item>
              <Item>
                <FormControl fullWidth>
                  <InputLabel id="equip-status-select-label">Tipo de intervención</InputLabel>
                  <Select
                  labelId="equip-status-select-label"
                  id="equip-status-select-label"
                  value={formData.EquipStatus}
                  label="Estado"
                  onChange={(e) => handleChangeSelect('EquipStatus', e.target.value)}
                  >
                    <MenuItem value="">...</MenuItem>
                    {dataIntervType.map((typeinter) => (
                      <MenuItem key={typeinter.Id} value={typeinter.Name}>
                        {typeinter.Name}
                      </MenuItem>
                    ))} 
                </Select>
                </FormControl>
              </Item>
              <Item>
                <Stack direction="row" spacing={2}>
                  <Item>
                    <FormControl fullWidth>
                      <InputLabel id="plant-select-label">Planta</InputLabel>
                      <Select
                        labelId="plant-select-label"
                        id="plant-select"
                        value={formData.Plant}
                        label="Planta"
                        onChange={(e) => { 
                          setPlantId(e.target.value);
                          handleChangeSelect('Plant', e.target.value);
                        }}
                      >
                        <MenuItem value="">...</MenuItem>
                        {dataPlant.map((plant) => (
                          <MenuItem key={plant.Id} value={plant.Id}>
                            {plant.Name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Item>
                  <Item>
                    <FormControl fullWidth>
                      <InputLabel id="area-select-label">Línea</InputLabel>
                      <Select
                        labelId="area-select-label"
                        id="area-select"
                        value={formData.Area}
                        label="Linea"
                        onChange={(e) => { 
                          setAreaId(e.target.value);
                          handleChangeSelect('Area', e.target.value);
                        }}
                      >
                        <MenuItem value="">...</MenuItem>
                        {dataArea.map((area) => (
                          <MenuItem key={area.Id} value={area.Id}>
                            {area.Name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Item>
                  <Item>
                    <FormControl fullWidth>
                      <InputLabel id="equip-select-label">Equipo</InputLabel>
                      <Select
                      labelId="equip-select-label"
                      id="equip-select-label"
                      value={formData.Equip}
                      label="equip"
                      onChange={(e) => { 
                        setEquipId(e.target.value);
                        handleChangeSelect('Equip', e.target.value);
                      }}
                    >
                      <MenuItem value="">...</MenuItem>
                      {dataEquip.map((equip) => (
                        <MenuItem key={equip.Id} value={equip.Id}>
                          {equip.Name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Item>
              </Stack>
            </Item>
          </Stack>
        </AccordionDetails>
      </Accordion>
      {(formData.EquipStatus === "Intervención en Producción" || formData.EquipStatus === "Intervención fuera de Producción") && (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4-content"
            id="panel4-header"
          >
            Información especifica
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Item>
                <Stack direction="row" spacing={2}>
                  <Item>
                    <FormControl fullWidth>
                      <InputLabel id="comp-select-label">Componente</InputLabel>
                      <Select
                      labelId="comp-select-label"
                      id="comp-select-label"
                      value={formData.Comp}
                      label="comp"
                      onChange={(e) => { 
                        setCompId(e.target.value);
                        handleChangeSelect('Comp', e.target.value);
                      }}
                      >
                        <MenuItem value="">...</MenuItem>
                        {dataComp.map((comp) => (
                          <MenuItem key={comp.Id} value={comp.Id}>
                            {comp.Name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Item>
                  <Item>
                    <FormControl fullWidth>
                      <InputLabel id="descrip-activity-select-label">Descripción de actividad</InputLabel>
                      <Select
                      labelId="descrip-activity-select-label"
                      id="descrip-activity-select-label"
                      value={formData.DescActivity}
                      label="Actividad"
                      onChange={(e) => handleChangeSelect('DescActivity', e.target.value)}
                      >
                        <MenuItem value="">...</MenuItem>
                        {dataDescAct.map((activity) => (
                          <MenuItem key={activity.Id} value={activity.Name}>
                            {activity.Name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Item>
                </Stack>
              </Item>
              <Item>
                <Stack direction="row" spacing={2}>
                  <Item>
                    <p>Orden de trabajo</p>
                    <TextField
                      name="WorkOrder"
                      label="Orden de trabajo"
                      variant="outlined"
                      type="number"
                      value={formData.WorkOrder}
                      onChange={handleChange}
                    />
                  </Item>
                  <Item>
                    <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
                      <Item>
                        <p>Hora de inicio</p>
                        <TextField
                          name="InitTime"
                          label="Hora inicio"
                          variant="outlined"                        
                          helperText="Hora:minuto"  
                          value={formData.InitTime}
                          onChange={handleChange}
                        />
                      </Item>
                      <Item>
                        <p>Hora de termino</p>
                        <TextField
                          name="FinishTime"
                          label="Hora de entrega"
                          variant="outlined"
                          helperText="Hora:minuto"  
                          value={formData.FinishTime}
                          onChange={handleChange}
                        />
                      </Item>
                      <Item>
                        <p>Duración del trabajo</p>
                        <TextField
                          name="Duration"
                          label="tiempo de trabajo"
                          variant="outlined"
                          value={formData.Duration}
                          onChange={handleChange}
                        />
                      </Item>
                    </Stack>
                  </Item>
                </Stack>
              </Item>
            </Stack>
            <Stack>
              <Item>
                <p>Como se soluciono el fallo</p>
                <TextField
                    name="Content"
                    label="Trabajo realizado"
                    variant="outlined"
                    value={formData.Content}
                    onChange={handleChange}
                  />
              </Item>
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}
      {(formData.EquipStatus === "Intervención en Producción" || formData.EquipStatus === "Intervención fuera de Producción") && (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5-content"
          id="panel5-header"
        >
          Analisis de la falla
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Item>
                  <FormControl fullWidth>
                    <InputLabel id="failureType-select-label">Tipo de fallo</InputLabel>
                    <Select
                    labelId="failureType-select-label"
                    id="failureType-select-label"
                    value={formData.FailureType}
                    label="failureType"
                    onChange={(e) => handleChangeSelect('FailureType', e.target.value)}
                    >
                      <MenuItem value="">...</MenuItem>
                      {dataFailType.map((fType) => (
                        <MenuItem key={fType.Id} value={fType.Name}>
                          {fType.Name}
                        </MenuItem>
                      ))} 
                    </Select>
                  </FormControl>
                </Item>
                <Item>
                  <FormControl fullWidth>
                    <InputLabel id="failure-mode-select-label">Modo de fallo</InputLabel>
                    <Select
                    labelId="failure-mode-select-label"
                    id="failure-mode-select-label"
                    value={formData.FailureMode}
                    label="modo de fallo"
                    onChange={(e) => handleChangeSelect('FailureMode', e.target.value)}
                    >
                      <MenuItem value="">...</MenuItem>
                      {dataFailMode.map((fMode) => (
                        <MenuItem key={fMode.Id} value={fMode.Name}>
                          {fMode.Name}
                        </MenuItem>
                      ))} 
                    </Select>
                  </FormControl>
                </Item>

              </Stack>
            </Item>
          </Stack>
          <Stack>
            <Item>
              <p>Explicación de motivo de la falla</p>
              <TextField
                name="Content2"
                label="Explicacion"
                variant="outlined"
                value={formData.Content2}
                onChange={handleChange}
              />
            </Item>
          </Stack>
        </AccordionDetails>
      </Accordion>
      )}
      {(formData.EquipStatus === "Ronda e inspección" || formData.EquipStatus === "Registro información Relevante") && (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel6-content"
            id="panel6-header"
          >
            Información Adicional
          </AccordionSummary>
          <AccordionDetails>
            
            <Stack>
              <Item>
                <p>Informacion adicional</p>
                <TextField
                  name="Comments"
                  label="Explicacion"
                  variant="outlined"
                  value={formData.Comments}
                  onChange={handleChange}
                />
              </Item>
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel6-content"
          id="panel6-header"
        >
          Enviar mantenimiento
        </AccordionSummary>
        <AccordionDetails>
          Toda la información en este formulario sera revisada por un supervisor.
        </AccordionDetails>
        <AccordionActions>
          <Button >Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar</Button>
        </AccordionActions>
      </Accordion>
    </div>
  );
}
