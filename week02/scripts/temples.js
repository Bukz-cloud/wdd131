
const hamLogo = document.querySelector('#menu');

hamLogo.addEventListener('click', () => {
    hamLogo.classList.toggle('show');
});

const currentYear = new Date().getFullYear();
document.getElementById("currentyear").innerHTML = `${currentYear}`;
document.getElementById("lastModified").innerHTML = `Last modified: ${document.lastModified}`;