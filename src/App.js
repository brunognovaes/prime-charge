import { useEffect, useState } from 'react';
import readXlsxFile from 'read-excel-file';
import copy from 'clipboard-copy';

import style from './App.module.css';

function App() {
  const [input, setInput] = useState(null);
  const [arrayText, setArrayText] = useState([]);
  const [position, setPosition] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (input) {
      readXlsxFile(input).then((rows) => {
        rows.shift();
        const arr = rows.map((row) => `Placa: ${row[0]} Valor: ${Math.abs(row[1]).toFixed(2).toString().replace(/\./g, ',')} Protocolo: ${row[2]}`);
        setArrayText(arr);
      })
    }
  }, [input]);

  const handleCopied = () => {
    copy(arrayText[position])
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000)
  }

  const handleNext = () => {
    if (position + 1 < arrayText.length) setPosition(position + 1);
  }

  return (
    <div className={style.app}>
      <div className={style.container}>
        <div className={style.buttonContainer}>
          <label className={style.button}>
            Upload File
            <input type="file" onChange={ ({target}) => setInput(target.files[0])} />
          </label>
            <button className={style.button} type="button" onClick={handleCopied}>{isCopied ? "Copiado!" : "Copiar"}</button>
        </div>
        <p>{arrayText[position]}</p>
        { arrayText.length >= 1 && (
          <button className={`${style.button} ${style.copy}`} type="button" onClick={handleNext}>{`Próximo - ${position + 1}/${arrayText.length}`}</button>
        )}
      </div>
    </div>
  );
}

export default App;
