## Özellikler
Bu proje, bir kütüphane yönetim sistemidir. Aşağıdaki özellikleri içerir:

-  Kitap ve kullanıcı yönetimi
-  Kitap ödünç alma/iade etme
-  Kitap puanlama sistemi
-  Kullanıcı geçmişi takibi

## Teknolojiler

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM

### Frontend
- React
- TypeScript
- Material-UI
- Vite
- Axios

## Kurulum Adımları

### 1. Ön Gereksinimler
- Node.js (v18 veya üzeri)
- PostgreSQL (v14 veya üzeri)
- npm (v9 veya üzeri)

### 2. Projeyi İndirme
```bash
git clone <repo-url>
cd library-management
```

### 2.1. Root Seviyesinde Kurulum
```bash
npm run install:all
npm run dev
```

### 3. Backend Kurulum
```bash
cd server
npm install
npm install -D @types/node
```

#### 3.1. PostgreSQL Kurulumu
1. PostgreSQL'i yükleyin ve başlatın
2. psql ile veritabanını oluşturun:
```bash
CREATE DATABASE library_db;
```

#### 3.2. Çevre Değişkenleri
1. Örnek dosyayı kopyalayın:
```bash
cp .env.example .env
```

2. `.env` dosyasını düzenleyin:
```bash
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/library_db"
PORT=3001
```

#### 3.3. Veritabanı Kurulumu
```bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
```

#### 3.4. Backend'i Başlat
```bash
npm run dev
```

### 4. Frontend Kurulum
```bash
cd client
npm install
npm install -D @types/node
npm run dev
```

#### 4.1. Frontend Çevre Değişkenleri
`.env` dosyası oluşturun:
VITE_API_URL=http://localhost:3001

#### 4.2. Frontend'i Başlat
```bash
npm run dev
```

## Uygulama Erişimi

- Frontend: http://localhost:5173
- Backend: http://localhost:3002

## Test Verileri

### Kullanıcılar
- Eray Aslan
- Enes Faruk Meniz
- Sefa Eren Şahin
- Kadir Mutlu

### Kitaplar
- The Hitchhiker's Guide to the Galaxy (Douglas Adams, 1979)
- I, Robot (Isaac Asimov, 1950)
- Dune (Frank Herbert, 1965)
- 1984 (George Orwell, 1949)
- Brave New World (Aldous Huxley, 1932)

## API Endpoints

### Users
Tüm kullanıcıları listele : GET http://localhost:3002/users
Kullanıcı detayı : GET http://localhost:3002/users/1
Kitap ödünç al : POST http://localhost:3002/users/1/borrow/2
Kitap iade et : POST http://localhost:3002/users/1/return/2

### Books
Tüm kitapları listele : GET http://localhost:3002/books
Kitap detayı : GET http://localhost:3002/books/1

### Dizin Yapısı
library-management/ ├── client/ # Frontend React uygulaması │ ├── src/ │ │ ├── components/ # Yeniden kullanılabilir komponentler │ │ ├── pages/ # Sayfa komponentleri │ │ ├── services/ # API servisleri │ │ └── config/ # Yapılandırma dosyaları │ └── .env # Frontend çevre değişkenleri └── server/ # Backend Express uygulaması ├── prisma/ # Veritabanı şeması ve migrations ├── src/ │ ├── controllers/ # İş mantığı │ ├── routes/ # API rotaları │ └── types/ # TypeScript tip tanımlamaları └── .env # Backend çevre değişkenleri

## Bunları Unutmayın!
- Tüm komutları belirtilen dizinlerde çalıştırdığınızdan emin olun
- PostgreSQL bağlantı bilgilerini kendi kurulumunuza göre ayarlayın
- Test verilerinin yüklenmesi için tüm adımları sırasıyla takip edin
- Her iki uygulamayı da (frontend ve backend) aynı anda çalıştırın
- Hata durumunda ilgili çözüm adımlarını sırasıyla deneyin

### Sık Karşılaşılan Port Hatası
- Backend için varsayılan port 3002'dir
- Eğer port çakışması olursa:
  1. `server/.env` dosyasında PORT değerini değiştirin (örn: 3003, 3004, vb.)
  2. `client/.env` dosyasında VITE_API_URL değerini aynı porta göre güncelleyin
  3. Her iki uygulamayı da yeniden başlatın

Not: Bu dokümandaki tüm API endpoint örnekleri varsayılan port olan 3002 ile yazılmıştır. 
Eğer farklı bir port kullanıyorsanız, endpoint URL'lerindeki port numarasını kendi port numaranızla değiştirin.


