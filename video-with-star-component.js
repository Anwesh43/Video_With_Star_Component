const w = window.innerWidth,h = window.innerHeight
const star_size = Math.max(w,h)/30)
const getPointInCircle = (r,deg) => {
    return {x:r*Math.cos(deg*Math.PI/180),y:r*Math.sin(deg*Math.PI/180)}
}
class VideoWithStarComponent extends HTMLElement {
      constructor() {
          super()
          const shadow = this.attachShadow({mode:'open'})
          this.img = document.createElement('img')
          shadow.appendChild(this.img)
      }
      render() {
          const canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          const context = canvas.getContext('2d')
          context.globalAlpha = 1
          context.drawImage(this.video,0,0,w,h)
          this.img.src = canvas.toDataURL()
      }
      connectedCallback() {
          this.createVideo()
      }
      createVideo() {
          this.video = document.createElement('video')
          this.video.autoplay = true
          this.video.width = w
          this.video.height = h
          window.navigator.getUserMedia = window.navigator.getUserMedia || window.navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia || window.navigator.oGetUserMedia
          window.navigator.getUserMedia({audio:false,video:true},(stream)=>{
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
customElements.define('video-with-stars-comp',VideoWithStarComponent)
class Star {
    constructor(x,y,size) {
        this.x = x
        this.y = y
        this.size = size
        this.rot = 0
    }
    draw(context) {
        context.save()
        context.globalAlpha = 0.6
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
        const speed = 20
        this.y += this.h/speed
        this.rot += 360/speed
    }
    handleTap(x,y) {
        return x>=this.x -this.size/2 && x<=this.x+this.size/2 && y>=this.y -this.size/2 && y<=this.y+this.size/2
    }
}
class StarContainer {
    constructor() {
        this.stars = []
        this.render = 0
    }
    createStars() {
        if(this.render % 15 == 0) {
            const x_min = star_size
            const x_max = w - star_size
            const x_random = x_min+Math.random()*(x_max-x_min)
            const star = new Star(0,0,star_size)
            this.stars.push(star)
        }
        this.render ++
    }
    draw(context) {
        context.fillStyle = '#ffc107'
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
        this.stars.handleTap((star,index)=>{
            if(star.handleTap(x,y)) {
                this.stars.splice(index,1)
            }
        })
    }
}
