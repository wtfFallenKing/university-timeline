import json
import logging
import os
import re
from os import listdir
from os.path import isfile, join
from pathlib import Path

from typing import Callable

import requests

from public.archive.parser.utils import make_dir_if_not_exists, save_md, save_image, apply_function_to_files, \
    remove_unnecessary_links

make_dir_if_not_exists('logs')
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    encoding='utf8',
    handlers=[
        logging.FileHandler('logs/archive_creator.log'),
        logging.StreamHandler()
    ]
)


def save_collection(base_path: str, collection: list[dict], default_img_extension=None):
    logging.info(f'\t\t\t\tSaving collection')
    for item in collection:
        info = item.get('text') or item.get('info', '')
        item_name = item.get('ФИО', '').replace(' ', '_')
        if not item_name and '**' in info:
            item_name = info.split('**')[1]

        if item_name:

            logging.info(f'\t\t\t\t\tSaving {item_name}')
            item_name = join(base_path, item_name)

            make_dir_if_not_exists(item_name)

            save_md(join(item_name, f'info.md'), info)

            extension = default_img_extension
            if extension is None:
                extension = os.path.basename(item["img"]).split(".")[-1]
            save_image(join(item_name, f'info.{extension}'), item['img'])
        else:
            print(item)
    logging.info(f'\t\t\t\tEnd saving collection')


def create_files_and_dirs(path_to_write, faculty: dict):
    """
    :param path_to_write:
    :param faculty:
    :return:

    archive/
        faculty_name/
            info.md
            logo.jpg

            deanery/
                ФИО/
                    info.md
                    info.jpg

            departments/
                department_name/
                    info.md
                    teachers/
                        ФИО/
                            info.md
                            info.jpg
    """
    pattern = r'[\«а-яА-Я\s]*'

    faculty_name = join(path_to_write, faculty['text'].replace(' ', '_'))
    faculty_deanery_name = join(faculty_name, 'deanery')
    faculty_departments_name = join(faculty_name, 'departments')

    logging.info(f'\t\tCreating faculty dirs and logo')
    make_dir_if_not_exists(faculty_name)
    make_dir_if_not_exists(faculty_deanery_name)
    make_dir_if_not_exists(faculty_departments_name)

    # save faculty logo
    save_image(join(faculty_name, f'logo.jpg'), faculty['logo'])
    save_md(join(faculty_name, f'info.md'), faculty['info'])
    logging.info(f'\t\tEnd creating faculty dirs and logo')

    # save deanery objects
    logging.info(f'\t\t\tCreating faculty deanery')
    save_collection(faculty_deanery_name, faculty['deanery'])
    logging.info(f'\t\t\tEnd creating faculty deanery')

    logging.info(f'\t\tCreating faculty departments')
    for department in faculty['departments']:
        department_name_ = [x for x in re.findall(pattern, department['text']) if x][0].replace(' ', '_')
        department_name = join(faculty_departments_name, department_name_)
        department_name_teachers = join(department_name, 'teachers')

        logging.info(f'\t\t\tCreating faculty department {department_name_}')

        make_dir_if_not_exists(department_name)
        make_dir_if_not_exists(department_name_teachers)

        save_md(join(department_name, f'info.md'), department['info']['blocks'])
        if department.get('teachers'):
            save_collection(department_name_teachers, department['teachers'], 'jpg')

        logging.info(f'\t\t\tEnd creating faculty department {department_name_}')


def main(path_to_write: Path, path_to_read='output'):
    """
    :param path_to_write:
    :param path_to_read:
    :return:
    """

    files = [f for f in listdir(path_to_read) if isfile(join(path_to_read, f))]

    for file in files:
        logging.info(f'Start parsing faculty "{file}"')
        with open(join(path_to_read, file), encoding='utf8') as input_file:
            faculty = json.load(input_file)

        create_files_and_dirs(path_to_write, faculty)
        logging.info(f'End parsing faculty "{file}"')

    apply_function_to_files(remove_unnecessary_links, work_path=path_to_write)


if __name__ == '__main__':
    path = Path(__file__).parent.parent
    main(path)
    # apply_function_to_files(remove_unnecessary_links)
