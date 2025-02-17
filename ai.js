export function ai(field, difficulty_level = false, start_player, count) { // AIの手を取得
  function random() {
    let availableIndices = []; // 空いているインデックスを格納する配列
    for (let i = 0; i < field.length; i++) { // 空いているインデックスをavailableIndicesに格納
      if (field[i] === 0) {
        availableIndices.push(i);
      }
    }
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]; // ランダムなインデックスを取得
    return randomIndex;
    
  }
  function reach_judge(a, player_number) { // リーチ判定
    let row1 = a.slice(0, 3);
    let row2 = a.slice(3, 6);
    let row3 = a.slice(6, 9);
    let col1 = [a[0], a[3], a[6]];
    let col2 = [a[1], a[4], a[7]];
    let col3 = [a[2], a[5], a[8]];
    let dia1 = [a[0], a[4], a[8]];
    let dia2 = [a[2], a[4], a[6]];
    let rows = [row1, row2, row3, col1, col2, col3, dia1, dia2];

    let reach_availability = rows.filter(row => row.includes(0) && 
        (row.filter(x => x === player_number).length === 2));

    if(reach_availability.length === 0) return [null];

    let winning_moves = [];
    for (let i = 0; i < rows.length; i++) { // リーチがあるか
        if (rows[i].includes(0) && rows[i].filter(x => x === player_number).length === 2) { // リーチがある場合のパターンを取得
            const emptyIndex = rows[i].indexOf(0); // 空いているインデックスを取得
            let boardIndex; // boardIndexはどこを指せばいいのかを示す変数
            switch(i) { // rowsの仲間ごとの場合分け
                case 0: // 横判定 1
                    boardIndex = emptyIndex;
                    break;
                case 1: // 横判定 2
                    boardIndex = emptyIndex + 3;
                    break;
                case 2: // 横判定 3
                    boardIndex = emptyIndex + 6;
                    break;
                case 3: // 縦判定 1
                    boardIndex = emptyIndex * 3;
                    break;
                case 4: // 縦判定 2
                    boardIndex = (emptyIndex * 3) + 1;
                    break;
                case 5: // 縦判定 3
                    boardIndex = (emptyIndex * 3) + 2;
                    break;
                case 6: // 斜め判定 1
                    if (emptyIndex === 0) boardIndex = 0;
                    else if (emptyIndex === 1) boardIndex = 4;
                    else if (emptyIndex === 2) boardIndex = 8;
                    break;
                case 7: // 斜め判定 2
                    if (emptyIndex === 0) boardIndex = 2;
                    else if (emptyIndex === 1) boardIndex = 4;
                    else if (emptyIndex === 2) boardIndex = 6;
                    break;
            }
            winning_moves.push(boardIndex);
        }
    }
    console.log(rows);
    return winning_moves;

  }
  function normal_selecting(a=null){ // aに関数を入れることで、その関数を実行する
    if (reach_judge(field, 2)[0] !== null){ //自分にリーチがある場合
      return reach_judge(field, 2)[0];
    }else if (reach_judge(field, 1)[0] !== null){ //相手にリーチがある場合
      return reach_judge(field, 1)[0];
    }else{
      if (a !== null && a() !== null){ //ハードで、有効な手がある場合
        return a();
      }else{
        return random();
      }
    }
  }
  function hard_selecting(){
    if (start_player){ //aiが後攻の場合
      if (field[4] === 0 && count == 1){ //相手が真ん中を取っていない場合
        return 4;
      }else if(field[4] === 1 && count == 1){ //相手が真ん中を取った場合
        return 0;
      }else if (count == 3 && (field[0] === 1 && field[8] === 1) || (field[2] === 1 && field[6] === 1)){ //二回目のaiの番につみ回避(はさみうち)
        return 1;
      }else if (count == 3 && field.toString() == [2, 0, 0, 0, 1, 0, 0, 0, 1].toString()){ //相手がダブルリーチを作っている場合(矢印攻撃)
        return 2;
      }else if (count === 3){ //相手がダブルリーチを作っている場合(互い違い)の対策
        if (field[0] === 1){
          return 8;
        }else if (field[2] === 1){
          return 6;
        }else if (field[6] === 1){
          return 2;
        }else if (field[8] === 1){
          console.log("8")
          return 0;
        }
      }
    }else{ //aiが先攻の場合
      if (count == 0){ //初手
        return 6;
      }else if (count == 2){ //二手目
        if (field[4] === 1){ //相手が真ん中を取った場合
          return 2;
        }else if (field[0] === 1 || field[8] === 1){ //相手が隣角を取った場合(左上、右下)
          return 2;
        }else if (field[2] === 1){ //相手が対角を取った場合(右上)
          return 8;
        }else{
          return 4;
        }
      }else if (count == 4){
        if (field[3] === 1){ //相手が隣エッジを取った場合(左)
          return 8;
        }else if (field[7] === 1){ //相手が隣エッジを取った場合(下)
          return 0;
        }else if (field[2] === 1){ //相手が対角を取った場合(右上)
          return 0;
        }
      }
    }
    console.log(count)
    return null
  }
  if (!difficulty_level){ //難易度が簡単な場合
    return normal_selecting();
  }else{ //難易度が難しい場合
    return normal_selecting(hard_selecting);
  }
}