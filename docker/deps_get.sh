export VERSION=$(grep SCYTHE_SERVER_VERSION= ../../scythe-server | cut -d = -f2)
export TAG='latest'

if [ ! -r ../deps/st ]; then
    last_release_url=$(curl -sLo /dev/null -w '%{url_effective}' "https://github.com/scythe-suite/scythe-tester/releases/latest")
    version="${last_release_url##*/}"
    echo "Getting st $version:"
    (cd ../deps && curl -#LO "https://github.com/scythe-suite/scythe-tester/releases/download/$version/st")
fi

if [ ! -r ../deps/sf ]; then
    last_release_url=$(curl -sLo /dev/null -w '%{url_effective}' "https://github.com/scythe-suite/sim-fun-i/releases/latest")
    version="${last_release_url##*/}"
    echo "Getting sf $version:"
    (cd ../deps && curl -#LO "https://github.com/scythe-suite/sim-fun-i/releases/download/$version/sf")
fi

if [ ! -r ../deps/tm ]; then
    last_release_url=$(curl -sLo /dev/null -w '%{url_effective}' "https://github.com/scythe-suite/tristo-mietitore/releases/latest")
    version="${last_release_url##*/}"
    echo "Getting tm $version:"
    (cd ../deps && curl -#LO "https://github.com/scythe-suite/tristo-mietitore/releases/download/$version/tm")
fi

if [ ! -r ../deps/site.tgz ]; then
    last_release_url=$(curl -sLo /dev/null -w '%{url_effective}' "https://github.com/scythe-suite/scythe-viewer-ng/releases/latest")
    version="${last_release_url##*/}"
    echo "Getting site.tgz $version:"
    (cd ../deps && curl -#LO "https://github.com/scythe-suite/scythe-viewer-ng/releases/download/$version/site.tgz")
fi

if [ ! -r ../deps/wait-for ]; then
    echo "Getting wait-for:"
    (cd ../deps && curl -#LO https://raw.githubusercontent.com/Eficode/wait-for/a93091b798cfbeae856f3bf3a1151a56629a61bf/wait-for)
fi

chmod a+rx ../deps/*
