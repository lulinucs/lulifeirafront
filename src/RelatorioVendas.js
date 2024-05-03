import React, { useState } from 'react';
import './RelatorioVendas.css';
import apiUrl from './config'; // Importe a variável apiUrl

function RelatorioVendas() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [relatorio, setRelatorio] = useState(null);
  const [relatorioLivrosVendidos, setRelatorioLivrosVendidos] = useState(null); // Adicionado
  const [erro, setErro] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch(apiUrl+'/relatorio-vendas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dataInicio: `${dataInicio}T00:00:00.000Z`,
          dataFim: `${dataFim}T23:59:59.999Z`,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar relatório de vendas');
      }

      const data = await response.json();
      setRelatorio(data);
      await handleRelatorioLivrosVendidos(); // Adicionado
      setErro('');
    } catch (error) {
      setRelatorio(null);
      setErro(error.message);
    }
  };

  const handleRelatorioLivrosVendidos = async () => {
    try {
      const response = await fetch(apiUrl+'/relatorio-livros-vendidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dataInicio: `${dataInicio}T00:00:00.000Z`,
          dataFim: `${dataFim}T23:59:59.999Z`,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao gerar relatório de livros vendidos');
      }
  
      const data = await response.json();
  
      // Verifica se o livro já está na lista de relatório de livros vendidos
      const uniqueLivrosVendidos = [];
      data.forEach(livro => {
        const existingBookIndex = uniqueLivrosVendidos.findIndex(
          item => item.ISBN === livro.ISBN && item['Valor Vendido'] === livro['Valor Vendido']
        );
        if (existingBookIndex !== -1) {
          // Se o livro já estiver na lista, apenas atualiza a quantidade
          uniqueLivrosVendidos[existingBookIndex].Quantidade += livro.Quantidade;
        } else {
          // Se o livro não estiver na lista, adiciona-o
          uniqueLivrosVendidos.push(livro);
        }
      });
  
      setRelatorioLivrosVendidos(uniqueLivrosVendidos);
      setErro('');
    } catch (error) {
      setRelatorioLivrosVendidos([]); // Corrigido
      setErro(error.message);
    }
  };
  

  return (
    <div className="relatorio-container">
      <h2>Gerar Relatório de Vendas</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="dataInicio">Data de Início:</label>
          <input
            type="date"
            id="dataInicio"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dataFim">Data de Fim:</label>
          <input
            type="date"
            id="dataFim"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            required
          />
        </div>
        <button type="submit" onClick={handleSubmit}>Gerar Relatório de Vendas e Livros Vendidos</button>
      </form>

      {relatorioLivrosVendidos && (
        <div className="tabela-livros-vendidos">
          <h3>Tabela de Livros Vendidos</h3>
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
              {relatorioLivrosVendidos.map(livro => (
                <tr key={livro.ISBN}>
                  <td>{livro.ISBN}</td>
                  <td>{livro.Título}</td>
                  <td>{livro.Editora}</td>
                  <td>R${livro['Valor Vendido'].toFixed(2)}</td>
                  <td>{livro.Quantidade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {relatorio && (
        <div className="relatorio">
          <h3>Relatório para o período {dataInicio} - {dataFim}</h3>
          <p>Total de Vendas: {relatorio.totalVendas}</p>
          <p>Total de Produtos Vendidos: {relatorio.totalProdutosVendidos}</p>
          <p>Valor Total de Vendas: R${relatorio.valorTotalVendas.toFixed(2)}</p>
          <p>Ticket Médio: R${relatorio.ticketMedio.toFixed(2)}</p>
          {/* Adicione outras informações desejadas aqui */}
        </div>
      )}

      {erro && <p className="erro">{erro}</p>}
    </div>
  );
}

export default RelatorioVendas;
