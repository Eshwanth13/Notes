document.addEventListener('DOMContentLoaded', async () => {
    loadTheme();

    try {
        const response = await fetch('/notes');
        const notes = await response.json();
        notes.forEach(addNoteToList);
    } catch (err) {
        console.error('Error fetching notes:', err);
    }

    const form = document.getElementById('noteForm');
    form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    if (!title || !content) return;

    try {
        await fetch('/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content }),
        });
        window.location.reload();
    } catch (err) {
        console.error('Error saving note:', err);
    }
    });


    document.getElementById('themeToggle').addEventListener('click', () => {
        document.body.classList.toggle('dark');
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    });
});

function addNoteToList(note) {
    const notesList = document.getElementById('notesList');
    const li = document.createElement('li');
    li.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <div class="note-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        li.remove();
    });

    const editBtn = li.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
        const newTitle = prompt("Edit title:", note.title);
        const newContent = prompt("Edit content:", note.content);
        if (newTitle && newContent) {
            li.querySelector('h3').innerText = newTitle;
            li.querySelector('p').innerText = newContent;
        }
    });

    notesList.appendChild(li);
}

function getAllNotesFromDOM() {
    const notes = [];
    document.querySelectorAll('#notesList li').forEach(li => {
        const title = li.querySelector('h3')?.innerText || '';
        const content = li.querySelector('p')?.innerText || '';
        notes.push({ title, content });
    });
    return notes;
}


document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');

    const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
});


function loadTheme() {
    const theme = localStorage.getItem('theme') || 'dark'; // default dark
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(theme);
}



document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id;

    await fetch(`/notes/${id}`, {
      method: "DELETE"
    });

    window.location.reload(); 
  }

  if (e.target.classList.contains("edit-btn")) {
    const id = e.target.dataset.id;
    const titleEl = e.target.closest(".note").querySelector("h3");
    const contentEl = e.target.closest(".note").querySelector("p");

    document.getElementById("title").value = titleEl.innerText;
    document.getElementById("content").value = contentEl.innerText;

 
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.textContent = "Update Note";

    submitBtn.onclick = async (ev) => {
      ev.preventDefault();

      await fetch(`/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: document.getElementById("title").value,
          content: document.getElementById("content").value
        })
      });

      window.location.reload();
    };
  }
});


