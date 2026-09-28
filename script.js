// ================= FORM VALIDATION =================
const form = document.getElementById('regForm');
const successBox = document.getElementById('successBox');

const rules = {
  nama: v => v.trim().length >= 3,
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  password: v => v.length >= 8,
  konfirmasi: v => v.length > 0 && v === document.getElementById('password').value,
  kelas: v => v !== '',
  ekskul: v => v !== ''
};

function validateField(id){
  const input = document.getElementById(id);
  const fieldWrap = document.getElementById('field-' + id);
  const value = input.value;
  const isValid = rules[id](value);
  fieldWrap.classList.remove('valid', 'invalid');

  const isSelect = id === 'kelas' || id === 'ekskul';
  if(value === '' && !isSelect){
    // Belum disentuh / masih kosong: netral sampai submit dicoba
    return isValid;
  }
  fieldWrap.classList.add(isValid ? 'valid' : 'invalid');
  return isValid;
}

['nama', 'email', 'password', 'konfirmasi'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    validateField(id);
    if(id === 'password' && document.getElementById('konfirmasi').value !== ''){
      validateField('konfirmasi');
    }
  });
  document.getElementById(id).addEventListener('blur', () => validateField(id));
});
document.getElementById('kelas').addEventListener('change', () => validateField('kelas'));
document.getElementById('ekskul').addEventListener('change', () => validateField('ekskul'));

form.addEventListener('submit', function(e){
  e.preventDefault(); // agar halaman tidak refresh saat form dikirim dalam keadaan eror

  successBox.classList.remove('show');
  let allValid = true;

  Object.keys(rules).forEach(id => {
    const ok = validateField(id);
    const fieldWrap = document.getElementById('field-' + id);
    fieldWrap.classList.remove('valid', 'invalid');
    fieldWrap.classList.add(ok ? 'valid' : 'invalid');
    if(!ok) allValid = false;
  });

  if(allValid){
    successBox.classList.add('show');
    form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    const firstInvalid = form.querySelector('.invalid input, .invalid select');
    if(firstInvalid) firstInvalid.focus();
  }
});

// ================= CHATBOT =================
const toggle = document.getElementById('chatToggle');
const panel = document.getElementById('chatPanel');
const body = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const quickButtons = document.querySelectorAll('.chat-quick button');
let started = false;

function addMsg(text, who){
  const div = document.createElement('div');
  div.className = 'msg ' + who;
  div.textContent = text;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function greet(){
  if(started) return;
  started = true;
  addMsg('Halo! Aku asisten pendaftaran ekstrakurikuler. Ada yang bisa dibantu seputar formulir ini?', 'bot');
}

function botReply(textRaw){
  const text = textRaw.toLowerCase();
  if(text.includes('kelas')){
    return 'Pilihan kelas yang tersedia: X TKJ 1, X TKJ 2, X RPL 1, XI TKJ 1, XI RPL 1, XII TKJ 1, dan XII RPL 1. Pilih kelasmu di dropdown "Pilihan Kelas".';
  }
  if(text.includes('ekskul') || text.includes('ekstrakurikuler')){
    return 'Pilihan ekstrakurikuler yang tersedia: Pramuka, PMR, Paskibra, Basket, Futsal, Robotik, Desain Grafis, dan Paduan Suara. Pilih salah satu di dropdown formulir.';
  }
  if(text.includes('password') || text.includes('sandi')){
    return 'Password minimal 8 karakter, dan kolom Konfirmasi Password harus diisi persis sama dengan Password.';
  }
  if(text.includes('email')){
    return 'Email harus memakai format yang benar, misalnya nama@contoh.com.';
  }
  if(text.includes('cara') || text.includes('daftar')){
    return 'Isi Nama Lengkap, Email, Password, Konfirmasi Password, pilih Kelas, lalu pilih Ekstrakurikuler. Setelah semua benar, klik tombol "Kirim Pendaftaran".';
  }
  if(text.includes('nama')){
    return 'Nama Lengkap wajib diisi, minimal 3 karakter.';
  }
  if(text.includes('makasih') || text.includes('terima kasih')){
    return 'Sama-sama! Semangat mendaftar ya 🙌';
  }
  return 'Aku bisa bantu jelaskan tentang pilihan kelas, pilihan ekstrakurikuler, syarat password, atau cara mengisi formulir. Coba tanya salah satunya ya.';
}

function sendUserMessage(text){
  if(!text.trim()) return;
  addMsg(text.trim(), 'user');
  chatInput.value = '';
  setTimeout(() => addMsg(botReply(text), 'bot'), 350);
}

toggle.addEventListener('click', function(){
  const isOpen = panel.classList.toggle('open');
  toggle.classList.toggle('open', isOpen);
  if(isOpen) greet();
});

chatSend.addEventListener('click', () => sendUserMessage(chatInput.value));
chatInput.addEventListener('keydown', e => {
  if(e.key === 'Enter') sendUserMessage(chatInput.value);
});
quickButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const map = {
      kelas: 'Apa saja pilihan kelasnya?',
      ekskul: 'Apa saja pilihan ekstrakurikulernya?',
      password: 'Apa syarat passwordnya?'
    };
    sendUserMessage(map[btn.dataset.q]);
  });
});