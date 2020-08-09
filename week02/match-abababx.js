function match(string) {
    let state = start
    for (const str of string) {
        state = state(str)
    }
    return state === end
}

function start(str) {
    if(str === 'a') {
        return foundA
    } else {
        return start
    }
}

function end(str) {
    return end
}

function foundA(str) {
    if(str === 'b') {
        return foundB
    } else {
        return start(str)
    }
}

function foundB(str) {
    if(str === 'a') {
        return foundA2
    } else {
        return start(str)
    }
}


function foundA2(str) {
    if(str === 'b') {
        return foundB2
    } else {
        return start(str)
    }
}

function foundB2(str) {
    if(str === 'a') {
        return foundA3
    } else {
        return start(str)
    }
}

function foundA3(str) {
    if(str === 'b') {
        return foundB3
    } else {
        return start(str)
    }
}

function foundB3(str) {
    if(str === 'x') {
        return end
    } else {
        return foundB2(str)
    }
}

console.log(match('abababyabababx'))
