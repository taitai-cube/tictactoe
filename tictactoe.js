import {ai} from './ai.js'; // aiをインポート

let field = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let player = true;
let start_player = true;
let battle_result = [0,0,0]
let mode = "PlayervsPlayer"; // モードがPlayer vs PlayerかPlayer vs AIか
let difficulty_level = false; // 難易度が簡単かどうか(簡単な場合はfalse)
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

function resetGame(allclear = false) { // ゲームをリセット
  if(allclear){
    battle_result = [0,0,0];
    document.getElementById('scoreboard').innerText = '〇が0勝、×が0勝、引き分けは0回です。';
    player = true;
  }
  field = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  if(mode !== "PlayervsAI"){
    player = !start_player;
    start_player = !start_player;
  }else{
    player = true;
  }
  // ボタンのテキストをクリア
  document.querySelectorAll('button').forEach(button => button.innerText = '');
  
}

function show(winner) { // 勝った時の表示
  alert(winner + 'の勝ち');
}

function battle_finish(scoreboard) { // ゲーム終了時の処理
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
}

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('button');
  const scoreboard = document.getElementById('scoreboard');
  const modeRadioButtons = document.querySelectorAll('input[name="mode"]');
  const difficultyRadioButtons = document.querySelectorAll('input[name="difficulty_level"]');
  difficultyRadioButtons.forEach(button => button.disabled = true);
  modeRadioButtons.forEach(button => { 
    button.addEventListener('change', (event) => {  // モードが変更された時の処理を登録
      if (event.target.value === "PlayervsAI") { // AIと対戦する場合
        difficultyRadioButtons.forEach(button => button.disabled = false); 
        mode = "PlayervsAI";
      }else {
        difficultyRadioButtons.forEach(button => button.disabled = true);
        mode = "PlayervsPlayer";
      }
      resetGame(true);
    }
  );
  });
  difficultyRadioButtons.forEach(button => {  // 難易度が変更された時の処理を登録
    button.addEventListener('change', (event) => { 
      resetGame(true);
      difficulty_level = !difficulty_level;
    }
  );
  });
  buttons.forEach(button => { // ボタンがクリックされた時の処理を登録
    button.addEventListener('click', (event) => { // ボタンがクリックされた時の処理
      const buttonId = event.target.id;
      if(field[buttonId[buttonId.length - 1] - 1] === 0){ // 既に埋まっている場合は何もしない
        if (player) { // 先攻後攻判定
          field[buttonId[buttonId.length - 1] - 1] = 1;
        } else {
          field[buttonId[buttonId.length - 1] - 1] = 2;
        }
        event.target.innerText = player ? '〇' : '×';
        battle_finish(scoreboard); // ゲームが終了したか判定＆終了時の処理
        if(mode === "PlayervsAI" && !judge(field) && field.includes(0)){ // AIと対戦する場合
          player = !player; // 先攻後攻切り替え
          let aiMove = ai(field, difficulty_level); // AIの手を取得
          console.log(aiMove)
          field[aiMove] = 2;
          const ai_button = document.getElementById(`Button${aiMove + 1}`); // AIの手を表示
          ai_button.innerText = '×';
          console.log(field);
          battle_finish(scoreboard); // ゲームが終了したか判定＆終了時の処理
        }
        player = !player; // 先攻後攻切り替え
      }
    });
  });
});
