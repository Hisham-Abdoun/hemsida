const produkter = [
    { id: 1, namn: 'T-shirt', pris: 100, bild: 'https://via.placeholder.com/150?text=T-shirt', färger: ['Röd','Blå','Svart'], kategori: 'Man' },
    { id: 2, namn: 'Byxor', pris: 150, bild: 'https://via.placeholder.com/150?text=Byxor', färger: ['Svart','Grå'], kategori: 'Man' },
    { id: 3, namn: 'Skor', pris: 250, bild: 'https://via.placeholder.com/150?text=Skor', färger: ['Vit','Svart'], kategori: 'Kvinna' },
    { id: 4, namn: 'Hatt', pris: 80, bild: 'https://via.placeholder.com/150?text=Hatt', färger: ['Blå','Grön'], kategori: 'Kvinna' },
    { id: 5, namn: 'Jacka', pris: 300, bild: 'https://via.placeholder.com/150?text=Jacka', färger: ['Svart','Röd'], kategori: 'Man' },
    { id: 6, namn: 'Strumpor', pris: 30, bild: 'https://via.placeholder.com/150?text=Strumpor', färger: ['Vit','Svart'], kategori: 'Barn' },
    { id: 7, namn: 'Väska', pris: 200, bild: 'https://via.placeholder.com/150?text=Väska', färger: ['Brun','Svart'], kategori: 'Kvinna' },
    { id: 8, namn: 'Bälte', pris: 90, bild: 'https://via.placeholder.com/150?text=Bälte', färger: ['Svart','Brun'], kategori: 'Man' },
    { id: 9, namn: 'Klocka', pris: 400, bild: 'https://via.placeholder.com/150?text=Klocka', färger: ['Silver','Svart'], kategori: 'Alla' },
    { id: 10, namn: 'Solglasögon', pris: 150, bild: 'https://via.placeholder.com/150?text=Solglasögon', färger: ['Svart','Brun'], kategori: 'Alla' },
    { id: 11, namn: 'Halsduk', pris: 120, bild: 'https://via.placeholder.com/150?text=Halsduk', färger: ['Röd','Blå','Grön'], kategori: 'Kvinna' },
    { id: 12, namn: 'Handskar', pris: 110, bild: 'https://via.placeholder.com/150?text=Handskar', färger: ['Svart','Brun'], kategori: 'Man' }
];

let varukorg = JSON.parse(localStorage.getItem('varukorg')) || [];
let valdKategori = 'Alla';

function visaProdukter() {
    const produkterDiv = document.getElementById('produkter');
    produkterDiv.innerHTML = '';
    const filtrerade = produkter.filter(p => valdKategori === 'Alla' || p.kategori === valdKategori);
    
    filtrerade.forEach(produkt => {
      console.log(produkt);
        const div = document.createElement('div');
        div.classList.add('produkt-kort');

        let färgerHTML = '<select id="color-' + produkt.id + '">';
        produkt.färger.forEach(färg => {
            färgerHTML += `<option value="${färg}">${färg}</option>`;
        });
        färgerHTML += '</select>';

        div.innerHTML = `
            <img src="${produkt.bild}" alt="${produkt.namn}">
            <h3>${produkt.namn}</h3>
            <p>Pris: ${produkt.pris} kr</p>
            ${färgerHTML}
            <button onclick="läggTillIVarukorg(${produkt.id})">Lägg till</button>
        `;
        produkterDiv.appendChild(div);
    });
}

function läggTillIVarukorg(produktId) {
    const produkt = produkter.find(p => p.id === produktId);
    const valdFärg = document.getElementById('color-' + produktId).value;

    const existerande = varukorg.find(item => item.id === produktId && item.färg === valdFärg);
    if (existerande) {
        existerande.antal += 1;
    } else {
        varukorg.push({...produkt, antal: 1, färg: valdFärg});
    }
    sparaVarukorg();
    visaVarukorg();
}

function sparaVarukorg() {
    localStorage.setItem('varukorg', JSON.stringify(varukorg));
}

function visaVarukorg() {
    const body = document.getElementById('varukorg-body');
    body.innerHTML = '';
    let total = 0;
    varukorg.forEach(item => {
        const summa = item.pris * item.antal;
        total += summa;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.namn} (${item.färg})</td>
            <td>${item.pris}</td>
            <td>
                <button onclick="ändraAntal(${item.id}, -1, '${item.färg}')">-</button>
                ${item.antal}
                <button onclick="ändraAntal(${item.id}, 1, '${item.färg}')">+</button>
            </td>
            <td>${summa}</td>
            <td><button onclick="taBortProdukt(${item.id}, '${item.färg}')">Ta bort</button></td>
        `;
        body.appendChild(tr);
    });
    document.getElementById('total').textContent = total;
}

function ändraAntal(produktId, delta, färg) {
    const item = varukorg.find(i => i.id === produktId && i.färg === färg);
    if (!item) return;
    item.antal += delta;
    if (item.antal <= 0) {
        taBortProdukt(produktId, färg);
    } else {
        sparaVarukorg();
        visaVarukorg();
    }
}

function taBortProdukt(produktId, färg) {
    varukorg = varukorg.filter(i => !(i.id === produktId && i.färg === färg));
    sparaVarukorg();
    visaVarukorg();
}

function rensaVarukorg() {
    varukorg = [];
    sparaVarukorg();
    visaVarukorg();
}

function filtreraKategori(kategori) {
    valdKategori = kategori;
    visaProdukter();
}

visaProdukter();
visaVarukorg();