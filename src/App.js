import { useState, useEffect } from "react";
import BlueCandy from './images/blue-candy.png'
import Blank from './images/blank.png'
import GreenCandy from './images/green-candy.png'
import OrangeCandy from './images/orange-candy.png'
import PurpleCandy from './images/purple-candy.png'
import YellowCandy from './images/yellow-candy.png'
import RedCandy from './images/red-candy.png'
import ScoreBoard from "./components/ScoreBoard";

const width = 8;

const candyColors = [BlueCandy, GreenCandy, OrangeCandy, PurpleCandy, RedCandy, YellowCandy];

const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareDragged, setSquareDragged] = useState(null);
  const [squareReplaced, setSquarePlaced] = useState(null);
  const [scoreDisplay, setScoreDisplay] = useState(0)

  const checkForColumnsOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === Blank

      if (
        columnOfFour.every(
          (num) => currentColorArrangement[num] === decidedColor && !isBlank
        )
      ) {
        setScoreDisplay((score) => score + 4);
        columnOfFour.forEach((num) => (currentColorArrangement[num] = Blank));
        return true;
      }
    }
  };

  console.log(scoreDisplay)

  const checkForColumnsOfThree = () => {
    for (let i = 0; i < 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentColorArrangement[i];

      if (
        columnOfThree.every(
          (num) => currentColorArrangement[num] === decidedColor && !isBlank
        )
      ) {
        setScoreDisplay((score) => score + 3);
        columnOfThree.forEach((num) => (currentColorArrangement[num] = Blank));
        return true;
      }
    }
  };

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const notValid = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
      ];

      if (notValid.includes(i)) continue;

      if (
        rowOfThree.every((num) => currentColorArrangement[num] === decidedColor)
      ) {
        setScoreDisplay((score) => score + 3);
        rowOfThree.forEach((num) => (currentColorArrangement[num] = Blank));
        return true;
      }
    }
  };

  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArrangement[i];
      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55, 62, 63, 64,
      ];

      if (notValid.includes(i)) continue;

      if (
        rowOfFour.every((num) => currentColorArrangement[num] === decidedColor)
      ) {
        setScoreDisplay((score) => score + 4);
        rowOfFour.forEach((num) => (currentColorArrangement[num] = Blank));
        return true;
      }
    }
  };

  const moveIntoSquareBelow = () => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);
      if (isFirstRow && currentColorArrangement[i] === Blank) {
        let randomNum = Math.floor(Math.random() * candyColors.length);
        currentColorArrangement[i] = candyColors[randomNum];
      }

      if (currentColorArrangement[i + width] === Blank) {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = Blank;
      }
    }
  };

  const dragStart = (e) => {
    console.log(e.target);
    console.log("drag start");
    setSquareDragged(e.target);
  };

  const dragDrop = (e) => {
    console.log(e.target);
    console.log("drag drop");
    setSquarePlaced(e.target);
  };
  const dragEnd = (e) => {
    console.log("drag End");
    const squareReplacedId = parseInt(squareReplaced.getAttribute("data-id"));
    const squareDraggedId = parseInt(squareDragged.getAttribute("data-id"));

    currentColorArrangement[squareReplacedId] =
      squareDragged.style.backgroundColor;
    currentColorArrangement[squareDraggedId] =
      squareReplaced.style.backgroundColor;

    console.log(squareDraggedId, squareReplacedId);

    const validMoves = [
      squareDraggedId - 1,
      squareDraggedId - width,
      squareDraggedId + 1,
      squareDraggedId + width,
    ];

    const validMove = validMoves.includes(squareReplacedId);

    const isAColumnOfFour = checkForColumnsOfFour();
    const isAColumnOfThree = checkForColumnsOfThree();
    const isARowOfFour = checkForRowOfFour();
    const isARowOfThree = checkForRowOfThree();

    if (
      squareDragged &&
      validMove &&
      (isARowOfFour || isARowOfThree || isAColumnOfFour || isAColumnOfThree)
    ) {
      setSquareDragged(null);
      setSquarePlaced(null);
    } else {
      currentColorArrangement[squareReplacedId] =
        squareReplaced.getAttribute('src');
      currentColorArrangement[squareDraggedId] =
        squareDragged.getAttribute('src');
      setCurrentColorArrangement(currentColorArrangement);
    }
  };

  const createBoard = () => {
    const randomColorArrangement = [];
    for (let i = 0; i < width * width; i++) {
      const randomNumFrom0to5 = Math.floor(Math.random() * candyColors.length);
      const randomColor = candyColors[randomNumFrom0to5];
      randomColorArrangement.push(randomColor);
    }
    setCurrentColorArrangement(randomColorArrangement);
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnsOfFour();
      checkForColumnsOfThree();
      checkForRowOfThree();
      checkForRowOfFour();
      moveIntoSquareBelow();
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 100);
    return () => clearInterval(timer);
  }, [
    checkForColumnsOfFour,
    currentColorArrangement,
    checkForColumnsOfThree,
    checkForRowOfFour,
    checkForRowOfThree,
  ]);

  // console.log(currentColorArrangement)

  return (
    <div className="app">
      <div className="game">
        {currentColorArrangement.map((candyColor, index) => (
          <img
            key={index}
            // style={{ backgroundColor: candyColor }}
            src={candyColor}
            data-id={index}
            draggable={true}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDragOver={(e) => e.preventDefault()}
            onDragStart={dragStart}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <ScoreBoard score={scoreDisplay}/>
    </div>
  );
};

export default App;
