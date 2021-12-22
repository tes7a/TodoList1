import React, {ChangeEvent, KeyboardEvent, useState} from "react";

export type inputType = {
    callBack: (todolistID: string, title: string) => void;
    todolistID: string;
    title: string
    setTitle: (title: string) => void
}

export const SingleInput = ({title, setTitle, todolistID, callBack}: inputType) => {
    let [error, setError] = useState<string | null>(null);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    };

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null);
        if (e.charCode === 13) {
            callBack(todolistID, title);
        }
    };


    return (
        <div>
            <input value={title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   className={error ? "error" : ""}
            />

        </div>
    )
};