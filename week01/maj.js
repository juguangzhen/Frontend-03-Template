/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
    let map = {}
    let len = nums.length
    for(let i = 0; i < len; i++) {
        if(map.hasOwnProperty(nums[i])) {
            map[nums[i]] += 1   
        } else {
            map[nums[i]] = 1
        }
        if(map[nums[i]] >= (len/2)) {
            return nums[i]
        }
    }
};
console.log(majorityElement([1]))
