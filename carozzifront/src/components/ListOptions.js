import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import { visuallyHidden } from "@mui/utils";

import axios from "axios";
import NewData from "./NewData";

function getComparator(order, orderBy) {
  return (a, b) => {
    if (order === "asc") {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    } else {
      return b[orderBy] < a[orderBy] ? -1 : 1;
    }
  };
}
function stableSort(array, comparator) {
  return array.slice().sort(comparator);
}

const headCells = [
 
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Nombre',
  },
  {
    id: 'comment',
    numeric: false,
    disablePadding: true,
    label: 'Comentarios',
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
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
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, onDelete, onCreate } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Información
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Add Item">
          <IconButton onClick={onCreate}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function ListOptions({ option }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [dataComp, setDataComp] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/${option}`, {
        headers: {
          //Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setDataComp(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  
  console.log(dataComp)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = dataComp.map((row) => row.Id);
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
  const emptyRows = React.useMemo(
    () =>
    dataComp
        ? Math.max(0, rowsPerPage - (dataComp.length - page * rowsPerPage))
        : 0,
    [dataComp, rowsPerPage, page]
  );
  // console.log(data);
  const visibleRows = React.useMemo(
    () => {
      if (!dataComp) return []; // Verificación de nulidad
      return stableSort(dataComp, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    },
    [dataComp, order, orderBy, page, rowsPerPage]
  );
  const containerStyle = {
    width: '80%', 
    margin: '0 auto' 
  };
  const handleNew = () => {
    setIsDialogOpen(true);
  };

  const handleAddData = (NewData) => {
    // Actualiza el estado de los camiones al agregar un nuevo camión
    setDataComp([...dataComp, NewData]);
    axios
      .get(`http://localhost:8080/api/${option}`, {
        headers: {
          //Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setDataComp(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const getDeleteOption = () => {
    switch (option) {
      case 'specialities':
        return 'deleteSpec';
      case 'equipStatus':
        return 'deleteStatus';
      case 'fails':
        return 'deleteFail';
      case 'failsMode':
        return 'deleteFailMode';
      case 'mantType':
        return 'deleteMantType';
      case 'intType':
        return 'deleteTypeInt';
      case 'activities':
        return 'deleteActiv';
      default:
        return 'newData';
    }
  };

  const handleDelete = () => {
    if (selected.length === 0) {
      return;
    }

    const deleteOption = getDeleteOption();
    console.log(deleteOption)
    
    // Realizar la solicitud de eliminación para cada elemento seleccionado
    selected.forEach((selectedId) => {
      axios
      .delete(`http://localhost:8080/api/${deleteOption}/${selectedId}`, {
          headers: {
            //Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("Elemento eliminado con éxito:", selectedId);
        })
        .catch((error) => {
          console.error("Error al eliminar el elemento:", error);
        });
    });

    // Actualizar el estado después de eliminar los elementos
    const newData = dataComp.filter((row) => !selected.includes(row.Id));
    setDataComp(newData);
    setSelected([]); // Limpiar la selección después de la eliminación
  }

  // Función para determinar la opción de creación de datos correspondiente
  const getNewDataOption = () => {
    switch (option) {
      case 'specialities':
        return 'newSpec';
      case 'equipStatus':
        return 'newStatus';
      case 'fails':
        return 'newFail';
      case 'failsMode':
        return 'newFailMode';
      case 'mantType':
        return 'newMantType';
      case 'intType':
        return 'newTipeInt';
      case 'activities':
        return 'newActiv';
      default:
        return 'newData';
    }
  };

  return (
    <div style={containerStyle}>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            onDelete={handleDelete}
            onCreate={handleNew}
          />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={dataComp.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.Id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.Id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.Id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell align="left">{row.Name}</TableCell>
                      <TableCell align="left">{row.Descrip}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 20, 30]}
            component="div"
            count={dataComp.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <Box sx={{ p: 2 }}>
            <NewData onDataAdded={handleAddData} option={getNewDataOption()} />
          </Box>
        </Dialog>
      </Box>
    </div>
  );
}