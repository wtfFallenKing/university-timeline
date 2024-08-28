import asyncio
import json
import logging
import re
from typing import Any

from bs4 import BeautifulSoup, element
from requests import get

from public.archive.parser.utils import make_dir_if_not_exists, get_md_from_tag

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


def fix_links(elements: str):
    return elements.replace('(/', '(http://www.psu.ru/')


def pre_add_img_src(src: str, prefix: str = 'http://www.psu.ru'):
    if src.startswith(f'{prefix}/'):
        return src
    return f'{prefix}{src}' if src.startswith('/') else f'{prefix}/{src}'


def parse_link(link: element.Tag):
    if link:
        return {
            'text': link.text.strip(),
            'href': pre_add_img_src(link.attrs.get('href'))
        }
    return {}


async def get_faculty_info(faculty_url):
    key_headers = {
        'история факультета',
        'о факультете',
        'краткое описание',
        'об институте',
        'история юридического факультета',
    }

    page = BeautifulSoup(get(faculty_url).text, 'html.parser')
    blog = page.find('div', attrs={'class': 'blog'})

    blocks = blog.find_all('div', attrs={'class': 'yutoks-post-inner'})
    necessary_blocks = []

    for block in blocks:
        title = block.find(attrs={'class': 'yutoks-postheader'})
        if title and title.text.strip().lower() in key_headers:
            necessary_blocks.append(get_md_from_tag(block))

    return fix_links(''.join(necessary_blocks)).strip()


async def parse_ul(url: str) -> list[dict[str, str]]:
    page = BeautifulSoup(get(url).text, 'html.parser')

    uls = page.find('div', attrs={'class': 'cat-children'})
    if uls:
        return [parse_link(li.find('a')) for li in uls.find_all('li')]

    return []


async def get_faculty_deanery(url: str):
    data = []
    page = BeautifulSoup(get(url).text, 'html.parser')

    content = page.find('div', attrs={'class': 'category-desc'})
    if content:
        trs = content.find('table').find_all('tr')
        for tr in trs:
            tds = tr.find_all('td')
            if len(tds) < 2:
                continue

            img: element.Tag = tds[0].find('img')
            text = tds[1].text
            fio = tds[1].find('strong')

            if img and text:
                data.append(
                    {
                        'ФИО': fio and fio.text.strip(),
                        'img': pre_add_img_src(img.attrs.get('src')),
                        'text': get_md_from_tag(text).strip()
                    }
                )

    return data


async def get_faculty_logo(url: str):
    page = BeautifulSoup(get(url).text, 'html.parser')
    logo = page.find('div', attrs={'class': 'category-desc'}).find('img')

    return pre_add_img_src(logo.attrs.get('src')) if logo else ''


async def get_faculties(faculties_url='http://www.psu.ru/fakultety') -> list[dict[str, str]]:
    logging.info("Start parsing faculties")
    return await parse_ul(faculties_url)


async def parse_department(url):
    key_headers = {
        'история',
        'история кафедры',
        'о кафедре',
    }
    page = BeautifulSoup(get(url).text, 'html.parser')
    blog = page.find('div', attrs={'class': 'blog'})

    blocks = blog.find_all('div', attrs={'class': 'yutoks-post-inner'})
    necessary_blocks = []

    for block in blocks:
        title = block.find(attrs={'class': 'yutoks-postheader'})
        if title and title.text.strip().lower() in key_headers:
            necessary_blocks.append(get_md_from_tag(block))

    head = blog.find('div', attrs={'class': 'category-desc'})
    head_img = head.find('img')

    head_obj = {
        'text': '',
        'ФИО': '',
        'img': ''
    }
    if head_img:
        obj = head.prettify()
        head_img_pretty = head_img.prettify()
        head_img_info = get_md_from_tag(obj[obj.index(head_img_pretty) + len(head_img_pretty):])

        fio = head_img_info.split('**')
        head_obj = {
            'text': fix_links(head_img_info.strip()),
            'ФИО': (len(fio) > 1 and fio[1].strip()) or '',
            'img': pre_add_img_src(head_img.attrs.get('src'))
        }

    teachers = [a.attrs.get('href') for a in head.find_all('a') if a.text.lower().strip() == 'сотрудники кафедры']

    return {
        'head': head_obj,
        'teachers': teachers and teachers[0],
        'blocks': fix_links(head_obj['text'] + ''.join(necessary_blocks)).strip()
    }


async def parse_department_teachers(url: str):
    ans = []

    page = BeautifulSoup(get(url).text, 'html.parser')
    table = page.find('table')

    trs = table.find_all('tr')
    for tr in trs:
        tds: list[element.Tag] = tr.find_all('td')
        if len(tds) < 5:
            continue

        img = tds[0].find('img')
        if not img:
            continue

        ans.append(
            {
                'img': pre_add_img_src(img.attrs.get('src'), prefix='https://helios.psu.ru/pls/www_psu_ru/'),
                'ФИО': tds[1].text.strip(),
                'text': f'{tds[3].text.strip()}\n\n'
                        f'{tds[2].text.strip()}\n\n'
                        f'**{tds[1].text.strip()}**\n\n' +
                        "\n\t*".join(tds[4].text.strip().split("\n"))
            }
        )

    return ans


async def parse_faculty(faculty: dict[str, Any]):
    pattern = r'[а-яА-Я\s]*'

    name = faculty['text'].strip()
    base_url = faculty['href'].split('/o-fakultete')[0]

    logging.info(f'\t\tStart parsing faculty "{name}" detail info')
    faculty['info'] = await get_faculty_info(faculty['href'])
    faculty['logo'] = await get_faculty_logo(faculty['href'])
    faculty['deanery'] = await get_faculty_deanery(f'{base_url}/dekanat')
    faculty['departments'] = await parse_ul(f'{base_url}/kafedry')

    logging.info(f'\t\t\tStart parsing faculty "{name}" departments detail info')
    logging.info(f'\t\t\t\t-------------------------------------------')
    for department in faculty['departments']:
        department['info'] = await parse_department(department['href'])

        department_name = [x for x in re.findall(pattern, department['text']) if x][0]
        logging.info(f'\t\t\t\tStart parsing\t\t"{department_name}" detail info')

        if department['info']['teachers']:
            department['teachers'] = await parse_department_teachers(department['info']['teachers'])
            if department['info']['head']['text']:
                department['teachers'].append(department['info']['head'])
            del department['info']['head']

        logging.info(f'\t\t\t\tEnd parsing\t\t\t"{department_name}" detail info')
        logging.info(f'\t\t\t\t-------------------------------------------')

    logging.info(f'\t\t\tEnd parsing faculty "{name}" departments detail info')

    with open(f'output/{name}.json', 'w', encoding='utf8') as file:
        file.write(
            json.dumps(
                faculty, indent=2, ensure_ascii=False
            ).replace(
                'У вас должен быть включен JavaScript для просмотра.', ''
            ).replace(
                'Этот адрес электронной почты защищен от спам-ботов.', ''
            )
        )
    logging.info(f'\t\tEnd parsing faculty "{name}" detail info')


async def parse():
    logging.info("Start parsing faculties")
    faculties: list[dict[str, Any]] = await get_faculties()
    logging.info("End parsing faculties")

    tasks = []
    for faculty in faculties:
        # tasks.append(parse_faculty(faculty))
        await parse_faculty(faculty)
    await asyncio.gather(*tasks)


if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(parse())
