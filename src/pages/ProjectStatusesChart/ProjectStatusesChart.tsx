import Chart from "../../components/Chart/Chart";
import { ProjectStatusesChartData } from "../../mocks/projectStatusesChartData";
function ProjectTypesChart() {
  return (
    <>
      <Chart data={ProjectStatusesChartData} />
    </>
  );
}

export default ProjectTypesChart;
