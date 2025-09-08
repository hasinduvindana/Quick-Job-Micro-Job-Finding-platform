**QuickJob - Micro Job Finding Platform**

**📌 Overview**
QuickJob is a web and mobile application designed to connect job suppliers with employees looking for micro jobs such as plumbing, mechanics, carpentry, and more. The platform simplifies the process of finding and offering short-term, skill-based tasks, ensuring efficient and quick job matching. External users also can find employee for their tasks using this Quick find dunction. Tey can contact or get direction to service Location of employee and rate the experiance also. Built using the latest technologies like Next.js, it provides a seamless user experience with real-time interactions and modern UI components.

**🚀 Features**
User Registration & Authentication: Secure sign-up and sign-in for job suppliers and employees.
User Roles:
Job Suppliers: Post micro jobs with details like job type, description, location, and payment. View applicants and edit ad.
Employees: Browse available jobs and apply with a click.
Job Listings: Filter and search for micro jobs by category, location, and date.
Application Management: Job suppliers can review applicants and assign jobs.
Ratings & Reviews: After job completion, External users can leave ratings and reviews for employee to build trust.
Responsive Design: Works seamlessly across web and mobile devices.

**🛠️ Tech Stack**

Frontend: Next.js (v14.2.14), React.js, Tailwind CSS
Backend: Node.js, Express.js
Database: Firebase
Authentication: Firebase Authentication
Deployment: Vercel 

**📂 Project Structure**

Copy code

├── components/           # Reusable React components

├── pages/                # Next.js pages (routes)

│   ├── api/              # API routes

│   ├── index.js          # Home page

│   ├── sign-in.js        # Sign-in page

│   └── sign-up.js        # Sign-up page

├── public/               # Static assets (images, icons, etc.)

├── styles/               # Tailwind CSS configurations

├── utils/                # Helper functions and utilities

├── package.json          # Project metadata and dependencies

└── README.md             # Documentation (this file)

**🛠️ Installation & Setup**
To get a local copy of the project up and running, follow these steps:

Prerequisites
Ensure you have the following installed:

Node.js (v18.x.x or higher)
npm (v9.x.x or higher)
MongoDB
Step 1: Clone the Repository
bash
Copy code
git clone https://github.com/hasinduvindana/Quick-Job-Micro-Job-Finding-platform.git
cd Quick-Job-Micro-Job-Finding-platform
Step 2: Install Dependencies
bash
Copy code
npm install
Step 3: Configure Environment Variables
Create a .env file in the root directory and add the following:

makefile
Copy code
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
NEXT_PUBLIC_API_URL=http://localhost:3000
Step 4: Run the Application
bash
Copy code
npm run dev
The application will be accessible at http://localhost:3000.

**📱 Mobile Compatibility**

The platform is fully responsive and optimized for mobile devices. To view the mobile version, simply access the website on your smartphone or use browser developer tools.

**🧩 Key Components**

Authentication: Secure login and registration system.
Job Listings: Dynamic listings that allow suppliers to post jobs and employees to apply.
Dashboard: A personalized dashboard for users to manage job posts, applications, and more.

**🚧 Future Enhancements**

Payment Integration: Add secure payment gateways for job transactions.
Real-Time Notifications: Notify users of new job posts and applications in real-time.
Profile Verification: Enable profile verification to enhance trust and reliability.

**🤝 Contributing**

Contributions are welcome! Please follow these steps:

Fork the repository.
Create a new branch (git checkout -b feature-branch).
Commit your changes (git commit -m 'Add new feature').
Push to the branch (git push origin feature-branch).
Open a pull request.

**📝 License**

This project is licensed under the MIT License - see the LICENSE file for details.

**📧 Contact**

For any inquiries or support, please contact:

Hsindu Vindana - hasinduvindana@gmail.com

**Project UI**
--> Home page UI
<img width="1897" height="908" alt="Screenshot 2025-09-05 174440" src="https://github.com/user-attachments/assets/2fda962c-9367-4971-8646-c130fb17b2af" />
--> Signin Page UI
<img width="1918" height="905" alt="Screenshot 2025-09-05 174516" src="https://github.com/user-attachments/assets/d7c746d8-f3f7-4f1a-a8ec-7566ac7e548e" />
--> Admin Dashboard UI
<img width="1897" height="908" alt="Screenshot 2025-09-05 174617" src="https://github.com/user-attachments/assets/3e23a1b8-2c3b-415c-ab9c-08dee4bce5f9" />
--> Employee Dashboard UI
<img width="1918" height="905" alt="Screenshot 2025-09-05 174704" src="https://github.com/user-attachments/assets/e219381a-1b38-4769-a2b8-ba7fdc3aaa45" />
--> Job Post[id] Page UI
<img width="1897" height="908" alt="Screenshot 2025-09-05 174744" src="https://github.com/user-attachments/assets/703a0e85-a5c2-4cee-8824-7389ff805b23" />
--> Quick Find UI
<img width="1897" height="908" alt="Screenshot 2025-09-05 174846" src="https://github.com/user-attachments/assets/419106c4-cfad-437f-8e9f-f8062e61e147" />
--> Rate Employee UI
<img width="1897" height="908" alt="Screenshot 2025-09-05 174918" src="https://github.com/user-attachments/assets/64707487-b244-4350-bfff-acbd27970d41" />






