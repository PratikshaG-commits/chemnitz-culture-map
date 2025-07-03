
Chemnitz Cultural Map – Project Setup


Project Contents:
--------------------
- A map-based web application to show cultural places in Chemnitz.
- You can register, login, save favorite places, and view everything on an interactive map.
- Technologies: HTML, CSS, JS (Leaflet), Node.js, Express.js, MongoDB.

Developed By:
----------------
Name: Pratiksha Kakasaheb Gawande   
Matriculation Number: 806512 
Semester: Summer 2025  
University: TU Chemnitz  
Module: Datenbanken und Web-Techniken


How to Run the App

1. Backend Setup
--------------------
a. Open terminal and go to project folder:
cd chemnitz-culture-map
b. Go to backend folder and install the packages:
cd backend
npm install
c. Start the backend server:
node backend/server.js

Note: This starts the backend at:  
http://localhost:5000


2.  Frontend Setup
----------------------
Open `map.html` from the root folder in any browser.

Tip: If using VS Code, right-click `map.html` → “Open with Live Server”.

You will see:
Login/Register Page  
Map with cultural places  
Category filter, All Places, and Favorites  

NOTE:
- Make sure MongoDB is running on your machine.
- The app uses offline GeoJSON data stored in `/dbwProjectOfflineData/`.


Features You Built


✔ Interactive map (Leaflet.js)  
✔ Categories & Search functionality  
✔ Register, Login & JWT auth  
✔ Favorite places (save/remove)  
✔ "All Places" table with clickable rows  
✔ Animation for markers and favorites  
✔ Stylish dark theme (black + orange)  
✔ Responsive design  
✔ Custom toast messages instead of alerts  
✔ Cancel buttons for favorites and places panels


MongoDB Setup


- Create a database named: `chemnitz_map`
- Create a collection: `users`
- Favorite places are saved in the user document

(Optional) You can use `init_db.js` or import a JSON if shared.


Trouble?

If you see an error like `jwt malformed` – it means you need to login again.

If MongoDB errors appear, check:
- MongoDB is running
- Connection string is correct in `backend/server.js`


That's It!

Enjoy exploring Chemnitz 
