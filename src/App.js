import { useEffect, useState } from 'react';
import readXlsxFile from 'read-excel-file';
import copy from 'clipboard-copy';

import style from './App.module.css';
import infos from './helpers/associationsInfo';

function App() {
  const [input, setInput] = useState(null);
  const [arrayText, setArrayText] = useState([]);
  const [position, setPosition] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [selectedAssociation, setSelectedAssociation] = useState('universo');

  useEffect(() => {
    if (input) {
      readXlsxFile(input).then((rows) => {
        rows.shift();
        const arr = rows.map((row) => ({
          id: row[0],
          plate: row[1],
          price: row[2],
          protocol: row[3],
        }));
        setArrayText(arr);
      });
    }
  }, [input]);

  useEffect(() => {
    if (arrayText.length > 0) {
      const text = `Olá, me chamo Bruno e falo em nome da TATO Assist\nVocê realizou o serviço de protocolo ${arrayText[position].protocol} Placa: ${arrayText[position].plate} no valor de R$ ${Math.abs(arrayText[position].price).toFixed(2).replace('.', ',')}\n\nGentileza encaminhar a nota fiscal para este WhatsApp ou pelo e-mail nf.avista@tatoassist.com.br.\n${infos[selectedAssociation]}\n*Gentileza descrever na nota fiscal o protocolo e a placa.*\n*Envio da nota em XML e PDF.*\n\nGrato.`;
      setCurrentText(text);
    }
  }, [arrayText, selectedAssociation, position, input])

  console.log(currentText)

  const handleCopied = () => {
    copy(currentText)
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
          <div>
            <label className={style.button} htmlFor="file-upload">
              Upload File
              <input id="file-upload" type="file" onChange={ ({target}) => setInput(target.files[0])} />
            </label>
            <label htmlFor="select">
              <select id="select" value={selectedAssociation} onChange={({target}) => setSelectedAssociation(target.value)}>
                <option value="universo">Universo</option>
                <option value="agv">AGV</option>
                <option value="magen">Magen</option>
                <option value="cartruck">Cartruck</option>
              </select>
            </label>
          </div>
            <button className={style.button} type="button" onClick={handleCopied}>{isCopied ? "Copiado!" : "Copiar"}</button>
        </div>
        { arrayText.length > 0 && (
          <>
            <p>{`CNPJ: ${arrayText[position].id}`}</p>
            <p>{`Placa: ${arrayText[position].plate}`}</p>
            <p>{`Protocol: ${arrayText[position].protocol}`}</p>
            <p>{`Valor: ${Math.abs(arrayText[position].price).toFixed(2).replace('.', ',')}`}</p>
          </>
        )}
        { arrayText.length >= 1 && (
          <button className={`${style.button} ${style.copy}`} type="button" onClick={handleNext}>{`Próximo - ${position + 1}/${arrayText.length}`}</button>
        )}
      </div>
    </div>
  );
}

export default App;
