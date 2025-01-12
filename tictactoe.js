let field = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let player = true;
let battle_result = [0,0,0]

function judge(a) { // 判定
  function judge_same(b) { // 同じ値か判定
    if ((b[0] === b[1] && b[1] === b[2]) && (b[0] !== 0)) {
      return true;
    } else {
      return false;
    }
  }
  if (judge_same(a.slice(0, 3)) || judge_same(a.slice(3, 6)) || judge_same(a.slice(6, 9))) { // 横判定
    return true;
  } else if (judge_same([a[0], a[3], a[6]]) || judge_same([a[1], a[4], a[7]]) || judge_same([a[2], a[5], a[8]])) { // 縦判定
    return true;
  } else if (judge_same([a[0], a[4], a[8]]) || judge_same([a[2], a[4], a[6]])) { // 斜め判定
    return true;
  } else {
    return false;
  }
}

function resetGame() {
  field = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  // ボタンのテキストをクリア
  document.querySelectorAll('button').forEach(button => button.innerText = '');
}

function show(winner) { // 勝った時の表示
  alert(winner + 'の勝ち');
}

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('button');
  const scoreboard = document.getElementById('scoreboard');
  buttons.forEach(button => { // ボタンがクリックされた時の処理を登録
    button.addEventListener('click', (event) => { // ボタンがクリックされた時の処理
      const buttonId = event.target.id;
      if(field[buttonId[buttonId.length - 1] - 1] === 0){
        if (player) { // 先攻後攻判定
          field[buttonId[buttonId.length - 1] - 1] = 1;
        } else {
          field[buttonId[buttonId.length - 1] - 1] = 2;
        }
        event.target.innerText = player ? '〇' : '×';
        if (judge(field)) { // 勝った時の処理
          const winner = player ? "〇" : "×";
          if (player) {
            battle_result[0] += 1;
          } else {
            battle_result[1] += 1;
          }
          setTimeout(() => {
            show(winner);
            resetGame(); // ゲームをリセット
            scoreboard.innerText = `〇が${battle_result[0]}勝、×が${battle_result[1]}勝、引き分けは${battle_result[2]}回です。`;
          }, 100); // 少し遅延
        }else if(!field.includes(0)){ // 引き分けの処理
          setTimeout(() => {
            alert('引き分け');
            battle_result[2] += 1;
            resetGame(); // ゲームをリセット
            scoreboard.innerText = `〇が${battle_result[0]}勝、×が${battle_result[1]}勝、引き分けは${battle_result[2]}回です。`;
          }, 100); // 少し遅延
        }
        player = !player; // 後攻に交代
      }
    });
  });
});
