import logging
from pathlib import Path

from public.archive.parser.utils import make_dir_if_not_exists, apply_function_to_dirs, \
    remove_duplicates

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


def main(path_to_read: Path):
    """
    :param path_to_read:
    :return:
    """
    apply_function_to_dirs(remove_duplicates, work_path=path_to_read)


if __name__ == '__main__':
    path = Path(__file__).parent.parent
    main(path)
    # apply_function_to_files(remove_unnecessary_links)
