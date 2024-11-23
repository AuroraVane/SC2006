# RouteRunner 🚀  
_Right Job, Right Runner, Right Time_

## Team Members
- [Gay Ming Kai](https://github.com/AuroraVane)
- [Low Kan Yui](https://github.com/lowkanyui)
- [Khoo An Xian](https://github.com/khooax)
- [Tan Hsuen Yin Andria](https://github.com/andriathy)
- [Aung Aung Pyae Phyo](https://github.com/AAPP02)


---

## Purpose  
**RouteRunner** automates job assignment and optimizes every match, offering:  
- **Smart job allocation** tailored for SMEs.  
- A dynamic assignment of new jobs with a **simple UI** for small businesses.  

---

## Target Users  
- Service Technicians  
- Sales Representatives  
- Property Inspectors  

---

## Novelty  
- **Existing Apps:** Focus on route planning for pre-scheduled jobs, often too complex for SMEs.  
- **RouteRunner:** Provides **dynamic job assignment** and a simple user interface designed for small businesses.

---

## Features and Functionalities  

### **Key Features**  
1. **Layered Security:** Robust measures for Runner account creation.  
2. **Smart Job Allocation:** Assign jobs based on priority, location, and runner availability.  
3. **Carpark Convenience:** Integrated car park availability for runners.  

### **Operator Functionalities**  
- Manage Runners (Create, Read, Update, Delete).  
- Manage Jobs (Create, Read, Update, Delete).  
- View Active Runners.

### **Runner Functionalities**  
- View Assigned Routes.  
- View Assigned Jobs.

---

## APIs Used  
- **Google Maps**: Geolocation and routing.  
- **Firebase**: Backend and database.  
- **OneMap**: Singapore-specific map data.  
- **GovTech Carpark Availability**: Real-time carpark availability.

---

## System Design  

### **1. BCE Class Design**  
- **Boundary (Presentation)**: Manages the UI.  
- **Control (Application Logic)**: Handles the app’s logic and workflows.  
- **Entity (Persistent Data)**: Stores and manages data.  
- Promotes **modularity** and follows a **3-layer architecture**.

### **2. Design Principles**
- **Single Responsibility Principle**: Each class/function focuses on a single task.  
- **Principle of Least Knowledge**: Minimizes dependencies between components.  
- **Open-Closed Principle**: New features can be added without modifying existing code.



## Conclusion  
- Dynamic job allocation and car park integration provide unmatched convenience.  
- Scalable and extensible for future development.  
- Built with robust software engineering practices, making it an invaluable tool for SMEs.

## Reference
- [Youtube Video](https://youtu.be/NFL_Co6FD74)
---