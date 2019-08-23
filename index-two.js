/**
 * 生成5个随机大写字母
 */
const getName = (count) => {
    var result = [];
    for (var i = 0; i < count; i++) {
        var numRan = Math.ceil(Math.random() * 25) + 65;
        result.push(numRan);
    }
    // 将打散数组的 Unicode 转换为字母
    return String.fromCharCode(...result);
}
/**
 * 根据传入参数num，生成 num=>x>=0的数字x
 */
const getParentid = (num) => {
    return num ? Math.floor(Math.random() * num) : null;
}

/**
 * 生成扁平数组
 */
const genData = (count) => {
    var result = [];
    for (var i = 0; i < count; i++) {
        result.push({
            id: i,
            name: getName(5),
            parentId: getParentid(i)
        });
    }
    return result;
}

/**
 * 生成树形结构
 */
// 方法一
const genTreeOne = (data) => {
    let cache = {};
    for (let i = 0; i < data.length; i++) {
        let item = data[i];
        cache[item.id] = data[i];
    }
    let tree = [];
    for (let i = 0; i < data.length; i++) {
        let itm = data[i];
        if (itm.parentId === null) {
            tree.push(cache[itm.id]);
        } else {
            let parent = cache[itm.parentId];
            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(cache[itm.id]);
        }
    }
    return tree;
}

// genTree(genData(10));

// 方法二  只适合 id 升序 且 parentId 小于id
const genTreeTwo = (data) => {
    let cache = {};
    data.forEach((item) => {
        cache[item.id] = item;
        let parent = cache[item.parentId];
        if (item.parentId !== null && parent) {
            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(cache[item.id]);
        }
    });
    console.log(JSON.stringify([cache['0']]));

    return [cache['0']];
}

// genTreeTwo(genData(10));

// 方法三  利用数组的引用属性
const genTree = (data) => {
    data.forEach((item) => {
        if (item.parentId !== null) {
            // 找到满足条件的下标
            let Index = data.findIndex((target) => target.id === item.parentId);
            let children = data[Index].children;
            if (!children) {
                data[Index].children = [];
            }
            data[Index].children.push(item);
        }
    });
    let tree = data.find((tagert) => tagert.parentId === null)
    return [tree]
}
// console.log(genTree(genData(10)));

// 方法四  利用递归属性
const genFour = (data) => {
    let parent = data.filter((item) => item.parentId === null);
    let children = data.filter((item) => item.parentId !== null);
    let translate = (parent, children) => {
        parent.forEach((pas) => {
            children.forEach((chs, index) => {
                if (pas.id === chs.parentId) {
                    if (!pas.children) {
                        pas.children = [];
                    }
                    // let temp = JSON.parse(JSON.stringify(children));
                    // temp.splice(index, 1);
                    // translate([chs], temp);
                    translate([chs], children);
                    pas.children.push(chs);
                }
            })
        })
    }
    translate(parent, children);
    return parent;
}

let arrs = genFour(genData(10));
/**
 * 将树形结构转换为扁平数组
 */
// 方法一 递归
let barr = [];
const treeList = (arrs) => {
    let copyArr = [].concat(arrs);
    copyArr.forEach((item) => {
        if (item.children && item.children.length) {
            treeList(item.children);
            delete item['children'];
        }
        barr.push(item);
    });
};
// treeList(arrs);

// 方法二 根据循环
const treeListTwo = (arrs) => {
    let queen = [];
    let out = [];
    queen = queen.concat(arrs);
    while (queen.length) {
        let first = queen.shift();
        if (first.children && first.children.length) {
            queen = queen.concat(first.children);
            delete  first['children']
        }
        out.push(first);
    }
    return out;
}
// console.log(treeListTwo(arrs));


/**
 * 将树形结构有序的打印出来
 */
const drawLite = (data) => {
    let tree = genFour(data);
    drawItem(tree);
}
const drawItem = (data, deep = 0) => {
    let space = Array(deep).fill(' ').join('');
    data.forEach((item) => {
        console.log(space + item.name);
        if (item.children) {
            drawItem(item.children, deep + 1);
        }
    })
}
// console.log(drawLite(genData(15)));


/**
 * 将树形结构有序带标识符的打印出来
 */
const drawIdentifier = (data) => {
    let tree = genFour(data);
    console.log(JSON.stringify(tree));
    drawIftem(tree);
}
const drawIftem = (data, deep = 0, omit = []) => {
    for (let i = 0; i < data.length; i++) {
        let space = [];
        let endSymbol = i + 1 === data.length ? ' └' : ' ├';
        if (deep > 1) {
            space = Array(deep - 1).fill(' │');
        }
        omit.forEach((target) => {
            if (space[target - 1]) {
                space[target - 1] = ' ┊';
            }
        });
        space = space.join('');
        if (deep !== 0) {
            space += endSymbol;
        }
        console.log(`${space}${data[i].name}`);
        if (data[i].children) {
            if (deep !== 0 && i + 1 === data.length) {
                omit = omit.filter((target) => {
                    return target < deep;
                });
                omit.push(deep);
            }
            drawIftem(data[i].children, deep + 1, omit);
        }
    }
}

drawIdentifier(genData(15));
