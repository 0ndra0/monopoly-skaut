const sloupec = document.getElementById('sloupec');

const jmena = ["Heliodor", "Karel", "Pavel", "Straka", "Pepa", "Risa", "Brcek", "Ondra", "Martin", "Petarda", "Kaja", "Orel", "Tonda"]
const seznamDomu = [[],
    ["Kancelare", "Celnice", "Ambasada", "Policie", "Vezeni", "Kasarna", "Urad", "Radnice", "Soud"],
    ["Tovarna", "Skladiste", "Most", "Benzinka", "Parkoviste", "Depo", "Nadrazi", "Pristav", "Letiste", ],
    ["Kavarna","Obchod", "Restaurace", "Lekarna", "Trznice", "Kino", "Supermarket", "Hotel", "Banka"],
    ["Knihovna", "Muzeum", "Archiv", "Galerie", "Divadlo", "Filharmonie", "Planetarium", "Univerzita", "Observator"],
    ["Jesle", "Skolka",  "Duchodak", "Ordinace", "Hospic", "Sanatorium", "Laborator", "Poliklinika", "Nemocnice", ]]

const seznamStanovist = ["nula","Veřejné a správní budovy", "Dopravní a průmyslové budovy", "Obchodní a ubytovací budovy", "ulturní a vzdělávací budovy", "Zdravotnické a sociální budovy"]

const prvni_spusteni = !window.location.hash.startsWith("#stanoviste-")
let stanoviste = 0
if (prvni_spusteni) {
    if ((window.location.hash.startsWith("#start-"))) {
        stanoviste = parseInt(window.location.hash[7]) % seznamDomu.length
    } else {
        stanoviste = 1
    }
} else {
    stanoviste = parseInt(window.location.hash[12])
}

const domy = seznamDomu[stanoviste]
let monopoly = [domy.slice(0, 3), domy.slice(3, 6), domy.slice(6, 9)]

let penize = {}
let ceny_domu = {}

for (let i = 0; i < domy.length; i++) {
    ceny_domu[domy[i]] = 20 * (Math.floor(i/3) + 1) * (i % 3 + 1)
}

let majetky = {}
jmena.forEach((jmeno) => {
    majetky[jmeno] = {}
})
let koupene_domy = []

if (prvni_spusteni) {
    window.location.hash = `stanoviste-${stanoviste}?`
    jmena.forEach(jmeno => {
        penize[jmeno] = 0;
        window.location.hash += jmeno + "=0&"
    })

    domy.forEach(dum => {
        window.location.hash += dum + "=-.0&"
    })

} else {
    window.location.hash.split('?')[1].split("&").forEach(parameter => {
        const key = parameter.split('=')[0];
        const value = parameter.split('=')[1];
        if (jmena.includes(key)) {
            const jmeno = key
            const majetek = value
            penize[jmeno] = parseInt(majetek)
        } else if (domy.includes(key)) {
            const dum = key
            const majitel = value.split(".")[0]
            const uroven = value.split(".")[1]
            if (majitel !== "-") {
                majetky[majitel][dum] = uroven
                koupene_domy.splice(0, 0, dum)
            }
        }
    })

}

reload()

window.onhashchange = () => {
    reload()
}

function reload() {

    sloupec.innerHTML = `<h3>Stanoviště ${stanoviste} - ${seznamStanovist[stanoviste]}</h3>`
    jmena.forEach(jmeno => {
        const p = document.createElement('p');
        let text = `${jmeno}: ${penize[jmeno]} DHP <button id="prichod-${jmeno}">Příchod</button> <button id="vybrat-${jmeno}">Vybrat peníze</button>`

        domy.forEach(dum => {
            const barva = ["orange", "yellow", "violet"][Math.floor(domy.indexOf(dum) / 3)]
            if (domy.indexOf(dum) % 3 === 0) {
                text += `<div style="background: ${barva};padding: 3px;margin-top: 5px">`
            }
            if (!koupene_domy.includes(dum)) {
                text += `${dum}: <button id="koupit${dum}-${jmeno}" style="background: lightgreen">Koupit [-${ceny_domu[dum]} DHP]</button><br>`
            }
            if (Object.keys(majetky[jmeno]).includes(dum)) {
                const uroven = parseInt(majetky[jmeno][dum])
                text += `${dum} [${uroven}]: <button id="prodat${dum}-${jmeno}" style="background: lightcoral">Prodat [+${ceny_domu[dum]} DHP]</button>`
                if (uroven !== 5) {
                    text += ` <button id="vylepsit${dum}-${jmeno}" style="background: lightblue">Vylepšit [-${ceny_domu[dum] / 2 * uroven} DHP]</button><br>`
                } else {
                    text += `<br>`
                }
            }
            if (domy.indexOf(dum) % 3 === 2) {
                text += `</div>`
            }
        })

        p.innerHTML = text
        sloupec.appendChild(p)
        const prichod = document.getElementById(`prichod-${jmeno}`)
        prichod.addEventListener('click', (event) => {
            jmena.forEach(aktJmeno => {
                if (aktJmeno !== jmeno) {
                    Object.entries(majetky[aktJmeno]).forEach(([dum, uroven]) => {
                        let domuVMonopolu = 0
                        Object.entries(majetky[aktJmeno]).forEach(([aktDum, _]) => {
                            if (Math.floor(domy.indexOf(aktDum) / 3) === Math.floor(domy.indexOf(dum) / 3)) {domuVMonopolu ++}
                        })
                        pridatPenize(aktJmeno, ceny_domu[dum] / 10 * uroven * 2**(domuVMonopolu - 1));
                    })
                }
            })
        })
        const vybrat = document.getElementById(`vybrat-${jmeno}`)
        vybrat.addEventListener('click', (event) => {
            //alert("Vydej hráči " + jmeno + " " + penize[jmeno] + " DHP")
            pridatPenize(jmeno, -penize[jmeno])
        })

        domy.forEach(dum => {
            if (!koupene_domy.includes(dum)) {
                const koupit = document.getElementById(`koupit${dum}-${jmeno}`)
                koupit.addEventListener('click', () => {
                    //alert(jmeno + " platí " + ceny_domu[dum] + " DHP")
                    pridatMajetek(jmeno, dum)

                })
            }

            if (Object.keys(majetky[jmeno]).includes(dum)) {
                const uroven = parseInt(majetky[jmeno][dum])
                const prodat = document.getElementById(`prodat${dum}-${jmeno}`)
                prodat.addEventListener('click', () => {
                    pridatPenize(jmeno, ceny_domu[dum])
                    prodatMajetek(jmeno, dum)

                })
                if (uroven !== 5) {
                    const vylepsit = document.getElementById(`vylepsit${dum}-${jmeno}`)
                    vylepsit.addEventListener('click', () => {
                        //alert(jmeno + " platí " + ceny_domu[dum] / 2 * uroven + " DHP")
                        vylepsitMajetek(jmeno, dum)

                    })
                }
            }

        })
    })
}

function pridatPenize(jmeno, pridanePenize) {
    penize[jmeno] += pridanePenize
    window.location.hash = window.location.hash.replace(RegExp(jmeno + "=-*\\d*"), jmeno + "=" + penize[jmeno])
}

function pridatMajetek(jmeno, dum) {
    console.log("sdfasfd")
    majetky[jmeno][dum] = 1
    koupene_domy.splice(0, 0, dum)
    window.location.hash = window.location.hash.replace(RegExp(dum + "=-.\\d"), dum + "=" + jmeno + ".1")
}

function prodatMajetek(jmeno, dum) {
    delete majetky[jmeno][dum]
    koupene_domy.splice(koupene_domy.indexOf(dum), 1)
    window.location.hash = window.location.hash.replace(RegExp(dum + "=" + jmeno + ".\\d"), dum + "=-.1")
}
function vylepsitMajetek(jmeno, dum) {
    const uroven = parseInt(majetky[jmeno][dum]) + 1

    majetky[jmeno][dum] = uroven
    window.location.hash = window.location.hash.replace(RegExp(dum + "=" + jmeno + ".\\d"), dum + "=" + jmeno + "." + uroven)
}