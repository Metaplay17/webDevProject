const coffeeBlock = document.querySelector(".coffee-list")
let coffeeSelectors = []

for (let i = 1; i <= 5; i++) {
    coffeeSelectors.push(document.getElementById(`${i}-coffee-type`))
}

let coffee = [];
let types = [];
let selectedTypes = [0, 1, 2, 3, 4];
let selectedBlock = -1;

function loadCoffeeSync() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'coffee.json', false);
    xhr.send();
    if (xhr.status === 200) {
      coffee = JSON.parse(xhr.responseText);
    }
    xhr.open('GET', 'types.json', false);
    xhr.send();
    if (xhr.status === 200) {
      types = JSON.parse(xhr.responseText);
    }
}

function Init() {
    loadCoffeeSync();
    s = "";
    let ind = 0;
    coffee.forEach(elem => {
        s += `<div class="coffee-card" id="${elem.type}-block">`
        s += `<a name="${elem.type}"></a>`
        s += `<img src="${elem.image}"`
        s += `<p>${elem.name}</p>`
        s += `<div class="order-button-block">`
        s += `<div class="order-text-block">`
        s += `<p>${elem.price} RUB</p>`
        s += `</div>`
        s += `<button class="order-button">+</button>`
        s += `</div>`
        s += `</div>`
    });
    coffeeBlock.innerHTML = s;
    Update()
}

Init();

function Update() {
    for (let i = 0; i <= 4; i++) {
        if (i == selectedBlock) {
            let link = "";
            coffee.forEach(elem => {
                if (elem.type == types[selectedTypes[i]].type) {
                    link = elem.image;
                }
            })
            coffeeSelectors[i].classList.add("coffee-selected-block")
            coffeeSelectors[i].classList.remove("coffee-selector-block")
            coffeeSelectors[i].innerHTML = 
            `
            <a href="#${types[selectedTypes[i]].type}" onclick="SelectCoffee(${i})">
                <img src="${link}">
                <p>${types[selectedTypes[i]].type}</p>
            </a>
            `;
        }
        else {
            coffeeSelectors[i].classList.remove("coffee-selected-block")
            coffeeSelectors[i].classList.add("coffee-selector-block")
            coffeeSelectors[i].innerHTML = 
            `
            <a href="#${types[selectedTypes[i]].type}" onclick="SelectCoffee(${i})">
                <p>${types[selectedTypes[i]].type}</p>
            </a>
            `;
        }
    }
}

function SelectCoffee(selectorInd) {
    selectedBlock = selectorInd;
    Update();
}

function ScrollDown() {
    if (Math.max(...selectedTypes) >= 6) {
        return;
    }
    for (let i = 0; i <= 4; i++) {
        selectedTypes[i] += 1;
    }
    selectedBlock -= 1;
    Update();
}

function ScrollUp() {
    if (Math.min(...selectedTypes) <= 0) {
        return;
    }
    for (let i = 0; i <= 4; i++) {
        selectedTypes[i] -= 1;
    }
    selectedBlock += 1;
    Update();
}