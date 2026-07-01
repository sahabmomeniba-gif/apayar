import { multipleExist } from "./MultiParamsArrayCheck"

export const saLabelDetector = (text) => {
    let splitArr = []
    let payload = {}
    let index;
    index = text.indexOf('A')
    if (index != -1) splitArr.push({ labelIndex: 'A', strIndex: index })
    else {
        return payload
    }
    index = text.indexOf('G')
    if (index != -1) splitArr.push({ labelIndex: 'G', strIndex: index })
    index = text.indexOf('F')
    if (index != -1) splitArr.push({ labelIndex: 'F', strIndex: index })
    index = text.indexOf('P')
    if (index != -1) splitArr.push({ labelIndex: 'P', strIndex: index })
    index = text.indexOf('S')
    if (index != -1) splitArr.push({ labelIndex: 'S', strIndex: index })
    index = text.indexOf('V')
    if (index != -1) splitArr.push({ labelIndex: 'V', strIndex: index })
    index = text.indexOf('K')
    if (index != -1) splitArr.push({ labelIndex: 'K', strIndex: index })
    index = text.indexOf('Q')
    if (index != -1) splitArr.push({ labelIndex: 'Q', strIndex: index })
    index = text.indexOf('M')
    if (index != -1) splitArr.push({ labelIndex: 'M', strIndex: index })
    index = text.indexOf('H')
    if (index != -1) splitArr.push({ labelIndex: 'H', strIndex: index })
        // let spliter;
        // if (!multipleExist(text, ['A'])) payload.string = text
        // else {
        //     let A_spliter = text.split('A')
        //     if (multipleExist(text, ['G'])) {
        //         payload.A = A_spliter[1].split['G'][0]
        //         spliter = A_spliter[1].split['G'][1]
        //     }
        //     if (!payload.A)
        // }
    for (let index = 0; index < splitArr.length - 1; index++) {
        payload[splitArr[index].labelIndex] = text.substring(
            splitArr[index].strIndex + 1,
            splitArr[index + 1].strIndex
        );
    }
    payload[splitArr[splitArr.length - 1].labelIndex] = text.substring(
        splitArr[splitArr.length - 1].strIndex + 1,
        splitArr[text.length - 1]
    );

    return payload
}