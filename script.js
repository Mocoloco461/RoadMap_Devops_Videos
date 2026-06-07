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
  const videoSummary = document.createElement('p');
  videoSummary.id = 'videoSummary';
  progress.insertAdjacentElement('afterend', videoSummary);
  let current = 0;
  const rows = [];

  function getVideoSummary(video) {
    if (video.summary) {
      return video.summary;
    }
    const label = video.title.toLowerCase();
    const topics = [
      { match: /(lan|wan|pan|man|wlan|san)/, summary: 'סוגי רשתות וההבדלים ביניהן בארגון מודרני.' },
      { match: /(subnet|subnets)/, summary: 'חלוקה נכונה של רשתות ותכנון טווחי כתובות.' },
      { match: /(ip address|ipv4|ipv6|ipconfig)/, summary: 'עבודה עם כתובות IP והגדרות רשת בפועל.' },
      { match: /(router|routing|routing tables|gateway)/, summary: 'ניתוב תעבורה בין רשתות וקבלת החלטות מסלול.' },
      { match: /(switch|hub|mac|vlan|spanning tree)/, summary: 'תקשורת שכבה 2, ציוד רשת וסגמנטציה.' },
      { match: /(tcp|udp|packets|arp|nat|dns|dhcp|http|https|ssl|tls)/, summary: 'פרוטוקולי תקשורת ושירותי רשת בסיסיים.' },
      { match: /(ping|tracert|netstat|command line)/, summary: 'כלי אבחון תקלות וחקר חיבוריות ברשת.' },
      { match: /(vpn|ipsec|firewall|proxy|dmz|ddos)/, summary: 'מנגנוני אבטחה והקשחת גבולות הרשת.' },
      { match: /(server|virtualization|containers|cloud|raid|nas|vpc)/, summary: 'תשתיות מחשוב, ענן, אחסון ווירטואליזציה.' },
      { match: /(cdn)/, summary: 'שיפור ביצועים והפצת תוכן גלובלית.' }
    ];
    const found = topics.find(topic => topic.match.test(label));
    return found ? found.summary : `מיקוד הסרטון: ${video.title}`;
  }

  function loadVideo(index) {
    current = index;
    const video = videos[index];
    frame.src = 'https://www.youtube.com/embed/' + video.id;
    progress.textContent = `סרטון ${index + 1} מתוך ${videos.length}`;
    videoSummary.textContent = getVideoSummary(video);
    rows.forEach((row, rowIndex) => {
      row.classList.toggle('active', rowIndex === index);
    });
  }

  videos.forEach((video, index) => {
    const li = document.createElement('li');
    const content = document.createElement('div');
    content.className = 'video-item-content';
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = `${index + 1}. ${video.title}`;
    const meta = document.createElement('span');
    meta.className = 'video-meta';
    meta.textContent = getVideoSummary(video);
    link.addEventListener('click', e => {
      e.preventDefault();
      loadVideo(index);
    });
    content.appendChild(link);
    content.appendChild(meta);
    li.appendChild(content);

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
    rows.push(li);
  });

  loadVideo(current);
}
