import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import axios from "axios";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function HomeGraphs() {
  const [data, setData] = useState([]);
  const [dataCountTurn, setDataCountTurn] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/binnacle", {
        headers: {
          //Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/countTurn", {
        headers: {
          //Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setDataCountTurn(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  console.log(dataCountTurn)

  return (
    <div>
       <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Item>Cantidad de fallas por turno</Item>
          </Grid>
          <Grid item xs={6}>
            <Item>Cantidad de fallas por turno historico</Item>
          </Grid>
          <Grid item xs={2}>
            <Item>Mañana</Item>
            <Item>{ data.length }</Item>
          </Grid>
          <Grid item xs={2}>
            <Item>Tarde</Item>
            <Item>20</Item>
          </Grid>
          <Grid item xs={2}>
            <Item>Noche</Item>
            <Item>30</Item>
          </Grid>
          <Grid item xs={2}>
            <Item>Mañana</Item>
            <Item>{dataCountTurn.morning} </Item>
          </Grid>
          <Grid item xs={2}>
            <Item>Tarde</Item>
            <Item>{dataCountTurn.afternoon}</Item>
          </Grid>
          <Grid item xs={2}>
            <Item>Noche</Item>
            <Item>{dataCountTurn.night}</Item>
          </Grid>
          <Grid item xs={5}>
            <Item>
              <Typography>Cantidad de Mantenciones del dia de ayer, por turno</Typography>
              <PieChart
                series={[{ data: [{ id: 0, value: 10, label: 'Mañana' }, { id: 1, value: 15, label: 'Tarde' }, { id: 2, value: 20, label: 'Noche' }] }]}
                width={500}
                height={300}
              />
            </Item>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={5}>
            <Item>
              <Typography>Tipo de mantenciones del turno</Typography>
              <BarChart
                xAxis={[{ scaleType: 'band', data: ['Mañana', 'Tarde', 'Noche'] }]}
                series={[
                  { data: [3, 4, 1], stack: 'A', label: 'Mecanico' },
                  { data: [4, 2, 5], stack: 'B', label: 'Electrico' },
                  { data: [2, 8, 1], stack: 'C', label: 'Soldadura' },
                ]}
                width={500}
                height={300}
              />
            </Item>
          </Grid>
          <Grid item xs={5}>
            <Item>
              <Typography>Cantidad de Mantenciones por mes</Typography>
              <LineChart
                xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }]}
                series={[
                  {
                    curve: "linear",
                    data: [120, 200, 210, 190, 189, 150, 200, 201, 220, 223, 225, 225],
                  },
                ]}
                width={500}
                height={300}
              />
            </Item>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={5}></Grid>
        </Grid>
      </Box>
    </div>
  );
}