#!/bin/bash

echo "wait for api to be up and running"
for i in {1..120}
do
  curl http://localhost:4000/api/v1/version 2> /dev/null
  if [[ $? -eq 0 ]]
  then
    break
  elif [[ $i -eq 120 ]]
  then
    echo "[ERROR] api is not responding!"
    exit 1
  fi
  echo -n "."
  sleep 1
done

FILES="data-master data-employees data-applicants data-jobs data-milestones"
for file in $FILES
do
  psql postgresql://${TEST_POSTGRES_USERNAME}:${TEST_POSTGRES_PASSWORD}@${TEST_POSTGRES_HOST}:${TEST_POSTGRES_PORT}/${TEST_POSTGRES_DATABASE} -f $(dirname $0)/${file}.sql
done

