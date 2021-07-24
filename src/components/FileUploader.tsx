import React, { useCallback, useRef } from 'react';

interface FileUploaderProps {
    accept: string
    onFileUpload: (files: FileList) => void
    children: (openUploader: () => void) => JSX.Element
}

const FileUploader = ({ accept, onFileUpload, children }: FileUploaderProps): JSX.Element => {
    const inputRef = useRef<HTMLInputElement>(null);

    const onChangeFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => e.target.files && onFileUpload(e.target.files), [onFileUpload]);

    const openUploader = useCallback(() => inputRef.current?.click(), []);

    return (
        <>
            <input hidden type="file" ref={inputRef} accept={accept} onChange={onChangeFile} />
            {children(openUploader)}
        </>
    );
};

export default React.memo(FileUploader);
