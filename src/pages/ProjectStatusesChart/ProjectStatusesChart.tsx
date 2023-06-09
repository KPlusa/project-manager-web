import Chart from "../../components/Chart/Chart";
import { projectStatusesChartData } from "../../mocks/projectStatusesChartData";
function ProjectTypesChart() {
  return (
    <>
      <Chart
        data={projectStatusesChartData}
        title="Projekty graficznie według statusu projektu"
      />
    </>
  );
}

export default ProjectTypesChart;
