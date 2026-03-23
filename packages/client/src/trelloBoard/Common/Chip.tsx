import React from 'react';
import { X } from 'react-feather';
import { ILabel } from '../Interfaces/Kanban';
interface ChipProps {
    item;
    removeLabel?: (label: ILabel) => void;
}
export default function Chip(props: ChipProps) {
    const { item, removeLabel } = props;

    let backgroundColor;
    if (item === 'High') {
        backgroundColor = '#F44336';
    } else if (item === 'Low') {
        backgroundColor = '#8BC34A';
    } else {
        backgroundColor = '#FFC107';
    }

    return <label className='text-base' style={{ backgroundColor, color: '#fff', }}>{item}</label>;
}
