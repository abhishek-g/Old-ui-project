PKG_FILE="$(pwd)/$(npm pack)"
PACKAGE_NAME="$(npm ls 2&>/dev/null | head -1 | cut -d'@' -f1)"

# Fetch all the integrations tests
git clone https://github.com/karma-runner/integration-tests.git --depth 1

# Go to the folder
cd integration-tests

# Only run the tests related to the current package
./run.sh "$PKG_FILE" -g ^"$PACKAGE_NAME"
