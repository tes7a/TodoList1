import React, { ChangeEvent, useState, KeyboardEvent } from 'react';
import TextField from '@mui/material/TextField';

type EditableSpanPropsType = {
    value: string
    onChange: (newValue: string) => void
    disabled: boolean
}

export const EditableSpan = React.memo(function (props: EditableSpanPropsType) {
    console.log('EditableSpan called');
    let [editMode, setEditMode] = useState(false);
    let [title, setTitle] = useState(props.value);

    const activateEditMode = () => {
        setEditMode(true);
        setTitle(props.value);
    }

    const activateViewMode = () => {
        setEditMode(false);
        props.onChange(title);
    }
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const activateTitleButton = (e: KeyboardEvent<HTMLDivElement>) => {
        if(e.key === "Enter" || e.key === "Escape"){
            setEditMode(false)
            props.onChange(title);
        }
    }

    return editMode
        ? <TextField value={title} onChange={changeTitle} autoFocus onBlur={activateViewMode} onKeyPress={activateTitleButton} disabled={props.disabled}/>
        : <span onDoubleClick={activateEditMode}>{props.value}</span>
});
