let attempts = 0;
let index = 0;
let timer;

function appStart() {
  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "정답입니다. <br>게임이 종료됐습니다";
    div.style =
      "display:flex; justify-content:center; align-items:center; position:absolute; top:40vh; left:38%; background-color:white; width:200px; height:200px";
    document.body.appendChild(div);

    //3초뒤에 페이지를 새로고침하는 코드 이벤트
    setTimeout(() => {
      location.reload();
    }, 3000);
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

  const handleEnterKey = async () => {
    let 맞은_갯수 = 0;
    // await 함수를 쓰기 위해선 async 가 필요
    // await 함수: 응답이 올때 까지 기다렸다가 응답이 오면 다음 함수로 진행할 수 있게 기다려 주는 함수
    // 이제는 정답이 정해졍 있지 않고 서버에서 준 정답을 가져와 비교해야함
    //fetch: 자바스크립트에서 서버로 요청 보낼때 쓰는 함수
    const 응답 = await fetch("/answer");

    // 응답을 받아와서 json값으로 바꿔준다
    const 정답 = await 응답.json();

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
    // if (맞은_갯수 === 5) gameover();
    // else nextLine();

    if (맞은_갯수 === 5) {
      gameover();
    } else {
      //오답일때 오답 메세지 불러오기
      displayResultMessage();

      setTimeout(() => {
        nextLine();
      }, 1000);
    }
  };

  const displayResultMessage = () => {
    const div = document.createElement("div");
    div.innerText = "오답입니다";
    div.id = "result-message"; // 결과 메세지라고 아이디 값을 줌
    div.style =
      "display:flex; justify-content:center; align-items:center; position:absolute; top:40vh; left:38%; background-color:red; width:200px; height:200px";
    document.body.appendChild(div);

    // 2초 지나고 오답입니다 메세지 사라지게 하기
    setTimeout(() => {
      removeResultMessage();
    }, 2000);
  };

  const removeResultMessage = () => {
    const resultMessage = document.getElementById("result-message");
    if (resultMessage) {
      resultMessage.remove();
    }
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

  const handleMouseClick = (event) => {
    const clickKey = event.currentTarget.getAttribute("data-key");
    console.log("clickKey", clickKey);
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );

    // 마우스 클릭 시 정답을 입력합니다.
    if (clickKey === "Backspace") handleBackspace();
    else if (index === 5) {
      if (clickKey === "Enter") handleEnterKey();
      else return;
    } else {
      thisBlock.innerHTML = clickKey;
      index += 1;
      //index =index+1; , index++; 같은 표현
    }
  };

  // 키보드 클릭 이벤트 처리
  // window.addEventListener("keydown", handleKeydown);

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
  // 마우스 클릭 이벤트 처리
  const boardBlocks = document.querySelectorAll(
    ".keyboard-block, .keyboard-block-1"
  );
  boardBlocks.forEach((block) => {
    block.addEventListener("click", handleMouseClick);
  });
}
appStart();
