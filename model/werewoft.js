module.exports = function() {
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