module.exports = function (source, map) {
    let content = handle(source)
    content = content.replace(/[\r\n]/g, "");
    // content = content.replace(/`/g, "+");
    content = content.replace(/"/g, '\\"');

    this.callback(null, `
       export default{
           html:"${content}" 
       }`, map)
}

function handle(markdown) {

    markdown = handleHTag(markdown);

    markdown = handleStrongTag(markdown)

    markdown = handleCodeBlockTag(markdown);
    markdown = handleCodeTag(markdown);
    markdown = handleDelTag(markdown);

    markdown = handleBlockquoteTag(markdown);

    markdown = handleListTag(markdown);
    markdown = handleImageTag(markdown);

    markdown = handleURLTag(markdown);

    //  最后处理
    markdown = markdown.replace(/《《--/g, "<").replace(/--》》/g, ">");
    return markdown;
}


//  标题
function handleHTag(markdown) {
    var arr = markdown.match(/(\n)(\s{0,3})(#{1,6}) (.*)|^(\s{0,3})(#{1,6}) (.*)/g);
    if (arr != null) {
        arr.forEach((element) => {
            let count = element.replace(/(\n)(\s{0,3})(#{1,6}) (.*)/i, "$3").split('#').length - 1;

            let newStr = element.replace(/(#{1,6}) (.*)/i, " \n 《《--h" + count + "--》》$2《《--/h" + count + "--》》 \n ");
            markdown = markdown.replace(element, newStr);
        });
    }
    return markdown;
}

//  加粗
function handleStrongTag(markdown) {
    var arr = markdown.match(/(\n{1,2})(\s{0,3})(\*\*)(.*)(\n{0,1})(.*)\*\*|^(\s{0,3})(\*\*)(.*)(\n{0,1})(.*)\*\*/g);
    if (arr != null) {
        arr.forEach((element) => {

            let newStr = element.replace(/(\n{1,2})(\s{0,3})(\*\*)(.*)(\n{0,1})(.*)\*\*|^(\s{0,3})(\*\*)(.*)(\n{0,1})(.*)\*\*/i, "《《--p--》》《《--strong--》》$4 $6《《--/strong--》》《《--/p--》》");

            markdown = markdown.replace(element, newStr);
        });
    }
    return markdown;
}

//  代码块
function handleCodeBlockTag(markdown) {
    var arr = markdown.match(/(\n{1,2})```(\n)([\s\S]*?)(\n)```|^(\s{0})```(\n)([\s\S]*?)(\n)```/g);
    if (arr != null) {
        arr.forEach((element) => {

            let newStr = element.replace(/(\n{1,2})```(\n)([\s\S]*?)(\n)```|^(\s{0})```(\n)([\s\S]*?)(\n)```/i, " \n 《《--div class=\"code\"--》》《《--pre--》》《《--code--》》$3《《--/code--》》《《--/pre--》》《《--/div--》》 \n ");

            markdown = markdown.replace(element, newStr);
        });
    }
    return markdown;
}

//  代码
function handleCodeTag(markdown) {
    var arr = markdown.match(/`([\s\S]*?)`/g);
    if (arr != null) {
        arr.forEach((element) => {
            if (element.length == 2) {
                return;
            }
            //  第二次验证
            if (/(\n\s)/.test(element)) {
                return;
            }


            let newStr = element.replace(/`([\s\S]*?)`/i, "《《--code--》》$1《《--/code--》》");
            markdown = markdown.replace(element, newStr);
        });
    }
    return markdown;
}

//  删除线
function handleDelTag(markdown) {
    var arr = markdown.match(/(\n{1,2})~~([\s\S]*?)~~|(\S{1,2})~~([\s\S]*?)~~|(\S{1,2})(\s{0,3})~~([\s\S]*?)~~|(\n{1,2})(\s{0,3})~~([\s\S]*?)~~|^(\s{0,3})~~([\s\S]*?)~~/g);

    if (arr != null) {
        arr.forEach((element) => {
            if (element.length == 4) {
                return;
            }
            //  第二次验证
            if (/(\n\s*\n)/.test(element)) {
                return;
            }


            let newStr = element.replace(/~~([\s\S]*?)~~/i, "《《--del--》》$1《《--/del--》》");
            markdown = markdown.replace(element, newStr);
        });
    }
    return markdown;
}



//  引用
function handleBlockquoteTag(markdown) {
    var arr = markdown.match(/\n(\s{0,3})>([\s\S]*?)\n{1,2}>|\n(\s{0,3})>([\s\S]*?)\n{1,2}(\s*)>|^(\s{0,3})>([\s\S]*?)\n{1,2}(\s*)>/g);
    //  第一次处理

    if (arr != null) {
        arr.forEach((element) => {
            //  去掉匹配所需要的 >
            element = element.replace(/\n>/i, "");
            //   console.log(element)
            let newStr = element.replace(/>([\s\S]*)/i, " \n 《《--blockquote--》》$1《《--/blockquote--》》 \n ");
            // console.log(newStr)
            markdown = markdown.replace(element, newStr);
        });
    }

    //  第二次处理
    arr = markdown.match(/\n(\s*)>([\s\S]*?)\n{2}|^(\s*)>([\s\S]*?)\n{2}|\n(\s*)>([\s\S]*?)$/g);
    if (arr != null) {
        arr.forEach((element) => {
            // console.log(element);

            let newStr = element.replace(/>([\s\S]*)/i, " \n 《《--blockquote--》》$1《《--/blockquote--》》 \n ");
            // console.log(newStr);
            markdown = markdown.replace(element, newStr);
        });
    }

    //  第三次处理
    arr = markdown.match(/\n(\s*)>(.*)|^(\s*)>(.*)/g);
    if (arr != null) {
        arr.forEach((element) => {
            // console.log(element);

            let newStr = element.replace(/>([\s\S]*)/i, " \n 《《--blockquote--》》$1《《--/blockquote--》》 \n ");
            // console.log(newStr);
            markdown = markdown.replace(element, newStr);
        });
    }

    return markdown;
}


//  列表
function handleListTag(markdown) {
    var arr = markdown.match(/\n\s{0,3}- ([\s\S]*)《《--(.{1,})--》》|^\s{0,3}- ([\s\S]*)《《--(.{1,})--》》/g);

    //  第一次处理
    if (arr != null) {
        arr.forEach((element) => {
            var itemStr = '';
            //  取出每一行
            var lineArr = element.match(/\n\s{0,3}- (.*)/g);
            if (lineArr != null) {
                lineArr.forEach((line) => {
                    let newLineStr = line.replace(/\n\s{0,3}- (.*)/i, "《《--li--》》$1《《--/li--》》");
                    itemStr += newLineStr;
                });
            }
            if (itemStr.length > 0) {
                //  替换整块
                // console.log(element);
                element = element.replace(/(《《[\s\S]*)/i, "");
                let newStr = " \n 《《--ul--》》" + itemStr + "《《--/ul--》》 \n ";
                // console.log(newStr)
                markdown = markdown.replace(element, newStr);
            }

            // let newStr = element.replace(/~~([\s\S]*?)~~/i, "《《--del--》》$1《《--/del--》》");
            // markdown = markdown.replace(element, newStr);
        });
    }

    //  第二次处理
    arr = markdown.match(/\n\s{0,3}- ([\s\S]*?)\n{2}|^\s{0,3}- ([\s\S]*?)\n{2}/g);

    //  第一次处理
    if (arr != null) {
        arr.forEach((element) => {
            //  取出每一行
            var itemStr = '';

            var lineArr = element.match(/\n\s{0,3}- (.*)/g);
            if (lineArr != null) {
                lineArr.forEach((line) => {
                    let newLineStr = line.replace(/\n\s{0,3}- (.*)/i, "《《--li--》》$1《《--/li--》》");
                    itemStr += newLineStr;
                });
            }
            if (itemStr.length > 0) {
                //  替换整块
                // console.log(element);
                let newStr = " \n 《《--ul--》》" + itemStr + "《《--/ul--》》 \n ";
                // console.log(newStr)
                markdown = markdown.replace(element, newStr);
            }
        });

    }
    return markdown;
}

//  图像
function handleImageTag(markdown) {
    markdown = markdown.replace(/!\[(.*?)\]\((https|http):\/\/(.*?)\)/g, "《《--img alt=\"$1\" src=\"$2://$3\" /--》》");

    // console.log(markdown)
    return markdown;
}

//  链接
function handleURLTag(markdown) {
    markdown = markdown.replace(/\[(.*?)\]\((https|http):\/\/(.*?)\)/g, "《《--a href=\"$2://$3\"--》》$1《《--/a--》》");

    // console.log(markdown)
    return markdown;
}

