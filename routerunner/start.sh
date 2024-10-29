#!/bin/bash

# Start the server in the background
(cd server && npm start) &

# Start the client in the background
(cd client && npm start) &