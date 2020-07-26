module.exports = () => {
  this.deck = ""
  this.players = []
  this.alives = []
  this.deads = {}

  this.reset = () => {
    this.deck = ""
    this.players = []
    this.alives = []
    this.deads = {}
  }
}