
// Takes in a string and returns the same string as a valid file-name.
// It replaces all invalid characters with an underscore
function makeValidFilename(baseName: string) : string{
    return (baseName as any).replaceAll(/[^\w ()-_.$!\d]/gi, "_");
}

function promptDownload(raw: string, type: string, filename: string){
    // Creates the file
    var file = new Blob([raw], { endings: "native", type });

    // Creates an element to download the element
    var a = document.createElement("a");
    var url = a.href = URL.createObjectURL(file);

    // Sets the filename
    a.download = makeValidFilename(filename)

    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

export default {
    makeValidFilename,
    promptDownload
}