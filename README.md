Sleep & Dream Tracker
=====================

Project Summary
---------------

This is a modern, full-stack sleep and dream logging application designed for secure management, recording, and analysis of user sleep patterns. The system's primary focus is ensuring data integrity and implementing Role-Based Access Control (RBAC).

Technical Stack
---------------

**Node.js, Express.js, Vue.js 3** (Composition API), **MongoDB, Mongoose,** **JWT (JSON Web Tokens)**

Core Features and Capabilities
------------------------------

### 1\. User Data Management

*   **Full CRUD:** Allows creating, reading, updating, and deleting sleep and dream entries.
    
*   **Data Visualization:** Uses an interactive chart to display analysis of sleep time.
    
*   **Data Integrity:** Manages 1:N table relationships (SleepSession and DreamLog) using cascading deletes.
    

### 2\. Security and Authorization (RBAC)

*   **Authentication:** Secure login and user identification via **JWT** tokens.
    
*   **Administration Panel:** A separate, protected interface for listing and managing users.
    
*   **Role-Based Access:** Critical routes (e.g., /admin) are restricted solely to users with the **admin** role.
    

Quick Start Guide
-----------------

1.  **Clone:** Clone the repository, then install dependencies in both the /server and /client directories (npm install).
    
2.  **Configuration:** Set up the MongoDB URI (mongodb://localhost:27017/test) and the JWT\_SECRET in the /server/.env file.
    
3.  **Launch:** Run the backend and frontend in separate terminals (npm run dev).