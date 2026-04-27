import React, { useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import { List, ChevronsLeftRightEllipsis } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const myProfile = {
  id: 1,
  username: 'Carlos Usuga',
  rol: 'viewer',
  companyname: 'C y C Droguerias',
  email: 'cycdroguerias@gmail.com',
  publicIP: 'https://drogueriasCyC.com',
  cidr: '192.168.1.0/24',
  dominio: 'https://drogueriasCyC.com',
  subdomino: 'https://drogueriasCyC.com/registros',
};

const myElements = [
  { id: 1, activo: 'https://prueba1.com', type: 'IP', estado: 'Seguro' },
  { id: 2, activo: 'https://prueba2.com', type: 'IP', estado: 'Posible riesgo' },
  { id: 3, activo: 'https://prueba3.com', type: 'IP', estado: 'Riesgo' },
];

interface MyAssetsProps {
  title: string;
}

export default function MyAssets({ title }: MyAssetsProps) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { isLoading, isAuthenticated, error, clearError } = useAuthStore();

  const [assets, setAssets] = useState('');
  const [typeAssets, setTypeAssets] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    console.log(`Registro hecho => Tipo: ${typeAssets}, Activo: ${assets}`)
    setIsModalOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-slate-100">{title}</h1>

      {/* Activos */}
      <Card className="flex flex-col gap-4 p-6 border border-slate-700">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">{myProfile.companyname}</h2>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setIsModalOpen(true)}
          >
            Registrar nuevo activo
          </Button>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar activos">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Select
              label="Tipo de activo"
              value={typeAssets}
              required
              leftIcon={<List size={15} />}
              onChange={(e) => setTypeAssets(e.target.value)}
            >
              <option value="" disabled hidden>
                Selecciona el tipo de activo
              </option>
              <option value="ip">IP</option>
              <option value="cidr">CIDR</option>
              <option value="dominio">Dominio</option>
              <option value="subdominio">Subdominio</option>
            </Select>

            <Input
              label="Activo"
              placeholder="192.0.000.0"
              type="text"
              value={assets}
              onChange={(e) => setAssets(e.target.value)}
              required
              leftIcon={<ChevronsLeftRightEllipsis size={15} />}
            />

            <Button type="submit" size="lg" isLoading={isLoading} className="mt-2 w-full">
              {isLoading ? 'Registrando...' : 'Registrar activo'}
            </Button>
          </form>
        </Modal>

        {/* Tabla de activos */}
        <table className="w-full text-sm text-slate-300">
          <thead className="text-xs uppercase text-slate-400 border-b border-slate-700">
            <tr>
              <th className="py-2 w-1/5">ID</th>
              <th className="py-2 w-1/5">Tipo</th>
              <th className="py-2 w-2/5">Activo</th>
              <th className="py-2 w-1/5">Estado</th>
            </tr>
          </thead>
          <tbody>
            {myElements.map((el) => (
              <tr key={el.id} className="border-b text-center border-slate-700">
                <td className="py-2">{el.id}</td>
                <td className="py-2">{el.type}</td>
                <td className="py-2">{el.activo}</td>
                <td className="py-2">
                  <span className="px-2 py-1 rounded text-xs font-semibold flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        el.estado === 'Seguro'
                          ? 'bg-green-600 shadow-[0_0_10px_2px_rgba(34,197,94,0.7)]'
                          : el.estado === 'Posible riesgo'
                            ? 'bg-yellow-500 shadow-[0_0_10px_2px_rgba(234,179,8,0.7)]'
                            : 'bg-red-600 shadow-[0_0_10px_2px_rgba(220,38,38,0.7)]'
                      }`}
                    />
                    {el.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
