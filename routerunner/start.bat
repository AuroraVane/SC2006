@echo off
echo Starting server...
start cmd /k "cd server && npm start"

echo Starting client...
start cmd /k "cd client && npm start"

echo Both client and server are starting in separate windows.