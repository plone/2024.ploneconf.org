"""Installer for the ploneconf package."""

from pathlib import Path
from setuptools import find_packages
from setuptools import setup


long_description = f"""
{Path("README.md").read_text()}\n
{Path("CONTRIBUTORS.md").read_text()}\n
{Path("CHANGES.md").read_text()}\n
"""


setup(
    name="ploneconf",
    version="1.0.0a1",
    description="Plone Conference 2024 configuration package.",
    long_description=long_description,
    long_description_content_type="text/markdown",
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Environment :: Web Environment",
        "Framework :: Plone",
        "Framework :: Plone :: Addon",
        "Framework :: Plone :: 6.0",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Operating System :: OS Independent",
        "License :: OSI Approved :: GNU General Public License v2 (GPLv2)",
    ],
    keywords="Python Plone CMS",
    author="PloneGov-BR",
    author_email="gov@plone.org.br",
    url="https://github.com/plone/2024.ploneconf.org",
    project_urls={
        "PyPI": "https://pypi.python.org/pypi/ploneconf",
        "Source": "https://github.com/plone/2024.ploneconf.org",
        "Tracker": "https://github.com/plone/2024.ploneconf.org/issues",
    },
    license="GPL version 2",
    packages=find_packages("src", exclude=["ez_setup"]),
    package_dir={"": "src"},
    include_package_data=True,
    zip_safe=False,
    python_requires=">=3.8",
    install_requires=[
        "setuptools",
        "Plone",
        "plone.api",
        "collective.exportimport",
        "pas.plugins.authomatic",
        "plone.app.multilingual",
        "collective.volto.formsupport",
        "collective.honeypot",
        "collective.volto.otp",
        "plone.exportimport",
        "Products.Membrane",
        "souper.plone",
        "bcrypt",
    ],
    extras_require={
        "test": [
            "Products.PrintingMailHost",
            "zest.releaser[recommended]",
            "zestreleaser.towncrier",
            "plone.app.testing",
            "plone.restapi[test]",
            "pytest",
            "pytest-cov",
            "pytest-plone>=0.5.0",
        ],
    },
    entry_points="""
    [z3c.autoinclude.plugin]
    target = plone
    [console_scripts]
    update_i18n = ploneconf.locales.update:update_locale
    """,
)
