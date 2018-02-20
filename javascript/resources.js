import * as d3 from 'd3';
import leaves from '../resources/word_groups.csv';
import trunk from '../resources/noun_441084_cc.svg';
import leaf from '../resources/bitcoin-coin.svg';

export function loadTreeTrunk() {
    return trunk;
}

export function loadLeaf() {
    return leaf;
}

export function loadLeavesConfiguration() {
    const colNames = "text,size,group\n" + leaves;
    const data = d3.csvParse(colNames);
    return data;
}