var waitTime = 5;
var randomWaitTime = 20;

window.addEventListener('load', async function () {
    console.log("loaded");
    let area = document.getElementsByClassName('projectSlide');
    let child = area[0].getElementsByClassName("text")[0];
    addStart(child);
})



//TODO: 
// Add functionality to add HTML elements to the written (and removed) text..
    //This could be done by when we get the start of the part, we check if it contains any < before the end, and then get the corresponding >
    // Then take that part from the rawHtml and add it back into the rawHtml
let spanEffectStart = "<span class=\"canSelect\">";
let spanEffectEnd = "<\\span>";

function instant(){
    waitTime = 0;
    randomWaitTime = 0; 
}

function speedUp(){
    waitTime = 0;
    randomWaitTime = 2;
}

function speedDown(){
    waitTime = 5;
    randomWaitTime = 20;
}

async function addStart(area){
    let pos = 0;
    let possibleText = area.textContent;
    let part = possibleText.indexOf('*')+1;
    let secondPart = possibleText.indexOf('*', part);
    const text = possibleText.substring(part,secondPart);
    pos =  addTypeWrite(text, area, pos+1);
}

async function change(area){
    let pos = 0
    let possibleText = area.textContent;
    let part = possibleText.indexOf('*')+1;
    let secondPart = possibleText.indexOf('*', part);
    const text = possibleText.substring(part,secondPart);
    pos =  addInstantly(text, area, pos);
    await sleep(500);
    pos = pos - 1;
    pos = await moveTypeWrite(0, area, pos);
    part = possibleText.indexOf('~')+1;
    secondPart = possibleText.indexOf('~', part);
    let searchWord = possibleText.substring(part, secondPart);
    console.log("search word is: " + searchWord);
    part = possibleText.indexOf(searchWord) + searchWord.length-1;
    console.log(part);
    await sleep(500);
    addSpan(part,searchWord,area);
    await sleep(500);
    pos = await moveTypeWrite(part, area, pos);
    pos = await deleteTypeWritePart(area, searchWord.length + 1, pos);
    part = possibleText.indexOf('^')+1;
    secondPart = possibleText.indexOf('^', part);
    let addWord = possibleText.substring(part, secondPart, pos);
    pos = await addTypeWritePart(area, addWord, pos);
    let innerSearchWord = '^' + addWord+'^';
    let innerPart = possibleText.indexOf(innerSearchWord) + innerSearchWord.length;
    console.log(innerPart);
    let res = possibleText.substring(innerPart);
    area.innerHTML = area.innerHTML + '<a id="hidden" aria-hidden="true">' + res + '</a>';
    console.log(area.innerHTML);
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max)*5;
}


function addSelect(letter){
    return `<span class='canSelect'>` + letter + `</span>`;
}

function addSpan(part, searchWord,area){
    let raw = area.textContent
    let possiblePart = raw.indexOf(searchWord);
    area.innerHTML = [raw.slice(0,possiblePart),addSelect(searchWord),raw.slice(possiblePart + searchWord.length)].join('');
}

async function addTypeWrite(text, area, pos){
    for(let i = 0; i <= text.length; i++){
        area.innerHTML = text.substring(0,i+1);
        insertTypeEffect(pos, area);
        pos = pos + 1;
        await sleep(waitTime+getRandomInt(randomWaitTime));
    }
    return pos;
}

function addInstantly(text, area, pos){
    for(let i = 0; i <= text.length; i++){
        area.innerHTML = text.substring(0,i+1);
        pos = pos + 1;
    }
    return pos;
}

async function deleteTypeWrite(text, area, pos){
    for(let i = text.length-1; i >= -1; i--){
        area.innerHTML = text.substring(0,i+1);
        insertTypeEffect(pos, area);
        pos = pos - 1;
        await sleep(25+getRandomInt(5));
    }
    return pos;
}

async function deleteTypeWritePart(area, length, pos){
    pos = pos - 1;
    while(length >= 0){
        const text = area.innerHTML;
        area.innerHTML = text.slice(0,pos) + text.slice(pos+1); 
        insertTypeEffect(pos, area);
        await sleep(150+getRandomInt(5));
        pos = pos - 1;
        length = length - 1;
    }
    return pos;
}

async function addTypeWritePart(area, text, pos){
    let ogPos = pos;
    let oldText = area.textContent;
    //area.innerHTML = oldText.slice(0,ogPos+1) + " " + oldText.slice(ogPos+1);
    for(let i = ogPos; i <= ogPos + text.length; i++){
        pos = pos + 1;
        area.innerHTML = oldText.slice(0,ogPos+1) + text.substring(0, i-ogPos) + oldText.slice(ogPos+1);
        insertTypeEffect(pos, area);
        await sleep(35+getRandomInt(25));
    }
    return pos;
}

async function moveTypeWrite(wantedPos, area, pos){
    while(wantedPos != pos){
        if(wantedPos > pos){
            pos = pos + 1;
        }else{
            pos = pos - 1;
        }
        insertTypeEffect(pos, area);
        await sleep(25+getRandomInt(5));
    }
    return pos;
}

function sleep(ms){
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 
function main(){
    let typeWriterArea = document.getElementById('text1');
    console.log(typeWriterArea.innerHTML);
    typeWriterArea.innerHTML = typeWriterArea.textContent.substring(0,4) + typeEffect + typeWriterArea.textContent.substring(4);
    typeWriterArea = document.getElementById('text1');
    console.log(typeWriterArea.innerHTML);
}
*/

function addTypeEffect(letter){
    return `<span class='typewrite'>` + letter + `</span>`;
}

function insertTypeEffect(pos,area){
    let text = area.textContent;
    let newHtml = "";
    if (pos < text.length-1){
        newHtml = [text.slice(0,pos),addTypeEffect(text[pos]),text.slice(pos+1)].join('');
    }else if (pos == text.length-1){
        newHtml = [text.slice(0,pos),addTypeEffect(text[pos])].join('');
    }else{
        newHtml = [text.slice(0,pos),addTypeEffect(`&nbsp`)].join('');
    }
    area.innerHTML = newHtml;
}


