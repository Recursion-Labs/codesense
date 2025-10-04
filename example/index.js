// Example JavaScript file to demonstrate CodeSense scanning

// Modern fetch API - should be detected
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data));

// IntersectionObserver - modern API
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('Element is visible');
    }
  });
});

// Navigator clipboard API - newer feature
navigator.clipboard.writeText('Hello World')
  .then(() => console.log('Text copied'))
  .catch(err => console.error('Failed to copy', err));

// Local storage - widely supported
localStorage.setItem('key', 'value');

// ResizeObserver - newer API
const resizeObserver = new ResizeObserver(entries => {
  for (let entry of entries) {
    console.log('Element resized:', entry.target);
  }
});

// Promise.allSettled - ES2020 feature
Promise.allSettled([
  fetch('/api/1'),
  fetch('/api/2')
]).then(results => {
  console.log('All requests completed');
});