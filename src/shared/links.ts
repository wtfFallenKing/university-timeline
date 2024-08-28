export const facultyUrl = (faculty: string) => `/archive/${faculty}`;
export const departmentUrl = (faculty: string, department: string) =>
  `/archive/${faculty}/departments/${department}`;
export const teacherUrl = (faculty: string, department: string, teacher: string) =>
  `/archive/${faculty}/departments/${department}/teachers/${teacher}`;
export const deaneryUrl = (faculty: string, deanery: string) =>
  `/archive/${faculty}/deanery/${deanery}`;
export const translate = (name: string) => name.trim().replaceAll('_', ' ');
