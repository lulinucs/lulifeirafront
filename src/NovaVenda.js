import React, { useState } from 'react';
import axios from 'axios';
import './NovaVenda.css';
import apiUrl from './config'; // Importe a variável apiUrl
import { FaTrashAlt, FaMinusCircle, FaPlusCircle, FaUserPlus, FaShoppingCart } from 'react-icons/fa';

function NovaVenda() {
  const [isbn, setIsbn] = useState('');
  const [livros, setLivros] = useState([]);
  const [erro, setErro] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [idCliente, setIdCliente] = useState(null);
  const [cliente, setCliente] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  const handleInputChange = (event) => {
    setIsbn(event.target.value);
  };

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
      try {
        const response = await fetch(`${apiUrl}/livro/${isbn}`); // Substitua a URL aqui
        if (!response.ok) {
          throw new Error('Livro não encontrado');
        }
        const data = await response.json();
        const livroExistente = livros.find((livro) => livro.ISBN === data.livro.ISBN);
        if (livroExistente) {
          if (livroExistente.Quantidade < data.livro.Estoque) {
            setLivros(livros.map((livro) =>
              livro.ISBN === data.livro.ISBN
                ? { ...livro, Quantidade: livro.Quantidade + 1 }
                : livro
            ));
            setErro('');
          } else {
            setErro('A quantidade excede o estoque disponível');
          }
        } else {
          // Verificar se o estoque é maior ou igual a 1 antes de adicionar o livro
          if (data.livro.Estoque >= 1) {
            setLivros([...livros, { ...data.livro, Quantidade: 1, Desconto: 0 }]);
            setErro('');
          } else {
            setErro('O estoque deste livro é menor que 1');
          }
        }
        setIsbn('');
      } catch (error) {
        setErro(error.message);
      }
    }
  };

  const handleAddCliente = () => {
    setShowModal(true);
  };

  const handleSalvarCliente = async (event) => {
    event.preventDefault(); // Evita o comportamento padrão do formulário
  
    try {
      const response = await axios.post(`${apiUrl}/salvarCliente`, cliente); // Substitua a URL aqui
      const clienteSalvo = response.data.cliente; // Captura o cliente retornado na resposta
      setIdCliente(clienteSalvo._id.toString()); // Atualiza o ID do cliente
      setCliente(clienteSalvo); // Atualiza todas as informações do cliente
      setShowModal(false); // Fechar o modal após salvar
    } catch (error) {
      console.error('Erro ao salvar o cliente:', error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleInputChangeCliente = (event) => {
    const { name, value } = event.target;
    setCliente({ ...cliente, [name]: value });
  };

  const handleCancelarCliente = () => {
    setShowModal(false);
    setCliente({
      nome: '',
      cpf: '',
      email: '',
      telefone: '',
      cep: '',
      endereco: '',
      bairro: '',
      cidade: '',
      estado: ''
    });
  };

  const handleEditQuantidade = (livro, newQuantidade) => {
    const updatedLivros = livros.map((livroItem) =>
      livroItem.ISBN === livro.ISBN ? { ...livroItem, Quantidade: newQuantidade } : livroItem
    );
    setLivros(updatedLivros);
  };

  const handleRemoveLivro = (isbn) => {
    const updatedLivros = livros.filter((livro) => livro.ISBN !== isbn);
    setLivros(updatedLivros);
  };

  const handleDescontoChange = (livro, event) => {
    const value = event.target.value;
    const updatedLivros = livros.map((livroItem) =>
      livroItem.ISBN === livro.ISBN ? { ...livroItem, Desconto: value } : livroItem
    );
    setLivros(updatedLivros);
  };

  const calcularPrecoComDesconto = (valorFeira, desconto) => {
    const descontoDecimal = desconto / 100;
    const valorComDesconto = valorFeira - valorFeira * descontoDecimal;
    return valorComDesconto;
  };

  const calcularSubtotal = (livro) => {
    const precoDesconto = calcularPrecoComDesconto(livro['Valor Feira'], livro.Desconto);
    return (precoDesconto * livro.Quantidade).toFixed(2);
  };

  const totalQuantidade = livros.reduce((acc, livro) => acc + livro.Quantidade, 0);
  const totalPrecoDesconto = livros.reduce((acc, livro) => acc + Number(calcularSubtotal(livro)), 0);

  const handleRegistrarVenda = async () => {
    if (livros.length === 0) {
      setErro('Nenhum livro incluído na venda');
      return;
    }
  
    // Calcular o valor total da compra com desconto

    try {
      const response = await axios.post(`${apiUrl}/registrar-venda`, { // Substitua a URL aqui
        cliente: idCliente, // Passar o ID do cliente
        livros: livros.map(livro => ({
          livro: livro._id,
          isbn: livro.ISBN, 
          quantidade: livro.Quantidade,
          desconto: livro.Desconto,
          subtotal: calcularPrecoComDesconto(livro['Valor Feira'], livro.Desconto),
        })),
        total: totalPrecoDesconto,
      });
      console.log(livros)
      console.log('Venda registrada com sucesso:', response.data);
      // Limpar estado após o registro da venda
      setLivros([]);
      setCliente({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        cep: '',
        endereco: '',
        bairro: '',
        cidade: '',
        estado: ''
      });
      setErro('');
    } catch (error) {
      console.error('Erro ao registrar a venda:', error);
    }
  };
  

  return (
    <div className="NovaVenda">
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>&times;</span>
            <h2>Adicionar Cliente</h2>
            <form>
              <div className="form-group">
                <label htmlFor="nome">Nome*</label>
                <input name="nome" value={cliente.nome} onChange={handleInputChangeCliente} required />
              </div>
              <div className="form-group">
                <label htmlFor="cpf">CPF*</label>
                <input name="cpf" value={cliente.cpf} onChange={handleInputChangeCliente} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">E-mail*</label>
                <input name="email" value={cliente.email} onChange={handleInputChangeCliente} required />
              </div>
              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input name="telefone" value={cliente.telefone} onChange={handleInputChangeCliente} />
              </div>
              <div className="form-group">
                <label htmlFor="cep">CEP</label>
                <input name="cep" value={cliente.cep} onChange={handleInputChangeCliente} />
              </div>
              <div className="form-group">
                <label htmlFor="endereco">Endereço</label>
                <input name="endereco" value={cliente.endereco} onChange={handleInputChangeCliente} />
              </div>
              <div className="form-group">
                <label htmlFor="bairro">Bairro</label>
                <input name="bairro" value={cliente.bairro} onChange={handleInputChangeCliente} />
              </div>
              <div className="form-group">
                <label htmlFor="cidade">Cidade</label>
                <input name="cidade" value={cliente.cidade} onChange={handleInputChangeCliente} />
              </div>
              <div className="form-group">
                <label htmlFor="estado">Estado</label>
                <input name="estado" value={cliente.estado} onChange={handleInputChangeCliente} />
              </div>
              <button className="salvar-button" onClick={(event) => handleSalvarCliente(event)}>Salvar</button>
              <button className="cancelar-button" onClick={handleCancelarCliente}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      <div className="input-group">
        <label htmlFor="isbn">Nova Venda</label>
        <input
          type="text"
          id="isbn"
          placeholder="Digite o ISBN do livro..."
          value={isbn}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className="lista-livros">
        <table>
          <thead>
            <tr>
              <th>ISBN</th>
              <th>Título</th>
              <th>Editora</th>
              <th>Autor</th>
              <th>PVP</th>
              <th>Preço Feira</th>
              <th>Quantidade</th>
              <th>Desconto (%)</th>
              <th>Subtotal</th>
              <th>Remover</th>
            </tr>
          </thead>
          <tbody>
            {livros.map((livro, index) => (
              <tr key={index}>
                <td>{livro.ISBN}</td>
                <td>{livro.Título}</td>
                <td>{livro.Editora}</td>
                <td>{livro.Autor}</td>
                <td>R${livro.Valor.toFixed(2)}</td>
                <td>R${livro['Valor Feira'].toFixed(2)}</td>
                <td>
                  <FaMinusCircle onClick={() => handleEditQuantidade(livro, Math.max(1, livro.Quantidade - 1))} />
                  <span className="quantidade">{livro.Quantidade}</span>
                  <FaPlusCircle onClick={() => handleEditQuantidade(livro, Math.min(livro.Quantidade + 1, livro.Estoque))} />
                </td>
                <td>
                  <input
                    type="number"
                    value={livro.Desconto || 0}
                    onChange={(event) => handleDescontoChange(livro, event)}
                  />
                </td>
                <td>R${calcularSubtotal(livro)}</td>
                <td><FaTrashAlt onClick={() => handleRemoveLivro(livro.ISBN)} /></td>
              </tr>
            ))}
            <tr>
              <td colSpan="6">Totais:</td>
              <td>{totalQuantidade}</td>
              <td></td>
              <td>R${totalPrecoDesconto.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        {cliente.nome && <p>Nome do Cliente: {cliente.nome.split(' ')[0]}</p>}
        <button className="btn-add-cliente" onClick={handleAddCliente}><FaUserPlus /> Adicionar Cliente</button>
        <button className="btn-registrar-venda" onClick={handleRegistrarVenda}><FaShoppingCart />Registrar Venda</button>
      </div>
      
      {erro && <p className="erro">{erro}</p>}
    </div>
  );
}

export default NovaVenda;
