function match(str) {
    let state = start
    for(let s of str) {
        state = state(s)
    }
    return state === end
}

function start(s) {
    if(s === 'a') {
        return foundA
    } else {
        return start
    }
}

function end(s) {
    return end
}

function foundA(s) {
    if(s === 'b') {
        return foundB
    } else {
        return start(s)
    }
}

function foundB(s) {
    if(s === 'c') {
        return foundC
    } else {
        return start(s)
    }
}

function foundC(s) {
    if(s === 'd') {
        return foundD
    } else {
        return start(s)
    }
}

function foundD(s) {
    if(s === 'e') {
        return end
    } else {
        return start(s)
    }
}

console.log(match('sadjsabcklkabcde'))
