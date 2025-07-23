const { createClient } = supabase;

const supabaseUrl = "https://gnmrsgkdhlavtqxowkmi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const supabaseClient = createClient(supabaseUrl, supabaseKey);

const form = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const gallery = document.getElementById('gallery');

async function fetchFiles() {
  const { data, error } = await supabaseClient.storage
    .from('uploads')
    .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

  if (data) {
    gallery.innerHTML = '';
    data.forEach(file => {
      const url = `${supabaseUrl}/storage/v1/object/public/uploads/${file.name}`;
      const item = document.createElement('div');
      item.className = 'gallery-item';

      if (file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        item.innerHTML = `<img src="${url}" alt="${file.name}" style="max-width:100%"/>`;
      } else {
        item.innerHTML = `<a href="${url}" target="_blank">${file.name}</a>`;
      }

      gallery.appendChild(item);
    });
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = fileInput.files[0];
  if (!file) return alert('Selecione um arquivo');

  const filePath = `${Date.now()}_${file.name}`;
  const { error } = await supabaseClient.storage
    .from('uploads')
    .upload(filePath, file);

  if (error) {
    alert('Erro ao enviar');
  } else {
    fetchFiles();
    document.body.style.backgroundColor = `hsl(${Math.random() * 360}, 60%, 90%)`;
  }
});

fetchFiles();
