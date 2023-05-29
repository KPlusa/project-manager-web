import { Project } from "../models/project";

export const projectTypes = [
  "Zewnętrzny",
  "Wewnętrzny",
  "Techniczny",
  "Finansowy",
  "Handlowy",
];
export const projectStatuses = [
  "Nowy",
  "Rozpoczęty",
  "Zakończony",
  "Wstrzymany",
];

export const data: Project[] = [
  {
    idProject: 1,
    projectType: "Zewnętrzny",
    projectStatus: "Rozpoczęty",
    projectNumber: "123214",
    projectTitle: "Projekt Major",
    startDate: "2022-12-12",
    endDate: undefined,
    sum: 20000,
    comments: "",
  },
  {
    idProject: 2,
    projectType: "Zewnętrzny",
    projectStatus: "Nowy",
    projectNumber: "16324",
    projectTitle: "Sample Project",
    startDate: "2022-01-03",
    endDate: undefined,
    sum: 150000,
    comments: "",
  },
];
