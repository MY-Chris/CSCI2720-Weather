# CSCI2720-Weather
CUHK CSCI2720 Course Project

To run this project:
1. build the frontend part in ./weather
/cd ./weather
/npm install
/npm run build

2. link the frontend and backend
/cd ../server
/npm install
/ln -s ../weather/build app

3. start the server
/npm start (in ./server)

4. visit the website
/localhost(run locally)
/server.public.ipaddress(run on server)
