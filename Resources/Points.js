function Points(currenttestmark, difficulty) {
    if (difficulty === "Easy") {
      return 1 * (currenttestmark / 100);
    } else if (difficulty === "Medium") {
      return 2 * (currenttestmark / 100);
    } else if (difficulty === "Hard") {
      return 3 * (currenttestmark / 100);
    }
    else
    {
        return 0;
    }
  }
  
  module.exports = Points;
  