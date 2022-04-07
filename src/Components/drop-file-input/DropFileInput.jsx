import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import './drop-file-input.css';

import { ImageConfig } from '../../config/ImageConfig'; 
import uploadImg from '../../assets/cloud-upload-regular-240.png';

const DropFileInput = props => {

    const wrapperRef = useRef(null);

    const [fileList, setFileList] = useState([]);

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');

    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = (e) => {
        if (props.multiple === true) {
            var updatedList = [...fileList];
            for( var i = 0 ; i < e.target.files.length ; i++ ){
                console.log(i);
                updatedList = [...updatedList, e.target.files[i]];
            }
            console.log(updatedList);
            setFileList(updatedList);
            props.onFileChange(updatedList);
        }else{
            const newFile = e.target.files[0];
            setFileList([newFile]);
            props.onFileChange(newFile);
        }
    }

    const fileRemove = (file) => {
        if(props.multiple === true){
            const updatedList = [...fileList];
            updatedList.splice(fileList.indexOf(file), 1);
            setFileList(updatedList);
            props.onFileChange(updatedList);
        }else{
            setFileList([]);
            props.onFileChange(null);
        }   
        
    }

    const { t } = useTranslation();

    return (
        <>
            <div
                ref={wrapperRef}
                className="drop-file-input"
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className="drop-file-input__label">
                    <img src={uploadImg} alt="" />
                    <p>{t('drag&drop')}</p>
                </div>
                <input type="file" value="" onChange={onFileDrop} multiple={props.multiple} />
            </div>
            {
                fileList.length > 0 ? (
                    <div className="drop-file-preview">
                        {
                            fileList.map((item, index) => (
                                <div key={index} className="drop-file-preview__item">
                                    <img src={ImageConfig[item.type.split('/')[1]] || ImageConfig['default']} alt="" />
                                    <div className="drop-file-preview__item__info">
                                        <p>{item.name}</p>
                                        <p>{item.size}B</p>
                                    </div>
                                    <span className="drop-file-preview__item__del" onClick={() => fileRemove(item)}>x</span>
                                </div>
                            ))
                        }
                    </div>
                ) : null
            }
        </>
    );
}

DropFileInput.propTypes = {
    onFileChange: PropTypes.func
}

export default DropFileInput;
