import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import Home from "./pages/Home/Home";
import DetalhesPet from "./pages/DetalhesPet/DetalhesPet";
import MinhasConversas from "./pages/MinhasConversas/MinhasConversas";
import Chat from "./pages/Chat/Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/pet/:id" element={<DetalhesPet />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/conversas" element={<MinhasConversas />} />
        <Route path="/chat/:chatId" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
