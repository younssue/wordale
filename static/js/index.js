const 정답 = "APPLE";

let attempts = 0;
let index = 0;
let timer;

function appStart() {
  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "게임이 종료됐습니다";
    div.style =
      "display:flex; justify-content:center; align-items:center; position:absolute; top:40vh; left:38%; background-color:white; width:200px; height:200px";
    document.body.appendChild(div);
  };

  const nextLine = () => {
    if (attempts === 6) return gameover();
    //다음줄로 이동 2번째 줄이니까 attempts +1
    attempts += 1;
    index = 0;
  };

  const gameover = () => {
    window.removeEventListener("keydown", handleKeydown);
    displayGameover();
    //정답을 맞췄을 때, 저장된 timer을 멈춰줌
    clearInterval(timer);
  };

  const handleEnterKey = () => {
    let 맞은_갯수 = 0;
    //정답확인
    //엔터키를 눌렸을 때 한줄에 쓰여진 단어를 가져옴
    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-block[data-index='${attempts}${i}']`
      );
      const 입력한_글자 = block.innerHTML;
      const 정답_글자 = 정답[i];
      if (입력한_글자 === 정답_글자) {
        맞은_갯수 += 1;
        block.style.background = "#6AAA64";
      } else if (정답.includes(입력한_글자)) block.style.background = "#C9B458";
      else block.style.background = "#787C7E";

      block.style.color = "white";
      console.log("입력한 글자:", 입력한_글자, "정답_글자", 정답_글자);
    }
    if (맞은_갯수 === 5) gameover();
    else nextLine();
  };

  const handleBackspace = () => {
    if (index > 0) {
    }
    const preBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index - 1}']`
    );
    preBlock.innerHTML = "";
    if (index !== 0) index -= 1;
  };

  const handleKeydown = (event) => {
    //wordale 에서 한줄이 다 채워지면 더이상 밑에줄로 내려가서 써지지 않게 하기 위해서 index=05에서 멈춤

    //대문자 toUpperCase()
    const key = event.key.toUpperCase();
    const keyCode = event.keyCode;
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );

    if (event.key === "Backspace") handleBackspace();
    else if (index === 5) {
      if (event.key === "Enter") handleEnterKey();
      else return;
    }
    //keycode : 웹 상에서 a:65~z:90
    else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerHTML = key;
      index += 1;
      //index =index+1; , index++; 같은 표현
    }
  };

  //타이머
  const startTimer = () => {
    const 시작_시간 = new Date();

    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);
      const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
      const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");
      const timeDiv = document.querySelector("#time");
      timeDiv.innerHTML = `${분}:${초}`;
    }

    //주기성
    timer = setInterval(setTime, 1000);
  };
  startTimer();
  window.addEventListener("keydown", handleKeydown);
}
appStart();
