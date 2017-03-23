
import { getNullableType } from 'graphql';
import { getArgumentValues } from 'graphql/execution/values';

export default function buildQueryTree (info, keepRoot = false) {
  let tree = buildTree(info.fieldNodes, info.parentType, info);
  if (!keepRoot) {
    tree = tree[info.fieldName];
  }
  return tree;
}

const buildTree = function (selections, parentType, info, tree = {}) {
  parentType = getType(parentType);
  const fields = selectionsToFields(selections, info);
  fields.forEach(field => {
    const name = field.name.value;
    tree[name] = {};
    const fieldDef = parentType._fields[name]
    tree[name]['$args'] = getArgumentValues(fieldDef, field, info.variableValues);
    if (field.selectionSet) {
      buildTree(field.selectionSet.selections, fieldDef.type, info, tree[name]);
    }
  });
  return tree;
};

export function getType (type) {
  type = getNullableType(type);
  if (type.ofType) {
    type = getType(type.ofType);
  }
  return type;
};

const selectionsToFields = function (selections, info) {
  const fields = [];
  selections.forEach(sel => {
    if (sel.kind === 'Field') {
      fields.push(sel);
    } else if (sel.kind === 'FragmentSpread') {
      const fragment = info.fragments[sel.name.value];
      fields.push.apply(fields, selectionsToFields(fragment.selectionSet.selections));
    } else if (sel.kind === 'InlineFragment') {
      fields.push.apply(fields, selectionsToFields(sel.selectionSet.selections));
    }
  });
  return fields;
};
