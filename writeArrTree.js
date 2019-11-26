/* 生成展平树结构 */

const genName = (count) => {
    const result = [];
    for (var i = 0; i < count; i++) {
        var ranNum = Math.ceil(Math.random() * 25); //生成一个0到25的数字
        //大写字母'A'的ASCII是65,A~Z的ASCII码就是65 + 0~25;然后调用String.fromCharCode()传入ASCII值返回相应的字符并push进数组里
        result.push(String.fromCharCode(65 + ranNum));
    }
    return result.join('');
};


const genParent = (number) => {
    if (number === 0) {
        return null;
    }
    const ranNum = Math.floor(Math.random() * number);
    return ranNum;
};

const genData = (count) => {
    const ret = [];
    for (let i = 0; i < count; i++) {
        ret.push({
            id: i,
            name: genName(5),
            parent: genParent(i),
        });
    }
    return ret;
};

const arr = genData(10);


/* 生成树形结构 */
const genTree = (data) => {
    data.forEach((item) => {
        if (item.parent !== null) {
            const index = data.findIndex(target => target.id === item.parent);
            let children = data[index].children;

            // if (!children) {
            //     children = [];
            //     data[index].children = children;

            // }
            // children.push(item);
            children ? children.push(item) : data[index].children = [item];
        }
    });

    const root = data.find(item => !item.parent);
    const tree = [root];
    return tree;
};

const drawItem = (tree, deepLevel = 0) => {
    const len = tree.length;
    for (let i = 0; i < len; i++) {
        const name = tree[i].name;
        const beforeFix = Array(deepLevel).fill('  ').join('');
        console.log(`${beforeFix}${name}`);

        if (tree[i].children && tree[i].children.length) {
            drawItem(tree[i].children, deepLevel + 1);
        }
    }
};

const drawLite = (data) => {
    const tree = genTree(data);

    drawItem(tree);
};

const tree = drawLite(arr);
