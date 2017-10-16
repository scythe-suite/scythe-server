export HERE=$(pwd)

rm -f ../deps/{sf,st,tm}

echo "Building sf:"
(cd ../../../sim-fun-i && ./bin/mkdist && cp -f ./release/sf $HERE/../deps)

echo "Building st:"
(cd ../../../scythe-tester && ./bin/mkdist && cp -f ./release/st $HERE/../deps)

echo "Building tm:"
(cd ../../../tristo-mietitore && ./bin/mkdist && cp -f ./release/tm $HERE/../deps)
