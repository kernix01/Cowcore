const mainCowButton = document.querySelector(".main-cow-btn");
const mainCowImage = document.querySelector(".pixel-image");
const scoreCounter = document.querySelector("#score-counter");
const cpsCounter = document.querySelector("#cps-counter");
const comboFills = document.querySelectorAll(".combo-fill");
const comboLabel = document.querySelector(".bar-label");
const gameScreen = document.querySelector("#game-screen");

const upgradesContainer = document.querySelector("#upgrades-container");
const upgradesDock = document.querySelector(".upgrades-dock");
const toggleUpgradesButton = document.querySelector("#toggle-upgrades-btn");
const toggleUpgradesLabel = toggleUpgradesButton.querySelector(".dock-toggle-label");
const categoryButtons = document.querySelectorAll("[data-upgrade-filter]");

const settingsModal = document.querySelector("#settings-modal");
const openSettingsButton = document.querySelector("#settings-open-btn");
const closeSettingsButton = document.querySelector("#settings-close-btn");
const fullscreenButton = document.querySelector("#fullscreen-btn");
const resetButton = document.querySelector("#reset-btn");

const backgroundName = document.querySelector("#bg-name");
const previousBackgroundButton = document.querySelector("#bg-prev");
const nextBackgroundButton = document.querySelector("#bg-next");
const cowName = document.querySelector("#cow-name");
const previousCowButton = document.querySelector("#cow-prev");
const nextCowButton = document.querySelector("#cow-next");
const miniCowName = document.querySelector("#mini-cow-name");
const miniCowNextButton = document.querySelector("#mini-cow-next");
const miniCowPrevButton = document.querySelector("#mini-cow-prev");
const miniCowPreview = document.querySelector("#mini-cow-preview");


const multiplierThreshold = 50;
const tickInterval = 1000;

const upgradeIcons = {
    click: "box/Cowbell.png",
    pasture: "box/Milk.png",
    farm: "box/Mushroom.png",
    factory: "box/Gold.png",
    mine: "box/IceCrystal.png",
    portal: "box/LightningOrb.png",
    cloner: "box/StarFragment.png",
    galaxy: "box/Crown.png"
};

const advancedUpgradeIds = new Set(["portal", "cloner", "galaxy"]);

const backgrounds = [
    "fon/1.png",
    "fon/2.png",
    "fon/3.png",
    "fon/4.png",
    "fon/5.png",
    "fon/6.png",
    "fon/7.png",
    "fon/8.png",
    "fon/9.png",
    "fon/10.png",
    "fon/11.png",
    "fon/12.png",
    "fon/13.png"
];

const cows = [
    { name: "Обычная", url: "Normal/Cow.png" },
    { name: "Каменная корова", url: "Normal/Cow_Stone.png" },
    { name: "Слаймовая корова", url: "Normal/Cow_Slime.png" },
    { name: "Космическая корова", url: "Normal/Cow_Cosmic.png" },
    { name: "Золотая корова", url: "Normal/Cow_Golden.png" },
    { name: "Лавовая корова", url: "Normal/Cow_Lava.png" },
    { name: "Грибная корова", url: "Normal/Cow_Mushroom.png" },
    { name: "Ледяная корова", url: "Normal/Cow_Ice.png" },
    { name: "Штормовая корова", url: "Normal/Cow_Storm.png" }
];

const miniCow = [
    { name: "Обычная", url: "headCow/CowHead.png" },
    { name: "Космическая корова", url: "headCow/CowHead_Cosmic.png" },
    { name: "Золотая корова", url: "headCow/CowHead_Golden.png" },
    { name: "Лавовая корова", url: "headCow/CowHead_Lava.png" },
    { name: "Грибная корова", url: "headCow/CowHead_Mushroom.png" },
    { name: "Ледяная корова", url: "headCow/CowHead_Ice.png" },
    { name: "Штормовая корова", url: "headCow/CowHead_Storm.png" }
];

const initialUpgrades = [
    { id: "click", name: "Сила Клика", desc: "+1 за клик", cost: 10, level: 1, type: "click", power: 1 },
    { id: "pasture", name: "Пастбище", desc: "+1 корова/сек", cost: 50, level: 0, type: "cps", power: 1 },
    { id: "farm", name: "Ферма коров", desc: "+8 коров/сек", cost: 400, level: 0, type: "cps", power: 8 },
    { id: "factory", name: "Завод коров", desc: "+50 коров/сек", cost: 3000, level: 0, type: "cps", power: 50 },
    { id: "mine", name: "Коровья Шахта", desc: "+260 коров/сек", cost: 25000, level: 0, type: "cps", power: 260 },
    { id: "portal", name: "Адский Портал", desc: "+1400 коров/сек", cost: 180000, level: 0, type: "cps", power: 1400 },
    { id: "cloner", name: "Клонатор коров", desc: "+7800 коров/сек", cost: 1400000, level: 0, type: "cps", power: 7800 },
    { id: "galaxy", name: "Космо-Ферма", desc: "+44000 коров/сек", cost: 10000000, level: 0, type: "cps", power: 44000 }
];


let score = 0;
let clickPower = 1;
let totalCps = 0;
let multiplierProgress = 0;
let isMultiplierActive = false;
let currentBackgroundIndex = 0;
let currentCowIndex = 0;
let currentMiniCowIndex = 0;
let currentUpgradeFilter = "all";

// три точки раскладывают свойства объекта внутрь нового объекта (три точки называют(spread-синтаксис))
let upgrades = initialUpgrades.map((upgrade) =>  ({...upgrade}))


function calculateCps() {
    let currentCps = 0;
    let currentClickPower = 1;

    upgrades.forEach((upgrade) => {
        if (upgrade.type === "cps") {
            currentCps += upgrade.level * upgrade.power;
        } else if (upgrade.type === "click") {
            currentClickPower = upgrade.level * upgrade.power;
        }
    });

    totalCps = currentCps;
    clickPower = currentClickPower;
}

function getVisibleUpgrades() {
    return upgrades.filter((upgrade) => {
        if (currentUpgradeFilter === "all") return true;
        if (currentUpgradeFilter === "advanced") return advancedUpgradeIds.has(upgrade.id);
        if (currentUpgradeFilter === "click") return upgrade.type === "click";

        return upgrade.type === "cps" && !advancedUpgradeIds.has(upgrade.id);
    });
}

function renderUpgrades() {
    upgradesContainer.innerHTML = "";

    const visibleUpgrades = getVisibleUpgrades();

    visibleUpgrades.forEach((upgrade) => {
        const upgradeButton = document.createElement("button");

        upgradeButton.classList.add("upgrade-item");
        upgradeButton.dataset.upgradeId = upgrade.id;
        upgradeButton.disabled = score < upgrade.cost;


        upgradeButton.innerHTML = `
            <div class="upgrade-icon-wrap">
                <img src="${upgradeIcons[upgrade.id]}" class="upgrade-icon" alt="">
            </div>
            <div class="upgrade-info">
                <div class="upgrade-name">${upgrade.name}</div>
                <div class="upgrade-level">LV ${upgrade.level}</div>
            </div>
            <div class="upgrade-cost">
                <img src="headCow/CowHead.png" class="mini-cow" alt="">
                <span>${upgrade.cost}</span>
            </div>
            <div class="upgrade-desc">${upgrade.desc}</div>
        `;

        upgradesContainer.appendChild(upgradeButton);
    });
}

function updateInterface() {
    scoreCounter.textContent = Math.round(score);
    cpsCounter.textContent = totalCps;

    updateUpgradeCards();
}

function updateCombo() {
    comboFills.forEach((fill) => {
        fill.style.width = multiplierProgress + "%";
    });

    if (isMultiplierActive) {
        comboLabel.style.color = "#facc15";
        comboLabel.textContent = "ACTIVE!";
    } else {
        comboLabel.style.color = "#fff";
        comboLabel.textContent = "2X";
    }

    
}

function updateBackground() {
    gameScreen.style.backgroundImage = `url("${backgrounds[currentBackgroundIndex]}")`;
    backgroundName.textContent = `Фон ${currentBackgroundIndex + 1}`;
}

function updateCow() {
    mainCowImage.src = cows[currentCowIndex].url;
    cowName.textContent = cows[currentCowIndex].name;
}

function updateMiniCow() {
    miniCowName.textContent = miniCow[currentMiniCowIndex].name;

    const currentMiniCow = miniCow[currentMiniCowIndex];
    miniCowName.textContent = currentMiniCow.name;
    
    const currentMiniCowImage = document.querySelectorAll(".mini-cow");
    currentMiniCowImage.forEach((image) => {
        image.src = currentMiniCow.url;
    });
}

function saveGame() {
    localStorage.setItem("cow_score", score);
    localStorage.setItem("cow_upgrades", JSON.stringify(upgrades));
    localStorage.setItem("cow_bg", currentBackgroundIndex);
    localStorage.setItem("cow_cow", currentCowIndex);
    localStorage.setItem("mini_cow", currentMiniCowIndex);
}

function loadGame() {
    const savedScore = localStorage.getItem("cow_score");
    const savedUpgrades = localStorage.getItem("cow_upgrades");
    const savedBackground = localStorage.getItem("cow_bg");
    const savedCow = localStorage.getItem("cow_cow");
    const savedMiniCow = localStorage.getItem("mini_cow");

    if (savedScore !== null) {
        score = Math.round(Number(savedScore));
    }

    if (savedUpgrades !== null) {
        upgrades = JSON.parse(savedUpgrades);
    }

    if (savedBackground !== null) {
        currentBackgroundIndex = Number(savedBackground);
    }

    if (savedCow !== null) {
        currentCowIndex = Number(savedCow);
    }

    if (savedMiniCow !== null) {
        currentMiniCowIndex = Number(savedMiniCow);
    }

    updateBackground();
    updateCow();
    updateMiniCow();
    calculateCps();
}

function updateGame() {
    calculateCps();

    const passiveGain = isMultiplierActive
        ? totalCps * 2
        : totalCps;

    score += passiveGain;

    if (multiplierProgress > 0) {
        multiplierProgress = Math.max(0, multiplierProgress - 3);

        if (multiplierProgress < multiplierThreshold) {
            isMultiplierActive = false;
        }
    }

    updateCombo();
    updateInterface();
    saveGame();
}

function updateUpgradeCards() {
    const upgradeButtons = document.querySelectorAll(".upgrade-item");

    upgradeButtons.forEach((upgradeButton) => {
        const upgradeId = upgradeButton.dataset.upgradeId;

        const upgrade = upgrades.find((upgrade) => upgrade.id === upgradeId);

        if (!upgrade) {
            return;
        }

        upgradeButton.disabled = score < upgrade.cost;

        const upgradeLV = upgradeButton.querySelector(".upgrade-level");
        const upgradeCost = upgradeButton.querySelector(".upgrade-cost span");

        upgradeLV.textContent = `LV ${upgrade.level}`;
        upgradeCost.textContent = upgrade.cost;
        
    });
}

function openSettings() {
    settingsModal.style.display = "flex";
    settingsModal.setAttribute("aria-hidden", "false");
    closeSettingsButton.focus();
}

function closeSettings() {
    settingsModal.style.display = "none";
    settingsModal.setAttribute("aria-hidden", "true");
    openSettingsButton.focus();
}


mainCowButton.addEventListener("click", () => {
    multiplierProgress = Math.min(100, multiplierProgress + 5);
    isMultiplierActive = multiplierProgress >= multiplierThreshold;

    const finalClickPower = isMultiplierActive
        ? clickPower * 2
        : clickPower;

    score += finalClickPower;

    updateCombo();
    updateInterface();
});

upgradesContainer.addEventListener("click", (event) => {
    const upgradeButton = event.target.closest(".upgrade-item");

    if (!upgradeButton) return;

    const upgradeId = upgradeButton.dataset.upgradeId;
    const upgrade = upgrades.find((item) => item.id === upgradeId);

    if (!upgrade || score < upgrade.cost) return;

    score -= upgrade.cost;
    upgrade.level += 1;
    upgrade.cost = Math.round(upgrade.cost * 1.5);

    calculateCps();
    saveGame();
    updateInterface();
});

toggleUpgradesButton.addEventListener("click", () => {
    const isHidden = upgradesDock.classList.toggle("upgrades-hidden");

    toggleUpgradesButton.setAttribute("aria-expanded", String(!isHidden));
    toggleUpgradesLabel.textContent = isHidden
        ? "Показать"
        : "Скрыть";
});

categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        currentUpgradeFilter = button.dataset.upgradeFilter;

        categoryButtons.forEach((categoryButton) => {
            categoryButton.classList.toggle("active", categoryButton === button);
        });

        renderUpgrades();
    });
});

fullscreenButton.addEventListener("click", async () => {
    try {
        if (document.fullscreenElement) {
            await document.exitFullscreen();
        } else {
            await gameScreen.requestFullscreen();
        }
    } catch (error) {
        console.error("Не удалось изменить полноэкранный режим:", error);
    }
});

document.addEventListener("fullscreenchange", () => {
    const isFullscreen = Boolean(document.fullscreenElement);

    fullscreenButton.textContent = isFullscreen
        ? "×"
        : "⛶";

    fullscreenButton.setAttribute(
        "aria-label",
        isFullscreen
            ? "Выйти из полноэкранного режима"
            : "Полноэкранный режим"
    );
});

openSettingsButton.addEventListener("click", () => {
    openSettings();
});

closeSettingsButton.addEventListener("click", () => {
    closeSettings();
});

settingsModal.addEventListener("click", (event) => {
    if (event.target === settingsModal) {
        closeSettings();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && settingsModal.style.display === "flex") {
        closeSettings();
    }
});

nextBackgroundButton.addEventListener("click", () => {
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;

    updateBackground();
    saveGame();
});

previousBackgroundButton.addEventListener("click", () => {
    currentBackgroundIndex = (currentBackgroundIndex - 1 + backgrounds.length) % backgrounds.length;

    updateBackground();
    saveGame();
});

nextCowButton.addEventListener("click", () => {
    currentCowIndex = (currentCowIndex + 1) % cows.length;

    updateCow();
    saveGame();
});

previousCowButton.addEventListener("click", () => {
    currentCowIndex = (currentCowIndex - 1 + cows.length) % cows.length;

    updateCow();
    saveGame();
});

miniCowNextButton.addEventListener("click", () => {
    currentMiniCowIndex = (currentMiniCowIndex + 1) % miniCow.length;

    updateMiniCow();
    saveGame();
});

miniCowPrevButton.addEventListener("click", () => {
    currentMiniCowIndex = (currentMiniCowIndex - 1 + miniCow.length) % miniCow.length;

    updateMiniCow();
    saveGame();
});

resetButton.addEventListener("click", () => {
    score = 0;
    multiplierProgress = 0;
    isMultiplierActive = false;
    
    currentBackgroundIndex = 0;
    currentCowIndex = 0;
    currentMiniCowIndex = 0;

    upgrades = initialUpgrades.map((upgrade) => ({...upgrade}));

    
    calculateCps();
    updateCow();
    updateMiniCow();
    updateBackground();
    updateCombo();
    updateInterface();
    saveGame();
});


loadGame();
updateCombo();
renderUpgrades();
updateInterface();

setInterval(updateGame, tickInterval);
