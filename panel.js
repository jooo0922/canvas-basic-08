'use strict'

// contents panel을 생성하는 class
// class Panel도 class Box처럼 contents box를 draw하는 메소드를 활용하는 등 비슷한 구조로 만들것임. 
class Panel {
  constructor(){
    // 패널의 크기를 변화시킬 때 사용할 속성 정의
    this.scale = 0;
    this.angle = 0;
  }

  draw(){
    context.fillStyle = 'rgba(255, 0, 0, 0.8)';
    // context.globalAlpha로 투명도를 줄 수도 있지만, 그냥 fillStyle = 'rgba()'로 하는게 낫다.
    // 글로벌알파로 투명도를 주면 색깔을 바꾸거나 할 때에도 투명도가 계속 유지가 되서 일일이 투명도를 원상복귀 시켜줘야 하는 번거로움이 있음. 

    // render함수에서 증가시킨 scale값이 적용되서 실제 변환이 이루어지게 해야 함. transform() 사용할 것.
    // 일단 transform을 사용하려면 처음에는 단위행렬로 초기화해줘야 함. 변환 자체를 초기화해야 안전함.
    // 이 draw메소드는 render함수 안에서 계속 반복호출 될테니까 항상 습관적으로 변환값을 초기화해주는 게 중요!
    context.resetTransform(); // context.setTransform(1, 0, 0, 1, 0, 0); 으로 해줘도 똑같음.
    // 그 다음에 그냥 scale하면 안되지? 변환의 기준점이 왼쪽 위(0, 0)가 default이기 때문에 얘를 중앙으로 직접 이동시켜줘야 했었지?
    // 뭘로 이동시켜줘? translate()로! 
    context.translate(oX, oY);
    // 이렇게 중심점을 가운데로 옮겨주고 나서야 scale을 해주는거야. 그래야 가운데에서부터 scaling이 되는거지!
    context.scale(this.scale, this.scale);

    // scale을 해주는 동시에 rotate도 변환해줄 것. 시작각, 끝각 모두 radian 단위로 변환해서 전달하는거 알지?
    // 지금이야 parameter에서 바로 계산하지만 canvas에서 회전할 일이 많으니까 라디안으로 전환하는 유틸리티 함수를 만들어놓고 쓰면 편하다고 했었지?
    context.rotate(canUtil.toRadian(this.angle), );

    context.translate(-oX, -oY); // 그리고 기준점을 다시 (0, 0)으로 돌려놔줘야 함.

    // panel을 canvas.width, height의 절반 크기만큼, 가운데로 만들고 싶다면, 그냥 
    // fillRect(150, 100, 300, 200) 이렇게 숫자를 바로 정해줘도 되지만, 패널 크기가 다른게 여러 개 있거나, 캔버스 사이즈가 변할 수도 있잖아>
    // 캔버스가 화면에 꽉 차게 만드는 등 반응형으로 사이즈를 변형하게 될 수도 있으니까
    // 왼쪽 위를 기준으로 좌표값을 잡기보다, 어차피 가운데에 올거니까 센터를 중심으로 하면 계산이 편할거다.
    // 가운데로부터, canvas.width / 2 (= -150) 이렇게 하면 센터로 정렬이 되겠지?
    // 캔버스의 크기가 어떻게 늘어나건 줄어나건, 가운데를 중심으로 canvas.width의 절반만큼만 땡겨서 위치시키면 됨.
    // interaction.js에서도 여러 군데에서 사용될 지 모르니까 global scope에 중심점을 정의해놓자.
    // 150을 빼는 이유는 센터에 정렬할건데 width, height는 300으로 할거니까!
    context.fillRect(oX - 150, oY - 150, 300, 300);
    context.resetTransform();
  }

  showContent(){
    // 이제 패널에도 해당 박스에 대한 컨텐츠를 나타내주면 좋겠지?
    // 이거는 애니메이션이 끝난 다음에 필요할 때 호출해주면 됨. 3단계로 넘어갔을 때 해주면 됨.
    console.log('showContent 실행'); // 애니메이션을 cancel할 때 제대로 cancel됬는지 확인하려고 쓴 것! 콘솔에 1번만 찍혀야 애니메이션이 잘 cancel된거겠지?
    context.fillStyle = '#fff';
    if (selectedBox) {
      context.fillText(selectedBox.index, oX, oY);
    }
  }
}