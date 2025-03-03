# IoT Application for Smart Home Energy Monitoring 🎛️⚡🏠

## Overview 🌍📊🔋

This project is an IoT-based Smart Home Energy Monitoring System that allows users to track real-time energy consumption of household appliances, visualize trends, and manage their energy usage efficiently. The system consists of a React-based frontend, a python FastAPI backend, and a database for data storage, running on Kubernetes and Docker. Kubernetes was chosen for its ability to efficiently manage containerized applications at scale, while Docker simplifies the packaging and deployment of application components, ensuring consistency across different environments. 🚀📡🔧

## Features 🏠⚡📉

### **Frontend** 🎨📲💡

- Displays real-time energy consumption data from smart meters and plugs.
- Provides interactive charts to visualize energy trends (line graphs, bar charts).
- Allows users to set energy usage budgets and receive alerts when limits are exceeded.
- User-friendly UI for managing accounts and preferences.

### **Backend** 🖥️🔗🛠️

- RESTful API for data ingestion from smart home devices and meters (real/simulated).
- Supports integration with IoT platforms (AWS IoT Core, Azure IoT Core, or simulated data).
- Implements OAuth 2.0 for secure authentication and authorization.
- Database management using PostgreSQL or MongoDB.

## **Tech Stack** 🏗️🖥️⚙️

- **Frontend:** React.js, Material UI, Chart.js/D3.js for data visualization.
- **Backend:** Java Spring Boot, RESTful APIs, OAuth 2.0 authentication.
- **Database:** PostgreSQL / MongoDB.
- **Deployment:** Docker & Kubernetes (AWS/GCP/Azure Cloud).

## **Setup Instructions** 📜🛠️📌

### **Prerequisites** 📋🖥️🔌

Ensure you have the following installed:

- Node.js & npm (for frontend)
- Java & Maven (for backend)
- Docker & Kubernetes (for deployment)
- PostgreSQL / MongoDB (for database)

### **Installation Steps** 🚀💾🔧

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Nieldave/Energy-Monitoring-using-ml.git
   cd Energy-Monitoring-using-ml
   ```

2. **Run Backend (Spring Boot API):**

   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

3. **Run Frontend (React App):**

   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Run the database (PostgreSQL/MongoDB)**

   ```bash
   docker-compose up -d
   ```

5. **Deploy using Kubernetes:** 🚀

   This step ensures the application is containerized and orchestrated efficiently, providing scalability, resilience, and automated management of microservices.

   ```bash
   kubectl apply -f k8s/
   ```

## **Evaluation Criteria** 🏆📊✔️

1. **Technical Proficiency:**
   - Frontend: React.js, Material UI, Chart.js
   - Backend: Java Spring Boot, RESTful API design
   - Database: SQL/NoSQL integration
   - IoT & Cloud: Kubernetes, OAuth 2.0 authentication
2. **Problem-Solving Skills:**
   - Scalable and efficient architecture
   - Multi-source data handling
   - Debugging and troubleshooting
3. **Communication:**
   - Clear code documentation
   - Detailed README with design decisions

## **Bonus Features** ✨📈🛠️

- **Machine Learning**: Predictive analysis for energy consumption & personalized energy-saving tips.
- **Voice Assistant Integration**: Alexa/Google Assistant support.
- **Mobile App**: Remote monitoring & control via a mobile application.

## **Contributors** 🧑‍💻👥📌

- **Author:** Nieldave
- **GitHub:** [https://github.com/Nieldave](https://github.com/Nieldave)
- **Contact:** (Your Email)

## **License** 📜🖊️🔓

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 📄✅💡

---

Please review the solution at [Energy Monitoring using ML](https://github.com/Nieldave/Energy-Monitoring-using-ml). Shankar Ganesh can be reached at [https://github.com/shankarganesh-pj](https://github.com/shankarganesh-pj).

