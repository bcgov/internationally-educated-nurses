psql postgresql://${TEST_POSTGRES_USERNAME}:${TEST_POSTGRES_PASSWORD}@${TEST_POSTGRES_HOST}:${TEST_POSTGRES_PORT}/${TEST_POSTGRES_DATABASE} -f $(dirname $0)/seed-test-data
