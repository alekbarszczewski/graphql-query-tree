
import selectn from 'selectn';
import buildQueryTree from './build-query-tree';

export default class GraphqlQueryTree {

  constructor (info, keepRoot = false) {
    this._tree = buildQueryTree(info, keepRoot);
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
    return tree ? Object.keys(tree).filter(key => (key !== '$args')) : null;
  }

};
