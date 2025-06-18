# JobConnectX

**JobConnectX** is a full-featured job portal built with the MERN stack that connects recruiters and candidates seamlessly. Featuring real-time chat powered by **Socket.IO**, communication is activated when a recruiter selects a candidate’s resume — just like how modern job platforms operate.

---

## 🚀 Live Demo

🌐 [Frontend]()
🌐 [Backend]()

---

## 🧠 Features

* 👥 Role-based Authentication (Recruiter / Candidate)
* 📄 Resume Upload & Management
* 💼 Job Listings and Applications
* ⚡ Real-Time Chat via Socket.IO
* 🔐 JWT-based Authentication (Access & Refresh Tokens)
* ☁️ Resume/Image Uploads via Multer + Cloudinary
* 🎯 REST API Architecture
* 🗃️ State Management with Redux Toolkit
* 📱 Responsive UI with TailwindCSS

---

## 🏗️ Tech Stack

| Layer      | Technologies                             |
| ---------- | ---------------------------------------- |
| Frontend   | React, Redux Toolkit, Axios, TailwindCSS |
| Backend    | Node.js, Express.js                      |
| Database   | MongoDB with Mongoose                    |
| Real-Time  | Socket.IO                                |
| Uploads    | Multer, Cloudinary                       |
| Auth       | JWT (Access + Refresh Tokens)            |
| Deployment | Render / Vercel / Netlify                |

---

## 🔄 Real-Time Chat Flow

1. Recruiter browses resumes.
2. On selection, recruiter and candidate are connected in real-time using **WebSocket events**.
3. Real-time chat is enabled.
4. Messages are stored in MongoDB for future reference.

---

## 📁 Folder Structure

```
JobConnectX/
├── FrontEnd/             # React Frontend
│   ├── components/
│   ├── pages/
│   └── redux/
└── BackEnd/             # Node + Express Backend
    ├── routes/
    ├── models/
    ├── controllers/
    └── socket/         # WebSocket logic (Socket.IO)
```

---

## 📸 Screenshots

> *(Add these for more visual appeal in interviews)*

* Resume Listing UI
* Recruiter Dashboard
* Chat Window
* User Profile Page

---

## 🛠️ Installation

### 🔧 Frontend Setup

```bash
cd FrontEnd
npm install
npm start
```

### 🔧 Backend Setup

```bash
cd BackEnd
npm install
npm start
```

📓 Create `.env` file in the `server/` folder with:

* MONGO\_URI
* JWT\_SECRET
* CLOUDINARY\_CLOUD\_NAME / KEY / SECRET

---

## 🌟 Why This Project Stands Out in Interviews

* ✅ Real-time communication with Socket.IO
* ✅ Role-based access and JWT auth
* ✅ Secure file handling (Multer + Cloudinary)
* ✅ State management with Redux Toolkit
* ✅ Clean code structure & modular design

---

## 📧 Contact

👨‍💼 Built by **Sarvesh Deshpande**
📌 System Engineer @ TCS | Full Stack Developer
🔗 [LinkedIn](https://linkedin.com/in/your-profile)
🔗 [GitHub](https://github.com/sarveshd92)

---

## 📜 License

This project is licensed under the MIT License.
