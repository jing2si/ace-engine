**无限整数四则运算**


---


# 概述 #

无限整数指：不限定长度和进制的整数。

# 方法 #

## add ##
_无限整数的加法_
```
/**
 * 无限进制的加法
 * @param {String} a 整数1
 * @param {String} b 整数2
 * @param {Number} scale 进制 2-64
 * @return {String} 返回两个数的和
 */
function add(a, b, scale)
```

## mul ##
_无限整数乘法_
```
/**
 * 无限整数乘法
 * @param {String} a 整数1
 * @param {String} b 整数2
 * @param {Number} scale 进制 2-64
 * @return {String} 返回两个数的乘积
 */
function mul(a, b, scale)
```

## power ##
_无限整数的次方_
```
/**
 * 无限整数的次方
 * @param {String} base 指数
 * @param {String} exponent 幂数
 * @param {Number} scale 进制 2-64
 * @return {String} 返回base的exponent次方
 */
function power(base, exponent, scale)
```

## digit ##
_无限整数进制间的转换_
```
/**
 * 无限整数进制间的转换
 * @param {String} n 整数
 * @param {Number} from 来源进制 2-64
 * @param {Number} to 目标进制 2-64
 * @return {String} 返回转换后的数字
 */
function digit(n, from, to)
```


## sub ##
_无限整数减法_
```
/**
 * 无限整数减法
 * @param {String} a 减数
 * @param {String} b 被减数
 * @param {Number} scale 进制 2-64
 * @return {String} 返回转换后的数字
 */
function sub(a, b, scale)
```

## div ##
_无限整数除法_
```
/**
 * 无限进制除法
 * @param {String} a 除数
 * @param {String} b 被除数
 * @param {Number} scale 进制 2-64
 * @return {Array} 返回[商数,余数]
 */
function div(a, b, scale)
```

## div2 ##
_无限整数除法(支持小数)_
```
/**
 * 无限进制除法，如果是循环小数，则在循环部分加上括号
 * @param {String} a 除数
 * @param {String} b 被除数
 * @param {Number} scale 进制 2-64
 * @return {Array} 返回[商数,余数]
 */
function div2(a, b, scale)
```