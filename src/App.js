import { useEffect, useState } from 'react';
import readXlsxFile from 'read-excel-file';
import copy from 'clipboard-copy';

import style from './App.module.css';

function App() {
  const [input, setInput] = useState(null);
  const [arrayText, setArrayText] = useState([]);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (input) {
      readXlsxFile(input).then((rows) => {
        rows.shift();
        const arr = rows.map((row) => `Placa: ${row[0]} Valor: ${Math.abs(row[1]).toFixed(2).toString().replace(/\./g, ',')} Protocolo: ${row[2]}`);
        setArrayText(arr);
      })
    }
  }, [input]);

  return (
    <div className="App">
      <input type="file" onChange={ ({target}) => setInput(target.files[0])} />
      <button type="button" onClick={() => setPosition(position + 1)}>Próximo</button>
      <button type="button" onClick={() => copy(arrayText[position])}>Copiar</button>
      <p>{arrayText[position]}</p>
    </div>
  );
}

export default App;
