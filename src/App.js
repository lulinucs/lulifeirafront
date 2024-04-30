import React, { useState } from 'react';
import './App.css';
import PesquisaLivro from './PesquisaLivro';
import NovaVenda from './NovaVenda';
import ListaVendas from './ListaVendas';
import ListarClientes from './ListarClientes';
import FileUpload from './FileUpload'; // Importe o componente de upload de arquivo
import logo from './logo512.png'; // Importe o logo
import ListarLivro from './ListarLivros'; // Importe o componente ListarLivro

function App() {
  const [selectedComponent, setSelectedComponent] = useState('PesquisaLivro');

  const renderComponent = (component) => {
    switch (component) {
      case 'PesquisaLivro':
        return <PesquisaLivro />;
      case 'NovaVenda':
        return <NovaVenda />;
      case 'ListaVendas':
        return <ListaVendas />;
      case 'ListarClientes':
        return <ListarClientes />;
      case 'FileUpload': // Adicionei esta opção para renderizar o componente de upload de arquivo
        return <FileUpload />;
      case 'ListarLivro': // Adicionei o case para renderizar o componente ListarLivro
        return <ListarLivro />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="Logo" className="logo" /> 
        <p>A solução definitiva pros problemas do Versa</p> {/* Mantenha o slogan abaixo */}
      </header>
      <nav className="menu">
        <button className={selectedComponent === 'NovaVenda' ? 'active' : ''} onClick={() => setSelectedComponent('NovaVenda')}>Nova Venda</button>
        <button className={selectedComponent === 'ListaVendas' ? 'active' : ''} onClick={() => setSelectedComponent('ListaVendas')}>Vendas</button>
        <button className={selectedComponent === 'ListarClientes' ? 'active' : ''} onClick={() => setSelectedComponent('ListarClientes')}>Clientes</button>
        <button className={selectedComponent === 'FileUpload' ? 'active' : ''} onClick={() => setSelectedComponent('FileUpload')}>Adicionar Estoque</button> 
        <button className={selectedComponent === 'ListarLivro' ? 'active' : ''} onClick={() => setSelectedComponent('ListarLivro')}>Pesquisar</button>
        <button className={selectedComponent === 'PesquisaLivro' ? 'active' : ''} onClick={() => setSelectedComponent('PesquisaLivro')}> Consultar</button>
      </nav>
      <main>
        <div className="main-content">{renderComponent(selectedComponent)}</div>
      </main>
      <footer>
        <p>© 2024 LuliBooks. Alguns direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
