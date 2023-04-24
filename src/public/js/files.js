let fileHandle;


async function button() {
    let [fileHandle] = await window.showOpenFilePicker();
    let fileData = await fileHandle.getFile();
    let text = await fileData.text();
    textarea.innerText = text;
}

async function save(){
    let stream = await fileHandle.createWritable();
    await stream.write(textarea.innerText);
    await stream.close();
}

async function saveAs(){
    fileHandle = await window.showSaveFilePicker();
    save();

}

