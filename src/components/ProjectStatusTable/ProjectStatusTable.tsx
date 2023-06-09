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
  Stack,
  TextField,
  Tooltip,
  darken,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { projectStatusesData } from "../../mocks/projectStatuses";
import { ProjectStatus } from "../../models/projectStatus";

const ProjectStatusTable = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState<ProjectStatus[]>(
    () => projectStatusesData
  );
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const handleCreateNewRow = (values: ProjectStatus) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const handleSaveRowEdits: MaterialReactTableProps<ProjectStatus>["onEditingRowSave"] =
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
    (row: MRT_Row<ProjectStatus>) => {
      if (
        !confirm(
          `Czy jesteś pewien, że chcesz usunąć ten status projektu: ${row.getValue(
            "ProjectStatus"
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
      cell: MRT_Cell<ProjectStatus>
    ): MRT_ColumnDef<ProjectStatus>["muiTableBodyCellEditTextFieldProps"] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid = validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `$To pole jest wymagane`,
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

  const columns = useMemo<MRT_ColumnDef<ProjectStatus>[]>(
    () => [
      {
        accessorKey: "projectStatusName",
        header: "Nazwa Statusu Projektu",
        size: 500,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
    ],
    [getCommonEditTextFieldProps]
  );

  return (
    <div className="table-container">
      <h2 className="table-title">Statusy Projektów</h2>
      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            header: "Akcje",
            muiTableHeadCellProps: {
              align: "center",
            },
            size: 100,
          },
        }}
        columns={columns}
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
          <Button
            color="primary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
          >
            Dodaj nowy status projektu
          </Button>
        )}
      />
      <CreateNewProjectStatusModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </div>
  );
};

interface CreateModalProps {
  columns: MRT_ColumnDef<ProjectStatus>[];
  onClose: () => void;
  onSubmit: (values: ProjectStatus) => void;
  open: boolean;
}

//example of creating a mui dialog modal for creating new rows
export const CreateNewProjectStatusModal = ({
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
    //setValues({});
    onClose();
  };
  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Dodaj nowy status projektu</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column) => (
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
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={handleCancel}>Anuluj</Button>
        <Button color="primary" onClick={handleSubmit} variant="contained">
          Dodaj nowy status projektu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value: string) => !!value.length;

export default ProjectStatusTable;
