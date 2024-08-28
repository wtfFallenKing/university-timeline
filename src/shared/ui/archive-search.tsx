import { Autocomplete, Link, TextField, createFilterOptions } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

import { facultyUrl, departmentUrl, teacherUrl, deaneryUrl, translate } from '~/shared/links';

import { getFaculties } from '../loader';
import { IFaculty } from '../types';

type SearchOption = {
  label: string;
  link: string;
};

function ArchiveSearch() {
  const [faculties, setFaculties] = useState<IFaculty[]>([]);
  const navigate = useNavigate();

  const options = useMemo<SearchOption[]>(
    () =>
      Object.values(
        faculties
          .flatMap((faculty) => [
            {
              label: translate(faculty.name),
              link: facultyUrl(faculty.name),
            },
            ...faculty.deanery.map((teacher) => ({
              label: translate(teacher.name),
              link: deaneryUrl(faculty.name, teacher.name),
            })),
            ...faculty.departments.flatMap((department) => [
              {
                label: translate(department.name),
                link: departmentUrl(faculty.name, department.name),
              },
              ...department.teachers.map((teacher) => ({
                label: translate(teacher.name),
                link: teacherUrl(faculty.name, department.name, teacher.name),
              })),
            ]),
          ])
          .reduce(
            (prev, curr) => ({
              ...prev,
              [curr.label]: curr,
            }),
            {} as { [key: string]: SearchOption },
          ),
      ),
    [faculties],
  );

  useEffect(() => {
    (async () => {
      setFaculties(await getFaculties());
    })();
  }, []);

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 100,
  });

  return (
    <Autocomplete
      options={options}
      disablePortal
      filterOptions={filterOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Поиск"
          InputProps={{
            ...params.InputProps,
            startAdornment: <SearchIcon />,
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} onClick={() => navigate(option.link)}>
          <Link component={RouterLink} to={option.link}>
            {option.label}
          </Link>
        </li>
      )}
    />
  );
}

export default ArchiveSearch;
