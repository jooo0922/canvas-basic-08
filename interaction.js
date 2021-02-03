'use strict';

// 지난 시간까지는 클릭했을때 인지하는 것 까지 만들어 봤으니까
// 이번에는 클릭했을때 해당하는 박스에 대한 내용이 나오는 걸 만들어볼게요.
// 어떤 박스를 클릭하면 해당 박스에 대한 contents panel을 띄울건데
// 띄우는 거 자체를 캔버스 안에서 할 수도 있고, 아니면 일반 html을 띄울수도 있음! 방법이야 만들기 나름인데
// 캔버스 수업이니까 캔버스 안에서 다 해보는걸로 하자
// 일반적으로 메뉴나 박스같은 건 캔버스로 만들고, 그 위에 패널은 일반 DOM요소로 띄우는 것도 많이 하는 방법.
// 근데 이거는 뭐 늘 하던대로 하는거니까 별로 어려운 게 아니잖아?

// render 함수 안에서 뭔가를 그려주고 있으니까 contents panel도 여기서 그려줘야 겠지?
// 일단 네모낳게 커다란 크기로 패널을 만들어보자. panel class를 하나 만들어보자
// 코드도 많아지고 정신사나우니까 클래스들은 따로 파일을 파서 보관해놓자

const canvas = document.querySelector('.canvas');
const context = canvas.getContext('2d');
const boxes = [];
const mousePos = {x: 0, y: 0}; 
let panel; // 패널 인스턴스를 생성해 담아넣을 변수. 나중에 값을 넣을거기 때문에 let으로 정의함. 
let selectedBox; 
context.font = 'bold 30px sans-serif';

// global scope에 중심점을 정의하기 위해 변수를 선언해놓음.
let oX;
let oY;

// 애플리케이션의 상태(단계)를 저장 1 ~ 4까지.
let step;

// requestAnimationFrame을 실행했을 때 return받는 id값을 담아놓기 위한 변수
let rafId;

// requestAnimationFrame으로 각각의 인스턴스별로 draw함수를 계속 호출함으로써
// 왼쪽에서 오른쪽으로(x방향으로) 이동하는 애니메이션을 렌더하는 함수를 따로 만듦. 
function render(){ 
  context.clearRect(0, 0, canvas.width, canvas.height);

  let box;
  for (let i = 0; i < boxes.length; i++) {
    box = boxes[i];
    // box.x += box.speed
  
    // if (box.x > canvas.width) {
    //   box.x = -box.width; 
    // }
  
    box.draw(); 
  }

  // step값이 1 ~ 4에 따라서 뭘 처리해줄 지 지정할 것. switch값으로 할 것!
  switch (step) {
    case 1: 
      for (let i = 0; i < boxes.length; i++) {
        box = boxes[i];
        box.x += box.speed;
      
        if (box.x > canvas.width) {
          box.x = -box.width; 
        }
      }
      break;

    case 2:
      // 2단계는 노란색 페널 그리는 거
      // 그리고 뒤에 박스들이 멈췄으면 좋겠음 = 즉, 멈춘다는 건 각 박스의 x좌표를 바꿔주는 행위를 안하면 되는거지?
      // 즉, box.speed를 더해서 x좌표를 바꿔주고, width를 넘어가면 -box.width 해주고, 이런거를 안해주면 됨.
      // 그러면, 얘내가 render함수 안에 for loop안에 정의된 거잖아? 이러면 switch문의 1~4단계에서 항상 실행이 되니까
      // 1단계에만 얘내들을 넣어주면, 2단계부터는 실행이 안되겠지. 전체 render함수 안에서 계속 실행되는 게 아니라 1단계에서만 실행될 테니까
      // 이런 식으로 하나하나 분기를 해가면서 단계별로 만들어나가면 됨

      // 이번에는 패널이 작은 거에서 큰 거로 튀어나오는 듯한 애니메이션을 추가해보자
      // 그러려면 width, height를 건드리는 것보다는 scale 메소드를 이용하는 게 낫겠지?
      // 그러려면 0~1까지 변화하는 scale의 값을 보관하고 있을 변수가 필요함.
      // 근데 어차피 자기 크기니까 자기가 가지고 있으면 됨. class Panel의 속성으로 추가해줘버리자.   
      
      // 근데 패널 애니메이션이 너무 재미없다. 등속운동을 감속운동으로 바꿔보자.
      // 감속운동 알고리즘(?): '목표위치 - 현재위치' * 0.1을 계속 해줘서, 그만큼 이동시켜주면 됨.
      // 왜냐? '목표위치 - 현재위치' 이 값 자체는 계속 줄어듦. 그 사이의 간격은 계속 줄어드니까. 왜? 우리가 목표위치로 계속 나아갈테니까 
      // 그러면 * 0.1한 값도 계속 줄어들겠지? 우리가 현재위치로 나아가는 거리가 계속 줄어들면서 감속운동이 될 수 밖에 없음.
      // 이걸 코드로 짜면 됨. 이런 기본적인 운동 관련 알고리즘은 외워두고 있는게 좋다.
      // 왜냐면 그게 완전히 각인된 상태가 되면 그거에 조금씩 변화를 줘가면서 움직임에 응용을 해볼 수 있음.
      // 근데 그 정도가 되려면 기본적인 알고리즘들은 체화가 되어있어야 함.
      // panel.scale = 현재크기 + (목표크기 - 현재크기) * 0.1; 감속운동 공식 외워! 
      // 목표크기는 1이 되어야겠지? 1이 단위크기를 100%로 계산해주는 거니까
      panel.scale = panel.scale + (1 - panel.scale) * 0.1;

      // 이제 scale이 커짐과 동시에 720도(2바퀴) rotate도 해보자.
      // 일단 panel에 rotate 변환도 추가해주시고!
      // 근데 scale이 딱 끝남과 동시에 rotate도 2바퀴 딱 끝나게 하고싶어. 그러려면 rotate를 독자적으로 변환할 게 아니라
      // 뭔가 scale의 값과 엮어줘야 하지 않을까? 제일 간단한 방법은 'scale의 비율만큼' 돌려주면 됨!
      // 다시 말해, scale이 0 ~ 1까지 움직일 동안, rotate는 0 ~ 720까지 가면 된다! -> 일차방정식! 전체 값에서 비율을 곱해주면 됨!
      // 각도 = 스케일(0~1) * 최종각도(720); 이 공식으로 하면 스케일 변화에 따라 각도도 0~720까지 비례하게 변하겠지?
      // 이렇게 하면 스케일에 먹인 가속도의 영향을 rotate에도 자동으로 먹이게 됨.
      panel.angle = panel.scale * 720;

      // 이제 render할때마다 전체 프레임이 clearRect되니까 panel하나를 그리더라도 매번 그려줘야 눈에 보이게 될거임.
      // 그래서 render 함수에서 따로 panel.draw()메소드를 반복 호출해줘야 지금 이 애니메이션이 적용된 캔버스 안에서 보일 수 있게 될거임.
      // render는 계속 반복되겠지만 어쨋든 여기서 panel을 무조건 그리는 게 아니고,
      // 어떤 조건을 만족했을때만!(즉, 박스를 클릭했을때만) 그리자는 거지?
      // 그래서 이 조건을 어떻게 할 것이냐? 어떤 단계라고 생각해보자.
      // 게임을 예로 들면(캔버스로 게임도 많이 만들 수 있으니까) 박스를 누르면 노란색 패널이 나타난다고 치자.
      // 그럼, 누른 순간, 상태가 바뀌었다는 것을 인지를 해서 패널을 그려줘야 되겠지?
      // 그래서 상태, 그 단계를 나타내줄 변수를 하나 만들고 그 변수값에 따라서 그려주고 말고를 결정해보자!
      panel.draw();
      // console.log(panel.scale); 얘는 영원히 1이 될 수 없다. 계산 공식 자체가 1에 '수렴'할 뿐 1이 되진 않음.
      // 그래서 아래 if문의 조건을 0.999정도로 바꿔서, 0.999정도만 넘으면 scale을 1로 할당해주고 3단계로 넘어가도록 수정해줘야 함.
      if (panel.scale >= 0.999) {
        panel.scale = 1;
        // scale이 1이 되어야 width값으로 준 300px 사이즈 고대로 그려질 것임. 왜? scale은 '단위 크기'만 변화시키니까.
        // 그러니 scale이 1이 되는 순간 panel.scale의 증가를 멈추고, 3단계로 넘어가버리게 함.
        step = 3;
      }
      break;

    case 3:
      // 이제 패널이 마냥 커질 수 없으니, width가 300이 되면 더이상 scale이 늘어나지 못하게 멈추고, contents를 패널에 표시할 것.
      // 이거를 3단계서 정의해보도록 하자.
      panel.draw();
      // panel.showContent();
      break;
  }

  // console.log('render!');

  // 그리고 case 3 은 사실 정지된 화면인데 굳이 애니메이션을 계속 돌려서 쓸데없이 같은 프레임만 그려대고 있음.
  // step === 3에 한해서만 이 애니메이션을 멈춰보자.

  // 얘도 window 전역객체에 들어있는 '메소드'임. 원래는 window.requestAnimationFrame(render); 이렇게 해줘야 하는데 전역객체는 생략 가능.
  // 근데 지금 animation을 멈추고 싶은 거니까 cancelAnimationFrame을 쓰면 되는데
  // 이걸 하기 전에 일단 requestAnimationFrame이 return해주는 값을 담아놓을 변수를 이용해서 애니메이션을 멈추는데 사용해보자.
  rafId = requestAnimationFrame(render);
  // console.log(rafId); 이렇게 찍어보면 그냥 1/60초당 숫자 1씩이 늘어난 값들이 계속 return되면서 찍히는건데
  // 이 숫자를 이용해서 쌍을 맞춰서 cancel을 해줄수가 있다! 그러라고 return을 해주는거.
  if (step === 3) {
    cancelAnimationFrame(rafId); // 이 id값이 할당된 프레임에서 애니메이션을 멈춰주는거임. 이런식으로 쌍을 맞춰서 멈춰주는 거. 
    panel.showContent(); // 그냥 case 3에 두면 실행안됨. 그래서 여기로 옮겨와서 실행될 수 있게 한 것.
  }
}

// 10개의 박스의 각각의 index, (x, y)좌표값, x방향의 애니메이션 속도값들을 랜덤하게 생성한 뒤,
// new Box로 새로운 인스턴스를 10개 생성함. 이후 그것들의 객체를 boxes 배열에 넣어서 보관해놓음.
let tempX, tempY, tempSpeed;

function init() {
  // 처음 박스 인스턴스 10개를 생성하여 그려내는 부분을 함수로 따로 정리한거임.
  // 그리고 애니메이션 프레임을 그려주는 render 함수를 init 안에서 호출하는 것.
  // 그리고 여기다가 박스 인스턴스들을 만들었던 것처럼 panel.js에서 정의한 class Panel의 인스턴스를 하나 만들어볼 것.
  
  step = 1; // 즉, init()함수가 발동되어 처음 박스가 그려지고, 애니메이션이 호출될 때의 상태를 1(단계)라고 보고 할당함.
  // 이 step값의 변화에 따라서 render함수 안에서 뭘 그려줄 지를 결정하고 처리할 것

  // 중심점에 위치하려면 캔버스 width, height의 절반이 중심점의 좌표값이니까 2로 나눔
  oX = canvas.width / 2;
  oY = canvas.height / 2;

  for (let i = 0; i < 10; i++) {
    tempX = Math.random() * canvas.width * 0.8; 
    tempY = Math.random() * canvas.height * 0.8;  
    tempSpeed = Math.random() * 4 + 1 
    
    boxes.push(new Box(i, tempX, tempY, tempSpeed)); 
  }
  
  console.log(boxes);

  // 이렇게 인스턴스를 생성하자마자 draw를 바로 호출하니까 캔버스에 보여야하는게 맞지만,
  // 지금 이 캔버스에는 requestAnimationFrame이 걸려있어서 render함수에서 계속 clearRect()를 해버리고 있음.
  // 그래서 인스턴스 생성과 동시에 최초로 자동 호출된 panel.draw()메소드는 안보이는 거.
  panel = new Panel();

  render();
}

// 특정 박스를 클릭하면 그것을 인식하여 콘솔창에 박스의 index가 출력되도록 함.
// 이 때 boxes 배열에 보관된 10개의 박스 정보가 담긴 객체들을 이용해서 마우스 클릭 좌표와 비교함.
canvas.addEventListener('click', e => {
  mousePos.x = e.layerX;
  mousePos.y = e.layerY;

  let box; 
  for (let i = 0; i < boxes.length; i++) {
    box = boxes[i]
  
    if (mousePos.x > box.x &&
        mousePos.x < box.x + box.width &&
        mousePos.y > box.y &&
        mousePos.y < box.y + box.height) {
          selectedBox = box;
        }
  }
  
  if (step === 1 && selectedBox) { // 조건문을 좀 더 명확하게 해준 것. 현재 step이 1단계이고, selectedBox가 존재할 때에만 2단계로 넘어감.
    console.log(selectedBox.index);
    step = 2; // selectedBox 값이 존재해야 제대로 된 박스를 클릭한 거니까, 여기서 2단계를 할당해줘야지.
    // selectedBox = undefined;
    // selectedBox = undefined;이렇게 해버리면 panel.js에서 fillText(selectedBox.index, oX, oY); 를 뿌려줄 수 없음.
    // 클릭하고서 마지막엔 결국 selectedBox의 값이 undefined가 되어버릴 테니까

    // 근데 얘를 또 안해주면 3단계 -> 1단계로 복귀해서 클릭 후 2단계로 넘어갈 때 빈 곳을 클릭해도 이전에 클릭한 box가 남아서
    // 고대로 2단계에서 캔버스에 애니메이션 적용되서 뿌려지는 버그가 생김
    // 그래서 어차피 fillText는 3단계에서만 뿌려주는거니까 3단계에서 click -> 1단계로 넘어가는 시점에 초기화해주면 아무 문제 없겠지!  
  } else if (step === 3) {
    // click event의 콜백함수 안에서 step이 3일 때 클릭하면 다시 원래 상태(1단계)로 돌아가게 해주는 기능도 정의해 놓는 거임.
    step = 1;
    // 3단계에서 click -> 1단계 복귀. 다시 click -> 2단계 하면 scale이 이미 1인 상태이기 때문에 애니메이션이 적용 안됨.
    // 그래서 지금 scale 값을 1단계로 복귀하는 동시에 0으로 초기화해주는거. 그래야 다시 click 후 2단계 넘어가서 애니메이션이 적용되겠지/
    panel.scale = 0; 
    selectedBox = undefined; 
    // 이런 초기화하는 애들은 switch 분기 어딘가에서 해줄수도 있지만, 분기 자체가 render함수에 있기 때문에
    // requestAnimationFrame에 의해 1초에 60번 호출되니까, 초기화도 쓸데없이 1초에 60번 되겠지. 성능저하에 영향이 갈수도 있음.
  
    // cancel된 애니메이션을 재개하려면 click해서 3단계 -> 1단계로 넘어가는 순간에 해줘야겠지?
    // 그냥 render 호출해주면 내부에서 알아서 requestAnimationFrame을 실행해줄 것
    render();
  }
});

init();

// 참고로 캔버스는 그림을 새로 그릴때마다 div같은 새로운 태그를 append하지 않기 때문에 성능 저하를 일으키지 않음.
// html 태그를 계속 추가할수록 파일의 용량이 커져서 성능 저하를 일으키니까. 캔버스가 그만큼 막강하다는 뜻.

// 또 주의사항! 캔버스에서 애니메이션을 만들때는, '반복이 되어야 할 애들/반복이 필요없는 애들'을 잘 구분해줘야 함.
// 반복이 필요없는 애들이 requestAnimationFrame 안에 들어가면 쓸데없이 반복되서 성능저하만 유발함. 

// canvas 로 실제 서비스 만들때는 항상 console.log는 다 썻으면 지워줘야 함.
// 다른 앱은 크게 냅둬도 상관없는데 캔버스는 애니메이션을 만들다보니까 console.log 실행할때마다 연산 비용이 꽤 큼. 그래서 버벅거림.
// 또 f12 개발자도구도 열어놓으면 성능저하 있음. 꺼줘야지 더 빠름.

// 이제 추후로 또 캔버스 강의를 틈나면 올려주겠지만
// 여기까지 배운 내용 정도면 캔버스 개발에 필요한 기본 근력을 길렀다고 생각하면 됨. 지금까지 배운 것만 복습 철저히 해둘 것.