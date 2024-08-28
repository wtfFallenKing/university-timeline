import os
import re
import shutil
from os.path import join, isfile
from pathlib import Path
from typing import Callable

import requests
from bs4 import element
from markdownify import markdownify


def get_md_from_tag(tag: element.Tag | str):
    return markdownify(tag.prettify() if isinstance(tag, element.Tag) else tag)


def save_image(file_path: str, src: str):
    if os.path.exists(file_path) or not src:
        return
    with open(file_path, 'wb') as img:
        img.write(requests.get(src).content)


def save_md(file_path: str, src: str):
    if os.path.exists(file_path):
        return
    with open(file_path, 'w', encoding='utf8') as md:
        md.write(src)


def make_dir_if_not_exists(path):
    if not os.path.exists(path):
        os.makedirs(path)


def remove_unnecessary_links(
    file_path: str,
    encoding='utf8',
    pattern=r'\[(\«|)[а-яА-Я\s\ \>]+\]\(http(s|):\/\/[a-zA-Z\.\/\-]*\)',
    delete=False
):
    with open(file_path, encoding=encoding) as file:
        data = file.read()

    flag = False
    for match in re.finditer(pattern, data):
        flag = True
        key_string = match.group(0).strip()

        if 'подробнее' in key_string:
            data = data.replace(key_string, '')
        else:
            if not delete:
                data = data.replace(key_string, key_string[key_string.index('[') + 1: key_string.index(']')])
            else:
                data = data.replace(key_string, '')

    if flag:
        with open(file_path, 'w', encoding=encoding) as file:
            file.write(data)


def remove_duplicates(
    file_path: str
):
    if ' ' in file_path:
        print(file_path)
        shutil.rmtree(file_path)


def apply_function_to_files(
    func: Callable,
    extension: str = '.md',
    work_path: Path | str = Path(__file__).parent.parent,
    **kwargs
):
    for obj in os.listdir(str(work_path)):
        obj_path = join(work_path, obj)

        if isfile(obj_path):
            if obj.endswith(extension):
                func(obj_path, **kwargs)
        else:
            apply_function_to_files(func, work_path=obj_path)


def apply_function_to_dirs(
    func: Callable,
    work_path: Path | str = Path(__file__).parent.parent,
    **kwargs
):
    for obj in os.listdir(str(work_path)):
        obj_path = join(work_path, obj)

        if isfile(obj_path):
            continue

        # apply to childes
        apply_function_to_dirs(func, work_path=obj_path)
        # apply to itself
        func(obj_path)
