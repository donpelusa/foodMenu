let alimentosData = {};
let desayunoItems = []; 
let almuerzoItems = [];
let cenaItems = [];

// Referencias a elementos del DOM
const desayunoAlimento = document.getElementById("desayuno-alimento");
const desayunoGramos = document.getElementById("desayuno-gramos");
const desayunoAgregar = document.getElementById("desayuno-agregar");
const desayunoTabla = document.getElementById("desayuno-tabla").querySelector("tbody");

const almuerzoAlimento = document.getElementById("almuerzo-alimento");
const almuerzoGramos = document.getElementById("almuerzo-gramos");
const almuerzoAgregar = document.getElementById("almuerzo-agregar");
const almuerzoTabla = document.getElementById("almuerzo-tabla").querySelector("tbody");

const cenaAlimento = document.getElementById("cena-alimento");
const cenaGramos = document.getElementById("cena-gramos");
const cenaAgregar = document.getElementById("cena-agregar");
const cenaTabla = document.getElementById("cena-tabla").querySelector("tbody");

const alvaroCalsEl = document.getElementById("alvaro-cals");
const alvaroProtEl = document.getElementById("alvaro-prot");
const alvaroCarbEl = document.getElementById("alvaro-carb");
const alvaroGrasEl = document.getElementById("alvaro-gras");
const alvaroFibrEl = document.getElementById("alvaro-fibr");

const carlaCalsEl = document.getElementById("carla-cals");
const carlaProtEl = document.getElementById("carla-prot");
const carlaCarbEl = document.getElementById("carla-carb");
const carlaGrasEl = document.getElementById("carla-gras");
const carlaFibrEl = document.getElementById("carla-fibr");

// Tabla real
const realAlvaroCalsEl = document.getElementById("real-alvaro-cals");
const realAlvaroProtEl = document.getElementById("real-alvaro-prot");
const realAlvaroCarbEl = document.getElementById("real-alvaro-carb");
const realAlvaroGrasEl = document.getElementById("real-alvaro-gras");
const realAlvaroFibrEl = document.getElementById("real-alvaro-fibr");

const realCarlaCalsEl = document.getElementById("real-carla-cals");
const realCarlaProtEl = document.getElementById("real-carla-prot");
const realCarlaCarbEl = document.getElementById("real-carla-carb");
const realCarlaGrasEl = document.getElementById("real-carla-gras");
const realCarlaFibrEl = document.getElementById("real-carla-fibr");

// Arrays con las restricciones
const desayunoPermitidos = [
    "Avena", "Palta", "Frambuesas", "Manzanas", "Plátano", 
    "Pera", "Chía", "Almendras", "Nueces", "Maní", 
    "Semillas girasol", "Semillas zapallo"
];

const cenaExcluidos = [
    "Lentejas", "Garbanzos", "Lentejas Rojas", "Poroto negro",
    "Arroz", "Lomo liso (Carne res)", "Láminas de Pan masa madre"
];

// Cargar el JSON de alimentos
fetch('alimentos.json')
  .then(response => response.json())
  .then(data => {
    alimentosData = data;
    poblarSelects();
    // Llamamos recalculateTotals aquí, después de cargar datos y poblar selects
    recalculateTotals();
  })
  .catch(error => console.error('Error al cargar alimentos.json:', error));

function poblarSelects() {
    // Poblar desayuno
    Object.keys(alimentosData).forEach(alimento => {
        if (desayunoPermitidos.includes(alimento)) {
            let option = document.createElement("option");
            option.value = alimento;
            option.textContent = alimento;
            desayunoAlimento.appendChild(option);
        }
    });

    // Poblar almuerzo (todos)
    Object.keys(alimentosData).forEach(alimento => {
        let option = document.createElement("option");
        option.value = alimento;
        option.textContent = alimento;
        almuerzoAlimento.appendChild(option);
    });

    // Poblar cena (todos menos excluidos)
    Object.keys(alimentosData).forEach(alimento => {
        if (!cenaExcluidos.includes(alimento)) {
            let option = document.createElement("option");
            option.value = alimento;
            option.textContent = alimento;
            cenaAlimento.appendChild(option);
        }
    });
}

// Eventos agregar ítems
desayunoAgregar.addEventListener('click', () => {
    const alimento = desayunoAlimento.value;
    const gramos = parseFloat(desayunoGramos.value);
    if (alimento && gramos > 0) {
        desayunoItems.push({alimento, gramos});
        renderTable(desayunoTabla, desayunoItems, 'desayuno');
        desayunoAlimento.value = "";
        desayunoGramos.value = "";
        recalculateTotals();
    }
});

almuerzoAgregar.addEventListener('click', () => {
    const alimento = almuerzoAlimento.value;
    const gramos = parseFloat(almuerzoGramos.value);
    if (alimento && gramos > 0) {
        almuerzoItems.push({alimento, gramos});
        renderTable(almuerzoTabla, almuerzoItems, 'almuerzo');
        almuerzoAlimento.value = "";
        almuerzoGramos.value = "";
        recalculateTotals();
    }
});

cenaAgregar.addEventListener('click', () => {
    const alimento = cenaAlimento.value;
    const gramos = parseFloat(cenaGramos.value);
    if (alimento && gramos > 0) {
        cenaItems.push({alimento, gramos});
        renderTable(cenaTabla, cenaItems, 'cena');
        cenaAlimento.value = "";
        cenaGramos.value = "";
        recalculateTotals();
    }
});

function renderTable(tbody, items, meal) {
    const thead = tbody.parentNode.querySelector("thead");
    if (thead && !thead.dataset.generated) {
        thead.innerHTML = `
            <tr>
                <th>Alimento</th>
                <th>Gramos (Total)</th>
                <th>Calorías</th>
                <th>Proteína (g)</th>
                <th>Carbohidratos (g)</th>
                <th>Grasas (g)</th>
                <th>Fibra (g)</th>
                <th>Acción</th>
            </tr>
        `;
        thead.dataset.generated = "true";
    }

    tbody.innerHTML = "";
    items.forEach((item, index) => {
        const d = alimentosData[item.alimento];
        if(!d) return;

        const cals = (d.calorias * item.gramos).toFixed(2);
        const prot = (d.proteina * item.gramos).toFixed(2);
        const carb = (d.carbohidratos * item.gramos).toFixed(2);
        const gras = (d.grasas * item.gramos).toFixed(2);
        const fibr = (d.fibra * item.gramos).toFixed(2);

        const tr = document.createElement("tr");

        const tdAlimento = document.createElement("td");
        tdAlimento.textContent = item.alimento;

        const tdGramos = document.createElement("td");
        tdGramos.textContent = item.gramos;

        const tdCals = document.createElement("td");
        tdCals.textContent = cals;

        const tdProt = document.createElement("td");
        tdProt.textContent = prot;

        const tdCarb = document.createElement("td");
        tdCarb.textContent = carb;

        const tdGras = document.createElement("td");
        tdGras.textContent = gras;

        const tdFibr = document.createElement("td");
        tdFibr.textContent = fibr;

        const tdAcc = document.createElement("td");
        const btn = document.createElement("button");
        btn.textContent = "Eliminar";
        btn.addEventListener('click', () => {
            if(meal === 'desayuno') {
                desayunoItems.splice(index, 1);
                renderTable(tbody, desayunoItems, 'desayuno');
            } else if(meal === 'almuerzo') {
                almuerzoItems.splice(index, 1);
                renderTable(tbody, almuerzoItems, 'almuerzo');
            } else if(meal === 'cena') {
                cenaItems.splice(index, 1);
                renderTable(tbody, cenaItems, 'cena');
            }
            recalculateTotals();
        });
        tdAcc.appendChild(btn);

        tr.appendChild(tdAlimento);
        tr.appendChild(tdGramos);
        tr.appendChild(tdCals);
        tr.appendChild(tdProt);
        tr.appendChild(tdCarb);
        tr.appendChild(tdGras);
        tr.appendChild(tdFibr);
        tr.appendChild(tdAcc);

        tbody.appendChild(tr);
    });
}

function sumNutrients(items) {
    let cals=0, prot=0, carb=0, gras=0, fibr=0;
    items.forEach(item => {
        const d = alimentosData[item.alimento];
        if(!d) return;
        cals += d.calorias * item.gramos;
        prot += d.proteina * item.gramos;
        carb += d.carbohidratos * item.gramos;
        gras += d.grasas * item.gramos;
        fibr += d.fibra * item.gramos;
    });
    return {cals, prot, carb, gras, fibr};
}

function recalculateTotals() {
    const desayunoFijos = [
        {alimento:"Huevos", gramos:300}, // 6 huevos (50g/huevo)
        {alimento:"Yogurt Griego", gramos:240}
    ];
    const desayunoFijosTotal = sumNutrients(desayunoFijos);
    const desayunoOpcionalesTotal = sumNutrients(desayunoItems);

    let totalDesayuno = {
        cals: desayunoFijosTotal.cals + desayunoOpcionalesTotal.cals,
        prot: desayunoFijosTotal.prot + desayunoOpcionalesTotal.prot,
        carb: desayunoFijosTotal.carb + desayunoOpcionalesTotal.carb,
        gras: desayunoFijosTotal.gras + desayunoOpcionalesTotal.gras,
        fibr: desayunoFijosTotal.fibr + desayunoOpcionalesTotal.fibr
    };

    let totalAlmuerzo = sumNutrients(almuerzoItems);
    let totalCena = sumNutrients(cenaItems);

    let totalDia = {
        cals: totalDesayuno.cals + totalAlmuerzo.cals + totalCena.cals,
        prot: totalDesayuno.prot + totalAlmuerzo.prot + totalCena.prot,
        carb: totalDesayuno.carb + totalAlmuerzo.carb + totalCena.carb,
        gras: totalDesayuno.gras + totalAlmuerzo.gras + totalCena.gras,
        fibr: totalDesayuno.fibr + totalAlmuerzo.fibr + totalCena.fibr
    };

    // Valores ideales
    const alvaroCals = 3500 * (4/7);
    const alvaroProt = 350 * (22/35);
    const alvaroCarb = 250 * (3/5);
    const alvaroGras = 85 * (10/17);
    const alvaroFibr = 25;

    const carlaCals = 3500 * (3/7);
    const carlaProt = 350 * (13/35);
    const carlaCarb = 250 * (2/5);
    const carlaGras = 85 * (7/17);
    const carlaFibr = 25;

    alvaroCalsEl.textContent = alvaroCals.toFixed(2);
    alvaroProtEl.textContent = alvaroProt.toFixed(2);
    alvaroCarbEl.textContent = alvaroCarb.toFixed(2);
    alvaroGrasEl.textContent = alvaroGras.toFixed(2);
    alvaroFibrEl.textContent = alvaroFibr.toFixed(2);

    carlaCalsEl.textContent = carlaCals.toFixed(2);
    carlaProtEl.textContent = carlaProt.toFixed(2);
    carlaCarbEl.textContent = carlaCarb.toFixed(2);
    carlaGrasEl.textContent = carlaGras.toFixed(2);
    carlaFibrEl.textContent = carlaFibr.toFixed(2);

    // División real
    const realAlvCals = totalDia.cals * (4/7);
    const realCarCals = totalDia.cals * (3/7);

    const realAlvProt = totalDia.prot * (22/35);
    const realCarProt = totalDia.prot * (13/35);

    const realAlvCarb = totalDia.carb * (3/5);
    const realCarCarb = totalDia.carb * (2/5);

    const realAlvGras = totalDia.gras * (10/17);
    const realCarGras = totalDia.gras * (7/17);

    const realAlvFibr = totalDia.fibr / 2;
    const realCarFibr = totalDia.fibr / 2;

    realAlvaroCalsEl.textContent = realAlvCals.toFixed(2);
    realAlvaroProtEl.textContent = realAlvProt.toFixed(2);
    realAlvaroCarbEl.textContent = realAlvCarb.toFixed(2);
    realAlvaroGrasEl.textContent = realAlvGras.toFixed(2);
    realAlvaroFibrEl.textContent = realAlvFibr.toFixed(2);

    realCarlaCalsEl.textContent = realCarCals.toFixed(2);
    realCarlaProtEl.textContent = realCarProt.toFixed(2);
    realCarlaCarbEl.textContent = realCarCarb.toFixed(2);
    realCarlaGrasEl.textContent = realCarGras.toFixed(2);
    realCarlaFibrEl.textContent = realCarFibr.toFixed(2);

    function colorCell(el, actual, objetivo, tipo) {
        el.classList.remove("verde","rojo");
        let val = parseFloat(actual);

        switch(tipo) {
            case "cal":
            case "carb":
            case "gras":
                // verde si val < objetivo
                if (val < objetivo) {
                    el.classList.add("verde");
                } else {
                    el.classList.add("rojo");
                }
                break;
            case "prot":
                // verde si val > objetivo
                if (val > objetivo) {
                    el.classList.add("verde");
                } else {
                    el.classList.add("rojo");
                }
                break;
            case "fibr":
                // verde si val > objetivo
                if (val > objetivo) {
                    el.classList.add("verde");
                } else {
                    el.classList.add("rojo");
                }
                break;
        }
    }

    // Objetivos por persona
    const alvObjCal = 3500*(4/7);
    const alvObjProt = 350*(22/35);
    const alvObjCarb = 250*(3/5);
    const alvObjGras = 85*(10/17);
    const alvObjFibr = 25;

    const carObjCal = 3500*(3/7);
    const carObjProt = 350*(13/35);
    const carObjCarb = 250*(2/5);
    const carObjGras = 85*(7/17);
    const carObjFibr = 25;

    // Colorear Álvaro
    colorCell(realAlvaroCalsEl, realAlvCals, alvObjCal, "cal");
    colorCell(realAlvaroProtEl, realAlvProt, alvObjProt, "prot");
    colorCell(realAlvaroCarbEl, realAlvCarb, alvObjCarb, "carb");
    colorCell(realAlvaroGrasEl, realAlvGras, alvObjGras, "gras");
    colorCell(realAlvaroFibrEl, realAlvFibr, alvObjFibr, "fibr");

    // Colorear Carla
    colorCell(realCarlaCalsEl, realCarCals, carObjCal, "cal");
    colorCell(realCarlaProtEl, realCarProt, carObjProt, "prot");
    colorCell(realCarlaCarbEl, realCarCarb, carObjCarb, "carb");
    colorCell(realCarlaGrasEl, realCarGras, carObjGras, "gras");
    colorCell(realCarlaFibrEl, realCarFibr, carObjFibr, "fibr");

    renderTable(desayunoTabla, desayunoItems, 'desayuno');
    renderTable(almuerzoTabla, almuerzoItems, 'almuerzo');
    renderTable(cenaTabla, cenaItems, 'cena');
}

// Nueva funcionalidad para exportar el día:

document.getElementById("exportar-dia").addEventListener("click", exportarDia);

function exportarDia() {
    const selectDay = document.getElementById("select-day");
    const chosenDay = selectDay.value; // Por ejemplo "martes"

    // Sumar todos los alimentos del día: desayuno fijo + desayunoItems + almuerzoItems + cenaItems
    // Primero, los fijos del desayuno:
    const desayunoFijos = [
        {alimento:"Huevos", gramos:300}, // 6 huevos
        {alimento:"Yogurt Griego", gramos:240}
    ];

    // Combinar todos los arrays en uno solo
    const allItems = [...desayunoFijos, ...desayunoItems, ...almuerzoItems, ...cenaItems];

    // Crear un objeto para sumar por alimento
    const alimentosTotales = {};

    allItems.forEach(item => {
        if(!alimentosTotales[item.alimento]) {
            alimentosTotales[item.alimento] = 0;
        }
        alimentosTotales[item.alimento] += item.gramos;
    });

    // Ordenar por nombre de alimento (clave)
    const alimentosOrdenados = Object.keys(alimentosTotales).sort().reduce((obj, key) => {
        obj[key] = alimentosTotales[key];
        return obj;
    }, {});

    // Generar el JSON
    const jsonData = JSON.stringify(alimentosOrdenados, null, 2);

    // Crear Blob y disparar descarga
    const blob = new Blob([jsonData], {type: "application/json"});
    const url = URL.createObjectURL(blob);

    // Crear un link temporal para forzar la descarga
    const a = document.createElement("a");
    a.href = url;
    a.download = chosenDay + ".json"; // nombre del archivo
    a.click();

    // Liberar el objeto URL
    URL.revokeObjectURL(url);
}