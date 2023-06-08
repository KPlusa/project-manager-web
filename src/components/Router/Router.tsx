import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Home from "../../pages/Home/Home";
import Projects from "../../pages/Projects/Projects";
import ProjectTypes from "../../pages/ProjectTypes/ProjectTypes";
import ProjectStatuses from "../../pages/ProjectStatuses/ProjectStatuses";
import ProjectTypesChart from "../../pages/ProjectTypesChart/ProjectTypesChart"
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
function Router() {
  const Layout = () => {
    return (
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
    );
  };

  const BrowserRoutes = () => {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/project-types" element={<ProjectTypes />} />
              <Route path="/project-statuses" element={<ProjectStatuses />} />
              <Route path="/project-types-chart" element={<ProjectTypesChart />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </>
    );
  };
  return (
    <>
      <BrowserRoutes />
    </>
  );
}

export default Router;
