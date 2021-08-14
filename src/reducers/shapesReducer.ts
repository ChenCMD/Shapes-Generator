import React from 'react';
import { Shape } from '../ShapeNodes';
import { RawParam, TargetParameter } from '../types/Parameter';
import { Point } from '../types/Point';
import { UUID } from '../types/UUID';
import { mod } from '../utils/math';

interface AddAction {
    type: 'add'
    shape: Shape
}

interface AddManyAction {
    type: 'addMany'
    shapes: Shape[]
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

interface DuplicateAction {
    type: 'duplicate'
    index: number
}

interface UpdateParamAction {
    type: 'update'
    index: number
    arg: string
    newParam: RawParam['value']
}

interface DeleteAction {
    type: 'delete'
}

type Action = AddAction | AddManyAction | SelectAction | MoveAction | RenameAction | DuplicateAction | UpdateParamAction | DeleteAction;

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
            case 'addMany': {
                onChange();
                return [[...shapes, ...action.shapes], selectLog];
            }
            case 'select': {
                // if (action.isRetentionOld) {
                //     shapes[action.index].isSelected = !shapes[action.index].isSelected;
                //     return [
                //         [...shapes],
                //         shapes[action.index].isSelected
                //             ? [...selectLog, action.index]
                //             : selectLog.filter(v => v !== action.index)
                //     ];
                // }
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
            case 'duplicate': {
                onChange();
                const newShapes = shapes.map(v => selectionChanger(v, false));
                newShapes.splice(action.index + 1, 0, selectionChanger(shapes[action.index].clone(), true));
                return [newShapes, [action.index + 1]];
            }
            case 'update': {
                onChange();
                const manipulateCallback = (points: Point[], from: UUID, prev: TargetParameter['value'] | undefined, next: TargetParameter['value'] | undefined) => {
                    prev && shapes.find(v => v.uuid === prev.target)?.disManipulate(prev.arg, manipulateCallback);
                    next && shapes.find(v => v.uuid === next.target)?.setParameter(next.arg, {
                        manipulate: true,
                        from: from,
                        value: points,
                        old: undefined
                    }, manipulateCallback);
                };
                shapes[action.index].setParameter(action.arg, action.newParam, manipulateCallback);
                return [[...shapes], selectLog];
            }
            case 'delete': {
                onChange();
                const manipulateCallback = (points: Point[], from: UUID, prev: TargetParameter['value'] | undefined, next: TargetParameter['value'] | undefined) => {
                    prev && shapes.find(v => v.uuid === prev.target)?.disManipulate(prev.arg, manipulateCallback);
                    next && shapes.find(v => v.uuid === next.target)?.setParameter(next.arg, {
                        manipulate: true,
                        from: from,
                        value: points,
                        old: undefined
                    }, manipulateCallback);
                };
                shapes.find(shape => shape.isSelected)
                    ?.destroy(t => shapes.find(v => v.uuid === t.target)?.disManipulate(t.arg, manipulateCallback));
                return [shapes.filter(shape => !shape.isSelected), []];
            }
        }
    };

export type ShapesDispatch = React.Dispatch<Action>;

export default createReducer;