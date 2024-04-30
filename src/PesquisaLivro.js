// PesquisaLivro.js

import React, { useState } from 'react';
import apiUrl from './config'; // Importe a variável apiUrl
import './PesquisaLivro.css';

function PesquisaLivro() {
  const [isbn, setIsbn] = useState('');
  const [livro, setLivro] = useState(null);
  const [erro, setErro] = useState('');

  const handleInputChange = (event) => {
    setIsbn(event.target.value);
  };

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
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
    }
  };

  return (
    <div className="PesquisaLivro">
        <h1>Consultar</h1>
      <div className="input-group">
        <label htmlFor="isbn">ISBN</label>
        <input
          type="text"
          id="isbn"
          placeholder="Digite o ISBN do livro..."
          value={isbn}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
      </div>
      {livro && (
        <div className="livro-detalhes">
          <h2>{livro.Título}</h2>
          <p><strong>ISBN:</strong> {livro.ISBN}</p>
          <p><strong>Editora:</strong> {livro.Editora}</p>
          <p><strong>Autor:</strong> {livro.Autor}</p>
          <p><strong>Valor:</strong> R${livro.Valor.toFixed(2)}</p>
          <p><strong>Valor Feira:</strong> R${livro['Valor Feira'].toFixed(2)}</p>
          <p><strong>Estoque:</strong> {livro.Estoque}</p>
        </div>
      )}
      {erro && <p className="erro">{erro}</p>}
    </div>
  );
}

export default PesquisaLivro;
