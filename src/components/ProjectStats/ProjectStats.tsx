import { useEffect, useMemo, useRef, useState } from "react";
import MaterialReactTable, {
  type MRT_ColumnDef,
  type MRT_SortingState,
  type MRT_Virtualizer,
} from "material-react-table";
import { ProjectStats } from "../../models/projectStats";
import { projectStatsData } from "../../mocks/projectStats";

const ProjectStatsPage = () => {
  const columns = useMemo<MRT_ColumnDef<ProjectStats>[]>(
    () => [
      {
        accessorKey: "numberOfProjects",
        header: "Liczba projektów",
        size: 150,
      },
      {
        accessorKey: "minimumAmount",
        header: "Kwota minimalna",
        size: 150,
      },
      {
        accessorKey: "maximumAmount",
        header: "Kwota Maksymalna",
        size: 150,
      },
      {
        accessorKey: "averageAmount",
        header: "Średnia Kwota",
        size: 300,
      },
    ],
    []
  );

  //optionally access the underlying virtualizer instance
  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

  const [data] = useState<ProjectStats[]>(() => [projectStatsData]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      //setData(makeData(10_000));
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    //scroll to the top of the table when the sorting changes
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sorting]);

  return (
    <div className="table-container">
      <h2 className="table-title">Statystyki Projektów</h2>
      <MaterialReactTable
        columns={columns}
        data={data}
        enableBottomToolbar={false}
        enableGlobalFilterModes
        enablePagination={false}
        enableRowVirtualization
        muiTableContainerProps={{ sx: { maxHeight: "600px" } }}
        onSortingChange={setSorting}
        state={{ isLoading, sorting }}
        rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} //optional
        rowVirtualizerProps={{ overscan: 8 }} //optionally customize the virtualizer
      />
    </div>
  );
};

export default ProjectStatsPage;
