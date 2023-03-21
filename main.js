const cols = document.querySelectorAll('.col');

function generateRandomColor() {
  const hexCodes = '0123456789ABCDEF';
  let color = '';
  for (let i = 0; i < 6; i++) {
    color += hexCodes[Math.floor(Math.random() * hexCodes.length)];
  }
  return '#' + color;
}

function copyColor(text) {
  return navigator.clipboard.writeText(text);
}

function setRandomColors(isInitial) {
  const colors = isInitial ? getColorsFromHash() : [];

  cols.forEach((col, index) => {
    const isLocked = col.querySelector('i').classList.contains('fa-lock');
    const header = col.querySelector('h2');
    const icon = col.querySelector('button');

    if (isLocked) {
      colors.push(header.textContent);
      return;
    }

    const color = isInitial
      ? colors[index]
        ? colors[index]
        : generateRandomColor()
      : generateRandomColor();

    if (!isInitial) {
      colors.push(color);
    }

    header.textContent = color;
    col.style.backgroundColor = color;
    setHeaderColor(header, color);
    setHeaderColor(icon, color);
  });
  updateHash(colors);
}

function setHeaderColor(header, color) {
  const luminance = chroma(color).luminance();
  header.style.color = luminance > 0.5 ? 'black' : 'white';
}

function updateHash(colors = []) {
  document.location.hash = colors
    .map((col) => {
      return col.substring(1);
    })
    .join('-');
}

function getColorsFromHash() {
  if (document.location.hash.length > 1) {
    document.location.hash
      .substring(1)
      .split('-')
      .map((col) => '#' + col);
  }
  return [];
}

setRandomColors(true);
document.addEventListener('keydown', (event) => {
  event.preventDefault();
  if (event.code.toLowerCase() === 'space') {
    setRandomColors();
  }
});

document.addEventListener('click', (event) => {
  const type = event.target.dataset.type;

  if (type === 'lock') {
    const node =
      event.target.tagName.toLowerCase() === 'i'
        ? event.target
        : event.target.children[0];
    node.classList.toggle('fa-lock-open');
    node.classList.toggle('fa-lock');
  } else if (type === 'copy') {
    copyColor(event.target.textContent);
  }
});
