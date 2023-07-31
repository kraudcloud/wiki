the kraudcloud documentation,

available on <https://docs.kraudcloud.com>

prepare:

    pip install mkdocs-material

for dev:

    mkdocs serve

for prod:

    mkdocs build -f mkdocs.insiders.yml
    rsync -av site/  leweb2:/srv/docs.kraudcloud.com
