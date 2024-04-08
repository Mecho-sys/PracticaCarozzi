import React from "react";
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import ListMaintainer from "./ListMaintainer";
import ListShifts from "./ListShifts";



const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    flexGrow: 1,
  }));

export default function ListWorkers() {
  return (
    <div>    
        <Box  sx={{ margin: 5 }}>
            <Typography variant="h4" component="h2" align="center" > 
                Lista de trabajadores
            </Typography>    
        </Box>   
        <Stack direction="row" spacing={2}>
            <Item sx={{ flex: 1, minWidth: 0 }}>
                <ListMaintainer />
            </Item>
            <Item sx={{ flex: 1, minWidth: 0 }}>
                <ListShifts />
            </Item>
        </Stack>
    </div>
  );
}
 