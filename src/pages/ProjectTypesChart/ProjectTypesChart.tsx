import Chart from "../../components/Chart/Chart";
import { projectTypesChartData } from "../../mocks/projectTypesChartData";
function ProjectTypesChart() {
  return (
    <>
      <Chart
        data={projectTypesChartData}
        title="Projekty graficznie według rodzaju projektu"
      />
    </>
  );
}

export default ProjectTypesChart;
