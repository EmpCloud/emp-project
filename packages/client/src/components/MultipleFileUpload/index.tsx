import React from 'react';
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import { getDroppedOrSelectedFiles } from 'html5-file-selector';
const FileUploadComponent = () => {
    const fileParams = ({ meta }) => {
        return { url: 'https://httpbin.org/post' };
    };
    const onFileChange = ({ meta, file }, status) => {};
    const onSubmit = (files, allFiles) => {
        allFiles.forEach(f => f.remove());
    };
    const getFilesFromEvent = e => {
        return new Promise(resolve => {
            getDroppedOrSelectedFiles(e).then(chosenFiles => {
                resolve(chosenFiles.map(f => f.fileObject));
            });
        });
    };
    const selectFileInput = ({ accept, onFiles, files, getFilesFromEvent }) => {
        const textMsg = files.length > 0 ? 'Upload Again' : 'Select Files';
        return (
            <label className='flex sm:h-32 h-24 justify-center w-full h-full px-4 transition bg-white border border-blueColor border-dashed rounded-md appearance-none cursor-pointer hover:border-darkBlue hover:bg-veryLightBlue focus:outline-none'>
                {textMsg}
                <input
                    className='items-center space-x-2  justify-center text-center font-medium text-lightTextColor flex flex-col'
                    style={{ display: 'none' }}
                    type='file'
                    accept={accept}
                    multiple
                    onChange={e => {
                        getFilesFromEvent(e).then(chosenFiles => {
                            onFiles(chosenFiles);
                        });
                    }}
                />
            </label>
        );
    };
    return (
        <Dropzone
            onSubmit={onSubmit}
            onChangeStatus={onFileChange}
            InputComponent={selectFileInput}
            getUploadParams={fileParams}
            getFilesFromEvent={getFilesFromEvent}
            accept='image/*,audio/*,video/*'
            maxFiles={5}
            inputContent='Drop A File'
            styles={{
                dropzone: { width: 600, height: 400 },
                dropzoneActive: { borderColor: 'green' },
            }}
        />
    );
};
export default FileUploadComponent;
