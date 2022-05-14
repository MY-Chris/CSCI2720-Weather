# CSCI2720-Weather  
CUHK CSCI2720 Course Project  

To run this project:  
  
build the frontend part:  
cd ./weather  
npm install  
npm run build  
  
link the frontend and backend:  
cd ../server  
npm install  
ln -s ../weather/build app  
  
start the server:  
npm start (in ./server)  
  
visit the website:  
http://localhost(run locally)  
http://server.public.ipaddress(run on server)  
