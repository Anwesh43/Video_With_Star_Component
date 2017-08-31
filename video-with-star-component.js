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
          context.fillStyle = 'red'
          context.fillRect(0,0,w,h)
          this.img.src = canvas.toDataURL()
      }
      connectedCallback() {
          this.render()
      }
}
customElements.define('video-with-stars-comp',VideoWithStarComponent)
