import { createBrowserRouter } from 'react-router-dom';

import {
  getFaculties,
  getFaculty,
  getDeanery,
  getDepartment,
  getTeacher,
  getEvents,
} from '~/shared/loader';

import ArchivePage from '~/pages/archive';
import DepartmentPage from '~/pages/department';
import FacultyPage from '~/pages/faculty';
import MapPage from '~/pages/map';
import TeacherPage from '~/pages/teacher';
import TimeLinePage from '~/pages/timeline';
import ErrorPage from '~/pages/error';
import DeaneryPage from '~/pages/deanery';
import { getBuildings } from '~/shared/loader/buildings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <TimeLinePage />,
    loader: async () => {
      return getEvents();
    },
  },
  {
    path: '/archive',
    element: <ArchivePage />,
    loader: async () => {
      return getFaculties();
    },
  },
  {
    path: '/archive/:faculty',
    element: <FacultyPage />,
    errorElement: <ErrorPage />,
    loader: async ({ params: { faculty: facultyName } }) => {
      const faculty = await getFaculty(facultyName as string);
      if (!faculty) {
        throw new Response('Факультет не найден', { status: 404 });
      }
      return faculty;
    },
  },
  {
    path: '/archive/:faculty/departments/:department',
    element: <DepartmentPage />,
    errorElement: <ErrorPage />,
    loader: async ({ params: { faculty: facultyName, department: departmentName } }) => {
      const department = await getDepartment(facultyName as string, departmentName as string);
      if (!department) {
        throw new Response('Кафедра не найдена', { status: 404 });
      }
      return department;
    },
  },
  {
    path: '/archive/:faculty/departments/:department/teachers/:teacher',
    element: <TeacherPage />,
    errorElement: <ErrorPage />,
    loader: async ({
      params: { faculty: facultyName, department: departmentName, teacher: teacherName },
    }) => {
      const teacher = await getTeacher(
        facultyName as string,
        departmentName as string,
        teacherName as string,
      );
      if (!teacher) {
        throw new Response('Преподаватель не найдена', { status: 404 });
      }
      return teacher;
    },
  },
  {
    path: '/archive/:faculty/deanery/:deanery',
    element: <DeaneryPage />,
    errorElement: <ErrorPage />,
    loader: async ({ params: { faculty: facultyName, deanery: deaneryName } }) => {
      const deanery = await getDeanery(facultyName as string, deaneryName as string);
      if (!deanery) {
        throw new Response('Преподаватель не найдена', { status: 404 });
      }
      return deanery;
    },
  },
  {
    path: '/map',
    element: <MapPage />,
    loader: async () => {
      return getBuildings();
    },
  },
]);