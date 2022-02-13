const SALARY = document.querySelector('#salary')
const TAB = document.querySelector('#tab')
const SAVING = document.querySelector('#saving')
const PLEASURE = document.querySelector('#pleasure')
const TOTAL = document.querySelector('#total')
const TBODY = document.querySelector('#tab tbody')
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
        ret +=  '           <td contenteditable="True" role="editable">' + line.label + '</td>'
        ret +=  '           <td contenteditable="True" role="amountEditable">' + line.amount.toFixed(2) + '&nbsp;&nbsp;€</td>'
        ret +=  '           <td><div class="btn remove" role="remove" ><i style="color: white" class="fas fa-times" role="remove" ></i></d></td>'
        ret +=  '       </tr>'
    }
    ret +=  '       <tr>'
    ret +=  '           <td contenteditable="True" id="newLabel" ></td>'
    ret +=  '           <td contenteditable="True" id="newAmount" ></td>'
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

TAB.addEventListener('click', (e) => {
    if(e.target && e.target.getAttribute('role') === "remove") {
        let uid = ''
        if(e.target.nodeName == 'I') {          uid = e.target.parentNode.parentNode.parentNode.getAttribute('uid') }
        else if(e.target.nodeName == 'DIV' ) {  uid = e.target.parentNode.parentNode.getAttribute('uid') }

        lines = lines.filter(el => el.uid != uid)
        TBODY.innerHTML = getDisplay(lines)
        updateCalc()
    }
})
TAB.addEventListener('focusout', (e) => {
    if(e.target && (e.target.nodeName == 'TD' && e.target.getAttribute('role') === "amountEditable")) {
        let newAmount = parseFloat(e.target.innerHTML.trim().replace('&nbsp;', '').replace('€', ''))
        let line = lines.find(el => el.uid === e.target.parentNode.getAttribute('uid'))
        line.amount = newAmount
        e.target.innerHTML = line.amount.toFixed(2) + '&nbsp;&nbsp;€'
        updateCalc()
    }
})
SALARY.addEventListener('change', () => {
    updateCalc()
})


let exLine = [
    new Line("Loyer", -640),
    new Line("APL", 106),
    new Line("Electricté", -47),
    new Line("Course", -70)
]


let lines = []
for(const line of exLine){
    line.amount = line.amount
    lines.push(line)
}

TBODY.innerHTML = getDisplay(lines)
updateCalc()

