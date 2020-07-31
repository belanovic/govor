const container = document.querySelector('.container');
const polje = document.querySelectorAll('.polje');
const ceoTekst = document.querySelector('.ceoTekst');
const klik = document.querySelector('.klik');
const selekcija = document.querySelector('.selekcija');
klik.addEventListener('click', kopiraj);
selekcija.addEventListener('click', uzmiSelTekst);

let reg = /background|color|height/i;

const govor = new webkitSpeechRecognition || new SpeechRecognition();
govor.lang = 'sr-RS-cyrl';
govor.interimResults = false;
govor.addEventListener('result', (e) => {
    let words = event.results[0][0].transcript;
    if(words == 'sve ponovo komanda'){
        document.activeElement.value = ''; 
        return;
    }
    let razmak = ' ';
    if('beli razmak' == words || 'znak uzvika' == words || 'znak uzvika' == words || 'crtica' == words || 'navodnik' == words || 'tačka' == words || 'zarez' == words || 'dve tačke' == words || 'novi red' == words) razmak = '';
    let komande = [
        [/ novi red|novi red/g, '\n\n'],
        [/ tačka|tačka/g, '. '],
        [/ zarez|zarez/g, ', '],
        [/ dve tačke|dve tačke|2 tačke| 2 tačke/g, ': '],
        [/ navodnik|navodnik/g, '"'],
        [/ crtica|crtica/g, '–'],
        [/ znak pitanja|znak pitanja/g, '?'],
        [/ znak uzvika|znak uzvika/g, '!'],
        [/ beli razmak|beli razmak/g, ' ']
    ];
    komande.forEach(prom => words = words.replace(prom[0], prom[1]));

    if(reg.test(words)){
        let currentCommand = words.match(reg)[0];
        const currentValue = words.replace(currentCommand, '').trim();

        container.style[currentCommand] = currentValue;
        return;
    }
    const elemFokus = document.activeElement;
    let cyrWords = konvertuj(words);
    let reciZaIspis = elemFokus.value + razmak + cyrWords;
    elemFokus.value = reciZaIspis.trimLeft()[0].toString().toUpperCase() + reciZaIspis.slice(1);
});
govor.start();
govor.addEventListener('end', govor.start);

function konvertuj(rec){
    const abeceda = ['a', 'b', 'c', 'č', 'ć', 'd', 'dž', 'đ', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'lj', 'm', 'n', 'nj', 'o', 'p', 'r', 's', 'š', 't', 'u', 'v', 'z', 'ž'];
    let azbuka = ['а', 'б', 'ц', 'ч', 'ћ', 'д', 'џ', 'ђ', 'е', 'ф', 'г', 'х', 'и', 'ј', 'к', 'л', 'љ', 'м', 'н', 'њ', 'о', 'п', 'р', 'с', 'ш', 'т', 'у', 'в', 'з', 'ж'];
    let novaRec = rec.replace(/nj|lj|dž|[a-zđčćžš]/gi, function(x){
        let index = abeceda.indexOf(x.toLowerCase());
        return x[0] == x.toString()[0].toUpperCase()? azbuka[index].toString().toUpperCase() : azbuka[index];
    });
    return novaRec;
}
function kopiraj(){
    ceoTekst.textContent = '';
    for(let i = 0; i < 3; i++){
        let noviRed = i == 0? '' : '\n\n';
        ceoTekst.textContent = ceoTekst.textContent + noviRed + polje[i].value;
        ceoTekst.select()
    }
}

function uzmiSelTekst(){
    const selektovaniTekst = window.getSelection();
    console.log(selektovaniTekst.toString());
}