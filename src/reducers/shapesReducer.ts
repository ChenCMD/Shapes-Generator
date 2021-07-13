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

const shapesReducer: React.Reducer<Shape[], Action> = (shapes, action) => {
    switch (action.type) {
        case 'add': {
            return [...shapes.map(shape => selectionChanger(shape, false)), selectionChanger(action.shape, true)];
        }
        case 'select': {
            if (action.isRetentionOld) {
                shapes[action.index].isSelected = !shapes[action.index].isSelected;
                return [...shapes];
            }
            if (shapes[action.index].isSelected) return shapes;
            return shapes.map((shape, i) => selectionChanger(shape, action.index === i));
        }
        case 'move': {
            const shapeIdx = mod(action.index + action.to, shapes.length);
            return shapes.map((shape, i) => selectionChanger(shape, shapeIdx === i));
        }
        case 'rename': {
            shapes[action.index].name = action.newName;
            return [...shapes];
        }
        case 'update': {
            shapes[action.index].setParameter(action.arg, action.newParam);
            return [...shapes];
        }
        case 'delete': {
            return shapes.filter(shape => !shape.isSelected);
        }
    }
};

export type ShapesDispatch = React.Dispatch<Action>;

export default shapesReducer;