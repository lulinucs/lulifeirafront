import React, { useState } from 'react';
import apiUrl from './config'; // Importe a variável apiUrl
import BarcodeScanner from './BarcodeScanner'; // Importe o componente BarcodeScanner
import { FaBarcode, FaShoppingCart } from 'react-icons/fa'; // Importe o ícone de carrinho de compras
import './PesquisaLivro.css';

function PesquisaLivro() {
  const [isbn, setIsbn] = useState('');
  const [livro, setLivro] = useState(null);
  const [erro, setErro] = useState('');
  const [showScanner, setShowScanner] = useState(false); // Estado para controlar a exibição do BarcodeScanner
  const [livrosVendidos, setLivrosVendidos] = useState([]);

  const handleInputChange = (event) => {
    setIsbn(event.target.value);
  };

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
      await searchBook(isbn); // Move a lógica de pesquisa para uma função separada
    }
  };

  // Função para pesquisar um livro
  const searchBook = async (isbn) => {
    try {
      const response = await fetch(`${apiUrl}/livro/${isbn}`);
      if (!response.ok) {
        throw new Error('Livro não encontrado');
      }
      const data = await response.json();
      setLivro(data.livro);
      setErro('');
    } catch (error) {
      setLivro(null);
      setErro(error.message);
    }
  };

  // Função para lidar com a leitura do código de barras
  const handleBarcodeScan = (result) => {
    setIsbn(result);
    setShowScanner(false);
    // Dispara a busca do livro automaticamente, como se o usuário tivesse pressionado Enter
    searchBook(result);
  };

  // Função para abrir o scanner
  const openScanner = () => {
    setShowScanner(true);
  };

  // Função para registrar a venda do livro pesquisado
  const handleRegistrarVenda = async () => {
    try {
      // Verifica se o livro já está na lista de livros vendidos
      const existingBookIndex = livrosVendidos.findIndex(item => item.ISBN === livro.ISBN);
      if (existingBookIndex !== -1) {
        // Se o livro já estiver na lista, atualiza a quantidade vendida
        const updatedLivrosVendidos = [...livrosVendidos];
        updatedLivrosVendidos[existingBookIndex].Quantidade += 1;
        setLivrosVendidos(updatedLivrosVendidos);
      } else {
        // Se o livro não estiver na lista, adiciona-o
        setLivrosVendidos([...livrosVendidos, { ...livro, Quantidade: 1 }]);
      }
      setLivro(null);
      setErro('');
    } catch (error) {
      console.error('Erro ao registrar a venda:', error);
    }
  };

  return (
    <div className="PesquisaLivro">
      <h1>Venda Rápida</h1>
      <div className="input-group">
        <label htmlFor="isbn">ISBN</label>
        <div className="input-with-button">
          <input
            type="text"
            id="isbn"
            placeholder="Digite o ISBN do livro..."
            value={isbn}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button className="barcode-button" onClick={openScanner}>
            <FaBarcode /> {/* Ícone de código de barras */}
          </button>
        </div>
      </div>
      {/* Renderizar o BarcodeScanner apenas se showScanner for verdadeiro */}
      {showScanner && <BarcodeScanner onResult={handleBarcodeScan} />}
      {livro && (
        <div className="livro-detalhes">
          <h2>{livro.Título}</h2>
          <p><strong>ISBN:</strong> {livro.ISBN}</p>
          <p><strong>Editora:</strong> {livro.Editora}</p>
          <p><strong>Autor:</strong> {livro.Autor}</p>
          <p><strong>Valor:</strong> R${livro.Valor.toFixed(2)}</p>
          <p><strong>Valor Feira:</strong> R${livro['Valor Feira'].toFixed(2)}</p>
          <p><strong>Estoque:</strong> {livro.Estoque}</p>
          {/* Botão para registrar a venda */}
          <button className="register-sale-button" onClick={handleRegistrarVenda}>
            <FaShoppingCart /> {/* Ícone de carrinho de compras */}
          </button>
        </div>
      )}
      {livrosVendidos.length > 0 && (
        <div className="livros-vendidos">
          <h2>Livros Vendidos</h2>
          <table>
            <thead>
              <tr>
                <th>ISBN</th>
                <th>Título</th>
                <th>Editora</th>
                <th>Valor Vendido</th>
                <th>Quantidade</th>
              </tr>
            </thead>
            <tbody>
              {livrosVendidos.map((livroVendido, index) => (
                <tr key={index}>
                  <td>{livroVendido.ISBN}</td>
                  <td>{livroVendido.Título}</td>
                  <td>{livroVendido.Editora}</td>
                  <td>{livroVendido['Valor Feira']}</td>
                  <td>{livroVendido.Quantidade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {erro && <p className="erro">{erro}</p>}
    </div>
  );
}

export default PesquisaLivro;
