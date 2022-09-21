const schemeModes = ["Analogic","Monochrome", "Monochrome-dark", "Monochrome-light", "Analogic-complement", "Complement", "Triad", "Quad"]

const baseURL = "https://www.thecolorapi.com"
const endpoint = "/scheme"
let seedColor = "#29A4A4"
let mode = schemeModes[0]
const modePicker = document.getElementById("select-mode")
const seedPicker = document.getElementById("input-seedColor")
const formGetScheme = document.getElementById("form-getScheme")
let schemeColors = null

// listen for Get Color Scheme button click
formGetScheme.addEventListener("submit",(event)=>{
    event.preventDefault()
    seedColor = seedPicker.value
    mode = modePicker.value
    console.log(`Color: ${seedColor} and mode ${mode}`)
    getScheme()
})

populateModeList()

function populateModeList(){
    schemeModes.forEach(choice=>{
          let option = document.createElement('option');
          option.value = choice;  
          option.text = choice; 
          modePicker.appendChild(option);
    })
}

// Call the Color API to get a set of colors back
//based on the seed color we send
function getScheme(){
    // seedColor will be in the form of #123456
    // the API needs us to strip the # off of the hex value
    const url = `${baseURL}${endpoint}?hex=${seedColor.substring(1)}&mode=${mode.toLowerCase()}`
    fetch(url)
        .then( response => response.json())
        .then( data => {
            //extract just the hex color value for each color
            //and put those into a new array
            schemeColors = data.colors.map( color => { return color.hex.value})
            
            renderColors()
      })
}

// using array of just hex#'s generate the color boxes HTML
function renderColors(){
    const container = document.getElementById("scheme-container")
    //wipe the existing HTML in this container
    container.innerHTML = ""
    // console.log(scheme)
    schemeColors.forEach((colorItem)=>{
        //if one of the returned colros matches the seed color
        //bold it's name (it rarely has an exact match)
        let colorName = seedColor === colorItem ? 
            `<b>${colorItem}</b>`: colorItem 
        const boxHTML = `
            <div class="color-container" onclick="copyHex('${colorItem}')" >
                <div class="colorBox" style="background-color:${colorItem}">
                </div>
                <div class="colorTitle">
                    <p>${colorName}</p>
                </div>
            </div>`
        container.innerHTML += boxHTML
    })
}

//Copy to clipboard and notify user we have done so
function copyHex(msg){
    navigator.clipboard.writeText(`${msg}`)
    alert(`Hex color value ${msg} copied to clipboard`)
}