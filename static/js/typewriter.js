window.addEventListener('load', async function () {
    console.log("loaded");
    let area = document.getElementById('text1');
    change(area);
    area = document.getElementById('text2');
    change(area);
})

async function change(area){
    let pos = 0
    let possibleText = area.textContent;
    let part = possibleText.indexOf('*')+1;
    let secondPart = possibleText.indexOf('*', part);
    const text = possibleText.substring(part,secondPart);
    pos = await addTypeWrite(text, area, pos);
    await sleep(500);
    pos = pos - 1;
    pos = await moveTypeWrite(0, area, pos);
    part = possibleText.indexOf('~')+1;
    secondPart = possibleText.indexOf('~', part);
    let searchWord = possibleText.substring(part, secondPart);
    part = possibleText.indexOf(searchWord) + Math.ceil(searchWord.length/2);
    pos = await moveTypeWrite(part, area, pos);
    pos = await deleteTypeWritePart(area, Math.ceil(searchWord.length), pos);
    part = possibleText.indexOf('^')+1;
    secondPart = possibleText.indexOf('^', part);
    let addWord = possibleText.substring(part, secondPart, pos);
    pos = await addTypeWritePart(area, addWord, pos);
    console.log(area.innerHTML);
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max)*5;
}

async function addTypeWrite(text, area, pos){
    for(let i = 0; i <= text.length; i++){
        area.innerHTML = text.substring(0,i+1);
        insertTypeEffect(pos, area);
        pos = pos + 1;
        await sleep(50+getRandomInt(25));
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


