"""Print the next build version: YYYY.MM.DD.BUILD (UTC date + running build number, never resets).

The build number continues the old "1.10.19+ext.N" counter (ext.29 was build 29). A version counts as used once it
is tagged in git (each pushed build is tagged with its version); an untagged current version (a build that failed
or is not committed yet) is reused, so failed runs do not skip numbers.
Usage: python3 tools/next_version.py custom_components/alarmo/const.py
"""

import re
import sys
import datetime as dt
import subprocess

cur = re.search(r'^VERSION = "([^"]+)"', open(sys.argv[1]).read(), re.M).group(1)
tags = subprocess.run(["git", "tag", "--list"], capture_output=True, text=True, check=False).stdout.split()
m = re.search(r"(?:\+ext\.|^\d{4}\.\d{1,2}\.\d{1,2}\.)(\d+)$", cur)
build = int(m.group(1)) if m else 0
legacy = "+ext." in cur  # the old scheme: its builds were never tagged; they all count as used
if legacy or cur in tags:
    build += 1
print(f"{dt.datetime.now(dt.UTC):%Y.%m.%d}.{build}")
