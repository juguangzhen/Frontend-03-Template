function foundAB(string) {
    for(let i = 0, len = string.length; i < len; i++) {
        if(string[i] === 'a' && string[i+1] === 'b') {
            return true
        }
    }
    return false
}
console.log(foundAB('yuhjnhjahsavb'))
