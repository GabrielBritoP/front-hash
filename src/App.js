import "./App.css";
import { useState, ChangeEvent, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";

import Dropzone from "../src/components/Dropzone/dropzone";
import InfoNumber from "../src/components/InfoNumber/infoZOne";
import api from "../src/services/api";
import { toastConfig } from "../src/config/toast";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";
function App() {
  const [pageSize, setPageSize] = useState(0);
  const [query, setquery] = useState("");
  const [bucketSize, setBucketSize] = useState(0);
  const formData = new FormData();
  const [info, setInfo] = useState({
    readSize: 0,
    pageSize: 0,
    bucketSize: 0,
    colisionCount: 0,
    overflowCount: 0,
    cost: 0,
    bucketNumber: 0,
  });

  useEffect(() => {}, []);

  const onChangePage = (event) => {
    const page = Number(event.target.value);
    if (isNaN(page)) return;
    setPageSize(page);
  };

  const onChangeBucket = (event) => {
    const bucket = Number(event.target.value);
    if (isNaN(bucket)) return;
    setBucketSize(bucket);
  };
  const onSubmitConfig = () => {
    api.get("/info").then((data) => {
      const json = JSON.parse(JSON.stringify(data));
      console.log(json);
      const { readSize, bucketNumber } = json.data;

      setInfo((prev) => ({
        ...prev,
        pageSize: pageSize,
        bucketSize: bucketSize,
        readSize,
        colisionCount: json.data.colisao,
        overflowCount: json.data.overflow,
        bucketNumber,
      }));
    });
  };

  const onloadFile = (file) => {
    formData.append("bucketSize", bucketSize);
    formData.append("pageSize", pageSize);
    console.log(bucketSize);
    console.log(pageSize);
    console.log(formData);
    formData.append("file", file);
    console.log(formData);

    api
      .post("start", formData)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        alert("erro" + error);
        toast.error("Backend offline: " + error, toastConfig);
      });
  };
  const onSearch = () => {
    console.log(query);
    api
      .post("search", { params: { query: query } })
      .then((data) => {
        console.log(data);
        const { cost } = data.data;
        setInfo((prev) => ({
          ...prev,
          cost,
        }));
      })
      .catch((error) => {
        alert(error);
      });
  };
  const onChangeSearch = (event) => {
    const { value } = event.target;
    setquery(value);
  };
  return (
    <div className="App">
      <section className="container">
        <div className="dropzone-container">
          <Dropzone onload={onloadFile} />
        </div>

        <div className="config-container">
          <div className="config-container-inputs">
            <div>
              <label htmlFor="">Tamanho da página:</label>
              <input type="text" value={pageSize} onChange={onChangePage} />
            </div>
            <div>
              <label htmlFor="">Tamanho do bucket: </label>
              <input type="text" value={bucketSize} onChange={onChangeBucket} />
            </div>
          </div>
          <button className="config-save-btn" onClick={onSubmitConfig}>
            Salvar
          </button>
        </div>
        <div className="search-container">
          <input
            className="search-input-btn"
            type="text"
            placeholder="Chave de busca"
            value={query}
            onChange={onChangeSearch}
          />
          <button
            onClick={onSearch}
            className="search-submit-btn"
            value="Buscar"
          >
            Buscar
          </button>
        </div>
        <div className="database-info">
          <InfoNumber title="Tamanho da página" number={info.pageSize} />
          <InfoNumber title="Tamanho do bucket" number={info.bucketSize} />
          <InfoNumber title="Número de colisões" number={info.colisionCount} />
          <InfoNumber title="Número de overflows" number={info.overflowCount} />
          {/* <InfoNumber title="Quantidade de registros" number={info.readSize} /> */}
          <InfoNumber title="Custo da leitura" number={info.cost} />
          {/* <InfoNumber
            title="Quantidade de buckets"
            number={info.bucketNumber}
          /> */}
        </div>
      </section>
    </div>
  );
}

export default App;
