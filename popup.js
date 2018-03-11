document.addEventListener('DOMContentLoaded', () => {
  var dropdown = document.getElementById('dropdown');

  dropdown.addEventListener('change', () => {
    generateDisturb(dropdown.value)
  });
});
