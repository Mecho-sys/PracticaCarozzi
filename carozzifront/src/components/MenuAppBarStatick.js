import React from "react";
import { Link } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import ListIcon from "@mui/icons-material/List";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

const MenuAppBarStatick = () => {
  return (
    <div>
        <Drawer anchor="left" open={true} variant="permanent">
            <List style={{ width: '100%' }}>
                <ListItem button component={Link} to="/Home">
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Inicio" />
                </ListItem>
                <ListItem button component={Link} to="/login">
                    <ListItemIcon>
                        <HomeIcon />
                </ListItemIcon>
            <ListItemText primary="Inicio de sesión" />
            </ListItem>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-master"
                    id="panel1-master"
                    >
                    Maestro
                    </AccordionSummary>
                    <AccordionDetails>
                        <ListItem button component={Link} to="/workers">
                            <ListItemIcon>
                            <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary="Trabajadores" />
                        </ListItem>
                        <ListItem button component={Link} to="/facilities">
                            <ListItemIcon>
                            <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary="Instalaciones" />
                        </ListItem>
                        <ListItem button component={Link} to="/specialities">
                            <ListItemIcon>
                            <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary="Tipos de Especialidades" />
                        </ListItem>
                        <ListItem button component={Link} to="/mantsTypes">
                            <ListItemIcon>
                            <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary="Tipos de mantenimientos" />
                        </ListItem>
                        <ListItem button component={Link} to="/activities">
                            <ListItemIcon>
                            <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary="Tipos de actividades" />
                        </ListItem>
                        <ListItem button component={Link} to="/intTypes">
                            <ListItemIcon>
                            <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary="Tipos de intervenciones" />
                        </ListItem>
                        <ListItem button component={Link} to="/equipStatus">
                            <ListItemIcon>
                            <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary="Estados del equipo" />
                        </ListItem>
                        <ListItem button component={Link} to="/failsTypes">
                            <ListItemIcon>
                            <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary="Tipos de fallos" />
                        </ListItem>
                        <ListItem button component={Link} to="/failsModes">
                            <ListItemIcon>
                            <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary="Modos de fallos" />
                        </ListItem>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-movments"
                    id="panel2-movments"
                    >
                    Movimientos
                    </AccordionSummary>
                    <AccordionDetails>
                        <ListItem button component={Link} to="/formBinnacle">
                            <ListItemIcon>
                            <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary="Formulario para ingresar" />
                        </ListItem>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3-master"
                    id="panel3-master"
                    >
                    Informes
                    </AccordionSummary>
                    <AccordionDetails>
                        <ListItem button component={Link} to="/binnacle">
                            <ListItemIcon>
                            <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary="Bitacora" />
                        </ListItem>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4-movments"
                    id="panel4  -movments"
                    >
                    Sistema
                    </AccordionSummary>
                    <AccordionDetails>
                        <ListItem button component={Link} to="/users">
                            <ListItemIcon>
                            <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary="Usuarios" />
                        </ListItem>
                        <ListItem button component={Link} to="/profiles">
                            <ListItemIcon>
                            <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary="Perfiles" />
                        </ListItem>
                        <ListItem button component={Link} to="/accesList">
                            <ListItemIcon>
                            <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary="Permisos de acceso" />
                        </ListItem>
                        <ListItem button component={Link} to="/permissionsProfile">
                            <ListItemIcon>
                            <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary="Gestionar Permisos de Perfil" />
                        </ListItem>
                        <ListItem button component={Link} to="/profilesUser">
                            <ListItemIcon>
                            <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary="Gestionar Perfil de Usuarios" />
                        </ListItem>
                    </AccordionDetails>
                </Accordion>
            </List>
        </Drawer> 
    </div>
  )
}

export default MenuAppBarStatick;