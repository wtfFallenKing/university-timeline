import logging
import logging
import os
from os.path import isfile, join
from pathlib import Path
from urllib.parse import unquote

from bs4 import BeautifulSoup, element

from public.archive.parser.utils import make_dir_if_not_exists, get_md_from_tag, save_image, apply_function_to_files, \
    remove_unnecessary_links

make_dir_if_not_exists('./logs')
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    encoding='utf8',
    handlers=[
        logging.FileHandler("./logs/parser.log"),
        logging.StreamHandler()
    ]
)


def parse_building(data: BeautifulSoup, path: str):
    parsed = [
        '| Старое здание | Номер, условное название | Адрес | Год создания | Здание сегодня |',
        '| --- | --- | --- | --- | --- |'
    ]
    table = data.find('tbody')
    parsed = get_md_from_tag(table).strip().split('\n')
    for i, tr in enumerate(table.find_all('tr')):
        tds: list[element.Tag] = tr.find_all('td')
        if len(tds) != 5:
            continue

        old_src = tds[0].find('img')
        new_src = tds[4].find('img')

        old_src = old_src and old_src.attrs.get('src')
        new_src = new_src and new_src.attrs.get('src')

        base_img_path = join(path, 'buildings', str(tds[1].text.strip().replace(' ', '_').replace(' ', '_')))
        make_dir_if_not_exists(base_img_path)

        old_path = join(base_img_path, 'old.jpg')
        new_path = join(base_img_path, 'new.jpg')

        save_image(old_path, old_src)
        save_image(new_path, new_src)

        old_path = old_path[old_path.find('public'):].replace('\\', '/')
        new_path = new_path[new_path.find('public'):].replace('\\', '/')

        parsed[i] = parsed[i].replace("|  |", f"| []({old_path}) |", 1).replace(f"|  |", f"| []({new_path}) |", 1)

    return '\n'.join(parsed)


def parse_history(data: BeautifulSoup):
    return '\n\n\n'.join(get_md_from_tag(p) for p in data.find_all('p'))


def parse_names(data: BeautifulSoup):
    return get_md_from_tag(data.find('ul'))


def parse(path_to_read: Path | str):
    logging.info("Start parsing html")

    path_to_write = join(path_to_read, 'output')

    files = [f for f in os.listdir(path_to_read) if isfile(join(path_to_read, f))]
    for file in files:
        with open(join(path_to_read, file), encoding='utf8') as input_file:
            data = BeautifulSoup(input_file.read(), 'html.parser')

        obj: tuple[str, str] = '', ''
        match file:
            case "university_building.html":
                obj = parse_building(data, path_to_write), 'buildings'
            case "university_history.html":
                obj = parse_history(data), 'history'
            case "university_names.html":
                obj = parse_names(data), 'names'

        if obj[0] and obj[1]:
            with open(join(path_to_write, f'{obj[1]}.md'), 'w', encoding='utf8') as output_file:
                output_file.write(unquote(obj[0]))

    apply_function_to_files(
        remove_unnecessary_links,
        work_path=path_to_write,
        pattern=r'\[[0-9а-яА-Я\s\ \>\[\]]+\]\(http(s|):\/\/[a-zA-Z0-9\.\/\-\?\=а-яА-Я\,\s\&\+\@\:\!\№]*\)',
        delete=True
    )
    apply_function_to_files(
        remove_unnecessary_links,
        work_path=path_to_write,
        pattern=r'\[[0-9а-яА-Я\s\ \>\[\]]+\]\([0-9a-zA-Zа-яА-Я\#\_\-\/\s\"\.\:]*\)',
        delete=True
    )
    apply_function_to_files(
        remove_unnecessary_links,
        work_path=path_to_write,
        pattern=r'\[[0-9а-яА-Я\s\ \>\ \№]+\]\([0-9a-zA-Zа-яА-Я\#\_\-\/\s\"\.\(\)]*\)'
    )

    logging.info("End parsing")


if __name__ == '__main__':
    parse(join(Path(__file__).parent, 'source'))
