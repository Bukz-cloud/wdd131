// WINDCHILL CALCULATION
function calculateWindChill(tempC, windKmh) {
    // Wind chill formula for °C
    return (
        13.12 +
        0.6215 * tempC -
        11.37 * Math.pow(windKmh, 0.16) +
        0.3965 * tempC * Math.pow(windKmh, 0.16)
    ).toFixed(1);
}

function displayWindChill() {
    const temp = parseFloat(document.getElementById("temp").textContent);
    const wind = parseFloat(document.getElementById("wind").textContent);
    const output = document.getElementById("windchill");

    if (temp <= 10 && wind > 4.8) {
        output.textContent = calculateWindChill(temp, wind) + "°C";
    } else {
        output.textContent = "N/A";
    }
}

displayWindChill();

const currentYear = new Date().getFullYear();
document.getElementById("currentyear").innerHTML = `${currentYear}`;
document.getElementById("lastModified").innerHTML = `Last modified: ${document.lastModified}`;