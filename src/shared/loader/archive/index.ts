import { Faculty, Department, Deanery, Teacher, makeArchiveObjectFromPath } from './factory';

const getArchiveObjects = () =>
  Object.entries(import.meta.glob(`/public/archive/**/*`))
    .filter(([path]) => !path.endsWith('py') && !path.endsWith('json') && !path.includes('parser'))
    .map(([path]) => makeArchiveObjectFromPath(path.replace('/public/archive/', '')));

export const getFaculties = async (): Promise<Faculty[]> => {
  const objects = getArchiveObjects();
  const faculties: Record<string, Faculty> = {};
  objects.forEach((object) => {
    if (!faculties[object.faculty]) {
      faculties[object.faculty] = new Faculty(object.faculty);
    }
    faculties[object.faculty].handleFile(object);
  });
  return Object.values(faculties);
};

export const getFaculty = async (faculty: string): Promise<Faculty | null> => {
  const loader = (await getFaculties()).find((object) => object.name === faculty);
  if (!loader) return null;
  await loader.loadInfo();
  return loader;
};

export const getDepartment = async (
  faculty: string,
  department: string,
): Promise<Department | null> => {
  const facultyLoader = await getFaculty(faculty);
  if (!facultyLoader) return null;
  const departmentLoader = facultyLoader.departments.find(
    (departmentLoader) => departmentLoader.name === department,
  );
  if (!departmentLoader) return null;
  await departmentLoader.loadInfo();
  return departmentLoader;
};

export const getTeacher = async (
  faculty: string,
  department: string,
  teacher: string,
): Promise<Teacher | null> => {
  const departmentLoader = await getDepartment(faculty, department);
  if (!departmentLoader) return null;
  const teacherLoader = departmentLoader.teachers.find(
    (teacherLoader) => teacherLoader.name === teacher,
  );
  if (!teacherLoader) return null;
  await teacherLoader.loadInfo();
  return teacherLoader;
};

export const getDeanery = async (faculty: string, deanery: string): Promise<Deanery | null> => {
  const facultyLoader = await getFaculty(faculty);
  if (!facultyLoader) return null;
  const deaneryLoader = facultyLoader.deanery.find(
    (deaneryLoader) => deaneryLoader.name === deanery,
  );
  if (!deaneryLoader) return null;
  await deaneryLoader.loadInfo();
  return deaneryLoader;
};