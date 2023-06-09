import { useCallback, useMemo, useState, useEffect } from "react";
import MaterialReactTable, {
  type MaterialReactTableProps,
  type MRT_Cell,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  darken,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { data, projectStatuses, projectTypes } from "../../mocks/projectData";
import { Project } from "../../models/project";
import "./table.css";

const ProjectTable = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState<Project[]>(() => data);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});
  const [checked, setChecked] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleCreateNewRow = (values: Project) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const handleSaveRowEdits: MaterialReactTableProps<Project>["onEditingRowSave"] =
    async ({ exitEditingMode, row, values }) => {
      if (!Object.keys(validationErrors).length) {
        tableData[row.index] = values;
        //send/receive api updates here, then refetch or update local table data for re-render
        setTableData([...tableData]);
        exitEditingMode(); //required to exit editing mode and close modal
      }
    };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row: MRT_Row<Project>) => {
      if (
        !confirm(
          `Czy jesteś pewien, że chcesz usunąć ten projekt: ${row.getValue(
            "projectType"
          )}`
        )
      ) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData]
  );

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<Project>
    ): MRT_ColumnDef<Project>["muiTableBodyCellEditTextFieldProps"] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "endDate" || cell.column.id === "comments"
              ? true
              : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `To pole jest wymagane`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo<MRT_ColumnDef<Project>[]>(
    () => [
      {
        accessorKey: "idProject",
        header: "Identyfikator",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
          disabled: true,
        }),
      },
      {
        accessorKey: "projectType",
        header: "Rodzaj Projektu",
        size: 140,
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          children: projectTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          )),
        },
      },
      {
        accessorKey: "projectStatus",
        header: "Status Projektu",
        size: 140,
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          children: projectStatuses.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          )),
        },
      },
      {
        accessorKey: "projectNumber",
        header: "Nr Projektu",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "projectTitle",
        header: "Temat Projektu",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "startDate",
        header: "Data Rozpoczęcia",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "date",
        }),
      },
      {
        accessorKey: "endDate",
        header: "Data Zakończenia",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "date",
          InputLabelProps: { shrink: true },
        }),
      },
      {
        accessorKey: "sum",
        header: "Kwota",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
      {
        accessorKey: "comments",
        header: "Uwagi",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "float",
        }),
      },
    ],
    [getCommonEditTextFieldProps]
  );

  return (
    <div className="table-container">
      <h2 className="table-title">Projekty</h2>
      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            header: "Akcje",
            muiTableHeadCellProps: {
              align: "center",
            },
            size: 120,
          },
        }}
        columns={
          checked
            ? columns
            : columns.filter((column) => column.accessorKey !== "idProject")
        }
        data={tableData}
        muiTableBodyProps={{
          sx: (theme) => ({
            "& tr:nth-of-type(odd)": {
              backgroundColor: darken(theme.palette.background.default, 0.1),
            },
          }),
        }}
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        enableColumnFilterModes
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <>
            <Button
              color="primary"
              onClick={() => setCreateModalOpen(true)}
              variant="contained"
            >
              Dodaj nowy projekt
            </Button>
            <FormControlLabel
              control={<Switch checked={checked} onChange={handleChange} />}
              label="Pokaż szczegóły"
            />
          </>
        )}
      />
      <CreateNewProjectModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </div>
  );
};

interface CreateModalProps {
  columns: MRT_ColumnDef<Project>[];
  onClose: () => void;
  onSubmit: (values: Project) => void;
  open: boolean;
}

//example of creating a mui dialog modal for creating new rows
export const CreateNewProjectModal = ({
  open,
  columns,
  onClose,
  onSubmit,
}: CreateModalProps) => {
  const clearedValues = columns.reduce((acc, column) => {
    acc[column.accessorKey ?? ""] = "";
    return acc;
  }, {} as any);

  const [values, setValues] = useState<any>(clearedValues);

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (open) {
      setValues({ ...clearedValues });
      setValidationErrors({});
    }
    document.title = "Projekty";
  }, [open]);

  const requiredFields = useMemo(() => {
    return columns
      .filter((column) => column.muiTableBodyCellEditTextFieldProps)
      .map((column) => column.accessorKey);
  }, [columns]);

  const handleSubmit = () => {
    //put your validation logic here
    const newValidationErrors: Record<string, string> = {};

    // Iterate through the required fields and check for empty values
    requiredFields.forEach((field) => {
      if (field === "endDate" || field === "comments") {
        return;
      }
      const value = values[field!];
      if (!validateRequired(value)) {
        newValidationErrors[field!] = `To pole jest wymagane`;
      }
    });

    if (Object.keys(newValidationErrors).length === 0) {
      // No validation errors, submit the values

      onSubmit(values);

      onClose();
    } else {
      // Update the validation errors state
      setValidationErrors(newValidationErrors);
    }
  };
  const handleCancel = () => {
    onClose();
  };
  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Dodaj nowy projekt</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column) =>
              column.accessorKey === "projectStatus" ? (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  select // Render a dropdown menu
                  value={values[column.accessorKey]}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                  error={Boolean(validationErrors[column.accessorKey])}
                  helperText={validationErrors[column.accessorKey]}
                >
                  {projectStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              ) : column.accessorKey === "projectType" ? (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  select // Render a dropdown menu
                  value={values[column.accessorKey]}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                  error={Boolean(validationErrors[column.accessorKey])}
                  helperText={validationErrors[column.accessorKey]}
                >
                  {projectTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              ) : column.accessorKey === "startDate" ||
                column.accessorKey === "endDate" ? (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  type="date" // Render a date input
                  value={values[column.accessorKey]}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                  error={Boolean(validationErrors[column.accessorKey])}
                  helperText={validationErrors[column.accessorKey]}
                  InputLabelProps={{ shrink: true }}
                />
              ) : column.accessorKey === "idProject" ? null : (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                  error={Boolean(validationErrors[column.accessorKey!])}
                  helperText={validationErrors[column.accessorKey!]}
                />
              )
            )}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={handleCancel}>Anuluj</Button>
        <Button color="primary" onClick={handleSubmit} variant="contained">
          Dodaj nowy projekt
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value: string) => !!value.length;

export default ProjectTable;
