import React from 'react';
import { Shape } from '../ShapeNodes';
import { mod } from '../utils/common';

interface AddAction {
    type: 'add'
    shape: Shape
}

interface SelectAction {
    type: 'select'
    index: number
    isRetentionOld: boolean
}

interface MoveAction {
    type: 'move'
    index: number
    to: -1 | 1
}

interface RenameAction {
    type: 'rename'
    index: number
    newName: string
}

interface UpdateParamAction {
    type: 'update'
    index: number
    arg: string
    newParam: string
}

interface DeleteAction {
    type: 'delete'
}

type Action = AddAction | SelectAction | MoveAction | RenameAction | UpdateParamAction | DeleteAction;

const selectionChanger = (target: Shape, selected: boolean) => {
    target.isSelected = selected;
    return target;
};

const createReducer: ((onChange: () => void) => React.Reducer<[shapes: Shape[], selectionLog: number[]], Action>) = onChange =>
    ([shapes, selectLog], action) => {
        switch (action.type) {
            case 'add': {
                onChange();
                return [[...shapes.map(shape => selectionChanger(shape, false)), selectionChanger(action.shape, true)], [shapes.length]];
            }
            case 'select': {
                if (action.isRetentionOld) {
                    shapes[action.index].isSelected = !shapes[action.index].isSelected;
                    return [
                        [...shapes],
                        shapes[action.index].isSelected
                            ? [...selectLog, action.index]
                            : selectLog.filter(v => v !== action.index)
                    ];
                }
                return [shapes.map((shape, i) => selectionChanger(shape, action.index === i)), [action.index]];
            }
            case 'move': {
                const shapeIdx = mod(action.index + action.to, shapes.length);
                return [shapes.map((shape, i) => selectionChanger(shape, shapeIdx === i)), [shapeIdx]];
            }
            case 'rename': {
                onChange();
                shapes[action.index].name = action.newName;
                return [[...shapes], selectLog];
            }
            case 'update': {
                onChange();
                shapes[action.index].setParameter(action.arg, action.newParam);
                return [[...shapes], selectLog];
            }
            case 'delete': {
                onChange();
                return [shapes.filter(shape => !shape.isSelected), []];
            }
        }
    };

export type ShapesDispatch = React.Dispatch<Action>;

export default createReducer;