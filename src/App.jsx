import { Button, Flex, Heading, useToast } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

const LETTERS = "abcdefghijklmnopqrstuvwxyz";

const globalGameItemArray = [
  {
    id: 0,
    name: "road",
    image:
      "https://images.unsplash.com/photo-1519817914152-22d216bb9170?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cm9hZHxlbnwwfHwwfHw%3D&w=1000&q=80",
  },
  {
    id: 1,
    name: "tree",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSwCpc24hURxSTdskux_1mQYuEe3NxwiiShg&usqp=CAU",
  },
  {
    id: 2,
    name: "car",
    image:
      "https://www.apkoficial.com/juegos/wp-content/uploads/thumbs/gamemonetize/M/mr-bean-car-hidden-keys.jpg",
  },
];

const shuffle = (neededArray) => {
  const lettersArray = LETTERS.split("");
  for (let i = 0; i < lettersArray.length - 1; ++i) {
    const j = Math.floor(Math.random() * lettersArray.length);
    const temp = lettersArray[i];
    lettersArray[i] = lettersArray[j];
    lettersArray[j] = temp;
  }
  const arr = neededArray.split("");
  let n = arr.length;

  for (n; n <= 11; n++) {
    arr.push(lettersArray[n]);
  }

  for (let i = 0; i < n - 1; ++i) {
    const j = Math.floor(Math.random() * n);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};

function App() {
  const toast = useToast();
  const [gameItem, setGameItem] = useState(globalGameItemArray[0]);
  const myArray = useMemo(() => shuffle(gameItem.name), [gameItem]);

  const [answers, setAnswers] = useState([]);

  // adding answer and filling the gaps
  const handleAddAnswer = (item, index) => {
    const ItemIndex = answers.findIndex((item) => item === "");
    if (ItemIndex !== -1) {
      const myArray = [...answers];
      myArray.splice(ItemIndex, 1);
      myArray.splice(ItemIndex, 0, { id: index, item });
      setAnswers(myArray);
      return;
    }
    setAnswers((prev) => [...prev, { id: index, item }]);
  };

  // delete item from the answer boxes
  const handleDeleteAnswer = (id) => {
    const newState = answers.map((item) => {
      if (item.id === id) return "";
      return item;
    });
    setAnswers(newState);
  };

  // reset level
  const handleResetLevele = () => {
    setAnswers([]);
  };

  const handleNextChangeLevel = () => {
    setGameItem((prev) => globalGameItemArray[prev.id + 1]);
    handleResetLevele();
  };

  const handlePrevChangeLevel = () => {
    setGameItem((prev) => globalGameItemArray[prev.id - 1]);
    handleResetLevele();
  };
  // check if the user complete all the word
  useEffect(() => {
    if (gameItem.name.length === answers.length) {
      const newArray = answers.map((item) => item.item);
      if (gameItem.name === newArray.join("")) {
        toast({
          title: "yes you won",
          description: "now you can go to the next level",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "You are such a big loser",
          description: "You can reset the game to clear your shame",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }, [answers, toast, gameItem.name]);

  return (
    <Flex gap="10px" align="center" direction="column" bg="salmon" h="100vh">
      <Heading>4 pics game</Heading>
      <Flex gap="10px">
        <Button disabled={gameItem.id === 0} onClick={handlePrevChangeLevel}>
          Prev
        </Button>
        <Button
          disabled={gameItem.id === globalGameItemArray.length - 1}
          onClick={handleNextChangeLevel}
        >
          next
        </Button>
      </Flex>
      <Flex
        direction="column "
        w="310px"
        gap="10px"
        align="center"
        bg="#fff"
        p="10px"
        borderRadius="10px"
      >
        <img src={gameItem.image} alt="road" height="300px" width="300px" />

        <Flex gap="10px">
          {gameItem.name.split("").map((item, index) => (
            <Button
              bg="#000"
              color="#fff"
              key={index}
              disabled={answers.length === gameItem.name.length}
              onClick={() => handleDeleteAnswer(answers[index].id)}
            >
              {answers[index] ? answers[index].item : "_"}
            </Button>
          ))}
        </Flex>
        <Flex justify="center" w="300px" wrap="wrap" gap="5px">
          {myArray.map((item, index) => (
            <Button
              bg="gray.300"
              fontWeight="bold"
              key={index}
              disabled={
                answers.find((item) => item.id === index) ||
                answers.length === gameItem.name.length
              }
              onClick={() => handleAddAnswer(item, index)}
            >
              {item}
            </Button>
          ))}
        </Flex>
      </Flex>
      {gameItem.name.length === answers.length && (
        <Button onClick={handleResetLevele}>clear answers</Button>
      )}
    </Flex>
  );
}

export default App;

// [a] [b] [c] [d]
// img.
// answer.length boxes of selected letters.
// by default 12 box of random letters + answer letters (shuffled). (OPTIONS)

// Answer (empty);
// when user selects a letter, add it to the smallest index of answer.
// when the user clicks on an answer box, remove that letter only.
// when a letter is selected from options (disable it).

// clear answer btn

// img + answer -> answerState -> options(shuffle).
// As soon as the answer is filled check if the user is correct/wrong.
