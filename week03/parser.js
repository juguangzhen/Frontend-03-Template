const css = require('css')

const EOF = Symbol('EOF')

let currentToken = null
let currentTexNode = null
let currentAttribute = null

let stack = [{type: 'document', children: []}]

// 处理CSS
let rules = []
function addCSSRules(text) {
    let ast = css.parse(text)
    rules.push(...ast.stylesheet.rules)
}
// 选择器匹配规则
function match(element, selector) {
    if(!selector || !element.attributes) {
        return false
    }
    if(selector.charAt(0) === '#') {
        let attr = element.attributes.filter(attr => attr.name === 'id')[0]
        if(attr && attr.value === selector.replace('#', '')) {
            return true
        }
    } else if(selector.charAt(0) === '.') {
        let attr = element.attributes.filter(attr => attr.name === 'class')[0]
        if(attr && attr.value === selector.replace('.', '')) {
            return true
        }
    } else {
        if(element.tagName === selector) {
            return true
        }
    }
    return false
}

function computeCSS(element) {
    let elements= stack.slice().reverse()
    if(!element.computedStyle) {
        element.computedStyle = {}
    }
    for(let rule of rules) {
        let selectorParts = rule.selectors[0].split(' ').reverse()

        if(!match(element, selectorParts[0])) {
            continue
        }

        let matched = false
        let j = 1
        for(let i = 0; i < elements.length; i++) {
            if(match(elements[i], selectorParts[j])) {
                j++
            }
        }
        if(j >= selectorParts.length) {
            matched = true
        }
        if(matched) { // 如果匹配到
            console.log('Element', element, 'matched rule', rule)
        }
    }
}

function emit(token) {

    let top = stack[stack.length - 1]

    if(token.type === 'startTag') {
        let element = {
            type: 'element',
            children: [],
            attributes: []
        }
        element.tagName = token.tagName
        for(let p in token) {
            if(p !== 'type' || p !== 'tagName') {
                element.attributes.push({
                    name: p,
                    value: token[p]
                })
            }
        }
        // 创建元素后立即计算css
        computeCSS(element)

        top.children.push(element)
        element.parent = top
        if(!token.isSelfClosing) {
            stack.push(element)
        }
        currentTexNode = null

    } else if(token.type === 'endTag') {
        if(top.tagName !== token.tagName) {
            throw new Error("Tag start en doesn't match!")
        } else {
            // 处理css规则
            if(top.tagName === 'style') {
                addCSSRules(top.children[0].content)
            }
            stack.pop()
        }
        currentTexNode = null
    } else if(token.type === 'text') {
        if(currentTexNode === null) {
            currentTexNode = {
                type: 'text',
                content: ''
            }
            top.children.push(currentTexNode)
        }
        currentTexNode.content += token.content
    }
}

function data(c) {
    if(c === '<') {
        return tagOpen
    } else if(c === EOF) {
        emit({
            type: 'EOF'
        })
        return
    } else {
        emit({
            type: 'text',
            content: c
        })
        return data
    }
}

function tagOpen(c) {
    if(c === '/') {
        return endTagOpen
    } else if(c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'startTag',
            tagName: ''
        }
        return tagName(c)
    } else {
        return
    }
}

function endTagOpen(c) {
    if(c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        }
        return tagName(c)
    } else if(c === '>'){
        // return
    } else if(c === EOF) {

    } else {

    }
}

function tagName(c) {
    if(c.match(/^[\t\n\f ]$/)) { // 空格 换行
        return beforeAttributeName
    } else if(c === '/') { // 自关闭标签
        return selfClosingStartTag
    } else if(c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c // toLowerCase()
        return tagName
    } else if(c === '>') {
        emit(currentToken)
        return data
    } else {
        return tagName
    }
}

function beforeAttributeName(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if(c === '/' || c === '>' || c === EOF) {
        return afterAttributeName(c)
    } else if(c === '=') {
        
    } else {
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c)
    }
}

function attributeName(c) {
    if(c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
        return afterAttributeName(c)
    } else if(c === '=') {
        return beforAttributeValue
    } else if(c === '\u0000') {

    } else if(c === '\"' || c === "'" || c === '<') {

    } else {
        currentAttribute.name += c
        return attributeName
    }
}

function beforAttributeValue(c) {
    if(c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
        return beforAttributeValue
    } else if(c === '\"') {
        return doubleQuoteAttributeValue
    } else if(c === "\'") {
        return singleQuoteAttributeValue
    } else if(c === '>') {

    } else {
        return UnquoteAttributeValue(c)
    }
}

function doubleQuoteAttributeValue(c) {
    if(c === '\"') {
        currentToken[currentAttribute.name] = currentAttribute.value
        return afterQuotedAttributeValue
    } else if(c === '\u0000') {

    } else if(c === EOF) {

    } else {
        currentAttribute.value += c
        return doubleQuoteAttributeValue
    }
}

function singleQuoteAttributeValue(c) {
    if(c === "\'") {
        currentToken[currentAttribute.name] = currentAttribute.value
        return afterQuotedAttributeValue
    } else if(c === '\u0000'){

    } else if(c === EOF) {

    } else {
        currentAttribute.value += c
        return singleQuoteAttributeValue // singleQuoteAttributeValue
    }
}

function afterQuotedAttributeValue(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if(c === '/') {
        return selfClosingStartTag
    } else if(c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if(c === EOF) {

    } else {
        currentAttribute.value += c
        return doubleQuoteAttributeValue
    }
}

function UnquoteAttributeValue(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value
        return beforeAttributeName
    } else if(c === '/'){
        currentToken[currentAttribute.name] = currentAttribute.value
    } else if(c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if(c === '\u0000') {

    } else if(c === '\"' || c === "'" || c === '<' || c === '=' || c === '`') {

    } else if(c === EOF) {

    } else {
        currentAttribute.value += c
        return UnquoteAttributeValue
    }
}

function afterAttributeName(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName
    } else if(c === '/') {
        return selfClosingStartTag
    } else if(c === '=') {
        return beforAttributeValue
    } else if(c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if(c === EOF) {

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c)
    }
}

function selfClosingStartTag(c) {
    if(c === '>') {
        currentToken.isSelfClosing = true
        return data
    } else if(c === 'EOF') {

    } else {

    }
}

module.exports.parseHTML = function oarseHTML(html) {
    let state = data
    for(let c of html) {
        state = state(c)
    }
    state = state(EOF)
    return stack[0]
}
