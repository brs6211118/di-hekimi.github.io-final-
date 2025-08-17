# 🦷 Dental Clinic Management System

Modern, full-stack dental clinic management system with Express.js backend and responsive frontend.

## 🚀 Features

- **Patient Management** - Complete patient records with medical history
- **Appointment Scheduling** - Advanced calendar with conflict detection
- **Digital Odontogram** - Interactive tooth chart for treatment tracking
- **Inventory Management** - Stock tracking and low-stock alerts
- **Invoicing System** - Professional invoice generation and tracking
- **User Management** - Role-based access control
- **Audit Logging** - Complete activity tracking
- **Data Export/Import** - Backup and restore functionality
- **PWA Support** - Offline capable progressive web app

## 🛠️ Tech Stack

- **Backend**: Express.js, Node.js 18+
- **Frontend**: Vanilla JavaScript, Modern CSS
- **Database**: JSON file storage (production-ready for small clinics)
- **Deployment**: Railway (backend) + Static hosting (frontend)

## 📦 Quick Start

### Local Development

```bash
# Clone repository
git clone <your-repo-url>
cd dental-clinic-system

# Install dependencies
npm install

# Seed sample data
npm run seed

# Start development server
npm run dev
```

Visit `http://localhost:5050` to access the application.

### Production Deployment

#### Option 1: Railway (Recommended)
1. Connect your GitHub repo to Railway
2. Deploy automatically with zero configuration
3. Railway will run `npm run deploy` automatically

#### Option 2: Docker
```bash
docker build -t dental-clinic .
docker run -p 8080:8080 dental-clinic
```

## 🌐 API Endpoints

### Collections
- `GET /api/patients` - List patients with pagination and search
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

*Same pattern for: `appts`, `inventory`, `invoices`, `users`, `audit`*

### Special Endpoints
- `GET /health` - Service health check
- `GET /api/export/all` - Export all data
- `POST /api/import/all` - Import all data
- `POST /api/:collection/import` - Bulk import for specific collection

### Query Parameters
- `q` - Search query
- `offset` - Pagination offset
- `limit` - Items per page (max 1000)
- `sort` - Sort field
- `dir` - Sort direction (asc/desc)

Example: `GET /api/patients?q=john&limit=10&sort=name&dir=asc`

## 🔧 Configuration

### Environment Variables
```bash
PORT=5050                # Server port
NODE_ENV=development     # Environment mode
DATA_DIR=./data         # Data storage directory
PUBLIC_DIR=./public     # Static files directory
```

### Data Storage
- Development: `./data/*.json`
- Production: Persistent volume recommended

## 🏗️ Architecture

```
dental-clinic-system/
├── src/
│   ├── server.js       # Express API server
│   └── seed.js         # Sample data generator
├── public/
│   └── index.html      # Frontend application
├── data/
│   ├── patients.json   # Patient records
│   ├── appts.json      # Appointments
│   ├── inventory.json  # Stock items
│   ├── invoices.json   # Billing records
│   ├── users.json      # System users
│   └── audit.json      # Activity logs
├── Dockerfile          # Container configuration
├── railway.json        # Railway deployment config
└── package.json        # Node.js dependencies
```

## 🔒 Security Notes

- **Authentication**: Basic user system (enhance for production)
- **Data Validation**: Input sanitization implemented
- **CORS**: Configured for cross-origin requests
- **Audit Trail**: All operations logged
- **Backup**: Use export/import for regular backups

## 📱 PWA Features

- **Offline Support**: Service worker caching
- **App-like Experience**: Install to home screen
- **Responsive Design**: Works on all devices
- **Fast Loading**: Optimized performance

## 🚨 Production Checklist

- [ ] Set up proper authentication system
- [ ] Configure database backups
- [ ] Set up monitoring and logging
- [ ] Configure SSL/HTTPS
- [ ] Set environment variables
- [ ] Test disaster recovery

## 📄 License

MIT License - feel free to use for your dental practice!

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## 📞 Support

For support, please create an issue in the GitHub repository.