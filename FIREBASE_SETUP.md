# Firebase Kurulum Talimatları

## 1. Firebase Projesi Oluşturma

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. "Create a project" butonuna tıklayın
3. Proje adını girin: `webportfolyo`
4. Google Analytics'i etkinleştirin (isteğe bağlı)
5. "Create project" butonuna tıklayın

## 2. Web Uygulaması Ekleme

1. Firebase Console'da projenizi seçin
2. "Add app" butonuna tıklayın
3. Web ikonunu seçin (`</>`)
4. App nickname: `webportfolyo-web`
5. "Register app" butonuna tıklayın
6. Config objesini kopyalayın

## 3. Environment Variables Ayarlama

1. Proje kök dizininde `.env.local` dosyası oluşturun
2. Aşağıdaki değerleri ekleyin:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 4. Firebase Services Etkinleştirme

### Authentication
1. Sol menüden "Authentication" seçin
2. "Get started" butonuna tıklayın
3. "Sign-in method" sekmesine gidin
4. "Email/Password" provider'ını etkinleştirin
5. "Save" butonuna tıklayın

### Firestore Database
1. Sol menüden "Firestore Database" seçin
2. "Create database" butonuna tıklayın
3. "Start in test mode" seçin (geliştirme için)
4. Location seçin (Europe-west3 önerilir)
5. "Done" butonuna tıklayın

### Storage
1. Sol menüden "Storage" seçin
2. "Get started" butonuna tıklayın
3. "Start in test mode" seçin
4. Location seçin (Firestore ile aynı)
5. "Done" butonuna tıklayın

## 5. Admin Kullanıcısı Oluşturma

1. Authentication > Users sekmesine gidin
2. "Add user" butonuna tıklayın
3. Email: `admin@yourdomain.com`
4. Password: güçlü bir şifre girin
5. "Add user" butonuna tıklayın

## 6. Firestore Security Rules

Firestore > Rules sekmesinde aşağıdaki kuralları ekleyin:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Projects collection
    match /projects/{document} {
      allow read: if true; // Herkes okuyabilir
      allow write: if request.auth != null; // Sadece giriş yapmış kullanıcılar yazabilir
    }
    
    // Settings collection
    match /settings/{document} {
      allow read: if true; // Herkes okuyabilir
      allow write: if request.auth != null; // Sadece giriş yapmış kullanıcılar yazabilir
    }
    
    // Content collection
    match /content/{document} {
      allow read: if true; // Herkes okuyabilir
      allow write: if request.auth != null; // Sadece giriş yapmış kullanıcılar yazabilir
    }
  }
}
```

## 7. Storage Security Rules

Storage > Rules sekmesinde aşağıdaki kuralları ekleyin:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true; // Herkes okuyabilir
      allow write: if request.auth != null; // Sadece giriş yapmış kullanıcılar yazabilir
    }
  }
}
```

## 8. Test Etme

1. Projeyi çalıştırın: `npm run dev`
2. Admin paneline gidin: `http://localhost:3000/admin`
3. Oluşturduğunuz admin kullanıcısı ile giriş yapın
4. Proje ekleme ve görsel yükleme işlemlerini test edin

## Sorun Giderme

- Environment variables'ların doğru ayarlandığından emin olun
- Firebase Console'da services'lerin etkin olduğunu kontrol edin
- Browser console'da hata mesajlarını kontrol edin
- Network tab'ında Firebase API çağrılarını kontrol edin
