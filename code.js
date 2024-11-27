const coffeeBlock = document.querySelector(".coffee-list")

let coffee = []

function loadCoffeeSync() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'coffee.json', false);
    xhr.send();
    if (xhr.status === 200) {
      coffee = JSON.parse(xhr.responseText);
  }
}

function Init() {
    loadCoffeeSync();
    s = "";
    coffee.forEach(elem => {
        s += `<div class="coffee-card">`
        s += `<img src="${elem.image}"`
        s += `<p>${elem.name}</p>`
        s += `<div class="order-button-block">`
        s += `<div class="order-text-block">`
        s += `<p>${elem.price}</p>`
        s += `</div>`
        s += `<button class="order-button">+</button>`
        s += `</div>`
        s += `</div>`
    });
    coffeeBlock.innerHTML = s;
}

Init();