
function testComponet(){
    
    function addText(val){
        val+= val;
        //console.log(" dd" +val)
    }

    return {
        addText:addText
    }
}

export default testComponet