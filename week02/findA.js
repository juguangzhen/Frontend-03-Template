function foundA(string) {
    for(let str of string) {
        if(str === 'a') {
            return true
        }
    }
    return false
}

console.log(foundA('fdfadas'))
