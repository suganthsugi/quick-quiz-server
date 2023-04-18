function Points(currenttestmark, difficulty) {
    if (difficulty === "Easy") {
      return Math.round((1 * (currenttestmark / 100))*1000)/1000;
    } else if (difficulty === "Medium") {
      return Math.round((2 * (currenttestmark / 100))*1000)/1000;
    } else if (difficulty === "Hard") {
      return Math.round((3 * (currenttestmark / 100))*1000)/1000;
    }
    else
    {
        return 0;
    }
  }
  
  module.exports = Points;
  