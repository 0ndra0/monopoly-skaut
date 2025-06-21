const searchParams = new URLSearchParams();

const sloupec = document.getElementById('sloupec');

const jmena = ["ondra", "tom", "risa", "heliodor"]
const domy = ["plovarna", "karluv-most", "narodni-muzeum", "hlavni-nadrazi", "nabrezi"]

const prvni_spusteni = !window.location.hash.startsWith("#home?")

let penize = {}
let ceny_domu = {}

for (let i = 0; i < domy.length; i++) {
    ceny_domu[domy[i]] = 20 * (i + 1)
}

let majetky = {}
jmena.forEach((jmeno) => {
    majetky[jmeno] = {}
})
let koupene_domy = []

if (prvni_spusteni) {
    window.location.hash = "home?"
    jmena.forEach(jmeno => {
        penize[jmeno] = 0;
        window.location.hash += jmeno + "=0&"
    })

    domy.forEach(dum => {
        window.location.hash += dum + "=-.0&"
    })

} else {
    window.location.hash.split('home?')[1].split("&").forEach(parameter => {
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

    sloupec.innerHTML = ""
    jmena.forEach(jmeno => {
        const p = document.createElement('p');
        let text = `${jmeno}: ${penize[jmeno]} DHP <button id="prichod-${jmeno}">Příchod</button> <button id="vybrat-${jmeno}">Vybrat peníze</button>`

        domy.forEach(dum => {
            if (!koupene_domy.includes(dum)) {
                text += ` <button id="koupit${dum}-${jmeno}" style="background: lightgreen">Koupit ${dum} [-${ceny_domu[dum]} DHP]</button>`
            }
            if (Object.keys(majetky[jmeno]).includes(dum)) {
                const uroven = parseInt(majetky[jmeno][dum])
                text += ` <button id="prodat${dum}-${jmeno}" style="background: lightcoral">Prodat ${dum} [+${ceny_domu[dum]} DHP]</button>`
                if (uroven !== 5) {
                    text += ` <button id="vylepsit${dum}-${jmeno}" style="background: lightblue">Vylepšit ${dum} na ${uroven + 1}. úroveň [-${ceny_domu[dum] / 2 * uroven} DHP]</button>`
                } else {
                    text += ` <button style="background: lightgoldenrodyellow">Dosažena 5. úroveň</button>`
                }
            }
        })

        p.innerHTML = text
        sloupec.appendChild(p)
        const prichod = document.getElementById(`prichod-${jmeno}`)
        prichod.addEventListener('click', (event) => {
            jmena.forEach(aktJmeno => {
                if (aktJmeno !== jmeno) {
                    Object.entries(majetky[aktJmeno]).forEach(([dum, uroven]) => {
                        pridatPenize(aktJmeno, ceny_domu[dum] / 10 * uroven);
                    })
                }
            })
        })
        const vybrat = document.getElementById(`vybrat-${jmeno}`)
        vybrat.addEventListener('click', (event) => {
            alert("Vydej hráči " + jmeno + " " + penize[jmeno] + " DHP")
            pridatPenize(jmeno, -penize[jmeno])
        })

        domy.forEach(dum => {
            if (!koupene_domy.includes(dum)) {
                const koupit = document.getElementById(`koupit${dum}-${jmeno}`)
                koupit.addEventListener('click', () => {
                    alert(jmeno + " platí " + ceny_domu[dum] + " DHP")
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
                        alert(jmeno + " platí " + ceny_domu[dum] / 2 * uroven + " DHP")
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