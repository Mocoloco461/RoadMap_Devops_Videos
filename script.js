function getWatchedItems() {
  let data = {};
  try {
    data = JSON.parse(localStorage.getItem('watchedItems')) || {};
  } catch (e) {}
  if (!Object.keys(data).length) {
    const match = document.cookie.match(/(?:^|; )watchedItems=([^;]*)/);
    if (match) {
      try {
        data = JSON.parse(decodeURIComponent(match[1]));
      } catch (e) {}
    }
  }
  return data;
}

function saveWatchedItems(data) {
  try {
    localStorage.setItem('watchedItems', JSON.stringify(data));
  } catch (e) {}
  document.cookie =
    'watchedItems=' +
    encodeURIComponent(JSON.stringify(data)) +
    '; max-age=31536000; path=/';
}

function setupCategory(categoryId, videos) {
  const watched = getWatchedItems();
  const list = document.getElementById('videoList');
  const frame = document.getElementById('videoFrame');
  const progress = document.getElementById('progress');
  let current = 0;

  function loadVideo(index) {
    current = index;
    const video = videos[index];
    frame.src = 'https://www.youtube.com/embed/' + video.id;
    progress.textContent = `סרטון ${index + 1} מתוך ${videos.length}`;
  }

  videos.forEach((video, index) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = video.title;
    link.addEventListener('click', e => {
      e.preventDefault();
      loadVideo(index);
    });
    li.appendChild(link);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'watched-checkbox';
    const key = encodeURIComponent(categoryId + '_' + video.id);
    if (watched[key]) {
      checkbox.checked = true;
      li.classList.add('watched');
    }
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        watched[key] = true;
        li.classList.add('watched');
      } else {
        delete watched[key];
        li.classList.remove('watched');
      }
      saveWatchedItems(watched);
    });
    li.appendChild(checkbox);
    list.appendChild(li);
  });

  loadVideo(current);
}
