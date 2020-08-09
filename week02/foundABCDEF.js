function foundStr(string) {
    let target = 'abbax'
    if(string.length < target.length) {
        return false
    } else if (string.length === target.length) {
        return string === target
    } else {
        // 正式逻辑
        let end = string.length - target.length
        let len = target.length
        for(let start = 0; start <= end; start++) {
            if(string.slice(start, start + len) === target) {
                return true
            }
        }
        return false
    }
}
console.log(foundStr('aabbaabbaaabbax')) // true
console.log(foundStr('aabbaabbaaabbabx')) // false

