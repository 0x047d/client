
#!/bin/bash

set -e -u -o pipefail # Fail on error

dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd $dir

client_dir="$dir/../.."
bucket_name=${BUCKET_NAME:-}
save_dir="/tmp/s3index"

if [ "$bucket_name" = "" ]; then
  echo "No BUCKET_NAME"
  exit 1
fi

echo "Loading release tool"
"$client_dir/packaging/goinstall.sh" "github.com/keybase/release"
release_bin="$GOPATH/bin/release"

mkdir -p $save_dir
echo "Creating index.html"
$release_bin index-html --bucket-name="$bucket_name" --prefixes="darwin/,linux_binaries/deb/,linux_binaries/rpm/" --dest="$save_dir/index.html"
echo "Linking latest"
$release_bin latest --bucket-name="$bucket_name"
echo "Syncing"
s3cmd sync --acl-public --disable-multipart $save_dir/* s3://$bucket_name/
