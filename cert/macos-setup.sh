#! /bin/zsh

if [[ $# -ne 1 ]]; then
    echo "Usage: $0 <Enterprise Certificate Common Name>"
    exit 1
fi

ENTERPRISE_CERT_CA="$1"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PEM_FILE="$SCRIPT_DIR/$(echo "$ENTERPRISE_CERT_CA" | tr ' ' '-' | tr '[:upper:]' '[:lower:]').pem"

# Extract Enterprise CA to a PEM file.
if [[ -f "$PEM_FILE" ]]; then
    echo "$ENTERPRISE_CERT_CA PEM file already exists. Skipping extraction."
else
    echo "Extracting $ENTERPRISE_CERT_CA from System Keychain..."
    security find-certificate -c "$ENTERPRISE_CERT_CA" -p > "$PEM_FILE"
    echo "Certificate saved to $PEM_FILE"
fi