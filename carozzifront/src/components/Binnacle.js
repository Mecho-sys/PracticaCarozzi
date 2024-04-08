import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from "@mui/icons-material/Download";

import axios from "axios";

import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { visuallyHidden } from '@mui/utils';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  flexGrow: 1,
}));


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'typeMan',
    numeric: false,
    disablePadding: true,
    label: 'Tipo de mantención',
  },
  {
    id: 'mant',
    numeric: true,
    disablePadding: false,
    label: 'Mantenedor',
  },
  {
    id: 'shift',
    numeric: true,
    disablePadding: false,
    label: 'Jefe de turno',
  },
  {
    id: 'date',
    numeric: true,
    disablePadding: false,
    label: 'Fecha',
  },
  {
    id: 'typeMant',
    numeric: true,
    disablePadding: false,
    label: 'Tipo  de Mantención',
  },
  
  {
    id: 'speciality',
    numeric: true,
    disablePadding: false,
    label: 'Especialidad',
  },
  {
    id: 'plant',
    numeric: true,
    disablePadding: false,
    label: 'Planta',
  },
  {
    id: 'equip',
    numeric: true,
    disablePadding: false,
    label: 'Equipo',
  },
  {
    id: 'details',
    numeric: true,
    disablePadding: false,
    label: 'Detalles',
  },
];


function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, onDownload } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Bitácora
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          <Tooltip title="Download">
            <IconButton onClick={onDownload}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function Binnacle() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openRows, setOpenRows] = React.useState({});

  const [data, setData] = useState([]);

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

  //console.log(data)

  const handleToggleRow = (id) => {
    setOpenRows((prevState) => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((row) => row.Id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [...selected];

    if (selectedIndex === -1) {
      newSelected.push(id);
    } else {
      newSelected.splice(selectedIndex, 1);
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.includes(id);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  // console.log(data);
  const visibleRows = React.useMemo(
    () =>
      stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [data, order, orderBy, page, rowsPerPage]
  );

  const handleDownload = () => {
    axios({
      url: "http://localhost:8080/api/binnacle/downExcel",
      method: "GET",
      responseType: "blob", // Indica que esperamos una respuesta binaria (archivo)
    })
      .then((response) => {
        // Crea un objeto URL para el archivo recibido
        const url = window.URL.createObjectURL(new Blob([response.data]));
        // Crea un enlace temporal y lo hace clic para iniciar la descarga
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Bitacora_de_mantencion.xlsx"); // Nombre del archivo
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar 
          numSelected={selected.length}
          onDownload={handleDownload} 
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.Id);
                const isOpen = openRows[row.Id];
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <React.Fragment key={row.Id}  >
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.Id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.TypeMant}
                      </TableCell>  
                      <TableCell align="right">
                          {row.Mant}
                      </TableCell>
                      <TableCell align="right">{row.ShiftManager}</TableCell>
                      <TableCell align="right">{row.FechaReal}</TableCell>
                      <TableCell align="right">{row.EquipStatus}</TableCell>
                      <TableCell align="right">{row.Speciality}</TableCell>
                      <TableCell align="right">{row.Plant}</TableCell>
                      <TableCell align="right">{row.Equip}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleToggleRow(row.Id)}
                        >
                          {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow align="center">
                      <TableCell align="center" style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                          <Collapse in={isOpen} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                              Detalle de la Mantención
                            </Typography>
                            <Stack direction="row" spacing={2}>
                              <Item>
                                <p>Tipo de mantención</p>
                                <Stack direction="row" spacing={2}>
                                  <Item>{row.Speciality}</Item>
                                </Stack>  
                              </Item>
                              <Item>
                                <p>Fecha</p>
                                <Stack direction="row" spacing={2}>
                                  <Item>{row.FechaReal}</Item>
                                </Stack>
                              </Item>
                              <Item>
                                <p>Turno</p>
                                <Stack direction="row" spacing={2}>
                                  <Item>{row.Turn}</Item>
                                </Stack>
                              </Item>
                        
                              <Item>
                                <p>Tipo de mantenimiento</p>
                                <Stack direction="row" spacing={2}>
                                  <Item>{row.TypeMant}</Item>
                                </Stack>
                                <Stack direction="row" spacing={2}>
                                  <Item>{row.EquipStatus}</Item>
                                </Stack>
                              </Item>
                              <Item>
                                <p>Tiempo de trabajo</p>
                                <Box sx={{ width: 300 }}>
                                  <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
                                    <Item>inicio: {row.InitTime}</Item>
                                    <Item>Entrega: {row.FinishTime}</Item>
                                    <Item>Duración: {row.Duration} h</Item>
                                  </Stack>
                                </Box>
                              </Item>
                            </Stack>


                            <Stack direction="row" spacing={2}>
                              <Item>
                              <p>Trabajadores involucrados</p>       
                              <Stack direction="row" spacing={2}> 
                                <Item>
                                  <p>Jefe de turno</p>
                                  <Stack direction="row" spacing={2}>
                                    <Item>{row.ShiftManager}</Item>
                                  </Stack>
                                </Item>
                                <Item>
                                  <p>Personal</p>
                                  <Item>{row.Mant}</Item>
                                  <Item>{row.Mant2}</Item>
                                  <Item>{row.Mant3}</Item>
                                </Item>  
                                <Item>
                                  <p>Planta</p>
                                  <Item>{row.Plant}</Item>
                                  <p>Num componente</p>
                                  <Item>00000</Item>
                                </Item>  
                                <Item>
                                  <p>Línea</p>
                                  <Item>{row.Area}</Item>
                                  <p>Equipo</p>
                                  <Item>{row.Equip}</Item>
                                </Item>  
                                <Item>
                                  <p>Componente</p>
                                  <Item>{row.Comp}</Item>
                                  <p>Orden de trabajo</p>
                                  <Item>{row.WorkOrder}</Item>
                                </Item> 
                              </Stack>
                              <Stack direction="row" spacing={2}>
                                <Item>
                                  <p>Descripción de actividad</p>
                                  <Item>{row.DescActivity}</Item>
                                  <p>Tipo de falla</p>
                                  <Item>{row.FailureType}</Item>
                                  <p>Modo de Falla</p>
                                  <Item>{row.FailureMode}</Item>
                                </Item> 
                                <Item>
                                  <p>Descripción del trabajo realizado</p>
                                  <Item>{row.Content}</Item>
                                  <p>Descripción del Modo de  falla</p>
                                  <Item>{row.Content2}</Item>
                                  <p>Comentarios</p>
                                  <Item>{row.Comments}</Item>
                                </Item> 
                                <Item>
                                  <p>imagen</p>
                                  <Item>
                                  <img src="logo192.png" alt="logo" />
                                  </Item>
                                </Item>                               
                              </Stack>
                              </Item>                            
                            </Stack>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
