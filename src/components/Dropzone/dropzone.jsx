import { FC, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './styles.css';

const Dropzone = ({ onload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0].type !== 'text/plain') return;
    console.log(acceptedFiles)
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
      // Do whatever you want with the file contents
        const binaryStr = reader.result
        console.log(binaryStr)

        onload && onload(file);
      }
      reader.readAsArrayBuffer(file)
    })
    
  }, [onload])

  const {getRootProps, getInputProps} = useDropzone({ 
    onDrop, 
    multiple: false,
    accept: 'text/plain'
  })

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} />
      <p className="dropzone-advice">Arraste e solte o arquivo / clique para selecionar o arquivo</p>
      <p className="dropzone-observation">Obs: Apenas arquivos .txt</p>
    </div>
  )
}

export default Dropzone;