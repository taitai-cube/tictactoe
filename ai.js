export function ai(field, difficulty_level = false) {
  function random() {
    let availableIndices = []; // 空いているインデックスを格納する配列
    for (let i = 0; i < field.length; i++) { // 空いているインデックスをavailableIndicesに格納
      if (field[i] === 0) {
        availableIndices.push(i);
      }
    }
    if (availableIndices.length === 0) return null; // 全ての値が0の場合、nullを返す
    const randomIndex = Math.floor(Math.random() * availableIndices.length +1);
    console.log(availableIndices)
    return randomIndex;
    
  }
  return random();
}