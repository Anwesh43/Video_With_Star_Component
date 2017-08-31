const w = window.innerWidth,h = window.innerHeight
const star_size = Math.max(w,h)/15
const getPointInCircle = (r,deg) => {
    return {x:r*Math.cos(deg*Math.PI/180),y:r*Math.sin(deg*Math.PI/180)}
}
class VideoWithStarComponent extends HTMLElement {
      constructor() {
          super()
          this.starContainer = new StarContainer()
          const shadow = this.attachShadow({mode:'open'})
          this.img = document.createElement('img')
          this.video = document.createElement('video')
          this.setSomeVideoParams()
          this.adjustPosition()
          shadow.appendChild(this.video)
          shadow.appendChild(this.img)
      }
      setSomeVideoParams() {
        this.video.autoplay = true
        this.video.width = w
        this.video.height = h
      }
      adjustPosition() {
          this.video.style.position = 'absolute'
          this.video.style.top = 0
          this.video.style.left = 0
          this.img.style.position = 'absolute'
          this.img.style.top = 0
          this.img.style.left = 0
      }
      render() {
          const canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          const context = canvas.getContext('2d')
          context.globalAlpha = 1
          context.save()
          context.globalAlpha = 0
          context.fillRect(0,0,w,h)
          context.restore()
          this.starContainer.draw(context)
          this.starContainer.createStars()
          this.starContainer.update()
          this.img.src = canvas.toDataURL()
      }
      connectedCallback() {
          this.createVideo()
          this.img.onmousedown = (event) => {
              const x = event.offsetX,y = event.offsetY
              this.starContainer.handleTap(x,y)
          }
      }
      createVideo() {
          window.navigator.getUserMedia = window.navigator.getUserMedia || window.navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia || window.navigator.oGetUserMedia
          window.navigator.getUserMedia({audio:false,video:{width:w,height:h}},(stream)=>{
              this.video.src = window.URL.createObjectURL(stream)
              this.renderVideoContinuously()
          },(err)=>{
              alert(err)
          })
      }
      renderVideoContinuously() {
          this.render()
          window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame
          window.requestAnimationFrame(this.renderVideoContinuously.bind(this))
      }
}

class Star {
    constructor(x,y,size) {
        this.x = x
        this.y = y
        this.size = size
        this.rot = 0
    }
    draw(context) {
        const size = this.size
        context.save()
        context.globalAlpha = 0.5
        context.translate(this.x,this.y)
        context.rotate(this.rot)
        var deg = -90
        const n = 5
        var r = size/2,r1 = r/3,gapDeg = 360/n
        deg = deg - gapDeg/2
        context.beginPath()
        for(var i=0;i<n;i++) {
            var point1 = getPointInCircle(r1,deg),point2 = getPointInCircle(r,deg+gapDeg/2),point3 = getPointInCircle(r1,deg+gapDeg)
            if(i == 0) {
                context.moveTo(point1.x,point1.y)
            }
            else {
                context.lineTo(point1.x,point1.y)
            }
            context.lineTo(point2.x,point2.y)
            context.lineTo(point3.x,point3.y)
            deg += gapDeg
        }
        context.fill()
        context.restore()
    }
    update() {
        const speed = 25
        this.y += h/speed
        this.rot += 360/speed
    }
    handleTap(x,y) {
        return x>=this.x -this.size && x<=this.x+this.size && y>=this.y -this.size && y<=this.y+this.size
    }
}
class StarContainer {
    constructor() {
        this.stars = []
        this.render = 0
    }
    createStars() {
        if(this.render % 5 == 0) {
            const x_min = star_size
            const x_max = w - star_size
            const x_random = x_min+Math.random()*(x_max-x_min)
            const star = new Star(x_random,0,star_size)
            this.stars.push(star)
        }
        this.render ++
    }
    draw(context) {
        context.fillStyle = '#f44336'
        this.stars.forEach((star)=>{
            star.draw(context)
        })
    }
    update() {
        this.stars.forEach((star,index)=>{
            star.update()
            if(star.y > h) {
                this.stars.splice(index,1)
            }
        })
    }
    handleTap(x,y) {
        console.log(x)
        console.log(y)
        this.stars.forEach((star,index)=>{
            if(star.handleTap(x,y)) {
                console.log("remove")
                this.stars.splice(index,1)
            }
        })
    }
}
customElements.define('video-with-stars-comp',VideoWithStarComponent)
