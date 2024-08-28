import { IDeanery, IDepartment, IFaculty, ITeacher } from '~/shared/types';

type ArchiveObject = {
  faculty: string;
  department?: string;
  deanery?: string;
  teacher?: string;
  file: string;
  path: string;
};

const pathToKey = {
  deanery: 'deanery',
  departments: 'department',
  teachers: 'teacher',
};

export const makeArchiveObjectFromPath = (path: string): ArchiveObject => {
  const [faculty, ...parts] = path.split('/');
  const file = parts.splice(-1)[0];
  if (parts.length % 2 !== 0) {
    console.error(`Invalid asset url: ${path}`);
    return { faculty, file, path };
  }
  return {
    faculty,
    file,
    path,
    ...parts
      .flatMap((_, i, arr) => (i % 2 === 0 ? [arr.slice(i, i + 2)] : []))
      .reduce(
        (prev, [key, value]) => ({
          ...prev,
          [pathToKey[key as keyof typeof pathToKey]]: value,
        }),
        {},
      ),
  };
};

const pathBase = '/archive/';

class Loader {
  protected infoPath: string = '';
  protected logoPath: string = '';

  public info: string = '';

  constructor(public name: string) {}

  public handleFile(file: ArchiveObject) {
    if (file.file.endsWith('md')) {
      this.infoPath = file.path;
    } else {
      this.logoPath = file.path;
    }
  }

  public async loadInfo() {
    this.info = await (await fetch(`${pathBase}${this.infoPath}`)).text();
  }

  public get logo(): string {
    return `${pathBase}${this.logoPath}`;
  }
}

export class Faculty extends Loader implements IFaculty {
  public departments: Department[] = [];
  public deanery: Deanery[] = [];

  handleFile(file: ArchiveObject) {
    if (file.department) {
      let department = this.departments.find((department) => department.name === file.department);
      if (!department) {
        department = new Department(file.department);
        this.departments.push(department);
      }
      department.handleFile(file);
    } else if (file.deanery) {
      let deanery = this.deanery.find((deanery) => deanery.name === file.deanery);
      if (!deanery) {
        deanery = new Deanery(file.deanery);
        this.deanery.push(deanery);
      }
      deanery.handleFile(file);
    } else {
      super.handleFile(file);
    }
  }
}

export class Department extends Loader implements IDepartment {
  public teachers: Teacher[] = [];

  handleFile(file: ArchiveObject) {
    if (file.teacher) {
      let teacher = this.teachers.find((teacher) => teacher.name === file.teacher);
      if (!teacher) {
        teacher = new Teacher(file.teacher);
        this.teachers.push(teacher);
      }
      teacher.handleFile(file);
    } else {
      super.handleFile(file);
    }
  }
}

export class Deanery extends Loader implements IDeanery {}
export class Teacher extends Loader implements ITeacher {}