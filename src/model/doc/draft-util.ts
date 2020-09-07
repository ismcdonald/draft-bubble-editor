import { ContentState, ContentBlock } from 'draft-js';
type int = number

export function showContent(content:ContentState) {
    var out = []
    var items:Array<ContentBlock> = content.getBlocksAsArray()
    for (var i:int = 0; i < items.length; i++ ) {
        var block:ContentBlock = items[i];
        var key = block.getKey()
        var txt = block.getText()
        var type = block.getType();
        var txt = ("   "  + i + 'key:' + key + ' type: ' + type + '   =\'' + txt + "'" )
        out.push(txt)
        console.log(txt)
    }

    console.log(' -------------- ')
    return out.join('\n')
}