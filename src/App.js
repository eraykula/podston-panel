import React, { useState } from 'react';
import { Upload, FileText, FolderOpen, LogOut, CreditCard, Clock, CheckCircle, Users, Plus, Search, Edit, Trash2, X, DollarSign, Package } from 'lucide-react';

export default function PodstonPanel() {
  // Auth state
  const [userType, setUserType] = useState(null); // null | 'customer' | 'admin'
  const [currentUser, setCurrentUser] = useState(null);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  
  // Panel states
  const [activeTab, setActiveTab] = useState('create-order');
  const [adminTab, setAdminTab] = useState('users');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orderFile, setOrderFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Modal states
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditOrder, setShowEditOrder] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', password: '', name: '', balance: 0 });
  
  // Demo data - normalde backend'den gelecek
  const [customers, setCustomers] = useState([
    { id: 1, username: 'ahmet', password: '1234', name: 'Ahmet Yılmaz', balance: 625.00, driveFolder: 'https://drive.google.com/...' },
    { id: 2, username: 'ayse', password: '5678', name: 'Ayşe Demir', balance: 1250.00, driveFolder: 'https://drive.google.com/...' },
    { id: 3, username: 'mehmet', password: '9012', name: 'Mehmet Kaya', balance: 320.00, driveFolder: 'https://drive.google.com/...' }
  ]);

  const [allOrders, setAllOrders] = useState([
    { id: 'SIP-001', customerId: 1, date: '2026-03-10', product: 'T-Shirt Baskı', quantity: 5, price: 37.50, status: 'paid', tracking: 'TRK123456789' },
    { id: 'SIP-002', customerId: 1, date: '2026-03-12', product: 'Hoodie Baskı', quantity: 2, price: 45.00, status: 'processing', tracking: null },
    { id: 'SIP-003', customerId: 1, date: '2026-03-13', product: 'T-Shirt Baskı', quantity: 3, price: 22.50, status: 'pending', tracking: null },
    { id: 'SIP-004', customerId: 2, date: '2026-03-11', product: 'Hoodie Baskı', quantity: 1, price: 22.50, status: 'paid', tracking: 'TRK987654321' },
    { id: 'SIP-005', customerId: 3, date: '2026-03-14', product: 'T-Shirt Baskı', quantity: 10, price: 75.00, status: 'pending', tracking: null }
  ]);

  const adminCredentials = { username: 'admin', password: 'admin123' };

  // Functions
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Admin check
    if (loginData.username === adminCredentials.username && loginData.password === adminCredentials.password) {
      setUserType('admin');
      setCurrentUser({ name: 'Admin', role: 'admin' });
      return;
    }
    
    // Customer check
    const customer = customers.find(c => c.username === loginData.username && c.password === loginData.password);
    if (customer) {
      setUserType('customer');
      setCurrentUser(customer);
      return;
    }
    
    alert('Kullanıcı adı veya şifre hatalı!');
  };

  const handleLogout = () => {
    setUserType(null);
    setCurrentUser(null);
    setLoginData({ username: '', password: '' });
    setSelectedCustomer(null);
  };

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password || !newUser.name) {
      alert('Tüm alanları doldurun!');
      return;
    }
    
    const newCustomer = {
      id: customers.length + 1,
      ...newUser,
      balance: parseFloat(newUser.balance) || 0,
      driveFolder: 'https://drive.google.com/...'
    };
    
    setCustomers([...customers, newCustomer]);
    setNewUser({ username: '', password: '', name: '', balance: 0 });
    setShowAddUser(false);
    alert('Kullanıcı oluşturuldu!');
  };

  const handleAddBalance = (customerId, amount) => {
    setCustomers(customers.map(c => 
      c.id === customerId ? { ...c, balance: c.balance + parseFloat(amount) } : c
    ));
    alert(`Bakiye yüklendi: $${amount}`);
  };

  const handleUpdateOrder = (orderId, updates) => {
    setAllOrders(allOrders.map(o => 
      o.id === orderId ? { ...o, ...updates } : o
    ));
    
    // Eğer fiyat değişirse ve durum "paid" ise bakiyeden düş
    if (updates.status === 'paid' && updates.price) {
      const order = allOrders.find(o => o.id === orderId);
      const priceDiff = parseFloat(updates.price) - order.price;
      if (priceDiff !== 0) {
        setCustomers(customers.map(c => 
          c.id === order.customerId ? { ...c, balance: c.balance - priceDiff } : c
        ));
      }
    }
    
    setShowEditOrder(null);
    alert('Sipariş güncellendi!');
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Siparişi iptal etmek istediğinize emin misiniz?')) {
      setAllOrders(allOrders.filter(o => o.id !== orderId));
      alert('Sipariş iptal edildi!');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOrderFile(file);
    }
  };

  const handleCreateOrder = () => {
    if (orderFile) {
      const newOrder = {
        id: `SIP-${String(allOrders.length + 1).padStart(3, '0')}`,
        customerId: currentUser.id,
        date: new Date().toISOString().split('T')[0],
        product: 'Yeni Ürün',
        quantity: 1,
        price: 0,
        status: 'pending',
        tracking: null
      };
      
      setAllOrders([...allOrders, newOrder]);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setOrderFile(null);
      }, 3000);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Ödeme Bekleniyor' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'İşleme Alındı' },
      paid: { bg: 'bg-green-100', text: 'text-green-700', label: 'Tamamlandı' }
    };
    const s = styles[status];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
        {s.label}
      </span>
    );
  };

  // ============================================
  // LOGIN SCREEN
  // ============================================
  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">P</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Podston Panel</h1>
            <p className="text-slate-600">Giriş Yap</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="kullaniciadi"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Şifre
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition"
            >
              Giriş Yap
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <button
              onClick={() => {
                setLoginData({ username: 'admin', password: 'admin123' });
              }}
              className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200 transition flex items-center justify-center space-x-2"
            >
              <Users className="w-5 h-5" />
              <span>Admin Girişi</span>
            </button>
            <p className="text-center text-xs text-slate-500 mt-3">
              Admin: admin / admin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // CUSTOMER PANEL
  // ============================================
  if (userType === 'customer') {
    const customerOrders = allOrders.filter(o => o.customerId === currentUser.id);
    
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Podston Panel</h1>
                <p className="text-sm text-slate-500">{currentUser.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-xs text-green-600">Bakiye</div>
                    <div className="text-lg font-bold text-green-700">
                      ${currentUser.balance.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
                title="Çıkış Yap"
              >
                <LogOut className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('create-order')}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition ${
                  activeTab === 'create-order'
                    ? 'border-black text-black font-medium'
                    : 'border-transparent text-slate-600 hover:text-black'
                }`}
              >
                <Upload className="w-5 h-5" />
                <span>Sipariş Oluştur</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition ${
                  activeTab === 'orders'
                    ? 'border-black text-black font-medium'
                    : 'border-transparent text-slate-600 hover:text-black'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Siparişlerim</span>
              </button>

              <button
                onClick={() => setActiveTab('folder')}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition ${
                  activeTab === 'folder'
                    ? 'border-black text-black font-medium'
                    : 'border-transparent text-slate-600 hover:text-black'
                }`}
              >
                <FolderOpen className="w-5 h-5" />
                <span>Klasörüm</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === 'create-order' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <h2 className="text-2xl font-bold mb-6">Yeni Sipariş Oluştur</h2>

                {showSuccess ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-600 mb-2">
                      Siparişiniz Oluşturuldu!
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Sipariş numaranız: <span className="font-bold">SIP-{String(allOrders.length).padStart(3, '0')}</span>
                    </p>
                    <p className="text-sm text-slate-500">
                      Siparişiniz işleme alındı. "Siparişlerim" sekmesinden takip edebilirsiniz.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        Etsy Sipariş Formu
                      </label>
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-slate-400 transition">
                        <input
                          type="file"
                          id="orderFile"
                          onChange={handleFileUpload}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                        />
                        <label htmlFor="orderFile" className="cursor-pointer flex flex-col items-center">
                          <Upload className="w-12 h-12 text-slate-400 mb-3" />
                          {orderFile ? (
                            <div className="text-center">
                              <p className="text-green-600 font-medium mb-1">✓ Dosya Yüklendi</p>
                              <p className="text-sm text-slate-500">{orderFile.name}</p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <p className="text-slate-700 font-medium mb-1">
                                Etsy sipariş formunu yükleyin
                              </p>
                              <p className="text-sm text-slate-500">
                                PDF, JPG, PNG (Max 10MB)
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={handleCreateOrder}
                      disabled={!orderFile}
                      className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                      Sipariş Oluştur
                    </button>

                    {!orderFile && (
                      <p className="text-sm text-slate-500 text-center">
                        Lütfen Etsy sipariş formunu yükleyin
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Siparişlerim</h2>
                <div className="text-sm text-slate-500">
                  Toplam {customerOrders.length} sipariş
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Sipariş No</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Tarih</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Ürün</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Adet</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Fiyat</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Durum</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Kargo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {customerOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{order.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-600">{order.date}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-900">{order.product}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-600">{order.quantity}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-slate-900">
                            ${order.price.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-6 py-4">
                          {order.tracking ? (
                            <div className="text-sm text-blue-600 font-medium">
                              {order.tracking}
                            </div>
                          ) : (
                            <div className="text-sm text-slate-400">-</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'folder' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Klasörüm</h2>
                <p className="text-slate-600">
                  Tasarımlarınızı Google Drive klasörünüze yükleyebilir ve yönetebilirsiniz.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FolderOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Google Drive Klasörünüz</h3>
                      <p className="text-sm text-slate-500">Tüm tasarımlarınız burada</p>
                    </div>
                  </div>
                  <a
                    href={currentUser.driveFolder}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition inline-flex items-center space-x-2"
                  >
                    <FolderOpen className="w-5 h-5" />
                    <span>Drive'da Aç</span>
                  </a>
                </div>

                <div className="aspect-[16/9] bg-slate-50 rounded-lg border-2 border-slate-200 flex items-center justify-center">
                  <div className="text-center">
                    <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 mb-2">Google Drive Klasörü</p>
                    <p className="text-sm text-slate-500 mb-4">
                      Gerçek entegrasyonda klasör içeriği burada görünecek
                    </p>
                    <a
                      href={currentUser.driveFolder}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Klasörü yeni sekmede aç →
                    </a>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
                  <h4 className="font-semibold text-blue-900 mb-3">💡 Kullanım Talimatları</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• Tasarımlarınızı PNG, AI veya PDF formatında yükleyin</li>
                    <li>• Her dosyayı açıklayıcı isimlerle kaydedin</li>
                    <li>• Sipariş oluştururken hangi tasarımı kullandığınızı belirtin</li>
                    <li>• Minimum 300 DPI çözünürlük kullanın</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================
  // ADMIN PANEL
  // ============================================
  if (userType === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-black text-white sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black text-lg font-bold">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Podston Admin Panel</h1>
                <p className="text-sm text-slate-300">Yönetim Paneli</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition flex items-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Çıkış</span>
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex space-x-8">
              <button
                onClick={() => {
                  setAdminTab('users');
                  setSelectedCustomer(null);
                }}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition ${
                  adminTab === 'users'
                    ? 'border-black text-black font-medium'
                    : 'border-transparent text-slate-600 hover:text-black'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Kullanıcılar</span>
              </button>

              <button
                onClick={() => {
                  setAdminTab('orders');
                  setSelectedCustomer(null);
                }}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition ${
                  adminTab === 'orders'
                    ? 'border-black text-black font-medium'
                    : 'border-transparent text-slate-600 hover:text-black'
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Tüm Siparişler</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* USERS TAB */}
          {adminTab === 'users' && !selectedCustomer && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Kullanıcı Yönetimi</h2>
                <button
                  onClick={() => setShowAddUser(true)}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Yeni Kullanıcı</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition cursor-pointer"
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{customer.name}</h3>
                        <p className="text-sm text-slate-500">@{customer.username}</p>
                      </div>
                      <div className="bg-green-50 px-3 py-1 rounded-full">
                        <p className="text-xs font-medium text-green-700">Aktif</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 mb-4">
                      <p className="text-xs text-slate-600 mb-1">Bakiye</p>
                      <p className="text-2xl font-bold text-slate-900">
                        ${customer.balance.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex justify-between text-sm text-slate-600">
                      <div>
                        <p className="text-xs text-slate-500">Toplam Sipariş</p>
                        <p className="font-medium text-slate-900">
                          {allOrders.filter(o => o.customerId === customer.id).length}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Bekleyen</p>
                        <p className="font-medium text-yellow-600">
                          {allOrders.filter(o => o.customerId === customer.id && o.status === 'pending').length}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CUSTOMER DETAIL */}
          {adminTab === 'users' && selectedCustomer && (
            <div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="mb-6 text-slate-600 hover:text-black flex items-center space-x-2"
              >
                <span>←</span>
                <span>Geri</span>
              </button>

              <div className="bg-white rounded-xl border border-slate-200 p-8 mb-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedCustomer.name}</h2>
                    <p className="text-slate-600">@{selectedCustomer.username}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 mb-1">Toplam Bakiye</p>
                    <p className="text-4xl font-bold text-green-600">
                      ${selectedCustomer.balance.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      const amount = prompt('Yüklenecek bakiye miktarı ($):');
                      if (amount && !isNaN(amount)) {
                        handleAddBalance(selectedCustomer.id, parseFloat(amount));
                        setSelectedCustomer({...selectedCustomer, balance: selectedCustomer.balance + parseFloat(amount)});
                      }
                    }}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2"
                  >
                    <DollarSign className="w-5 h-5" />
                    <span>Bakiye Yükle</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-8">
                <h3 className="text-xl font-bold mb-6">Siparişler</h3>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Sipariş No</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Tarih</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Ürün</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Fiyat</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Durum</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Kargo</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {allOrders.filter(o => o.customerId === selectedCustomer.id).map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm font-medium">{order.id}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{order.date}</td>
                          <td className="px-4 py-3 text-sm">{order.product}</td>
                          <td className="px-4 py-3 text-sm font-medium">${order.price.toFixed(2)}</td>
                          <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                          <td className="px-4 py-3 text-sm">{order.tracking || '-'}</td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setShowEditOrder(order)}
                                className="p-1 hover:bg-blue-50 rounded text-blue-600"
                                title="Düzenle"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="p-1 hover:bg-red-50 rounded text-red-600"
                                title="İptal Et"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ALL ORDERS TAB */}
          {adminTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Tüm Siparişler</h2>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Sipariş No</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Müşteri</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Tarih</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Ürün</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Fiyat</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Durum</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {allOrders.map((order) => {
                      const customer = customers.find(c => c.id === order.customerId);
                      return (
                        <tr key={order.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm font-medium">{order.id}</td>
                          <td className="px-6 py-4 text-sm">{customer?.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{order.date}</td>
                          <td className="px-6 py-4 text-sm">{order.product}</td>
                          <td className="px-6 py-4 text-sm font-medium">${order.price.toFixed(2)}</td>
                          <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setShowEditOrder(order)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Düzenle
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ADD USER MODAL */}
        {showAddUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-2xl max-w-md w-full p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Yeni Kullanıcı Oluştur</h3>
                <button
                  onClick={() => setShowAddUser(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Ad Soyad</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black"
                    placeholder="Ahmet Yılmaz"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Kullanıcı Adı</label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black"
                    placeholder="ahmet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Şifre</label>
                  <input
                    type="text"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black"
                    placeholder="1234"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Başlangıç Bakiyesi ($)</label>
                  <input
                    type="number"
                    value={newUser.balance}
                    onChange={(e) => setNewUser({...newUser, balance: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowAddUser(false)}
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleAddUser}
                    className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-slate-800 transition"
                  >
                    Oluştur
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EDIT ORDER MODAL */}
        {showEditOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-2xl max-w-md w-full p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Sipariş Düzenle</h3>
                <button
                  onClick={() => setShowEditOrder(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sipariş No</label>
                  <input
                    type="text"
                    value={showEditOrder.id}
                    disabled
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Ürün Adı</label>
                  <input
                    type="text"
                    value={showEditOrder.product}
                    onChange={(e) => setShowEditOrder({...showEditOrder, product: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fiyat ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={showEditOrder.price}
                    onChange={(e) => setShowEditOrder({...showEditOrder, price: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Durum</label>
                  <select
                    value={showEditOrder.status}
                    onChange={(e) => setShowEditOrder({...showEditOrder, status: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black"
                  >
                    <option value="pending">Ödeme Bekleniyor</option>
                    <option value="processing">İşleme Alındı</option>
                    <option value="paid">Tamamlandı</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Kargo Takip Kodu</label>
                  <input
                    type="text"
                    value={showEditOrder.tracking || ''}
                    onChange={(e) => setShowEditOrder({...showEditOrder, tracking: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black"
                    placeholder="TRK123456789"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowEditOrder(null)}
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                  >
                    İptal
                  </button>
                  <button
                    onClick={() => handleUpdateOrder(showEditOrder.id, showEditOrder)}
                    className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-slate-800 transition"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
