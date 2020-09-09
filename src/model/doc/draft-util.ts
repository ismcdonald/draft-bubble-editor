import { ContentState, ContentBlock } from 'draft-js';
type int = number

export function showContent(content:ContentState) {
    var out:any = []
    var items:any = content.getBlockMap()
    
    
    
    
    
    var i = 0;
    items.forEach((block:ContentBlock, k:string) => {

        var key = block.getKey()
        var txt = block.getText()
        var type = block.getType();
        var txt = (i + '-key: ' + key + ' type: ' + type + '   =\'' + txt + "'" )
        out.push(txt)
        console.log(txt)
        i++
    })

    console.log(' -------------- ')
    return out.join('\n')
}