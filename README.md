# PODSTON PANEL - MÜŞTERİ + ADMİN PANELİ

## 🎯 YENİ ÖZELLİKLER

### ✅ Müşteri Paneli (Önceki Özellikler)
- Login sistemi
- Sipariş oluşturma
- Sipariş listesi
- Google Drive klasörü
- Bakiye gösterimi

### 🆕 Admin Paneli (YENİ!)
- **Admin Girişi**: Login ekranında "Admin Girişi" butonu
- **Kullanıcı Yönetimi**: Kullanıcı listesi ve detayları
- **Kullanıcı Oluşturma**: Yeni müşteri hesapları
- **Bakiye Yönetimi**: Manuel bakiye yükleme
- **Sipariş Yönetimi**: Tüm siparişleri görme ve düzenleme
- **Sipariş Düzenleme**: Fiyat, durum, tracking code
- **Sipariş İptali**: Siparişleri iptal etme

---

## 🔐 GİRİŞ BİLGİLERİ

### Admin:
```
Kullanıcı Adı: admin
Şifre: admin123
```

### Demo Müşteriler:
```
1. Kullanıcı: ahmet / Şifre: 1234
2. Kullanıcı: ayse / Şifre: 5678
3. Kullanıcı: mehmet / Şifre: 9012
```

---

## 🚀 KURULUM

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Çalıştır
npm start

# Browser'da: http://localhost:3000
```

---

## 🎨 ADMİN PANELİ ÖZELLİKLERİ

### 1. Kullanıcı Listesi
- Tüm müşterileri kartlar halinde gösterir
- Her kartta:
  - İsim ve kullanıcı adı
  - Mevcut bakiye
  - Toplam sipariş sayısı
  - Bekleyen sipariş sayısı

### 2. Kullanıcı Oluşturma
- "Yeni Kullanıcı" butonu
- Gerekli bilgiler:
  - Ad Soyad
  - Kullanıcı Adı
  - Şifre
  - Başlangıç bakiyesi

### 3. Kullanıcı Detay Sayfası
**Bir müşteriye tıklayınca açılır:**

#### a) Bakiye Yönetimi
- Mevcut bakiyeyi gösterir
- "Bakiye Yükle" butonu
- Miktar girip yüklersiniz

#### b) Siparişler
- Müşterinin tüm siparişleri
- Her sipariş için:
  - Sipariş no, tarih, ürün
  - Fiyat ve durum
  - Kargo kodu
  - Düzenle ve Sil butonları

### 4. Sipariş Düzenleme
**Düzenle butonuna tıklayınca açılır modal:**
- Ürün adı değiştirme
- Fiyat değiştirme (bakiyeden otomatik düşer)
- Durum değiştirme:
  - Ödeme Bekleniyor
  - İşleme Alındı
  - Tamamlandı
- Kargo takip kodu ekleme

### 5. Sipariş İptali
- Sil butonuna tıkla
- Onay iste
- Siparişi sil

### 6. Tüm Siparişler
- Tüm müşterilerin siparişlerini gösterir
- Müşteri adıyla birlikte
- Hızlı düzenleme

---

## 💡 KULLANIM SENARYOLARı

### Senaryo 1: Yeni Müşteri Ekle
```
1. Admin olarak giriş yap
2. "Yeni Kullanıcı" tıkla
3. Bilgileri doldur:
   - Ad: Can Yıldız
   - Kullanıcı adı: can
   - Şifre: 1234
   - Bakiye: $500
4. "Oluştur" tıkla
5. ✅ Yeni müşteri listelendi!
```

### Senaryo 2: Bakiye Yükle
```
1. Müşteri kartına tıkla
2. "Bakiye Yükle" tıkla
3. Miktar gir: $100
4. ✅ Bakiye güncellendi!
```

### Senaryo 3: Sipariş Düzenle
```
1. Müşteri detayında sipariş listesini gör
2. "Düzenle" butonuna tıkla
3. Değişiklikleri yap:
   - Fiyat: $50 → $45
   - Durum: Ödeme Bekleniyor → Tamamlandı
   - Kargo: TRK999888777
4. "Kaydet" tıkla
5. ✅ Sipariş güncellendi!
6. ✅ Fiyat farkı bakiyeden düştü ($5)
```

### Senaryo 4: Sipariş İptal Et
```
1. Siparişin yanında "Sil" butonuna tıkla
2. Onay ver
3. ✅ Sipariş iptal edildi!
```

---

## 🎯 BACKEND ENTEGRASYONU

Panel şu an **demo mode**'da. Production için:

### Gerekli API Endpoints:

```javascript
// Auth
POST /api/admin/login
POST /api/customer/login

// Customers
GET /api/admin/customers
POST /api/admin/customers
GET /api/admin/customers/:id
PATCH /api/admin/customers/:id/balance

// Orders
GET /api/admin/orders
GET /api/admin/orders?customerId=:id
PATCH /api/admin/orders/:id
DELETE /api/admin/orders/:id
POST /api/customer/orders
```

---

## 📊 DATA FLOW

### Bakiye Yükleme:
```
1. Admin bakiye yükler
2. customers array'inde balance güncellenir
3. State güncellenir → UI yenilenir
```

### Sipariş Güncelleme:
```
1. Admin fiyat değiştirir
2. Fiyat farkı hesaplanır
3. Müşteri bakiyesinden düşülür
4. Sipariş ve bakiye state'i güncellenir
```

### Sipariş İptali:
```
1. Admin sipariş iptal eder
2. allOrders array'inden kaldırılır
3. State güncellenir
```

---

## 🔧 ÖZELLEŞTİRME

### Admin Şifresi Değiştirme:
**src/App.js, satır ~30:**
```javascript
const adminCredentials = { 
  username: 'admin', 
  password: 'YENİŞİFRE'  // ← Buradan değiştir
};
```

### Yeni Demo Müşteri Ekle:
**src/App.js, satır ~43:**
```javascript
const [customers, setCustomers] = useState([
  // ... mevcut müşteriler
  { 
    id: 4, 
    username: 'yenimusteri', 
    password: '1234', 
    name: 'Yeni Müşteri', 
    balance: 1000.00, 
    driveFolder: 'https://...' 
  }
]);
```

---

## 🎨 EKRAN GÖRÜNTÜLERİ

### Login Ekranı:
```
┌─────────────────────────┐
│   PODSTON PANEL         │
│   Giriş Yap             │
│                         │
│   Kullanıcı Adı: [___] │
│   Şifre: [___]          │
│                         │
│   [Giriş Yap]           │
│                         │
│   [Admin Girişi] ←NEW!  │
└─────────────────────────┘
```

### Admin Panel - Kullanıcılar:
```
┌────────────────────────────────────┐
│ Kullanıcı Yönetimi   [+Yeni Kullanıcı] │
├────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐         │
│ │ Ahmet Y. │ │ Ayşe D.  │         │
│ │ $625.00  │ │ $1,250   │         │
│ │ 3 sipariş│ │ 1 sipariş│         │
│ └──────────┘ └──────────┘         │
└────────────────────────────────────┘
```

### Müşteri Detay:
```
┌────────────────────────────────────┐
│ ← Geri                             │
│                                    │
│ Ahmet Yılmaz          $625.00      │
│ @ahmet                             │
│                                    │
│ [Bakiye Yükle] ←NEW!               │
│                                    │
│ Siparişler:                        │
│ SIP-001 | $37.50 | [✏️Düzenle] [🗑️] │
│ SIP-002 | $45.00 | [✏️Düzenle] [🗑️] │
└────────────────────────────────────┘
```

---

## ✅ TEST CHECKLIST

```
□ Admin girişi çalışıyor
□ Kullanıcı listesi görünüyor
□ Yeni kullanıcı oluşturuluyor
□ Kullanıcı detay sayfası açılıyor
□ Bakiye yüklenebiliyor
□ Siparişler görünüyor
□ Sipariş düzenlenebiliyor
□ Fiyat değişince bakiye düşüyor
□ Kargo kodu eklenebiliyor
□ Sipariş iptal ediliyor
□ Tüm siparişler sekmesi çalışıyor
□ Çıkış yapılabiliyor
```

---

## 🚀 DEPLOYMENT

Önceki gibi:

```bash
git add .
git commit -m "Admin paneli eklendi"
git push

# Vercel otomatik deploy eder
```

---

## 📞 YARDIM

**Demo veriler nerede?**
→ src/App.js, satır 40-70

**Admin şifresi nerede?**
→ src/App.js, satır 30

**Yeni özellik nasıl eklerim?**
→ src/App.js'de ilgili state ve fonksiyonları ekle

---

**Başarılar! 🎉**

Podston Panel v2.0 - Admin Edition
