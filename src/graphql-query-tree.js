
import selectn from 'selectn';
import buildQueryTree, { getType } from './build-query-tree';

export default class GraphqlQueryTree {

  constructor (info, keepRoot = false) {
    this._tree = buildQueryTree(info, keepRoot);
    this._parentType = getType(info.parentType).name;
    this._returnType = getType(info.returnType).name;
    this._parentField = info.fieldName;
  }

  isSelected (path) {
    return !!this.getArguments(path);
  }

  getArguments (path) {
    const tree = path ? selectn(path, this._tree) : this._tree;
    return tree && tree['$args'] ? tree['$args'] : null;
  }

  getChildFields (path) {
    const tree = path ? selectn(path, this._tree) : this._tree;
    return tree ? Object.keys(tree).filter(key => (key[0] !== '$')) : null;
  }

  getType (path) {
    const tree = path ? selectn(path, this._tree) : this._tree;
    return tree && tree['$type'] ? tree['$type'] : null;
  }

  getParentType () {
    return this._parentType;
  }

  getReturnType () {
    return this._returnType;
  }

  getParentField () {
    return this._parentField;
  }

};
