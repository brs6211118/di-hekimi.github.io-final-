# 🚀 GitHub Deployment Guide

Bu guide size dental clinic sistemini GitHub'da nasıl deploy edeceğinizi adım adım anlatıyor.

## 📋 Hazırlık

### 1. Repository Oluşturma
```bash
# Local'de repository başlatma
git init
git add .
git commit -m "Initial commit: Dental clinic management system"

# GitHub'da repo oluşturun ve remote ekleyin
git remote add origin https://github.com/USERNAME/dental-clinic-system.git
git branch -M main
git push -u origin main
```

### 2. Dosya Yapısı
```
dental-clinic-system/
├── src/
│   ├── server.js          # Express API server
│   └── seed.js            # Sample data generator
├── public/
│   ├── index.html         # Frontend (API entegreli)
│   └── api-client.js      # API client library
├── data/
│   └── .gitkeep           # Data folder placeholder
├── package.json           # Dependencies
├── Dockerfile             # Container config
├── railway.json           # Railway deployment
├── .env.example           # Environment variables
├── .gitignore             # Git ignore rules
└── README.md              # Documentation
```

## 🚂 Railway Deployment (Backend)

### Option 1: GitHub Integration (Önerilen)
1. [Railway.app](https://railway.app) hesabı açın
2. "New Project" → "Deploy from GitHub repo"
3. Repository'nizi seçin
4. Environment variables ayarlayın:
   ```
   PORT=8080
   NODE_ENV=production
   ```
5. Deploy otomatik başlar!

### Option 2: Railway CLI
```bash
# Railway CLI kurma
npm install -g @railway/cli

# Login ve deploy
railway login
railway link
railway up
```

**Backend URL'niz:** `https://your-app-name.railway.app`

## 🌐 Frontend Deployment

### Option A: Aynı Railway'de (Kolay)
Backend zaten frontend'i serve ediyor!
- Backend URL'niz aynı zamanda frontend URL'niz

### Option B: Vercel'de Ayrı (Gelişmiş)
```bash
# Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Environment variables
vercel env add NEXT_PUBLIC_API_URL production
# Value: https://your-backend.railway.app
```

## 🔧 Environment Variables

### Backend (.env)
```bash
PORT=8080
NODE_ENV=production
DATA_DIR=./data
PUBLIC_DIR=./public
```

### Frontend (config)
```javascript
// API base URL - production'da değiştirin
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend.railway.app'
  : '';
```

## 📦 Otomatik Deployment (GitHub Actions)

`.github/workflows/deploy.yml` ekleyin:

```yaml
name: Deploy to Railway
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test --if-present
      - name: Deploy to Railway
        uses: railway-sh/railway-action@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
```

## 🐳 Docker Deployment

```bash
# Build image
docker build -t dental-clinic .

# Run locally
docker run -p 8080:8080 dental-clinic

# Deploy to any Docker platform
# (Railway, Render, DigitalOcean, AWS, etc.)
```

## ✅ Test Deployment

Deployment'tan sonra test edin:

1. **Health Check**: `GET /health`
2. **API Test**: `GET /api/patients`
3. **Frontend**: Ana sayfa yükleniyor mu?
4. **Database**: Sample data var mı?

```bash
# Health check
curl https://your-app.railway.app/health

# API test
curl https://your-app.railway.app/api/patients?limit=5
```

## 🔒 Production Checklist

- [ ] Environment variables ayarlandı
- [ ] HTTPS aktif (Railway otomatik)
- [ ] Database backup stratejisi
- [ ] Error monitoring (Sentry, LogRocket)
- [ ] Performance monitoring
- [ ] User authentication (geliştirilecek)
- [ ] Rate limiting
- [ ] Input validation

## 🚨 Troubleshooting

### Problem: API Connection Failed
**Çözüm**: 
- Backend URL'ni kontrol edin
- CORS ayarları doğru mu?
- Network/firewall sorunu var mı?

### Problem: Deploy Failed
**Çözüm**:
- `package.json` scripts doğru mu?
- Node.js version >=18 mi?
- Environment variables ayarlandı mı?

### Problem: Data Not Persisting
**Çözüm**:
- Railway volume mount edin
- Database backup strategy

## 📞 Support

Sorun yaşarsanız:
1. Railway logs kontrol edin
2. Browser console errors
3. Network tab API calls
4. GitHub issues açın

## 🎉 Success!

Başarılı deployment sonrası:
- ✅ Backend API: `https://your-app.railway.app`
- ✅ Frontend: Aynı URL
- ✅ Database: JSON files in Railway
- ✅ SSL: Otomatik HTTPS
- ✅ Monitoring: Railway dashboard

**Artık dental clinic sisteminiz live!** 🦷✨