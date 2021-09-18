import BLOCKS from "./blocks.js"
import testComponet from "./com.js"

//DOM
const playground = document.querySelector('.playground > ul');
const scoreView = document.querySelector('.score');
const gameOver= document.querySelector('.game-over');
const reloadBtn= document.querySelector('.game-over > button');

let score =0;
let duration = 500;
let downInterval;
let tempMovingItem;

const movingItem ={
    type:"",
    direction:0,
    top:0,
    left:0
}
init();

function init(){

    let testcom = testComponet();
    testcom.addText('test ');
    
    score=0;
    tempMovingItem = { ...movingItem } //spread문번 movingItem의 값만 복사한다. movingItem의 값은 그대로 존재함
    for(let i =0; i< 20; i++){ 
        prependNewLine();
    } 
    generateNewBlock();
}

function prependNewLine(){
    let li = document.createElement('li'); //css display flex로 가로로 축 변경함 
    let ul = document.createElement('ul'); 
    for(let j =0; j<10; j++){
        let matrix = document.createElement('li');
        ul.prepend(matrix);
    }
    li.prepend(ul);
    playground.prepend(li);
}

function renderBlocks(moveType=""){
    // 블럭 object에서 지정된 영역의 좌표를 받아와서, view playgroud ul li ul li에 색을 칠한다. (add class)
    let {type, direction, top, left} = tempMovingItem;
    scoreView.innerHTML = score;
    //이미 moving이라는 클래스가 있는 블럭은 움직인 블럭의 과거 잔상이므로, 모두 찾아서 색깔을 빼준다. 
    let movingBlocks = document.querySelectorAll(".moving"); 
    movingBlocks.forEach((block)=>{
        block.classList.remove(type, "moving");
    })

    BLOCKS[type][direction].some(block => {/// forEach 에서 some으로 변경 return을 시키기 위해서 
        const x = block[0] + left;
        const y = block[1] + top;
        const target= playground.childNodes[y]? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        let isAvailable = checkEmpty(target);
        
        if( isAvailable ){ // 테트리스 그라운드를 벗어나는 경우가 아닐 경우 ! 
            target.classList.add(type, "moving");
        }else{
            if(moveType === 'retry'){
                clearInterval(downInterval);
                gameOver.style.display="flex";//game over show text 
            } 
            tempMovingItem ={ ...movingItem }; // 테트리스 그라운드를 벗어나는 경우라면 원래 값으로 변경
            setTimeout(()=>{//event loop가 끝난 뒤 호출 되도록, 재귀로 콜하는 거라 maximum stack error가 발생하기 떄문에 
                renderBlocks('retry');
                if(moveType === 'top'){
                    seizeBlock();
                }
            }, 0);
            return true;
        } 
    });
    /// 옮겨진 상태를 저장
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction; 
}  
function seizeBlock(){
    let movingBlocks = document.querySelectorAll(".moving"); 
    movingBlocks.forEach((block)=>{
        block.classList.remove("moving");
        block.classList.add("seized");
    })
    checkLine();
    generateNewBlock();
}
function generateNewBlock(){

    clearInterval(downInterval);
    downInterval = setInterval(()=>{
        moveBlock('top', 1);
    }, duration)
    let arrayBlock =  Object.entries(BLOCKS);// object to array
    let randomIndex = Math.floor(Math.random()*arrayBlock.length);

    movingItem.type= arrayBlock[randomIndex][0]; 
    movingItem.left = 0;
    movingItem.top = 0;
    movingItem.direction = 0; 
    tempMovingItem ={...movingItem}
    renderBlocks();

}
function checkEmpty(target){
    if(!target || target.classList.contains( "seized")){
        return false; 
    }
    return true;
}
function checkLine(){
    const childNodes= playground.childNodes; //[y]? playground.childNodes[y].childNodes[0].childNodes[x] : null;
    childNodes.forEach((y)=>{
        let match = true;
        y.childNodes[0].childNodes.forEach((li)=>{ //x 는 x 축 1줄
            if(!li.classList.contains("seized")){
                match = false;
            }
        })
        if(match){
            y.remove();
            score++;
            prependNewLine();
        } 
    })
    
}

function moveBlock(moveType, value){
    tempMovingItem[moveType] += value;
    renderBlocks(moveType);
}
function changeDirection(){
    let currentDirection = tempMovingItem['direction'];
    tempMovingItem['direction'] = currentDirection === 3 ? 0 : currentDirection += 1;
    renderBlocks();
}   
function fastSpeed(){
    clearInterval(downInterval);  
    downInterval = setInterval(()=>{
        moveBlock('top', 1);
    }, 10)
} 

reloadBtn.addEventListener("click",(e)=>{
    playground.innerHTML ="";
    gameOver.style.display ="none";
    init();
})
document.addEventListener("keydown",e=>{ 
    switch(e.keyCode){
        case 37:
            moveBlock('left', -1);
            break;
        case 38:
            changeDirection();
            break;
        case 39:
            moveBlock('left', 1);
            break;
        case 40:
            moveBlock('top', 1);
            break;
        case 32: //space
            fastSpeed();
            break;
        default :
            break;
    }
})