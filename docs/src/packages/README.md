# 用于存放一些存在问题的npm包
> 由于 vite 的开发和打包是不同的机制，所以会存在一些npm包，在dev模式下正常，但是在build时存在问题。所以，我们将这些包的源码存放在这里，直接引用，这样就相当于自己写的代码，会走dev模式的逻辑而不是build模式的逻辑。
## 1. flowmap.gl
1. "@flowmap.gl/data": "^8.0.2"
2. "@flowmap.gl/layers": "^8.0.2"