const ids = {
  BLANK: "BLANK",
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT"
}

const tiles = {
  BLANK: {
    image: "1.png",
    conditions: {
      up: [ids.DOWN, ids.BLANK],
      right: [ids.LEFT, ids.BLANK],
      down: [ids.UP, ids.BLANK],
      left: [ids.RIGHT, ids.BLANK],
    }
  },
  UP: {
    image: "2.png",
    conditions: {
      up: [ids.BLANK, ids.DOWN],
      right: [ids.UP, ids.RIGHT, ids.DOWN],
      down: [ids.RIGHT, ids.DOWN, ids.LEFT],
      left: [ids.UP, ids.LEFT, ids.DOWN],
    }
  },
  RIGHT: {
    image: "5.png",
    conditions: {
      up: [ids.LEFT, ids.UP, ids.RIGHT],
      right: [ids.BLANK, ids.LEFT],
      down: [ids.RIGHT, ids.DOWN, ids.LEFT],
      left: [ids.UP, ids.LEFT, ids.DOWN],
    }
  },
  DOWN: {
    image: "3.png",
    conditions: {
      up: [ids.LEFT, ids.UP, ids.RIGHT],
      right: [ids.RIGHT, ids.DOWN, ids.UP],
      down: [ids.BLANK, ids.UP],
      left: [ids.UP, ids.LEFT, ids.DOWN],
    }
  },
  LEFT: {
    image: "4.png",
    conditions: {
      up: [ids.LEFT, ids.UP, ids.RIGHT],
      right: [ids.UP, ids.RIGHT, ids.DOWN],
      down: [ids.RIGHT, ids.DOWN, ids.LEFT],
      left: [ids.BLANK, ids.RIGHT],
    }
  },
}

const width = 3 * 1

class Canvas{
  constructor(){
    this._init().then(()=>{
      setInterval(()=>{
        this._generate()
        this._display()
      })
    })
  }

  async _init(){
    this._canvas = document.createElement("canvas")
    this._ctx = this._canvas.getContext("2d")

    this._canvas.height = window.innerHeight
    this._canvas.width = window.innerWidth

    document.getElementById("app").appendChild(this._canvas)
    
    this._dimention = [
      Math.floor(this._canvas.width  / width), 
      Math.floor(this._canvas.height / width)
    ]

    await this._loadImages()
    
    this._buildMatrix()
    this._display()
  }

  async _loadImages(){
    const promises = []
    Object.keys(tiles).forEach((id)=>{
      promises.push(loadImage("/WaveFunctionCollapse/assets/" + tiles[id].image))
    })
    
    const images = await Promise.all(promises)
    
    this._images = {}

    Object.keys(tiles).forEach((id, index)=>{
      this._images[id] = images[index]
    })
  }

  _buildMatrix(){
    this._matrix = []

    for(let j = 0; j < this._dimention[1]; j++){
      this._matrix[j] = []
      for(let i = 0; i < this._dimention[0]; i++){
          this._matrix[j][i] = new Block()
          // this._matrix[j][i].finalize()
      }
    }

    for(let j = 0; j < this._dimention[1]; j++){
      for(let i = 0; i < this._dimention[0]; i++){
        const up = this._matrix[(j-1) >= 0 ? j-1 : this._matrix.length - 1][i]  //Use a block above, if not, use the block at the very bottom
        const down = this._matrix[(j+1) < this._matrix.length ? j+1 : 0][i]     //Use a block below, if not, use the first block
        const right = this._matrix[j][i+1 < this._matrix[j].length ? i+1 : 0]   //Use a block at right, if not, use the block at the very first
        const left = this._matrix[j][i-1 >= 0 ? i-1 : this._matrix[j].length-1]   //Use a block at right, if not, use the block at the very first
        
        this._matrix[j][i].addNeighbors(up, right, down, left)
      }
    }

    this._matrix[0][0].finalize()
  }

  _generate(){
    let modified = false
    let leastEntropy = {
      value: -1,
      blocks: []
    }

    for(let j = 0; j < this._dimention[1]; j++){
      for(let i = 0; i < this._dimention[0]; i++){
        const block = this._matrix[j][i]
        const initialEntropy = block.options.length

        if(initialEntropy !== 1){
          
          block.updateOptions()

          const finalEntropy = block.options.length

          if(initialEntropy !== finalEntropy) modified = true
          
          if(finalEntropy == 0) {}
          else if(leastEntropy.value == -1){
            leastEntropy.value = finalEntropy
            leastEntropy.blocks = [ block ]
          } else if(finalEntropy == leastEntropy.value){
            leastEntropy.blocks.push(block)
          } else if(finalEntropy < leastEntropy.value){
            leastEntropy.value = finalEntropy
            leastEntropy.blocks = [ block ]
          }
        }
      }
    }
    
    if(!modified){
      leastEntropy.blocks[Math.round(Math.random() * (leastEntropy.blocks.length - 1))].finalize()
    }
  }

  _display(){
    for(let j = 0; j < this._dimention[1]; j++){
      for(let i = 0; i < this._dimention[0]; i++){
        const entropy = this._matrix[j][i].options.length

        if(entropy == 1){
          const image = this._images[this._matrix[j][i].options[0]]
          this._ctx.drawImage(image, width * i, width * j)
        } else {
          switch(entropy){
            case 0:
              this._ctx.fillStyle = "#25c374"
              break
            case 2:
              this._ctx.fillStyle = "#596359"
              break
            case 3:
              this._ctx.fillStyle = "#434843"
              break
            case 4:
              this._ctx.fillStyle = "#272927"
              break
            case 5:
              this._ctx.fillStyle = "#181918"
              break
          }

          this._ctx.fillRect(width * i, width * j, width, width)
        }
      }
    }
  }
}

function loadImage(src) {
  return new Promise((resolve)=>{
    const img = new Image()
    
    img.onload = () =>{
      resolve(img)
    }

    img.onerror=(e)=>{
      console.error("Error fetching image with src: " + src)
    }

    img.src = src
  })
}


class Block{
  constructor(){
    this.options = Object.keys(tiles)
  }

  finalize(){
    if(this.options.length <= 1) return

    const selected = this.options[Math.round(Math.random() * (this.options.length -1))]
    this.options = [selected]
  }

  addNeighbors(up, right, down, left){
    this._neighbors = {
      up, right, down, left
    }
  }

  updateOptions(){
    const validOptions = {
      up: [],
      right: [],
      down: [],
      left: [],
    }

    this._neighbors.up.options.forEach((option)=>{
      validOptions.up.push(...tiles[option].conditions.down)
    })

    this._neighbors.right.options.forEach((option)=>{
      validOptions.right.push(...tiles[option].conditions.left)
    })

    this._neighbors.down.options.forEach((option)=>{
      validOptions.down.push(...tiles[option].conditions.up)
    })

    this._neighbors.left.options.forEach((option)=>{
      validOptions.left.push(...tiles[option].conditions.right)
    })

    //TODO Zero options
    if(this._neighbors.up.options.length == 0) validOptions.up = Object.keys(ids)
    if(this._neighbors.right.options.length == 0) validOptions.right = Object.keys(ids)
    if(this._neighbors.down.options.length == 0) validOptions.down = Object.keys(ids)
    if(this._neighbors.left.options.length == 0) validOptions.left = Object.keys(ids)

    const newOptions = []

    this.options.forEach((option)=>{
      if(
        !validOptions.up.includes(option) ||
        !validOptions.right.includes(option) ||
        !validOptions.down.includes(option) ||
        !validOptions.left.includes(option)
      )  return

      newOptions.push(option)
    })

    this.options = newOptions
  }
}

new Canvas()