const SALARY = document.querySelector('#salary')
const TAB = document.querySelector('#tab')
const SAVING = document.querySelector('#saving')
const PLEASURE = document.querySelector('#pleasure')
const TOTAL = document.querySelector('#total')
const TBODY = document.querySelector('#tab tbody')
const SAVE = document.querySelector('#save')
const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

class Line {
    /**
     * 
     * @param {string} label 
     * @param {number} amount 
     */
    constructor(label, amount) {
        this.uid = uuid()
        this.label = label
        this.amount = amount
    }
}        

/**
 * 
 * @param {[Line]} lines 
 * @returns A HTML string who represent a table
 */
const getDisplay = (lines) => {
    let ret = ""
    for(const line of lines) {
        ret +=  '       <tr uid="' + line.uid + '">'
        ret +=  '           <td contenteditable="True" role="labelEditable">' + line.label + '</td>'
        ret +=  '           <td contenteditable="True" role="amountEditable">' + line.amount.toFixed(2) + '&nbsp;&nbsp;€</td>'
        ret +=  '           <td><div class="btn remove" role="remove" ><i style="color: white" class="fas fa-times" role="remove" ></i></d></td>'
        ret +=  '       </tr>'
    }
    ret +=  '       <tr>'
    ret +=  '           <td contenteditable="True" id="newLabel" ></td>'
    ret +=  '           <td contenteditable="True" id="newAmount" role="add" ></td>'
    ret +=  '           <td><div class="btn add" role="add" ><i style="color: white" class="fas fa-plus" role="add" ></i></div></td>'
    ret +=  '       </tr>'

    return ret
}

const updateCalc = () => {
    let total = parseFloat(SALARY.value)
    let saving = 0
    let pleasure = 0
    for(const line of lines) {
        total += line.amount
    }
    saving = 0.25 * total
    pleasure = total - saving

    TOTAL.innerHTML = total.toFixed(2) + '&nbsp;&nbsp;€'
    SAVING.innerHTML = saving.toFixed(2) + ' €'
    PLEASURE.innerHTML = pleasure.toFixed(2) + ' €'
}

const dowload = () => {
    let data = JSON.stringify({
        salary: SALARY.value,
        saving: 0.25,
        lines: lines
    })
    let blob = new Blob([data], { type: 'text/plain' })
    if(file !== null) { window.URL.revokeObjectURL(file) }
    file = window.URL.createObjectURL(blob)

    return file
}

TAB.addEventListener('click', (e) => {
    if(e.target){
        switch(e.target.getAttribute('role')) {
            case "remove":
                let uid = ''
                if(e.target.nodeName == 'I') {          uid = e.target.parentNode.parentNode.parentNode.getAttribute('uid') }
                else if(e.target.nodeName == 'DIV' ) {  uid = e.target.parentNode.parentNode.getAttribute('uid') }
        
                lines = lines.filter(el => el.uid != uid)
                TBODY.innerHTML = getDisplay(lines)
                updateCalc()
                break;
            case "add":
                let newLabel = document.querySelector('#newLabel').innerHTML.replace('<br>', '')
                let newAmount = document.querySelector('#newAmount').innerHTML.replace('<br>', '') != '' ? parseFloat(document.querySelector('#newAmount').innerHTML.replace('<br>', '')) : 0
                lines.push(new Line(newLabel, newAmount))
                TBODY.innerHTML = getDisplay(lines)
                updateCalc()
                break;
        }
    }
})
TAB.addEventListener('focusout', (e) => {
    if(e.target){
        let line = null
        if(e.target.nodeName = "TD") { line = lines.find(el => el.uid === e.target.parentNode.getAttribute('uid')) }
        switch(e.target.getAttribute('role')) {
            case "amountEditable":
                let newAmount = parseFloat(e.target.innerHTML.replace('<br>', '').trim().replace('&nbsp;', '').replace('€', ''))
                line.amount = newAmount
                e.target.innerHTML = line.amount.toFixed(2) + '&nbsp;&nbsp;€'
                updateCalc()
                break;
            case "labelEditable":
                let newLabel = e.target.innerHTML.replace('<br>', '').trim()
                line.label = newLabel
                e.target.innerHTML = newLabel
                break;
            case "add":
                let newLineLabel = document.querySelector('#newLabel').innerHTML.replace('<br>', '')
                let newLineAmount = document.querySelector('#newAmount').innerHTML.replace('<br>', '') != '' ? parseFloat(document.querySelector('#newAmount').innerHTML.replace('<br>', '')) : 0
                lines.push(new Line(newLineLabel, newLineAmount))
                TBODY.innerHTML = getDisplay(lines)
                updateCalc()
                break;
        }
    }
})
TAB.addEventListener('focus', (e) => {
    if(e.target) {
        switch (e.target.getAttribute('role')) {
            case "amountEditable":
                let line = lines.find(el => el.uid === e.target.parentNode.getAttribute('uid'))
                e.target.innerHTML = line.amount
                break;
            default:
                break;
        }
    }
}, true)

SALARY.addEventListener('change', () => {
    updateCalc()
})

SAVE.addEventListener('click', () => {
    let link = document.createElement('a')
    document.body.appendChild(link)
    link.download = "compta.cpt"
    link.href = dowload()

    window.requestAnimationFrame(() => {
        let event = new MouseEvent('click')
        link.dispatchEvent(event)
        document.body.removeChild(link)
    })
}, false)


let exLine = [
    new Line("Loyer", -640),
    new Line("APL", 106),
    new Line("Electricté", -47),
    new Line("Course", -70)
]

let file = null
let lines = []
for(const line of exLine){
    line.amount = line.amount
    lines.push(line)
}

TBODY.innerHTML = getDisplay(lines)
updateCalc()


/*

{
    salary: number,
    saving: number
    lines: [
        {
            label: string,
            amount: number
        }
    ]
}

*/