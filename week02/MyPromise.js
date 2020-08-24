MyPromise.prototype.then = function(onResolved, onRejected) {
    
    const vm = this
    // 指定回调函数默认值
    onResolved = typeof onResolved === 'function' ? onResolved : res => res
    onRejected = typeof onRejected === 'function' ? onRejected : res => { throw res }

    return new MyPromise((resolve, reject) => {

        function handle(callback) {
            try {
                const result = callback(self.data)
                if(result instanceof MyPromise) {
                    result.then(value => resolve(value), reason => reject(reason))
                } else {
                    resolve(result)
                }
            } catch (error) {
                reject(error)
            }
        }
        
        if(self.status === FULFILLED) {
            setTimeout(() => {
                handle(onResolved)
            })
        } else if(self.status === REJECTED) {
            setTimeout(() => {
                handle(onRejected)
            })
        } else {
            self.callback.push({
                onResolved(value) {
                    handle(onResolved)
                },
                onRejected(reason) {
                    handle(reason)
                }
            })
        }
    })
}
