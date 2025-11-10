#  SkyDrive – Personal Cloud Storage App

SkyDrive is a full-stack cloud storage platform that allows users to **upload, view, and manage files securely**.  
It’s built using the **MERN stack** with **AWS S3** for file storage and **EC2** for backend hosting.

---

##  Project Preview

App Screenshot

<img width="1911" height="1017" alt="image" src="https://github.com/user-attachments/assets/138e07b4-ff5b-49b0-a03b-b35b0135c0aa" />
<img width="1904" height="1015" alt="image" src="https://github.com/user-attachments/assets/075a0869-32ac-45c1-b1d4-8afa36280808" />


---

## 🚀 Features

- 🔐 **JWT-based Authentication**
  - Secure login and registration
  - Access and refresh tokens stored in `localStorage`
  - Automatic token renewal on expiry
- 📦 **File Management**
  - Upload, list, and delete files on AWS S3
  - Each user has their own isolated storage
- 🌐 **Deployment**
  - **Frontend:** AWS S3 Static Hosting  
  - **Backend:** EC2 with PM2 (auto restart on reboot)
- ⚡ **Optimized for Speed**
  - Axios interceptors for auth
  - React Query for caching and performance
  - Node.js async handlers for efficiency

---

## 🧩 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React + TypeScript + React Query + TailwindCSS |
| **Backend** | Node.js + Express + Mongoose |
| **Database** | MongoDB Atlas |
| **Storage** | AWS S3 |
| **Hosting** | EC2 (backend), S3 (frontend) |
| **Process Manager** | PM2 |
| **Auth** | JWT in localStorage |

---

