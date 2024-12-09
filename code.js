const coffeeBlock = document.querySelector(".coffee-list");
const rightMenu = document.querySelector(".right-menu");
const leftMenu = document.querySelector(".left-menu");
const mainBlock = document.querySelector("main");
const htmlBody = document.querySelector("body");
const orderMenu = document.querySelector(".order-menu");
const coffeeOrderBlock = document.getElementById("coffee-order-block");
const orderImageBlock = document.querySelector(".order-image");
const orderedCoffeeBlock = document.getElementById("ordered-coffee-block");
const pricesBlock = document.querySelector(".prices-block");
let coffeeExtrasSizesButs = document.querySelector(".coffee-extras-sizes");
let coffeeExtrasExtrasButs = document.querySelector(".coffee-extras-extras");
let coffeeExtrasMilksButs = document.querySelector(".coffee-extras-milks");
let coffeeSelectors = [];
let orderedCoffeeList = [];

let selectedSize = "";
let selectedExtra = "";
let selectedMilk = "";


for (let i = 1; i <= 5; i++) {
    coffeeSelectors.push(document.getElementById(`${i}-coffee-type`));
}



let coffee = [];
let types = [];
let selectedTypes = [0, 1, 2, 3, 4];
let selectedBlock = -1;

let totalPrice = 0;
let totalCount = 0;

let currFilter = "";

function loadCoffeeSync() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'coffee.json', false);
    xhr.send();
    if (xhr.status === 200) {
        coffee = JSON.parse(xhr.responseText);
    } else {
        console.error('Ошибка загрузки coffee.json');
    }

    xhr.open('GET', 'types.json', false);
    xhr.send();
    if (xhr.status === 200) {
        types = JSON.parse(xhr.responseText);
    } else {
        console.error('Ошибка загрузки types.json');
    }
}
loadCoffeeSync();
LoadLocalStorage();

function Init() {
    let s = "";
    coffee.forEach(elem => {
        if (currFilter == "" || elem.name.toLowerCase().includes(currFilter.toLowerCase())) {
            s += `<div class="coffee-card" id="${elem.type}-block">`;
            s += `<a name="${elem.type}"></a>`;
            s += `<img src="${elem.image}">`;
            s += `<p>${elem.name}</p>`;
            s += `<div class="order-button-block">`;
            s += `<div class="order-text-block">`;
            s += `<p>${elem.price} RUB</p>`;
            s += `</div>`;
            s += `<button class="order-button" onclick="OrderCoffee('${elem.name}')">+</button>`;
            s += `</div>`;
            s += `</div>`;
        }

    });
    coffeeBlock.innerHTML = s;
    Update();
}

Init();

function Update() {
    for (let i = 0; i <= 4; i++) {
        if (i === selectedBlock) {
            let link = "";
            coffee.forEach(elem => {
                if (elem.type === types[selectedTypes[i]].type) {
                    link = elem.image;
                }
            });
            coffeeSelectors[i].classList.add("coffee-selected-block");
            coffeeSelectors[i].classList.remove("coffee-selector-block");
            coffeeSelectors[i].innerHTML = 
            `
            <a href="#${types[selectedTypes[i]].type}" onclick="SelectCoffee(${i})">
                <img src="${link}">
                <p>${types[selectedTypes[i]].type}</p>
            </a>
            `;
        } else {
            coffeeSelectors[i].classList.remove("coffee-selected-block");
            coffeeSelectors[i].classList.add("coffee-selector-block");
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
    if (Math.max(...selectedTypes) >= types.length - 1) {
        return;
    }
    selectedTypes = selectedTypes.map(t => t + 1);
    selectedBlock -= 1; // Math.max(0, selectedBlock - 1);
    Update();
}

function ScrollUp() {
    if (Math.min(...selectedTypes) <= 0) {
        return;
    }
    selectedTypes = selectedTypes.map(t => t - 1);
    selectedBlock += 1; // Math.min(4, selectedBlock + 1);
    Update();
}

function OrderCoffee(coffeeName) {
    OpenOrderMenu();
    let currCoffee = FindCoffee(coffeeName);
    let i = 0;

    let sizes = "<div class='extras-list'>";
    currCoffee.sizes.forEach(elem => {
        sizes += 
        `
        <div class="coffee-extras-sizes" onclick="ChooseCoffeeSize(${i})">
            <p>${elem}</p>
        </div>
        `
        i += 1;
    });
    sizes += "</div>"

    let extras = "<div class='extras-list'>";
    i = 0;
    currCoffee.extras.forEach(elem => {
        extras += 
        `
        <div class="coffee-extras-extras" onclick="ChooseCoffeeExtra(${i})">
            <p>${elem}</p>
        </div>
        `
        i += 1;
    });
    extras += "</div>"
    i = 0;
    let milks = "<div class='extras-list'>";
    currCoffee.milks.forEach(elem => {
        milks += 
        `
        <div class="coffee-extras-milks" onclick="ChooseCoffeeMilk(${i})">
            <p>${elem}</p>
        </div>
        `
        i += 1;
    });
    milks += "</div>"

    if (currCoffee) {
        orderImageBlock.innerHTML = 
        `
        <img src="${currCoffee.image}">
        `
        coffeeOrderBlock.innerHTML = 
        `
        <h5>${currCoffee.name}</h5>
        <p class="low-opacity-text">Size</p>
        ${sizes}
        <p class="low-opacity-text">Extra</p>
        ${extras}
        <p class="low-opacity-text">Milk</p>
        ${milks}
        <div class="buy-block">
        <div class="count-price">
        <p style="font-size: 3vw; font-weight: 800;">${currCoffee.price} RUB</p>
        <input type="number" min="1" max="10" value="1" id="order-count-input">
        </div>
        <button onclick="CreateOrder('${currCoffee.name}', 0)">PLACE ORDER</button>
        </div>
        `;
    }
}

function FindCoffee(name) {
    return coffee.find(element => element.name == name) || null;
}

function OpenRightMenu() {
    rightMenu.style.width = "25%";
    rightMenu.style.display = "flex";
    leftMenu.classList.add("deactivated");
    mainBlock.classList.add("deactivated");
    htmlBody.style.overflow = "hidden";
}

function CloseRightMenu() {
    rightMenu.style.width = "0%";
    rightMenu.style.display = "none";
    leftMenu.classList.remove("deactivated");
    mainBlock.classList.remove("deactivated");
    htmlBody.style.overflow = "auto";
}

function OpenOrderMenu() {
    orderMenu.style.display = "flex";
    htmlBody.style.overflow = "hidden";
    mainBlock.style.display = "none";
    leftMenu.style.display = "none";
}

function CloseOrderMenu() {
    orderMenu.style.display = "none";
    htmlBody.style.overflow = "auto";
    mainBlock.style.display = "flex";
    leftMenu.style.display = "flex";
}

function ChooseCoffeeSize(ind) {
    i = 0;
    coffeeExtrasSizesButs = document.querySelectorAll(".coffee-extras-sizes");
    coffeeExtrasSizesButs.forEach(elem => {
        if (i == ind) {
            elem.classList.add("selected-coffee-extra");
            selectedSize = elem.innerText;
        }
        else {
            elem.classList.remove("selected-coffee-extra");
        }
        i += 1;
    })
}

function ChooseCoffeeExtra(ind) {
    i = 0;
    coffeeExtrasExtrasButs = document.querySelectorAll(".coffee-extras-extras");
    coffeeExtrasExtrasButs.forEach(elem => {
        if (i == ind) {
            elem.classList.add("selected-coffee-extra")
            selectedExtra = elem.innerText;
        }
        else {
            elem.classList.remove("selected-coffee-extra")
        }
        i += 1;
    })
}

function ChooseCoffeeMilk(ind) {
    i = 0;
    coffeeExtrasMilksButs = document.querySelectorAll(".coffee-extras-milks");
    coffeeExtrasMilksButs.forEach(elem => {
        if (i == ind) {
            elem.classList.add("selected-coffee-extra")
            selectedMilk = elem.innerText;
        }
        else {
            elem.classList.remove("selected-coffee-extra")
        }
        i += 1;
    })
}

function CreateOrder(name, count_json) {
    let selectedCoffee = FindCoffee(name);
    let count = 0;
    if (count_json == 0) {
        count = Number(document.getElementById("order-count-input").value);
    }
    else {
        count = count_json;
    }
    s = orderedCoffeeBlock.innerHTML;
    s += 
    `
    <div class="ordered-coffee-block">
    <div class="element-order-block">
    <img src="${selectedCoffee.image}">
    </div>
    <div class="element-order-block">
    <p>${selectedCoffee.name}</p>
    </div>
    <div class="block-count">
    <p>${count}</p>
    </div>
    </div>
    `
    orderedCoffeeBlock.innerHTML = s;
    totalPrice += count * selectedCoffee.price;
    totalCount += count;
    let counts = document.querySelectorAll(".order-count");
    console.log(counts);
    counts.forEach(elem => {
        console.log(elem);
        elem.innerText = totalCount
    })

    let p = "";
    p += 
    `
    <div class="price-total-block">
    <p>Subtotal</p>
    <p>${totalPrice} RUB</p>
    </div>

    <div class="price-total-block">
    <p>Discount -10%</p>
    <p>${(totalPrice * 0.1).toFixed()} RUB</p>
    </div>

    <div class="price-total-block">
    <p style="font-size: 22px">Total</p>
    <p>${(totalPrice * 0.9).toFixed()} RUB</p>
    </div>
    <div class="slide-close-button" onclick="CloseRightMenu()">
    <img src="images/right-slide.png">
    </div>
    `
    pricesBlock.innerHTML = p;
    if (count_json == 0) {
        orderedCoffeeList.push({"name": name, "count": count, "size": selectedSize, "extra": selectedExtra, "milk": selectedMilk});
        UpdateLocalStorage();
        CloseOrderMenu();
    } 
}

document.getElementById("search-input").addEventListener('keydown', function(e) {
    if (e.key == "Enter") {
      currFilter = this.value;
    }
    Init();
});

function UpdateLocalStorage() {
    localStorage.setItem("orderedCoffeeList", JSON.stringify(orderedCoffeeList));
}

function LoadLocalStorage() {
    orderedCoffeeList = JSON.parse(localStorage.getItem("orderedCoffeeList"));
    orderedCoffeeList.forEach(elem => {
        CreateOrder(elem.name, elem.count);
    })
}