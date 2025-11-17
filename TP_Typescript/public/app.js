const api = {
  list: () => fetch('/api/books').then(r => r.json()),
  create: (b) => fetch('/api/books', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b)}).then(r => r.json()),
  update: (id, b) => fetch('/api/books/' + id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b)}).then(r => r.json()),
  delete: (id) => fetch('/api/books/' + id, { method: 'DELETE'}).then(r => r.json())
};

function qs(id) { return document.getElementById(id); }

async function load() {
  const books = await api.list();
  renderList(books);
}

function pct(book) {
  if (!book.numberOfPages) return 0;
  return Math.min(100, Math.round((book.pagesRead / book.numberOfPages) * 100));
}

function renderList(books) {
  const container = qs('booksList');
  container.innerHTML = '';

  let totalBooksRead = 0, totalPages = 0;
  books.forEach(book => {
    totalPages += (book.numberOfPages || 0);
    if (book.finished) totalBooksRead++;
  });

  qs('totals').innerText = `Total books: ${books.length} • Finished: ${totalBooksRead} • Total pages: ${totalPages}`;

  books.forEach(book => {
    const div = document.createElement('div');
    div.className = 'p-3 border rounded bg-gray-50 flex flex-col sm:flex-row sm:justify-between gap-2';
    div.innerHTML = `
      <div>
        <div class="font-semibold">${escapeHtml(book.title)} <span class="text-sm text-gray-600">by ${escapeHtml(book.author)}</span></div>
        <div class="text-sm text-gray-600">${book.pagesRead || 0}/${book.numberOfPages} pages • ${book.format} • ${book.status}</div>
        <div class="mt-2 w-full bg-gray-200 h-3 rounded overflow-hidden">
          <div style="width:${pct(book)}%" class="h-3 bg-green-500"></div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button class="px-3 py-1 bg-yellow-400 rounded" data-id="${book._id}" data-action="edit">Edit</button>
        <button class="px-3 py-1 bg-red-500 text-white rounded" data-id="${book._id}" data-action="delete">Delete</button>
      </div>
    `;
    container.appendChild(div);
  });

  // attach handlers
  container.querySelectorAll('button').forEach(b => {
    const id = b.dataset.id;
    const action = b.dataset.action;
    if (action === 'edit') b.addEventListener('click', () => startEdit(id));
    if (action === 'delete') b.addEventListener('click', async () => {
      if (!confirm('Delete this book?')) return;
      await api.delete(id);
      await load();
    });
  });
}

function escapeHtml(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

async function startEdit(id) {
  const res = await fetch('/api/books/' + id);
  const book = await res.json();
  qs('bookId').value = book._id;
  qs('title').value = book.title;
  qs('author').value = book.author;
  qs('numberOfPages').value = book.numberOfPages;
  qs('pagesRead').value = book.pagesRead;
  qs('status').value = book.status;
  qs('format').value = book.format;
  qs('price').value = book.price || 0;
  qs('suggestedBy').value = book.suggestedBy || '';
}

qs('bookForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = qs('bookId').value;
  const payload = {
    title: qs('title').value,
    author: qs('author').value,
    numberOfPages: Number(qs('numberOfPages').value),
    pagesRead: Number(qs('pagesRead').value) || 0,
    status: qs('status').value,
    format: qs('format').value,
    price: Number(qs('price').value) || 0,
    suggestedBy: qs('suggestedBy').value
  };

  if (id) {
    await api.update(id, payload);
  } else {
    await api.create(payload);
  }

  qs('bookForm').reset();
  qs('bookId').value = '';
  await load();
});

qs('resetBtn').addEventListener('click', () => { qs('bookForm').reset(); qs('bookId').value = ''; });

load();
