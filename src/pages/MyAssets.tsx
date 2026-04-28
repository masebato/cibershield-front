import React, { useMemo, useState } from 'react';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import { List, ChevronsLeftRightEllipsis, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import type { AssetType } from '../types/auth.types';

// useEffect(() => {
//   const fetchAssets = async () => {
//     const res = await getAssetsRequest();
//     setAssets(res.data);
//   };

//   fetchAssets();
// }, []);

interface MyAssetsProps {
  title: string;
}

export default function MyAssets({ title }: MyAssetsProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { user, createAsset, deleteAsset, error, clearError } = useAuthStore();

  const [assets, setAssets] = useState<string>('');
  const [typeAssets, setTypeAssets] = useState<AssetType | ''>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const profileAssets = useMemo(() => user?.assets ?? [], [user?.assets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeAssets || !assets.trim()) return;
    setLoading(true);
    clearError();
    try {
      await createAsset(typeAssets, assets.trim());
      setAssets('');
      setTypeAssets('');
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    clearError();
    try {
      await deleteAsset(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-slate-100">{title}</h1>

      {/* Activos */}
      <Card className="flex flex-col gap-4 p-6 border border-slate-700">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">{user?.company_name ?? 'Mi empresa'}</h2>
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
              onChange={(e) => setTypeAssets(e.target.value as AssetType)}
            >
              <option value="" disabled hidden>
                Selecciona el tipo de activo
              </option>
              <option value="ip">IP</option>
              <option value="cidr">CIDR</option>
              <option value="domain">Dominio</option>
              <option value="subdomain">Subdominio</option>
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

            {error && <p className="text-xs text-red-400">{error}</p>}

            <Button type="submit" size="lg" isLoading={loading} className="mt-2 w-full">
              {loading ? 'Registrando...' : 'Registrar activo'}
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
              <th className="py-2 w-1/5">Accion</th>
            </tr>
          </thead>
          <tbody>
            {profileAssets.map((el) => (
              <tr key={el.id} className="border-b text-center border-slate-700">
                <td className="py-2">{el.id}</td>
                <td className="py-2 uppercase">{el.type}</td>
                <td className="py-2">{el.value}</td>
                <td className="py-2">
                  <button
                    onClick={() => void handleDelete(el.id)}
                    disabled={deletingId === el.id}
                    className="px-2 py-1 rounded text-xs font-semibold inline-flex items-center gap-2 text-red-400 hover:bg-red-500/10 disabled:opacity-60"
                  >
                    <Trash2 size={14} />
                    {deletingId === el.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </td>
              </tr>
            ))}
            {!profileAssets.length && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-slate-500">
                  No hay activos registrados todavia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
