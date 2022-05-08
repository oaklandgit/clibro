from setuptools import setup, find_packages

setup(
    name="clibro",
    version="0.1.2",
    description="A visual, asynchronous, command-line web browser \
            that doesn't move focus away from your workflow.",
    author="Larry Stone",
    author_email="larry@larrystone.com",
    url="https://github.com/oaklandgit/clibro",
    packages=find_packages(),
    install_requires=[
        "Pillow>=9.1.0",
        "pixcat>=0.1.4",
        "selenium>=4.1.3",
        "validators>=0.18.2",
    ],
    entry_points={
        'console_scripts': [
            'bro = clibro.bro:main',
        ],
    },
)
