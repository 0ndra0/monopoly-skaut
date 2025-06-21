console.log('Happy developing ✨')

const sloupec = document.getElementById('sloupec');

const jmena = ["Ondra", "Tom", "Ríša", "Heliodor"]
const domy = ["Plovárna", "Karlův most"]

let penize = {}
jmena.forEach(jmeno => {
    penize[jmeno] = 0;
})
let ceny_domu = {}
for (let i = 0; i < domy.length; i++) {
    ceny_domu[domy[i]] = 20 * (i + 1)
}

let majetky = {}
jmena.forEach(jmeno => {
    majetky[jmeno] = {};
})

jmena.forEach(jmeno => {
    const p = document.createElement('p');
    let text = `${jmeno} <button id="prichod-${jmeno}">Příchod</button>`
    for (let i = 0; i < domy.length; i++) {
        text += ` <button id="koupit${i}-${jmeno}">Koupit ${domy[i]} [${ceny_domu[domy[i]]} $]</button>`
    }

    p.innerHTML = text
    sloupec.appendChild(p)
    const tlacitko = document.getElementById(`prichod-${jmeno}`)
    tlacitko.addEventListener('click', (event) => {
        alert(jmeno)
    })

    for (let i = 0; i < domy.length; i++) {
        const tlacitko = document.getElementById(`koupit${i}-${jmeno}`)
        tlacitko.addEventListener('click', () => {

        })
    }
})

