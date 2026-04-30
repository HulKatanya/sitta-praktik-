// Data Login Dummy
const validCredentials = {
    'admin@ut.ac.id': 'admin123'
};

// Inisialisasi saat DOM loaded
document.addEventListener('DOMContentLoaded', function() {
    // Cek login status
    checkLoginStatus();
    
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Modal handlers
    setupModals();

    // Tracking Form
    const trackingForm = document.getElementById('trackingForm');
    if (trackingForm) {
        trackingForm.addEventListener('submit', handleTracking);
    }

    // Add Stock Form
    const addStockForm = document.getElementById('addStockForm');
    if (addStockForm) {
        addStockForm.addEventListener('submit', handleAddStock);
    }

    // Greeting berdasarkan waktu
    updateGreeting();

    // Load stok table
    loadStockTable();
});

// Check Login Status
function checkLoginStatus() {
    if (window.location.pathname.includes('dashboard.html') && 
        !localStorage.getItem('loggedIn')) {
        window.location.href = 'index.html';
    }
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (validCredentials[email] && validCredentials[email] === password) {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'dashboard.html';
    } else {
        showAlert('Email/password yang anda masukkan salah!', 'error');
    }
}

// Setup Modals - FULLY FUNCTIONAL
function setupModals() {
    // Close all modals
    document.querySelectorAll('.close, .modal').forEach(element => {
        element.addEventListener('click', function(e) {
            if (e.target.classList.contains('close') || e.target.classList.contains('modal')) {
                e.target.closest('.modal').style.display = 'none';
            }
        });
    });

    // Lupa Password Form
    const resetForm = document.getElementById('resetPasswordForm');
    if (resetForm) {
        resetForm.addEventListener('submit', handleResetPassword);
    }

    // Daftar Form
    const daftarForm = document.getElementById('daftarForm');
    if (daftarForm) {
        daftarForm.addEventListener('submit', handleDaftar);
    }

    // Trigger buttons
    document.getElementById('lupaPasswordBtn')?.addEventListener('click', () => {
        document.getElementById('lupaPasswordModal').style.display = 'block';
    });
    
    document.getElementById('daftarBtn')?.addEventListener('click', () => {
        document.getElementById('daftarModal').style.display = 'block';
    });
}

// 🔥 LUPA PASSWORD - FULLY FUNCTIONAL
function handleResetPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('resetEmail').value;
    
    if (!email) {
        showAlert('⚠️ Silakan masukkan email Anda!', 'error');
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        showAlert('✅ Link reset password berhasil dikirim ke ' + email + '!', 'success');
        document.getElementById('lupaPasswordModal').style.display = 'none';
        document.getElementById('resetPasswordForm').reset();
        document.getElementById('email').focus();
    }, 1200);
}

// 🔥 DAFTAR AKUN - FULLY FUNCTIONAL dengan VALIDASI
function handleDaftar(e) {
    e.preventDefault();
    
    const nama = document.getElementById('daftarNama').value.trim();
    const email = document.getElementById('daftarEmail').value.trim();
    const password = document.getElementById('daftarPassword').value;
    const confirmPassword = document.getElementById('daftarConfirmPassword').value;
    
    // Validasi lengkap
    if (!nama || !email || !password) {
        showAlert('⚠️ Semua field harus diisi!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('⚠️ Password minimal 6 karakter!', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('⚠️ Password konfirmasi tidak cocok!', 'error');
        document.getElementById('daftarConfirmPassword').focus();
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('⚠️ Format email tidak valid!', 'error');
        return;
    }
    
    // Simulate registration
    setTimeout(() => {
        // Tambah ke localStorage (simulasi database)
        const users = JSON.parse(localStorage.getItem('utUsers') || '[]');
        users.push({ nama, email, password });
        localStorage.setItem('utUsers', JSON.stringify(users));
        
        showAlert(`✅ Pendaftaran berhasil! Selamat datang ${nama}!`, 'success');
        document.getElementById('daftarModal').style.display = 'none';
        document.getElementById('daftarForm').reset();
        document.getElementById('email').focus();
    }, 1500);
}

// Close Modal Helper
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Update Login untuk support user baru
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Cek admin default
    if (validCredentials[email] && validCredentials[email] === password) {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Cek user dari daftar
    const users = JSON.parse(localStorage.getItem('utUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userName', user.nama);
        window.location.href = 'dashboard.html';
    } else {
        showAlert('❌ Email/password yang anda masukkan salah!', 'error');
        document.getElementById('email').focus();
    }
}

// Navigation Helper
function navigateTo(page) {
    window.location.href = page;
}

// Show Laporan Modal
function showLaporanModal(type) {
    const modal = document.getElementById('laporanModal');
    const title = document.getElementById('laporanTitle');
    const content = document.getElementById('laporanContent');
    
    if (type === 'monitoring') {
        title.innerHTML = '<i class="fas fa-chart-line"></i> Monitoring Progress DO';
        content.innerHTML = generateMonitoringContent();
    } else if (type === 'rekap') {
        title.innerHTML = '<i class="fas fa-file-alt"></i> Rekap Bahan Ajar';
        content.innerHTML = generateRekapContent();
    }
    
    modal.style.display = 'block';
}

// Monitoring Progress DO - CARD LAYOUT PERFECT
function generateMonitoringContent() {
    const stats = {
        sent: trackingData.filter(d => d.status.toLowerCase() === 'dikirim').length,
        shipping: trackingData.filter(d => d.status.toLowerCase() === 'dalam perjalanan').length,
        delivered: trackingData.filter(d => d.status.toLowerCase() === 'sampai').length,
        total: trackingData.length
    };

    return `
        <div style="margin-bottom: 48px; text-align: center;">
            <h2 style="font-size: 2.25rem; color: var(--text-primary); margin-bottom: 16px;">
                📊 Monitoring Progress DO
            </h2>
            <p style="color: var(--text-secondary); font-size: 18px; max-width: 600px; margin: 0 auto;">
                Status lengkap semua pengiriman dengan detail real-time
            </p>
        </div>

        <!-- Stats Overview -->
        <div class="stats-grid" style="margin-bottom: 48px;">
            <div class="stat-card">
                <i class="fas fa-check-circle" style="color: #059669;"></i>
                <h3>${stats.delivered}</h3>
                <p>Selesai</p>
            </div>
            <div class="stat-card">
                <i class="fas fa-shipping-fast" style="color: #2563eb;"></i>
                <h3>${stats.shipping}</h3>
                <p>Perjalanan</p>
            </div>
            <div class="stat-card">
                <i class="fas fa-truck" style="color: #d97706;"></i>
                <h3>${stats.sent}</h3>
                <p>Dikirim</p>
            </div>
            <div class="stat-card">
                <i class="fas fa-boxes" style="color: var(--text-secondary);"></i>
                <h3>${stats.total}</h3>
                <p>Total DO</p>
            </div>
        </div>

        <!-- DO Cards -->
        <div class="monitoring-cards">
    ` + trackingData.map(item => {
        let statusClass = 'status-sent', progress = 0, progressColor = '#d97706', cardClass = 'do-sent';
        
        switch(item.status.toLowerCase()) {
            case 'dikirim':
                statusClass = 'status-sent';
                progress = 33;
                progressColor = '#d97706';
                cardClass = 'do-sent';
                break;
            case 'dalam perjalanan':
                statusClass = 'status-shipping';
                progress = 66;
                progressColor = '#2563eb';
                cardClass = 'do-shipping';
                break;
            case 'sampai':
                statusClass = 'status-delivered';
                progress = 100;
                progressColor = '#059669';
                cardClass = 'do-delivered';
                break;
        }

        return `
            <div class="monitoring-card ${cardClass}">
                <div class="card-header">
                    <div class="card-title">
                        <div class="card-icon">
                            <i class="fas fa-${item.status === 'Sampai' ? 'check-circle' : item.status === 'Dalam Perjalanan' ? 'shipping-fast' : 'truck'}"></i>
                        </div>
                        <span>DO-${item.noDO}</span>
                    </div>
                    <span class="status-badge ${statusClass}">
                        <i class="fas fa-${item.status === 'Sampai' ? 'check' : item.status === 'Dalam Perjalanan' ? 'shipping-fast' : 'truck'}"></i>
                        ${item.status}
                    </span>
                </div>
                
                <div class="card-content">
                    <div class="detail-row">
                        <span class="detail-label">Mahasiswa</span>
                        <span class="detail-value">${item.namaMahasiswa}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Ekspedisi</span>
                        <span class="detail-value">${item.ekspedisi.toUpperCase()}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Tanggal Kirim</span>
                        <span class="detail-value">${new Date(item.tglKirim).toLocaleDateString('id-ID')}</span>
                    </div>
                    
                    <div class="progress-row">
                        <div class="progress-label">
                            <span>Progress Pengiriman</span>
                            <span style="color: ${progressColor}; font-weight: 700;">${progress}%</span>
                        </div>
                        <div class="progress-bar" style="height: 12px;">
                            <div class="progress-fill" style="width: ${progress}%; background: ${progressColor};"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('') + `
        </div>

        <div style="text-align: center; padding: 40px; background: var(--accent); border-radius: var(--radius-lg); margin-top: 48px;">
            <h3 style="color: var(--text-primary); margin-bottom: 12px;">
                📈 Ringkasan Keseluruhan
            </h3>
            <div style="display: flex; justify-content: center; gap: 40px; flex-wrap: wrap;">
                <div style="text-align: center;">
                    <div style="font-size: 2.5rem; font-weight: 800; color: #059669;">${stats.delivered}</div>
                    <div style="color: var(--text-secondary);">Selesai</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2.5rem; font-weight: 800; color: #2563eb;">${stats.shipping}</div>
                    <div style="color: var(--text-secondary);">Perjalanan</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2.5rem; font-weight: 800; color: #d97706;">${stats.sent}</div>
                    <div style="color: var(--text-secondary);">Dikirim</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2.5rem; font-weight: 800; color: var(--text-primary);">${stats.total}</div>
                    <div style="color: var(--text-secondary);">Total</div>
                </div>
            </div>
        </div>
    `;
}

// Generate Rekap Content
function generateRekapContent() {
    const totalStok = dataBahanAjar.reduce((sum, item) => sum + item.stok, 0);
    const totalItem = dataBahanAjar.length;
    const outOfStock = dataBahanAjar.filter(item => item.stok === 0).length;
    
    let html = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div class="stat-card">
                <h3>${totalItem}</h3>
                <p>Total Item</p>
            </div>
            <div class="stat-card">
                <h3>${totalStok}</h3>
                <p>Total Stok</p>
            </div>
            <div class="stat-card">
                <h3>${outOfStock}</h3>
                <p>Habis</p>
            </div>
        </div>
        
        <div class="table-section">
            <table class="laporan-table">
                <thead>
                    <tr>
                        <th>Kode MK</th>
                        <th>Mata Kuliah</th>
                        <th>Stok</th>
                        <th>Harga</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    dataBahanAjar.forEach(item => {
        const status = item.stok === 0 ? 'Habis' : item.stok < 5 ? 'Low Stock' : 'Tersedia';
        html += `
            <tr>
                <td>${item.kdMataKuliah}</td>
                <td>${item.namaMataKuliah}</td>
                <td>${item.stok}</td>
                <td>Rp ${item.harga.toLocaleString()}</td>
                <td><span class="badge ${status === 'Habis' ? 'out-of-stock' : 'in-stock'}">${status}</span></td>
            </tr>
        `;
    });
    
    html += `</tbody></table></div>`;
    
    return html;
}

// Show Histori Modal
function showHistoriModal() {
    const modal = document.getElementById('historiModal');
    const content = document.getElementById('historiContent');
    
    const historiData = generateHistoriData();
    content.innerHTML = generateHistoriContent(historiData);
    modal.style.display = 'block';
}

// Generate Histori Data (dummy)
function generateHistoriData() {
    return [
        {
            id: 'TXN001',
            tanggal: '2024-01-20',
            mahasiswa: 'Ahmad Nurus Shoba',
            item: 'Pemrograman Web',
            qty: 2,
            total: 100000,
            status: 'Lunas'
        },
        {
            id: 'TXN002',
            tanggal: '2024-01-19',
            mahasiswa: 'Devi Isma',
            item: 'Basis Data',
            qty: 1,
            total: 45000,
            status: 'Lunas'
        },
        {
            id: 'TXN003',
            tanggal: '2024-01-18',
            mahasiswa: 'M. Syamsudin',
            item: 'Jaringan Komputer',
            qty: 3,
            total: 165000,
            status: 'Lunas'
        }
    ];
}

// Generate Histori Content
function generateHistoriContent(data) {
    let html = `
        <div class="table-section">
            <table class="laporan-table">
                <thead>
                    <tr>
                        <th>ID Transaksi</th>
                        <th>Tanggal</th>
                        <th>Mahasiswa</th>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    data.forEach(item => {
        html += `
            <tr>
                <td>${item.id}</td>
                <td>${item.tanggal}</td>
                <td>${item.mahasiswa}</td>
                <td>${item.item}</td>
                <td>${item.qty}</td>
                <td>Rp ${item.total.toLocaleString()}</td>
                <td><span class="badge in-stock">${item.status}</span></td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
            <div style="text-align: center; margin-top: 1rem; color: #7f8c8d;">
                Total Transaksi: ${data.length}
            </div>
        </div>
    `;
    
    return html;
}

// Close Modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Update Greeting berdasarkan waktu
function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    let greeting = '';
    
    if (hour < 12) greeting = 'Selamat Pagi';
    else if (hour < 15) greeting = 'Selamat Siang';
    else if (hour < 18) greeting = 'Selamat Sore';
    else greeting = 'Selamat Malam';
    
    const greetingEl = document.getElementById('timeGreeting');
    const userGreetingEl = document.getElementById('greeting');
    
    if (greetingEl) greetingEl.textContent = `${greeting}, Selamat datang di Dashboard!`;
    if (userGreetingEl) userGreetingEl.textContent = greeting;
}

// Handle Tracking - Dengan No Result
function handleTracking(e) {
    e.preventDefault();
    
    const noDO = document.getElementById('noDO').value.trim().toUpperCase();
    const resultSection = document.getElementById('trackingResult');
    const noResultSection = document.getElementById('noResult');
    
    // Hide all first
    resultSection.style.display = 'none';
    noResultSection.style.display = 'none';
    
    if (!noDO) {
        showAlert('⚠️ Masukkan Nomor Delivery Order!', 'error');
        return;
    }
    
    const trackingItem = trackingData.find(item => item.noDO === noDO);
    
    if (trackingItem) {
        displayTrackingResult(trackingItem);
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        noResultSection.style.display = 'block';
        noResultSection.scrollIntoView({ behavior: 'smooth' });
        showAlert('Nomor DO tidak ditemukan. Coba DO001, DO002, atau DO003', 'info');
    }
}

// Display Tracking Result - Enhanced
function displayTrackingResult(data) {
    document.getElementById('namaMahasiswa').textContent = data.namaMahasiswa;
    document.getElementById('statusText').textContent = data.status.toUpperCase();
    
    const statusIcon = document.getElementById('statusIcon');
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    
    let progress = 0, icon = 'fa-clock', color = '#94a3b8';
    
    switch(data.status.toLowerCase()) {
        case 'dikirim':
            progress = 33; icon = 'fa-truck'; color = '#f59e0b'; break;
        case 'dalam perjalanan':
            progress = 66; icon = 'fa-shipping-fast'; color = '#3b82f6'; break;
        case 'sampai':
            progress = 100; icon = 'fa-check-circle'; color = '#22c55e'; break;
    }
    
    statusIcon.className = `fas fa-${icon}`;
    statusIcon.style.color = color;
    progressFill.style.width = progress + '%';
    progressFill.style.background = color;
    progressPercent.textContent = progress + '%';
    progressPercent.style.color = color;
    
    // Details
    document.getElementById('ekspedisi').textContent = data.ekspedisi.toUpperCase();
    document.getElementById('tglKirim').textContent = new Date(data.tglKirim).toLocaleDateString('id-ID');
    document.getElementById('jenisPaket').textContent = data.jenisPaket.toUpperCase();
    document.getElementById('totalBayar').textContent = 'Rp ' + data.totalBayar.toLocaleString();
}

// Handle Add Stock
function handleAddStock(e) {
    e.preventDefault();
    
    const newStock = {
        kdMataKuliah: document.getElementById('kdMataKuliah').value,
        namaMataKuliah: document.getElementById('namaMataKuliah').value,
        stok: parseInt(document.getElementById('stok').value),
        harga: parseInt(document.getElementById('harga').value)
    };
    
    dataBahanAjar.push(newStock);
    loadStockTable();
    document.getElementById('addStockForm').reset();
    showAlert('Stok baru berhasil ditambahkan!', 'success');
}

// Load Stock Table - Dengan Edit Button FULLY FUNCTIONAL
function loadStockTable() {
    const tbody = document.getElementById('stockTableBody');
    const totalEl = document.getElementById('totalStok');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    dataBahanAjar.forEach((item, index) => {
        const row = document.createElement('tr');
        const statusClass = item.stok === 0 ? 'out-of-stock' : 'in-stock';
        row.innerHTML = `
            <td style="font-weight: 600;">${item.kdMataKuliah}</td>
            <td style="font-weight: 500; max-width: 250px;">${item.namaMataKuliah}</td>
            <td>
                <span class="badge ${statusClass}">
                    <i class="fas fa-${item.stok === 0 ? 'times' : 'check'}"></i>
                    ${item.stok}
                </span>
            </td>
            <td style="color: #10b981; font-weight: 700;">Rp ${item.harga.toLocaleString()}</td>
            <td style="white-space: nowrap;">
                <button class="btn-small btn-edit" onclick="editStock(${index})" title="Edit Stok">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-small btn-delete" onclick="deleteStock(${index})" title="Hapus Stok">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    if (totalEl) {
        totalEl.innerHTML = `<i class="fas fa-boxes"></i> Total: <strong>${dataBahanAjar.length}</strong> item`;
    }
}

// 🔥 FITUR EDIT STOK - FULLY FUNCTIONAL
function editStock(index) {
    const item = dataBahanAjar[index];
    
    // Populate form dengan data lama
    document.getElementById('editIndex').value = index;
    document.getElementById('editKdMataKuliah').value = item.kdMataKuliah;
    document.getElementById('editNamaMataKuliah').value = item.namaMataKuliah;
    document.getElementById('editStok').value = item.stok;
    document.getElementById('editHarga').value = item.harga;
    
    // Buka modal
    document.getElementById('editModal').style.display = 'block';
    
    // Scroll ke atas modal
    document.querySelector('#editModal .modal-content').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
}

// Handle Edit Form Submit
document.addEventListener('DOMContentLoaded', function() {
    const editForm = document.getElementById('editStockForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditStock);
    }
});

function handleEditStock(e) {
    e.preventDefault();
    
    const index = parseInt(document.getElementById('editIndex').value);
    
    // Update data
    dataBahanAjar[index] = {
        kdMataKuliah: document.getElementById('editKdMataKuliah').value,
        namaMataKuliah: document.getElementById('editNamaMataKuliah').value,
        stok: parseInt(document.getElementById('editStok').value),
        harga: parseInt(document.getElementById('editHarga').value)
    };
    
    // Refresh table
    loadStockTable();
    
    // Close modal & reset form
    closeEditModal();
    
    // Success alert
    showAlert('✅ Stok berhasil diupdate!', 'success');
}

// Close Edit Modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('editStockForm').reset();
}

// Update Delete Stock (dengan konfirmasi lebih baik)
function deleteStock(index) {
    const item = dataBahanAjar[index];
    if (confirm(`🗑️ Hapus "${item.namaMataKuliah}"?\n\nKode: ${item.kdMataKuliah}\nStok: ${item.stok}`)) {
        dataBahanAjar.splice(index, 1);
        loadStockTable();
        showAlert('🗑️ Stok berhasil dihapus!', 'success');
    }
}

// Logout
function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html';
}

// Alert/Popup
function showAlert(message, type = 'info') {
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) existingAlert.remove();
    
    const alert = document.createElement('div');
    alert.className = `custom-alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
        <button class="alert-close">&times;</button>
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        if (alert.parentNode) alert.remove();
    }, 4000);
    
    alert.querySelector('.alert-close').addEventListener('click', () => {
        alert.remove();
    });
}
