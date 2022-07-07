# File uploader service

This service enables the user to upload a JSON file, and create new events. It parses the JSON file asynchronously.

It provides the following endpoints:

- `POST /upload/events/json`: Uploads a JSON file of maximum `10 MB`. An example of file is:

```
[
  {
    "name": "Outside party 8",
    "date": "2022-07-07T15:46:43+00:00",
    "isOutside": true,
    "organizer": {
      "name": "John Smith"
    },
    "attendees": [
      {
        "name": "Rebecca Johnson",
        "age": 18
      },
      {
        "name": "Kevin Kepler",
        "age": 18
      }
    ]
  },
  {
    "name": "External Techno Rave 8",
    "date": "2022-07-10T15:46:43+00:00",
    "isOutside": true,
    "organizer": {
      "name": "DJ Party"
    },
    "attendees": [
      {
        "name": "Kepler Abismal",
        "age": 22
      }
    ]
  }
]
```

- `POST /events`: Creates a new event. An example of JSON body is:

```
{
    "name": "External Techno Rave 8",
    "date": "2022-07-10T15:46:43+00:00",
    "isOutside": true,
    "organizer": {
      "name": "DJ Party"
    },
    "attendees": [
      {
        "name": "Kepler Abismal",
        "age": 22
      }
    ]
  }
```

If running without Docker and Kubernetes, you will need to set up the env vars on a `.env` file. The values for the `file-uploader` service are:

```
# Env vars
ARG NODE_ENV
ARG DATABASE_URL
ARG PORT
ARG FILE_PARSER_BATCH_SIZE

# Kafka
ARG KAFKA_TOPIC
ARG KAFKA_GROUP_ID
ARG KAFKA_CLIENT_ID
ARG KAFKA_BROKERS

# File parser args
ARG UNPARSED_FILES_DIR
ARG PARSED_FILES_DIR
ARG TMP_DIR
```
