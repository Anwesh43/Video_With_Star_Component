const w = window.innerWidth,h = window.innerHeight
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
          context.globalAlpha = 0.5
          context.fillStyle = 'red'
          context.fillRect(0,0,w,h)
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
              this.render()
          },(err)=>{
              alert(err)
          })
      }
}
customElements.define('video-with-stars-comp',VideoWithStarComponent)
