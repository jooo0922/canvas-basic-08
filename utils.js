'use strict';

// 사실 함수 하나 쓸거 굳이 이렇게 유틸리티 객체를 만들어서
// 그 안에다가 key: value 이렇게 정의하는게 비효율적이기는 한데, 그냥 이런식으로 유틸리티 함수를 관리하면 좋다는 걸
// 보여주는 차원에서 만들어본 거라고 함.
const canUtil = {
  toRadian: function(degree){
    return degree * Math.PI/180; // 이렇게 먼저 개념적으로 먼저 계산된 애들은 붙여쓰는 게 더 코드 내용을 이해하기 쉬움.
  }
};